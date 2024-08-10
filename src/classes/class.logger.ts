import { Observable, Subscriber } from "rxjs";
import { LogLine, LogMessage } from "../interfaces/interfaces";
import { LogType } from "../types/types";

export class Logger {
    private broadcast$: Subscriber<LogLine>;
    private logger$: Observable<LogLine>;

    constructor() {
        this.broadcast$ = new Subscriber();
        this.logger$ = new Observable((subscriber) => {
            this.broadcast$ = subscriber;
        });
    }

    getObservable$(): Observable<LogLine> {
        return this.logger$;
    }

    info(message: LogMessage) {
        return this.broadcast("info", message);
    }

    trace(message: LogMessage): LogLine | null {
        return this.broadcast("trace", message);
    }

    warning(message: LogMessage) {
        return this.broadcast("warn", message);
    }

    error(message: LogMessage) {
        this.broadcast("error", message);
        throw new Error(message.message);
    }

    private broadcast(messageType: LogType, message: LogMessage): LogLine {
        const logLine: any = this.package(messageType, message);
        this.broadcast$.next(logLine);
        return logLine;
    }

    private package(messageType: LogType, message: LogMessage): LogLine {
        return { type: messageType, timeStamp: new Date().getTime(), message: message } as LogLine;
    }
}
