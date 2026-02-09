import { Observable, Subscriber } from "rxjs";
import { LogLine, LogMessage } from "../interfaces/core.interfaces";
import { LogType } from "../types/core.types";

/**
 * Observable-based logging system for simulation diagnostics and monitoring.
 *
 * @remarks
 * The Logger class provides a reactive logging interface using RxJS Observables.
 * Log messages are broadcast through an observable stream that can be subscribed to
 * for real-time monitoring, filtering, and persistence.
 *
 * **Key Features:**
 * - Multiple log levels: trace, info, warning, error
 * - Observable stream for reactive log handling
 * - Structured log messages with timestamps and source attribution
 * - Automatic error throwing for error-level logs
 *
 * **Usage Pattern:**
 * ```typescript
 * const logger = new Logger();
 *
 * // Subscribe to log stream
 * logger.getObservable$().subscribe((logLine) => {
 *   console.log(`[${logLine.type}] ${logLine.message.message}`);
 * });
 *
 * // Log messages
 * logger.info({ sourceObject: "Simulation", message: "Started" });
 * logger.warning({ sourceObject: "Agent", message: "Saturation detected" });
 * ```
 *
 * @public
 */
export class Logger {
    /** Internal subscriber for broadcasting log messages (null until first subscription) */
    private broadcast$: Subscriber<LogLine> | null = null;

    /** Observable stream of log messages */
    private logger$: Observable<LogLine>;

    /**
     * Creates a new Logger instance with an observable log stream.
     *
     * @remarks
     * The logger initializes with a null broadcast subscriber. The subscriber is
     * set when the observable is subscribed to. Log messages sent before the
     * first subscription are silently dropped (not buffered).
     *
     * @example
     * ```typescript
     * const logger = new Logger();
     *
     * // Subscribe to receive logs
     * const subscription = logger.getObservable$().subscribe({
     *   next: (log) => console.log(log),
     *   error: (err) => console.error(err),
     *   complete: () => console.log("Logger closed")
     * });
     *
     * // Later: unsubscribe to stop receiving logs
     * subscription.unsubscribe();
     * ```
     */
    constructor() {
        this.logger$ = new Observable((subscriber) => {
            this.broadcast$ = subscriber;
        });
    }

    /**
     * Returns the observable stream for subscribing to log messages.
     *
     * @returns Observable that emits {@link LogLine} objects
     *
     * @remarks
     * Multiple subscribers can listen to the same logger. Each subscriber
     * receives all log messages emitted after their subscription.
     *
     * @example
     * ```typescript
     * const logger = new Logger();
     *
     * // File logger
     * logger.getObservable$()
     *   .pipe(filter(log => log.type === 'error'))
     *   .subscribe(log => fs.appendFileSync('errors.log', JSON.stringify(log)));
     *
     * // Console logger
     * logger.getObservable$()
     *   .subscribe(log => console.log(`[${log.timeStamp}] ${log.type}: ${log.message.message}`));
     * ```
     */
    getObservable$(): Observable<LogLine> {
        return this.logger$;
    }

    /**
     * Logs an informational message.
     *
     * @param message - Message object containing source and content
     * @returns The formatted log line that was broadcast
     *
     * @remarks
     * Use info-level logs for general operational information, state transitions,
     * and successful operations.
     *
     * @example
     * ```typescript
     * logger.info({
     *   sourceObject: "Organisation",
     *   message: "State transition completed",
     *   data: { clockTick: 42, agentCount: 10 }
     * });
     * ```
     */
    info(message: LogMessage) {
        return this.broadcast("info", message);
    }

    /**
     * Logs a trace-level diagnostic message.
     *
     * @param message - Message object containing source and content
     * @returns The formatted log line that was broadcast, or null if no subscribers
     *
     * @remarks
     * Use trace-level logs for detailed diagnostic information during development
     * and debugging. Trace logs are typically filtered out in production.
     *
     * @example
     * ```typescript
     * logger.trace({
     *   sourceObject: "AgentSet",
     *   message: "Recalculating priority tensor",
     *   data: { alpha: 0, sigma: 1, deltaP: 0.025 }
     * });
     * ```
     */
    trace(message: LogMessage): LogLine | null {
        return this.broadcast("trace", message);
    }

    /**
     * Logs a warning message for non-critical issues.
     *
     * @param message - Message object containing source and content
     * @returns The formatted log line that was broadcast
     *
     * @remarks
     * Use warnings for recoverable issues, unexpected but handled conditions,
     * and potential problems that don't prevent normal operation.
     *
     * @example
     * ```typescript
     * logger.warning({
     *   sourceObject: "AgentSet",
     *   message: "Priority tensor saturation detected, tensor was regularised",
     *   data: { agent: 5, state: 2 }
     * });
     * ```
     */
    warning(message: LogMessage) {
        return this.broadcast("warn", message);
    }

    /**
     * Logs an error message and throws an Error.
     *
     * @param message - Message object containing source and content
     * @throws {Error} Always throws with the message content
     *
     * @remarks
     * Error-level logs indicate critical failures that prevent normal operation.
     * This method broadcasts the error message, then throws an Error, halting execution.
     *
     * Use this for unrecoverable errors like:
     * - Invalid tensor dimensions
     * - Consistency check failures
     * - Resource initialization failures
     *
     * @example
     * ```typescript
     * try {
     *   if (priorityTensor.length === 0) {
     *     logger.error({
     *       sourceObject: "AgentSet",
     *       message: "Invalid priority tensor dimensions",
     *       data: { shape: priorityTensor.length }
     *     });
     *   }
     * } catch (err) {
     *   console.error("Fatal error:", err.message);
     * }
     * ```
     */
    error(message: LogMessage) {
        this.broadcast("error", message);
        throw new Error(message.message);
    }

    /**
     * Broadcasts a log message to all subscribers.
     *
     * @param messageType - Log level: "trace", "info", "warn", or "error"
     * @param message - Log message content
     * @returns Formatted log line
     *
     * @remarks
     * If no subscribers exist (broadcast$ is null), the message is silently dropped.
     * This prevents log accumulation before the observable is subscribed to.
     *
     * @internal
     */
    private broadcast(messageType: LogType, message: LogMessage): LogLine {
        const logLine: any = this.package(messageType, message);
        if (this.broadcast$) {
            this.broadcast$.next(logLine);
        }
        return logLine;
    }

    /**
     * Packages a message into a structured log line with timestamp.
     *
     * @param messageType - Log level
     * @param message - Log message content
     * @returns Formatted log line with type, timestamp, and message
     *
     * @internal
     */
    private package(messageType: LogType, message: LogMessage): LogLine {
        return { type: messageType, timeStamp: new Date().getTime(), message: message } as LogLine;
    }
}
