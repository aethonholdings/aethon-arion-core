import { RandomStreamFactory } from "./class.random.stream.factory";
import { SimulationConfig, OrgModelConfig, StepOutput } from "../interfaces/interfaces";
import { Organisation } from "./class.organisation";
import { Logger } from "./class.logger";
import { Observable } from "rxjs";

export abstract class Simulation {
    protected name: string = "Simulation";
    protected config: SimulationConfig;
    protected orgModelConfig: OrgModelConfig;
    protected randomStreamFactory: RandomStreamFactory;
    protected logger: Logger;
    protected clockTicks: number;
    protected organisation: Organisation;

    constructor(simConfig: SimulationConfig, logger: Logger, randomStreamFactory: RandomStreamFactory) {
        this.logger = logger;
        this._log(`Initialising Simulation`);
        this.orgModelConfig = simConfig.orgConfig;
        this.randomStreamFactory = randomStreamFactory;
        this.config = simConfig;
        this.clockTicks = (this.config.days * 8 * 60 * 60) / this.orgModelConfig.clockTickSeconds;
        this.organisation = this.initialiseOrg();
        this._log(`Simulation initialised`);
    }

    run$(): Observable<StepOutput> {
        this._log(`Running simulation for ${this.clockTicks} clock ticks`);
        let stepOutput$ = new Observable<StepOutput>((subscriber) => {
            for (let tick: number = 0; tick < this.clockTicks; tick++) {
                this._log(`Beginning clock tick ${tick}`, { clockTick: tick });
                this.organisation.transitionState();
                this._log(`Completed clock tick ${tick}`, { clockTick: tick });
                subscriber.next({ clockTick: tick, organisation: this.organisation });
            }
            subscriber.complete();
        });
        return stepOutput$;
    }

    protected abstract initialiseOrg(): Organisation;

    private _log(message: string, data?: any): void {
        this.logger.trace({
            sourceObject: this.name,
            message: message,
            data: data
        });
    }
}
