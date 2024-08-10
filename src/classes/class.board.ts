import { Targets } from "../interfaces/interfaces";
import { Logger } from "./class.logger";

export abstract class Board {
    protected name: string = "Board";
    protected plan: Targets;
    protected logger: Logger;

    constructor(plan: Targets, logger: Logger) {
        this.logger = logger;
        this._log("Initialising Board");
        this.plan = plan;
        this._log("Board initialised");
        return this;
    }

    abstract transitionState(reportingTensor: number[]): Targets;

    getPlan(): Targets {
        return this.plan;
    };

    protected _log(message: string, data?: any): void {
        this.logger.trace({
            sourceObject: this.name,
            message: message,
            data: data
        });
    }
}
