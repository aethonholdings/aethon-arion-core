import { Utils, type Tensor } from "../modules/module.utils";
import { Plant } from "./class.plant";
import { Reporting } from "./class.reporting";
import { AgentSet } from "./class.agent.set";
import { Board } from "./class.board";
import { Targets } from "../interfaces/interfaces";
import { Logger } from "./class.logger";

export class Organisation {
    protected name: string = "Organisation";
    protected board: Board;
    protected agentSet: AgentSet;
    protected plant: Plant;
    protected reporting: Reporting;
    protected logger: Logger;
    private clockTick: number = 0;

    constructor(
        board: Board,
        agentSet: AgentSet,
        plant: Plant,
        reporting: Reporting,
        logger: Logger
    ) {
        this.logger = logger;
        this._log("Initialising Organisation");
        this.board = board;
        this.agentSet = agentSet;
        this.plant = plant;
        this.reporting = reporting;
        this.checkConsistency();
        this._log("Organisation initialised");
    }

    transitionState(): Organisation {
        this._log("Transitioning Organisation state");
        const targets: Targets = this.board.transitionState(this.reporting.getReportingTensor());
        const controlInputTensor: Tensor = this.agentSet.transitionState();
        const plantStateTensor: Tensor = this.plant.transitionState(controlInputTensor);
        const reportOutput: Tensor = this.reporting.transitionState(
            plantStateTensor,
            this.plant.getDeltaTensor(),
            controlInputTensor
        );
        this.agentSet.recalculateParams(targets, plantStateTensor, reportOutput);
        this.clockTick++;
        this._log("Organisation state transitioned");
        return this;
    }

    getStateArray(): number[] {
        let stateArray: number[] = this.agentSet.getAgentStateArray();
        stateArray.concat(this.plant.getStateTensor());
        stateArray.concat(this.reporting.getReportingTensor());
        return stateArray;
    }

    getClockTick(): number {
        return this.clockTick;
    }

    getBoard(): Board {
        return this.board;
    }

    getAgents(): AgentSet {
        return this.agentSet;
    }

    getPlant(): Plant {
        return this.plant;
    }

    getReporting(): Reporting {
        return this.reporting;
    }

    checkConsistency(): boolean {
        this._log("Checking organisation tensor dimension consistency");
        try {
            if (!this.board || !this.agentSet || !this.plant || !this.reporting) {
                throw new Error("Missing Board, AgentSet, Plant or Reporting");
            } else {
                if (!this.agentSet.checkConsistency()) throw new Error("Agent set inconsistency");
                const chi = this.plant.getDegreesOfFreedom();
                const psi = this.reporting.getDegreesOfFreedom();

                const plantTargetShape = this.board.getPlan().plantState.length;
                const reportingTargetShape = this.board.getPlan().reporting.length;
                const judgmentMatrixChi = Utils.shape(this.agentSet.getTensors().judgmentTensor)[3];
                const incentiveMatrixPsi = Utils.shape(this.agentSet.getTensors().incentiveTensor)[3];

                if (chi !== plantTargetShape)
                    throw new Error("Plant state tensor dimension inconsistency with Board Plant Targets (chi)");
                if (chi !== judgmentMatrixChi)
                    throw new Error("Judgment matrix tensor dimension inconsistency with Plant state tensor (chi)");
                if (psi !== reportingTargetShape)
                    throw new Error("Reporting tensor dimension inconsistency with Board Reporting Targets (psi)");
                if (psi !== incentiveMatrixPsi)
                    throw new Error("Incentive matrix tensor dimension inconsistency with Reporting tensor (psi)");
            }
        } catch (error: any) {
            this.logger.error({
                sourceObject: this.name,
                message: "Error in Organisation tensor dimension consistency",
                data: { message: error?.message }
            });
            return false;
        }
        this._log("Organisation tensor dimension consistency check passed");
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
