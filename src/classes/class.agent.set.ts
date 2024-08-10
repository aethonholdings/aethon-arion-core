import { Utils } from "../modules/module.utils";
import { Agent } from "./class.agent";
import { State } from "./class.state";
import { RandomStream } from "./class.random.stream";
import { AgentSetTensors, Targets } from "../interfaces/interfaces";
import { Logger } from "./class.logger";

export class AgentSet {
    protected name: string = "AgentSet";
    protected priorityTensor: number[][][];
    protected influenceTensor: number[][][][];
    protected judgmentTensor: number[][][][];
    protected incentiveTensor: number[][][][];

    private clockTick: number;
    private states: State[];
    private agents: Agent[];
    private randomStream: RandomStream;
    private logger: Logger;

    private agentCount: number;
    private stateCount: number;
    private plantDegreesOfFreedom: number;
    private reportingDimensions: number;

    private deltaP: number[][][];
    private deltaW: number[][][];

    constructor(
        agentSetTensors: AgentSetTensors,
        states: State[],
        randomStream: RandomStream,
        logger: Logger,
        clockTick: number
    ) {
        // initialise variables
        this.logger = logger;
        this._log("Initialising Agent Set");
        this.clockTick = clockTick;
        this.states = states;
        this.randomStream = randomStream;
        this.priorityTensor = agentSetTensors.priorityTensor as number[][][];
        this.influenceTensor = agentSetTensors.influenceTensor as number[][][][];
        this.judgmentTensor = agentSetTensors.judgmentTensor as number[][][][];
        this.incentiveTensor = agentSetTensors.incentiveTensor as number[][][][];
        this.agentCount = Utils.shape(this.priorityTensor)[0];
        this.stateCount = Utils.shape(this.priorityTensor)[1];
        this.plantDegreesOfFreedom = Utils.shape(agentSetTensors.judgmentTensor)[3];
        this.reportingDimensions = Utils.shape(agentSetTensors.incentiveTensor)[3];

        // check variable consistency
        this.checkConsistency();

        // initialise the agent set
        this.agents = [];
        for (let alpha = 0; alpha < this.agentCount; alpha++) {
            this.agents.push(new Agent(this.states.length - 1, states)); // initialise the agent and their states
        }

        // create a tensor for the DeltaP_{\alpha\sigma\tau} values
        this.deltaP = Utils.tensor([this.agentCount, this.stateCount, this.stateCount], () => {
            return 0;
        }) as number[][][];

        // initialise a null deltaW tensor
        this.deltaW = Utils.tensor([this.agentCount, this.stateCount, this.stateCount], () => {
            return 0;
        }) as number[][][];
        this._log("Agent Set initialised");
        return this;
    }

    transitionState(): number[][] {
        this._log("Transitioning agent states");

        // generate random state transition driver variables
        const rand: number[] = Utils.tensor([this.agents.length], () => {
            return this.randomStream.next();
        }) as number[];

        // generate cumulative state transition probabilities for comparison to the random variable
        const cumulative: number[][][] = JSON.parse(JSON.stringify(this.priorityTensor));
        for (let alpha = 0; alpha < this.agents.length; alpha++) {
            for (let sigma = 0; sigma < this.states.length; sigma++) {
                for (let tau = 1; tau < this.states.length; tau++) {
                    cumulative[alpha][sigma][tau] = cumulative[alpha][sigma][tau] + cumulative[alpha][sigma][tau - 1];
                    if (tau == this.states.length - 1)
                        cumulative[alpha][sigma][tau] = Math.round(cumulative[alpha][sigma][tau] * 10000) / 10000;
                }
            }
        }

        // iterate through the agents and transition their states, emiting workstation control tensors
        let controlInputTensor: number[][] = [];
        for (let alpha = 0; alpha < this.agents.length; alpha++) {
            // perform state transitions
            let tau: number = 0;
            while (true) {
                if (rand[alpha] < cumulative[alpha][this.agents[alpha].getStateIndex()][tau]) break;
                tau++;
            }
            this.agents[alpha].setStateIndex(tau);
        }
        controlInputTensor = this.emitControlInputTensor(); // emit control tensors for each agent
        this._log("Agent states transitioned", {
            agentStates: this.getAgentStateArray(),
            controlInputTensor: controlInputTensor
        });
        return controlInputTensor;
    }

    emitControlInputTensor(): number[][] {
        let controlInputTensor: number[][] = [];
        for (let alpha = 0; alpha < this.agents.length; alpha++) {
            // calculate the control input tensor
            controlInputTensor.push(this.agents[alpha].emitWorkstationControlTensor()); // emit control tensors for each agent
        }
        return controlInputTensor;
    }

    getTensors(): {
        priorityTensor: number[][][];
        influenceTensor: number[][][][];
        judgmentTensor: number[][][][];
        incentiveTensor: number[][][][];
    } {
        return {
            priorityTensor: this.priorityTensor,
            influenceTensor: this.influenceTensor,
            judgmentTensor: this.judgmentTensor,
            incentiveTensor: this.incentiveTensor
        };
    }

    getAgentStateArray(): number[] {
        let array: number[] = [];
        for (let alpha = 0; alpha < this.agents.length; alpha++) array.push(this.agents[alpha].getStateIndex());
        return array;
    }

    getAgentCount(): number {
        return this.agents.length;
    }

    getStateCount(): number {
        return this.stateCount;
    }

    getDeltaP(): number[][][] {
        return this.deltaP;
    }

    recalculateParams(targets: Targets, plantState: number[], reporting: number[]): AgentSet {
        this._log("Recalculating priority tensor");

        // calculate the deltaW entries for each entry in the priority matrix
        for (let alpha = 0; alpha < this.agentCount; alpha++) {
            for (let sigma = 0; sigma < this.stateCount; sigma++) {
                for (let tau = 0; tau < this.stateCount; tau++) {
                    this.deltaW[alpha][sigma][tau] = 0;
                    for (let beta = 0; beta < this.agentCount; beta++) {
                        this.deltaW[alpha][sigma][tau] +=
                            this.influenceTensor[alpha][beta][sigma][tau] *
                            (this.priorityTensor[alpha][sigma][tau] - this.priorityTensor[beta][sigma][tau]) *
                            this.clockTick;
                    }
                    for (let chi = 0; chi < this.plantDegreesOfFreedom; chi++) {
                        this.deltaW[alpha][sigma][tau] +=
                            this.judgmentTensor[alpha][sigma][tau][chi] *
                            (plantState[chi] - targets.plantState[chi]) *
                            this.clockTick;
                    }
                    for (let psi = 0; psi < this.reportingDimensions; psi++) {
                        this.deltaW[alpha][sigma][tau] +=
                            this.incentiveTensor[alpha][sigma][tau][psi] *
                            (reporting[psi] - targets.reporting[psi]) *
                            this.clockTick;
                    }
                }
            }
        }

        // calculate the deltaPs using the Jacobian derivatives and the deltaWs
        for (let alpha = 0; alpha < this.agentCount; alpha++) {
            for (let sigma = 0; sigma < this.stateCount; sigma++) {
                for (let tau = 0; tau < this.stateCount; tau++) {
                    this.deltaP[alpha][sigma][tau] = 0;
                    for (let lambda = 0; lambda < this.stateCount; lambda++) {
                        let delta: number = tau === lambda ? 1 : 0;
                        let jacobian =
                            this.priorityTensor[alpha][sigma][tau] *
                            (delta - this.priorityTensor[alpha][sigma][lambda]);
                        this.deltaP[alpha][sigma][tau] += jacobian * this.deltaW[alpha][sigma][lambda];
                    }
                }
            }
        }

        // update the priority matrix
        let logSaturation: boolean = false;
        for (let alpha = 0; alpha < this.agentCount; alpha++) {
            for (let sigma = 0; sigma < this.stateCount; sigma++) {
                let saturation: boolean = false;
                for (let tau = 0; tau < this.stateCount; tau++) {
                    // force regularisation of the priority matrix in case of high gains or long delta t which may cause saturation
                    let tmp = this.priorityTensor[alpha][sigma][tau];
                    if (this.deltaP[alpha][sigma][tau] < -tmp || this.deltaP[alpha][sigma][tau] > 1 - tmp) {
                        saturation = true;
                        this.deltaP[alpha][sigma][tau] < -tmp
                            ? (this.deltaP[alpha][sigma][tau] = -tmp)
                            : (this.deltaP[alpha][sigma][tau] = 1 - tmp);
                    }
                    this.priorityTensor[alpha][sigma][tau] += this.deltaP[alpha][sigma][tau];
                    this.priorityTensor[alpha][sigma][tau] =
                        Math.round(this.priorityTensor[alpha][sigma][tau] * 10000) / 10000;
                }
                // perform a final normalisation of the tensor row alpha sigma, to ensure that the sum of the row is 1 in case of numerical rounding
                let sum: number = 0;
                for (let tau = 0; tau < this.stateCount; tau++) {
                    sum += this.priorityTensor[alpha][sigma][tau];
                }
                for (let tau = 0; tau < this.stateCount; tau++) {
                    this.priorityTensor[alpha][sigma][tau] /= sum;
                }
                logSaturation = logSaturation || saturation;
            }
        }

        // log saturation if it occurs
        if (logSaturation) {
            this.logger.warning({
                sourceObject: this.name,
                message: "Priority tensor saturation detected, tensor was regularised"
            });
        }

        this._log("Agent set priority tensor recalculated", {
            newPriorityTensor: this.priorityTensor
        });
        return this;
    }

    checkConsistency(): boolean {
        const priorityTensor = this.priorityTensor as number[][][];
        const influenceTensor = this.influenceTensor as number[][][][];
        const judgmentTensor = this.judgmentTensor as number[][][][];
        const incentiveTensor = this.incentiveTensor as number[][][][];

        try {
            // check the simulation base dimensions
            const priorityTensorShape: number[] = Utils.shape(priorityTensor);
            const influenceTensorShape: number[] = Utils.shape(influenceTensor);
            const judgmentTensorShape: number[] = Utils.shape(judgmentTensor);
            const incentiveTensorShape: number[] = Utils.shape(incentiveTensor);

            if (priorityTensorShape.length !== 3) throw new Error("Invalid priority tensor dimensions.");
            if (influenceTensorShape.length !== 4) throw new Error("Invalid influence tensor dimensions.");
            if (judgmentTensorShape.length !== 4) throw new Error("Invalid judgment tensor dimensions.");
            if (incentiveTensorShape.length !== 4) throw new Error("Invalid incentive tensor dimensions.");

            const agentCount = priorityTensorShape[0];
            if (agentCount === 0) throw new Error("No agents in agent set.");
            if (this.states.length === 0) throw new Error("No states in state set.");
            
            const stateCount = this.states.length;
            if (stateCount !== priorityTensorShape[1] || stateCount !== priorityTensorShape[2])
                throw new Error("Inconsistent state set size and priority tensor dimensions.");
            if (influenceTensor.length !== agentCount) {
                throw new Error("Inconsistent agent dimensions (alpha) in influence tensor.");
            }
            if (judgmentTensor.length !== agentCount) {
                throw new Error("Inconsistent agent dimensions (alpha) in judgment tensor.");
            }
            if (incentiveTensor.length !== agentCount) {
                throw new Error("Inconsistent agent dimensions (alpha) in incentive tensor.");
            }
            for (let alpha = 0; alpha < agentCount; alpha++) {
                if (priorityTensor[alpha].length !== stateCount) {
                    throw new Error("Inconsistent state dimensions (sigma) in priority tensor.");
                }
                if (judgmentTensor[alpha].length !== stateCount) {
                    throw new Error("Inconsistent state dimensions (sigma) in judgment tensor.");
                }
                if (incentiveTensor[alpha].length !== stateCount) {
                    throw new Error("Inconsistent state dimensions (sigma) in incentive tensor.");
                }
                for (let sigma = 0; sigma < stateCount; sigma++) {
                    if (priorityTensor[alpha][sigma].length !== stateCount) {
                        throw new Error("Inconsistent state dimensions (tau) in priority tensor.");
                    }
                    if (judgmentTensor[alpha][sigma].length !== stateCount) {
                        throw new Error("Inconsistent state dimensions (tau) in judgment tensor.");
                    }
                    if (incentiveTensor[alpha][sigma].length !== stateCount) {
                        throw new Error("Inconsistent state dimensions (tau) in incentive tensor.");
                    }
                }
            }
            for (let alpha = 0; alpha < agentCount; alpha++) {
                if (influenceTensor[alpha].length !== agentCount) {
                    throw new Error("Inconsistent agent dimensions (beta) in influence tensor.");
                }
                for (let beta = 0; beta < agentCount; beta++) {
                    if (influenceTensor[alpha][beta].length !== stateCount) {
                        throw new Error("Inconsistent state dimensions (sigma) in influence tensor.");
                    }
                    for (let sigma = 0; sigma < stateCount; sigma++) {
                        if (influenceTensor[alpha][beta][sigma].length !== stateCount) {
                            throw new Error("Inconsistent state dimensions (tau) in influence tensor.");
                        }
                    }
                }
            }
        } catch (error: any) {
            this.logger.error({
                sourceObject: this.name,
                message: "Error in agent set initialisation.",
                data: {
                    message: error?.message
                }
            });
            return false;
        }
        return true;
    }

    protected _log(message: string, data?: any) {
        this.logger.trace({
            sourceObject: this.name,
            message: message,
            data: data
        });
    }
}
