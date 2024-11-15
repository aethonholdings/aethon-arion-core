import { lastValueFrom, map } from "rxjs";
import { Logger } from "../src/classes/class.logger";
import { RandomStreamFactory } from "../src/classes/class.random.stream.factory";
import { LogLine, SimulationConfig } from "../src/interfaces/interfaces";
import { Simulation } from "../src/classes/class.simulation";
import { Organisation } from "../src/classes/class.organisation";

export function runSimulationTest(description: string, simConfig: SimulationConfig, verbose: boolean = false) {
    const logger: Logger = new Logger();
    let logger$: Promise<LogLine> | undefined;

    describe(description, () => {
        let simulation: Simulation;

        it("can initialise a simulation", () => {
            simulation = new Simulation(simConfig, logger, new RandomStreamFactory(), {} as Organisation);
            if (verbose) {
                logger$ = lastValueFrom(
                    logger.getObservable$().pipe(
                        map((logLine) => {
                            console.log(logLine);
                            return logLine;
                        })
                    )
                );
            }
            expect(simulation).not.toBeNull();
        });
    });
}
