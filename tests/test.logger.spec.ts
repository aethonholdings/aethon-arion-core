import { map, Observable, firstValueFrom } from "rxjs";
import { Logger } from "../src/classes/class.logger";
import { LogLine } from "../src/interfaces/interfaces";

export function loggerTest() {
    let logger: Logger;
    let logger$: Observable<LogLine>;

    describe("Logger", () => {
        it("can initialise a logger", () => {
            logger = new Logger();
            expect(logger).not.toBeNull();
        });
        it("can log a message", () => {
            const message = { sourceObject: "Test", message: "logger initialised" };
            const logLine: LogLine | null = logger.info(message);
            expect(logLine).not.toBeNull();
            expect(logLine?.type).toBe("info");
            expect(logLine?.message).toBe(message);
        });
        it("can get an observable", () => {
            logger$ = logger.getObservable$();
            expect(logger$).not.toBeNull();
        });
        it("can broadcast a message through the observable", async () => {
            const message = { sourceObject: "Test", message: "Test logline", data: { test: "test" } };
            logger$ = logger.getObservable$();
            let logLine$ = firstValueFrom(
                logger$.pipe(
                    map((logLine: LogLine) => {
                        console.log(logLine);
                        return logLine;
                    })
                )
            );
            logger.info(message);
            const logLine = await logLine$;
            expect(logLine).not.toBeNull();
            expect(logLine.type).toBe("info");
            expect(logLine.message.sourceObject).toBe("Test");
            expect(logLine.message.message).toBe("Test logline");
        });
    });
}
