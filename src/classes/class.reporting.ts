import { Utils } from "../modules/module.utils";
import type { Tensor } from "../modules/module.utils";
import { Logger } from "./class.logger";

export abstract class Reporting {
    protected name: string = "Reporting";
    protected reportingTensor: number[];
    protected delta: number[];
    protected logger: Logger;

    constructor(initialReportingTensor: number[], logger: Logger) {
        this.logger = logger;
        this._log("Initialising Reporting");
        this.reportingTensor = initialReportingTensor;
        this.delta = Utils.tensor(Utils.shape(initialReportingTensor), () => {
            return 0;
        }) as number[];
        this._log("Reporting initialised");
    }

    abstract transitionState(stateTensor: Tensor, deltaStateTensor: Tensor, controlInputTensor: Tensor): number[];

    getDegreesOfFreedom(): number {
        return this.reportingTensor.length;
    }

    getReportingTensor(): number[] {
        return this.reportingTensor;
    }

    getDeltaTensor(): number[] {
        return this.delta;
    }

    protected _log(message: string, data?: any) {
        this.logger.trace({
            sourceObject: this.name,
            message: message,
            data: data
        });
    }
}
