import { Targets } from "../interfaces/core.interfaces";
import { Logger } from "./logger.class";

/**
 * Abstract base class for strategic planning and target setting.
 *
 * @remarks
 * The Board represents the strategic decision-making layer that sets performance targets
 * for the organisation. It observes current performance metrics and updates targets to
 * guide agent behavior toward desired outcomes.
 *
 * **Responsibilities:**
 *
 * - Review current performance (reporting metrics)
 * - Set or update strategic targets for:
 *   - Plant state variables (e.g., production capacity, inventory levels)
 *   - Reporting metrics (e.g., KPIs, performance indicators)
 * - Provide feedback to guide agent learning via gradient descent
 *
 * **Implementation Pattern:**
 *
 * Concrete Board implementations must define the `transitionState()` method to specify
 * how targets are updated based on current performance. Strategies include:
 *
 * - **Static targets**: Return fixed plan regardless of performance
 * - **Adaptive targets**: Adjust based on performance gaps
 * - **Scheduled targets**: Change targets over time (e.g., growth targets)
 * - **Reactive targets**: Respond to specific performance thresholds
 *
 * @example
 * ```typescript
 * // Example concrete implementation
 * class C1Board extends Board {
 *   transitionState(reportingTensor: number[]): Targets {
 *     // Static strategy: return unchanging targets
 *     return this.plan;
 *   }
 * }
 *
 * // Usage
 * const targets: Targets = {
 *   plantState: [10.0, 20.0],    // Target plant states
 *   reporting: [0.95, 0.90]      // Target performance metrics
 * };
 * const board = new C1Board(targets, logger);
 * ```
 *
 * @public
 */
export abstract class Board {
    protected name: string = "Board";
    protected plan: Targets;
    protected logger: Logger;

    /**
     * Creates a new Board with initial strategic targets.
     *
     * @param plan - Initial target values for plant state and reporting metrics
     * @param logger - Observable logging system
     *
     * @remarks
     * The plan defines the desired state that agents should drive the organisation toward.
     * Target dimensions must match:
     * - `plan.plantState.length` = Plant degrees of freedom (χ)
     * - `plan.reporting.length` = Reporting degrees of freedom (ψ)
     *
     * @example
     * ```typescript
     * const targets: Targets = {
     *   plantState: [100.0, 50.0, 75.0],  // 3 plant variables
     *   reporting: [0.95, 0.88, 1.2]      // 3 performance metrics
     * };
     * const board = new C1Board(targets, logger);
     * ```
     */
    constructor(plan: Targets, logger: Logger) {
        this.logger = logger;
        this._log("Initialising Board");
        this.plan = plan;
        this._log("Board initialised");
        return this;
    }

    /**
     * Updates strategic targets based on current performance.
     *
     * @param reportingTensor - Current performance metrics
     * @returns Updated targets for the next time step
     *
     * @remarks
     * This abstract method must be implemented by concrete Board subclasses.
     * It defines the Board's strategic behavior in response to performance feedback.
     *
     * **Implementation Strategies:**
     *
     * - **Static**: Return `this.plan` unchanged (simple baseline)
     * - **Gap-based**: Increase targets when performance exceeds current targets
     * - **Time-based**: Update targets according to a schedule
     * - **Threshold-based**: Change targets when metrics cross thresholds
     *
     * The returned targets influence agent behavior through the gradient descent
     * parameter update mechanism.
     *
     * @example
     * ```typescript
     * // Static strategy
     * class StaticBoard extends Board {
     *   transitionState(reportingTensor: number[]): Targets {
     *     return this.plan;  // Never change targets
     *   }
     * }
     *
     * // Adaptive strategy
     * class AdaptiveBoard extends Board {
     *   transitionState(reportingTensor: number[]): Targets {
     *     const newTargets = { ...this.plan };
     *     for (let i = 0; i < reportingTensor.length; i++) {
     *       if (reportingTensor[i] > this.plan.reporting[i] * 1.1) {
     *         // Exceeded by 10% -> increase target
     *         newTargets.reporting[i] *= 1.05;
     *       }
     *     }
     *     return newTargets;
     *   }
     * }
     * ```
     */
    abstract transitionState(reportingTensor: number[]): Targets;

    /**
     * Returns the current strategic plan.
     *
     * @returns Current target values for plant state and reporting metrics
     */
    getPlan(): Targets {
        return this.plan;
    }

    /**
     * Logs a trace-level diagnostic message.
     *
     * @param message - Message content
     * @param data - Optional structured data to include
     *
     * @internal
     */
    protected _log(message: string, data?: any): void {
        this.logger.trace({
            sourceObject: this.name,
            message: message,
            data: data
        });
    }
}
