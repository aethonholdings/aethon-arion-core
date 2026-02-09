import { Utils } from "../modules/utils.module";
import { Agent } from "./agent.class";
import { State } from "./state.class";
import { RandomStream } from "./random-stream.class";
import { AgentSetTensors, Targets } from "../interfaces/core.interfaces";
import { Logger } from "./logger.class";

/**
 * Represents a collection of autonomous agents with behavioral tensors governing their state transitions and interactions.
 *
 * @remarks
 * The AgentSet class manages a collection of agents whose behaviors are governed by four key tensors:
 * - **Priority Tensor** (`P[α][σ][τ]`): Probability of agent α transitioning from state σ to state τ
 * - **Influence Tensor** (`W[α][β][σ][τ]`): Influence of agent β on agent α's transition from σ to τ
 * - **Judgment Tensor** (`J[α][σ][τ][χ]`): Agent α's response to plant state variable χ when transitioning from σ to τ
 * - **Incentive Tensor** (`I[α][σ][τ][ψ]`): Agent α's response to reporting metric ψ when transitioning from σ to τ
 *
 * The priority tensor is dynamically updated, incorporating
 * influence from other agents, plant state deviations, and reporting metrics.
 *
 * @example
 * ```typescript
 * const agentSet = new AgentSet(
 *   agentSetTensors,
 *   states,
 *   randomStream,
 *   logger,
 *   0.1  // 0.1 second clock tick
 * );
 *
 * // Transition all agent states
 * const controlInputs = agentSet.transitionState();
 *
 * // Recalculate parameters based on targets
 * agentSet.recalculateParams(targets, plantState, reporting);
 * ```
 *
 * @public
 */
export class AgentSet {
    /** Name identifier for logging purposes */
    protected name: string = "AgentSet";

    /** 3D tensor `P[α][σ][τ]` representing state transition probabilities for each agent */
    protected priorityTensor: number[][][];

    /** 4D tensor `W[α][β][σ][τ]` representing inter-agent influence */
    protected influenceTensor: number[][][][];

    /** 4D tensor `J[α][σ][τ][χ]` representing agent judgment relative to plant states */
    protected judgmentTensor: number[][][][];

    /** 4D tensor `I[α][σ][τ][ψ]` representing agent incentives relative to reporting metrics */
    protected incentiveTensor: number[][][][];

    /** Simulation time step in seconds */
    private clockTick: number;

    /** Array of possible agent states */
    private states: State[];

    /** Array of agent instances */
    private agents: Agent[];

    /** Random number stream for stochastic transitions */
    private randomStream: RandomStream;

    /** Logger instance for trace and error logging */
    private logger: Logger;

    /** Total number of agents (α dimension) */
    private agentCount: number;

    /** Total number of states (σ, τ dimensions) */
    private stateCount: number;

    /** Number of plant state variables (χ dimension) */
    private plantDegreesOfFreedom: number;

    /** Number of reporting metrics (ψ dimension) */
    private reportingDimensions: number;

    /** 3D tensor `ΔP[α][σ][τ]` representing priority tensor updates */
    private deltaP: number[][][];

    /** 3D tensor `ΔW[α][σ][τ]` representing intermediate gradient calculations */
    private deltaW: number[][][];

    /**
     * Creates a new AgentSet instance with specified behavioral tensors.
     *
     * @param agentSetTensors - Object containing the four behavioral tensors
     * @param states - Array of possible agent states
     * @param randomStream - Random number generator for stochastic transitions
     * @param logger - Logger instance for diagnostics
     * @param clockTick - Simulation time step in seconds (default: 0.1)
     *
     * @throws {Error} If tensor dimensions are inconsistent
     *
     * @remarks
     * The constructor performs the following initialization steps:
     * 1. Validates tensor dimensions for consistency
     * 2. Extracts dimensional parameters (agent count, state count, etc.)
     * 3. Initializes each agent with a starting state
     * 4. Allocates ΔP and ΔW tensors for gradient calculations
     */
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
            this.agents.push(new Agent(this.states.length - 1, states));
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

    /**
     * Transitions all agents to new states based on stochastic priority tensor.
     *
     * @returns 2D tensor of control inputs `[α][χ]` emitted by each agent
     *
     * @remarks
     * The state transition algorithm:
     * 1. Generates random numbers `r[α] ∈ [0,1)` for each agent
     * 2. Computes cumulative distribution: `CDF[α][σ][τ] = Σ(P[α][σ][k] for k ≤ τ)`
     * 3. Selects new state τ where `CDF[α][σ][τ-1] < r[α] ≤ CDF[α][σ][τ]`
     * 4. Each agent emits control tensor based on new state
     *
     * The cumulative distribution is normalized to exactly 1.0 at the final state
     * to prevent floating-point precision issues from making the last state unreachable.
     *
     * @example
     * ```typescript
     * const controlInputs = agentSet.transitionState();
     * // controlInputs[0] contains agent 0's control tensor
     * // controlInputs[i][j] is agent i's control value for plant variable j
     * ```
     */
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
                    if (tau === this.states.length - 1)
                        cumulative[alpha][sigma][tau] = 1.0; // Force final cumulative value to exactly 1.0
                }
            }
        }

        // iterate through the agents and transition their states, emiting workstation control tensors
        let controlInputTensor: number[][] = [];
        for (let alpha = 0; alpha < this.agents.length; alpha++) {
            // perform state transitions
            let tau: number = 0;
            const currentState = this.agents[alpha].getStateIndex();
            const maxTau = this.states.length - 1;
            while (tau < maxTau) {
                if (rand[alpha] < cumulative[alpha][currentState][tau]) break;
                tau++;
            }
            // Ensure tau doesn't exceed valid bounds
            tau = Math.min(tau, maxTau);
            this.agents[alpha].setStateIndex(tau);
        }
        controlInputTensor = this.emitControlInputTensor();
        this._log("Agent states transitioned", {
            agentStates: this.getAgentStateArray(),
            controlInputTensor: controlInputTensor
        });
        return controlInputTensor;
    }

    /**
     * Emits control input tensor from all agents based on their current states.
     *
     * @returns 2D tensor `[α][χ]` where each row is an agent's control tensor
     *
     * @internal
     */
    emitControlInputTensor(): number[][] {
        const controlInputTensor: number[][] = [];
        for (let alpha = 0; alpha < this.agents.length; alpha++) {
            controlInputTensor.push(this.agents[alpha].emitWorkstationControlTensor());
        }
        return controlInputTensor;
    }

    /**
     * Retrieves all behavioral tensors.
     *
     * @returns Object containing priority, influence, judgment, and incentive tensors
     *
     * @remarks
     * The returned tensors are references to the internal state - modifications will affect
     * the agent set behavior. Use with caution.
     */
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

    /**
     * Returns array of current agent state indices.
     *
     * @returns Array where `result[α]` is agent α's current state index
     *
     * @example
     * ```typescript
     * const states = agentSet.getAgentStateArray();
     * // states = [0, 2, 1, 0, 1] means:
     * // Agent 0 is in state 0, Agent 1 in state 2, etc.
     * ```
     */
    getAgentStateArray(): number[] {
        const array: number[] = [];
        for (let alpha = 0; alpha < this.agents.length; alpha++) array.push(this.agents[alpha].getStateIndex());
        return array;
    }

    /**
     * Returns the total number of agents in the set.
     *
     * @returns Agent count (α dimension)
     */
    getAgentCount(): number {
        return this.agents.length;
    }

    /**
     * Returns the total number of possible states.
     *
     * @returns State count (σ, τ dimensions)
     */
    getStateCount(): number {
        return this.stateCount;
    }

    /**
     * Returns the priority tensor update (ΔP) from the most recent recalculation.
     *
     * @returns 3D tensor `ΔP[α][σ][τ]` representing priority updates
     *
     * @remarks
     * Useful for analyzing learning dynamics and convergence behavior.
     */
    getDeltaP(): number[][][] {
        return this.deltaP;
    }

    /**
     * Recalculates priority tensor using gradient descent based on system feedback.
     *
     * @param targets - Target values for plant state and reporting metrics
     * @param plantState - Current plant state vector `[χ]`
     * @param reporting - Current reporting metrics vector `[ψ]`
     * @returns This AgentSet instance for method chaining
     *
     * @remarks
     * The priority tensor update algorithm:
     *
     * 1. **Calculate ΔW** (gradient of objective function):
     *    ```
     *    ΔW[α][σ][τ] = Σ(W[α][β][σ][τ] * (P[α][σ][τ] - P[β][σ][τ])) * Δt
     *                + Σ(J[α][σ][τ][χ] * (x[χ] - x*[χ])) * Δt
     *                + Σ(I[α][σ][τ][ψ] * (r[ψ] - r*[ψ])) * Δt
     *    ```
     *
     * 2. **Calculate ΔP** (using Jacobian of simplex constraint):
     *    ```
     *    ΔP[α][σ][τ] = Σ(P[α][σ][τ] * (δ[τ,λ] - P[α][σ][λ]) * ΔW[α][σ][λ])
     *    ```
     *
     * 3. **Apply saturation limits** (prevent probabilities from going negative or > 1)
     *
     * 4. **Normalize** each row to ensure `Σ P[α][σ][τ] = 1` (simplex constraint)
     *
     * If normalization encounters a zero-sum row (degenerate case), the row is reset
     * to uniform distribution and a warning is logged.
     *
     * @example
     * ```typescript
     * agentSet.recalculateParams(
     *   { plantState: [10, 20], reporting: [100] },
     *   [11, 19],  // current plant state
     *   [98]       // current reporting
     * );
     * ```
     */
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
                        const delta: number = tau === lambda ? 1 : 0;
                        const jacobian =
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
                    const tmp = this.priorityTensor[alpha][sigma][tau];
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
                // Guard against division by zero
                if (sum !== 0) {
                    for (let tau = 0; tau < this.stateCount; tau++) {
                        this.priorityTensor[alpha][sigma][tau] /= sum;
                    }
                } else {
                    // Handle zero sum case by initializing to uniform distribution
                    const uniformValue = 1 / this.stateCount;
                    for (let tau = 0; tau < this.stateCount; tau++) {
                        this.priorityTensor[alpha][sigma][tau] = uniformValue;
                    }
                    this.logger.warning({
                        sourceObject: this.name,
                        message: "Priority tensor row sum was zero, reset to uniform distribution",
                        data: { alpha, sigma }
                    });
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

    /**
     * Validates dimensional consistency of all behavioral tensors.
     *
     * @returns `true` if all tensors are dimensionally consistent, `false` otherwise
     * @throws {Error} If critical inconsistencies are detected (via logger.error)
     *
     * @remarks
     * Checks the following constraints:
     * - Priority tensor: `[α][σ][τ]` with α = agentCount, σ = τ = stateCount
     * - Influence tensor: `[α][β][σ][τ]` with β = agentCount
     * - Judgment tensor: `[α][σ][τ][χ]` with χ = plantDegreesOfFreedom
     * - Incentive tensor: `[α][σ][τ][ψ]` with ψ = reportingDimensions
     *
     * @internal
     */
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

    /**
     * Internal trace logging helper.
     *
     * @param message - Log message
     * @param data - Optional data payload
     *
     * @internal
     */
    protected _log(message: string, data?: any) {
        this.logger.trace({
            sourceObject: this.name,
            message: message,
            data: data
        });
    }
}
