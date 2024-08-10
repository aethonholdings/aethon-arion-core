import { Observable, lastValueFrom, map } from "rxjs";
import { Logger } from "../src/classes/class.logger";
import { RandomStreamFactory } from "../src/classes/class.random.stream.factory";
import { LogLine, SimulationConfig } from "../src/interfaces/interfaces";
import { TestSimulation } from "./init/test.init.model";

export function runSimulationTest(description: string, simConfig: SimulationConfig, verbose: boolean = false) {
    const logger: Logger = new Logger();
    let logger$: Promise<LogLine> | undefined;

    describe(description, () => {
        let simulation: TestSimulation;

        it("can initialise a simulation", () => {
            simulation = new TestSimulation(simConfig, logger, new RandomStreamFactory());
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
