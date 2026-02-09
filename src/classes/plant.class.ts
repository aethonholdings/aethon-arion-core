import { Utils } from "../modules/utils.module";
import type { Tensor } from "../modules/utils.module";
import { Logger } from "./logger.class";

/**
 * Abstract base class representing the physical or operational system state.
 *
 * @remarks
 * The Plant models the dynamic physical or operational system that agents control.
 * Examples include:
 * - Manufacturing systems (production capacity, inventory, WIP)
 * - Service operations (queue lengths, utilization rates)
 * - Energy systems (generation capacity, storage levels)
 *
 * **State Evolution:**
 *
 * The plant state evolves based on agent control inputs:
 * ```
 * χ(t+1) = f(χ(t), u(t))
 * ```
 *
 * Where:
 * - `χ(t)` = Plant state at time t (state tensor)
 * - `u(t)` = Control input from agents (aggregated agent actions)
 * - `f()` = State transition function (defined in concrete implementations)
 *
 * **Delta Tracking:**
 *
 * The plant maintains `delta`, the change in state from the previous time step:
 * ```
 * Δχ(t) = χ(t) - χ(t-1)
 * ```
 *
 * This is used by the Reporting subsystem to calculate performance metrics
 * based on rates of change (e.g., production rate, growth rate).
 *
 * **Degrees of Freedom:**
 *
 * The number of state variables (χ) defines the plant's degrees of freedom.
 * This must match:
 * - Board plant target vector length
 * - AgentSet judgment tensor 4th dimension
 *
 * @example
 * ```typescript
 * // Example concrete implementation
 * class ProductionPlant extends Plant {
 *   transitionState(inputTensor: Tensor): number[] {
 *     const controlInput = inputTensor as number[];
 *     const newState = [...this.stateTensor];
 *
 *     // State dynamics: inventory changes based on production and demand
 *     newState[0] += controlInput[0] - 10.0;  // Production - demand
 *     newState[0] = Math.max(0, newState[0]);  // Non-negative constraint
 *
 *     // Calculate delta
 *     this.delta = newState.map((s, i) => s - this.stateTensor[i]);
 *     this.stateTensor = newState;
 *
 *     return this.stateTensor;
 *   }
 * }
 *
 * // Usage
 * const initialState = [50.0, 100.0];  // [inventory, capacity]
 * const plant = new ProductionPlant(initialState, logger);
 * ```
 *
 * @public
 */
export abstract class Plant {
    protected name: string = "Plant";
    protected stateTensor: number[];
    protected delta: number[];
    protected logger: Logger;

    /**
     * Creates a new Plant with specified initial state.
     *
     * @param initialStateTensor - Initial values for all plant state variables
     * @param logger - Observable logging system
     *
     * @remarks
     * The delta tensor is initialized to zeros with the same shape as the state tensor.
     * Delta values are updated during each `transitionState()` call to track
     * rates of change.
     *
     * @example
     * ```typescript
     * const initialState = [100.0, 50.0, 75.0];
     * const plant = new C1Plant(initialState, logger);
     * ```
     */
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

    /**
     * Advances plant state based on control inputs from agents.
     *
     * @param inputTensor - Aggregated control inputs from all agents
     * @returns Updated plant state tensor
     *
     * @remarks
     * This abstract method must be implemented by concrete Plant subclasses.
     * It defines the physical or operational dynamics of the system.
     *
     * **Implementation Requirements:**
     *
     * 1. Compute new state: `χ(t+1) = f(χ(t), u(t))`
     * 2. Calculate delta: `Δχ = χ(t+1) - χ(t)`
     * 3. Update `this.stateTensor` and `this.delta`
     * 4. Return new state
     *
     * **Common Patterns:**
     *
     * - **Integrator dynamics**: `χ(t+1) = χ(t) + u(t) × Δt`
     * - **First-order lag**: `χ(t+1) = χ(t) + α × (u(t) - χ(t))`
     * - **Constrained dynamics**: Apply bounds (e.g., non-negativity, capacity limits)
     * - **Coupled dynamics**: State variables influence each other
     *
     * @example
     * ```typescript
     * class InventoryPlant extends Plant {
     *   transitionState(inputTensor: Tensor): number[] {
     *     const production = (inputTensor as number[])[0];
     *     const demand = 10.0;  // Constant demand
     *
     *     const oldInventory = this.stateTensor[0];
     *     const newInventory = Math.max(0, oldInventory + production - demand);
     *
     *     this.delta[0] = newInventory - oldInventory;
     *     this.stateTensor[0] = newInventory;
     *
     *     return this.stateTensor;
     *   }
     * }
     * ```
     */
    abstract transitionState(inputTensor: Tensor): number[];

    /**
     * Returns the number of state variables (χ).
     *
     * @returns Dimensionality of the plant state space
     *
     * @remarks
     * This value must match:
     * - Board plant target vector length
     * - AgentSet judgment tensor 4th dimension
     */
    getDegreesOfFreedom(): number {
        return this.stateTensor.length;
    }

    /**
     * Returns the current plant state.
     *
     * @returns Current values of all plant state variables
     */
    getStateTensor(): number[] {
        return this.stateTensor;
    }

    /**
     * Returns the change in plant state from the previous time step.
     *
     * @returns Delta vector `Δχ = χ(t) - χ(t-1)`
     *
     * @remarks
     * Used by Reporting to calculate performance metrics based on
     * rates of change (e.g., production rate, growth rate).
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
