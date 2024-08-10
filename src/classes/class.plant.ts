import { Utils } from "../modules/module.utils";
import type { Tensor } from "../modules/module.utils";
import { Logger } from "./class.logger";

export abstract class Plant {
    protected name: string = "Plant";
    protected stateTensor: number[];
    protected delta: number[];
    protected logger: Logger;

    constructor(initialStateTensor: number[], logger: Logger) {
        this.logger = logger;
        this._log("Initialising Plant");
        this.stateTensor = initialStateTensor;
        this.delta = Utils.tensor(Utils.shape(initialStateTensor), () => {
            return 0;
        }) as number[];
        this._log("Plant initialised");
        return this;
    }

    abstract transitionState(inputTensor: Tensor): number[];

    getDegreesOfFreedom(): number {
        return this.stateTensor.length;
    }

    getStateTensor(): number[] {
        return this.stateTensor;
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
