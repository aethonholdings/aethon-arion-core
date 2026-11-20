import { Observable, Subject } from "rxjs";
import { LogLine, LogMessage } from "../interfaces/core.interfaces";
import { LogType } from "../types/core.types";

/**
 * Structured logger that broadcasts log lines to every subscriber of {@link getObservable$}.
 *
 * @remarks
 * - Lines are multicast: every subscriber receives every line emitted after it subscribed.
 * - {@link error} logs and returns the line; it does not throw. Callers that must abort do so explicitly.
 *
 * @example
 * ```typescript
 * const logger = new Logger();
 * logger.getObservable$().subscribe((line) => console.log(line));
 * logger.info({ sourceObject: "Simulation", message: "Started" });
 * ```
 */
export class Logger {
    private readonly subject$: Subject<LogLine> = new Subject<LogLine>();
    private readonly logger$: Observable<LogLine> = this.subject$.asObservable();

    /** Returns the observable stream of log lines. */
    getObservable$(): Observable<LogLine> {
        return this.logger$;
    }

    info(message: LogMessage): LogLine {
        return this.broadcast("info", message);
    }

    trace(message: LogMessage): LogLine {
        return this.broadcast("trace", message);
    }

    warning(message: LogMessage): LogLine {
        return this.broadcast("warn", message);
    }

    /** Logs an error line and returns it. Does not throw. */
    error(message: LogMessage): LogLine {
        return this.broadcast("error", message);
    }

    /** Completes the stream; subscribers receive `complete`. */
    complete(): void {
        this.subject$.complete();
    }

    private broadcast(messageType: LogType, message: LogMessage): LogLine {
        const logLine: LogLine = this.package(messageType, message);
        this.subject$.next(logLine);
        return logLine;
    }

    private package(messageType: LogType, message: LogMessage): LogLine {
        return { type: messageType, timeStamp: new Date().getTime(), message: message } as LogLine;
    }
}
