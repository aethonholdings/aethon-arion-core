import { Utils } from "../modules/utils.module";
import type { Tensor } from "../modules/utils.module";
import { Logger } from "./logger.class";

/**
 * Abstract base class for calculating performance metrics and KPIs.
 *
 * @remarks
 * The Reporting subsystem computes performance metrics based on the organisation's
 * operational state. These metrics provide feedback to:
 * - The Board for strategic target updates
 * - Agents via incentive tensors to shape behavior
 *
 * **Metric Calculation:**
 *
 * Reporting metrics are computed from three sources:
 * ```
 * ψ(t) = g(χ(t), Δχ(t), u(t))
 * ```
 *
 * Where:
 * - `ψ(t)` = Reporting metrics at time t
 * - `χ(t)` = Plant state (current levels)
 * - `Δχ(t)` = Plant state changes (rates)
 * - `u(t)` = Agent control inputs (decisions)
 * - `g()` = Metric calculation function (defined in concrete implementations)
 *
 * **Example Metrics:**
 *
 * - **Productivity**: Output per unit time (uses `Δχ`)
 * - **Utilization**: Resource usage ratio (uses `χ` and `u`)
 * - **Quality**: Defect rates (uses `χ` and `u`)
 * - **Efficiency**: Output/input ratio (uses all three)
 * - **Service Level**: Demand satisfaction rate (uses `χ` and `Δχ`)
 *
 * **Delta Tracking:**
 *
 * Like Plant, Reporting maintains `delta` to track metric changes:
 * ```
 * Δψ(t) = ψ(t) - ψ(t-1)
 * ```
 *
 * **Degrees of Freedom:**
 *
 * The number of metrics (ψ) defines the reporting degrees of freedom.
 * This must match:
 * - Board reporting target vector length
 * - AgentSet incentive tensor 4th dimension
 *
 * @example
 * ```typescript
 * // Example concrete implementation
 * class ProductionReporting extends Reporting {
 *   transitionState(
 *     stateTensor: Tensor,
 *     deltaStateTensor: Tensor,
 *     controlInputTensor: Tensor
 *   ): number[] {
 *     const plantState = stateTensor as number[];
 *     const plantDelta = deltaStateTensor as number[];
 *
 *     const oldMetrics = [...this.reportingTensor];
 *
 *     // Metric 1: Production rate (from plant delta)
 *     this.reportingTensor[0] = Math.max(0, plantDelta[0]);
 *
 *     // Metric 2: Inventory utilization (from plant state)
 *     this.reportingTensor[1] = plantState[0] / 100.0;
 *
 *     // Calculate delta
 *     this.delta = this.reportingTensor.map((m, i) => m - oldMetrics[i]);
 *
 *     return this.reportingTensor;
 *   }
 * }
 *
 * // Usage
 * const initialMetrics = [0.0, 0.5];  // [production_rate, utilization]
 * const reporting = new ProductionReporting(initialMetrics, logger);
 * ```
 *
 * @public
 */
export abstract class Reporting {
    protected name: string = "Reporting";
    protected reportingTensor: number[];
    protected delta: number[];
    protected logger: Logger;

    /**
     * Creates a new Reporting subsystem with specified initial metrics.
     *
     * @param initialReportingTensor - Initial values for all performance metrics
     * @param logger - Observable logging system
     *
     * @remarks
     * The delta tensor is initialized to zeros with the same shape as the reporting tensor.
     * Delta values are updated during each `transitionState()` call to track
     * metric trends.
     *
     * @example
     * ```typescript
     * const initialMetrics = [0.0, 0.85, 1.0];
     * const reporting = new C1Reporting(initialMetrics, logger);
     * ```
     */
    constructor(initialReportingTensor: number[], logger: Logger) {
        this.logger = logger;
        this._log("Initialising Reporting");
        this.reportingTensor = initialReportingTensor;
        this.delta = Utils.tensor(Utils.shape(initialReportingTensor), () => {
            return 0;
        }) as number[];
        this._log("Reporting initialised");
    }

    /**
     * Calculates updated performance metrics based on plant and agent states.
     *
     * @param stateTensor - Current plant state (χ)
     * @param deltaStateTensor - Change in plant state (Δχ)
     * @param controlInputTensor - Agent control inputs (u)
     * @returns Updated reporting metrics
     *
     * @remarks
     * This abstract method must be implemented by concrete Reporting subclasses.
     * It defines how performance metrics are calculated from observable system state.
     *
     * **Implementation Requirements:**
     *
     * 1. Compute new metrics: `ψ(t+1) = g(χ(t+1), Δχ(t), u(t))`
     * 2. Calculate delta: `Δψ = ψ(t+1) - ψ(t)`
     * 3. Update `this.reportingTensor` and `this.delta`
     * 4. Return new metrics
     *
     * **Common Metric Patterns:**
     *
     * - **Rates**: Use `deltaStateTensor` (e.g., production rate, throughput)
     * - **Ratios**: Use `stateTensor` (e.g., utilization = used/capacity)
     * - **Efficiency**: Combine `stateTensor` and `controlInputTensor`
     * - **Derived**: Complex calculations from multiple sources
     *
     * The metrics are observed by:
     * - Board to update strategic targets
     * - Agents via incentive tensors to influence behavior
     *
     * @example
     * ```typescript
     * class ServiceReporting extends Reporting {
     *   transitionState(
     *     stateTensor: Tensor,
     *     deltaStateTensor: Tensor,
     *     controlInputTensor: Tensor
     *   ): number[] {
     *     const state = stateTensor as number[];
     *     const delta = deltaStateTensor as number[];
     *     const inputs = controlInputTensor as number[];
     *
     *     const oldMetrics = [...this.reportingTensor];
     *
     *     // Throughput: rate of change in cumulative output
     *     this.reportingTensor[0] = Math.max(0, delta[0]);
     *
     *     // Service level: ratio of satisfied to total demand
     *     const demand = 100.0;
     *     this.reportingTensor[1] = Math.min(1.0, state[0] / demand);
     *
     *     // Efficiency: output per unit input
     *     this.reportingTensor[2] = inputs[0] > 0
     *       ? delta[0] / inputs[0]
     *       : 0.0;
     *
     *     // Calculate delta
     *     this.delta = this.reportingTensor.map((m, i) => m - oldMetrics[i]);
     *
     *     return this.reportingTensor;
     *   }
     * }
     * ```
     */
    abstract transitionState(stateTensor: Tensor, deltaStateTensor: Tensor, controlInputTensor: Tensor): number[];

    /**
     * Returns the number of performance metrics (ψ).
     *
     * @returns Dimensionality of the reporting metric space
     *
     * @remarks
     * This value must match:
     * - Board reporting target vector length
     * - AgentSet incentive tensor 4th dimension
     */
    getDegreesOfFreedom(): number {
        return this.reportingTensor.length;
    }

    /**
     * Returns the current performance metrics.
     *
     * @returns Current values of all reporting metrics
     */
    getReportingTensor(): number[] {
        return this.reportingTensor;
    }

    /**
     * Returns the change in metrics from the previous time step.
     *
     * @returns Delta vector `Δψ = ψ(t) - ψ(t-1)`
     *
     * @remarks
     * Used to track metric trends and identify performance improvements
     * or degradations over time.
     */
    getDeltaTensor(): number[] {
        return this.delta;
    }

    /**
     * Logs a trace-level diagnostic message.
     *
     * @param message - Message content
     * @param data - Optional structured data to include
     *
     * @internal
     */
    protected _log(message: string, data?: any) {
        this.logger.trace({
            sourceObject: this.name,
            message: message,
            data: data
        });
    }
}
