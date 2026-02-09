import { Utils, type Tensor } from "../modules/utils.module";
import { Plant } from "./plant.class";
import { Reporting } from "./reporting.class";
import { AgentSet } from "./agent-set.class";
import { Board } from "./board.class";
import { Targets } from "../interfaces/core.interfaces";
import { Logger } from "./logger.class";

/**
 * Orchestrates the coordinated state transitions of all organizational subsystems.
 *
 * @remarks
 * The Organisation class is the central coordinator that manages the interactions between
 * four key subsystems in each simulation time step:
 *
 * 1. **Board**: Strategic planning and target setting
 * 2. **AgentSet**: Collection of autonomous agents with behavioral tensors
 * 3. **Plant**: Physical system state (e.g., production capacity, inventory)
 * 4. **Reporting**: Performance metrics and KPIs
 *
 * **State Transition Sequence:**
 *
 * Each clock tick follows a deterministic order:
 * 1. Board reviews current performance and updates targets
 * 2. Agents choose their next states based on incentives and judgment
 * 3. Plant state evolves based on agent control inputs
 * 4. Reporting metrics are calculated from plant and agent states
 * 5. Agent behavioral parameters are updated via gradient descent
 *
 * **Tensor Dimension Consistency:**
 *
 * The organisation enforces dimensional consistency across all tensors:
 * - Plant degrees of freedom (χ) must match Board plant targets and AgentSet judgment tensor
 * - Reporting degrees of freedom (ψ) must match Board reporting targets and AgentSet incentive tensor
 *
 * @example
 * ```typescript
 * const organisation = new Organisation(
 *   board,
 *   agentSet,
 *   plant,
 *   reporting,
 *   logger
 * );
 *
 * // Advance one time step
 * organisation.transitionState();
 *
 * // Get current state vector
 * const state = organisation.getStateArray();
 * // state = [...agentStates, ...plantState, ...reportingMetrics]
 * ```
 *
 * @public
 */
export class Organisation {
    protected name: string = "Organisation";
    protected board: Board;
    protected agentSet: AgentSet;
    protected plant: Plant;
    protected reporting: Reporting;
    protected logger: Logger;
    private clockTick: number = 0;

    /**
     * Creates a new Organisation with all required subsystems.
     *
     * @param board - Strategic planning subsystem
     * @param agentSet - Collection of autonomous agents
     * @param plant - Physical system state model
     * @param reporting - Performance metrics calculator
     * @param logger - Observable logging system
     *
     * @throws {Error} If tensor dimension consistency checks fail
     *
     * @remarks
     * The constructor validates dimensional consistency between all subsystems
     * before the organisation can be used. This ensures that:
     * - Agent judgment tensors match plant state dimensions
     * - Agent incentive tensors match reporting metric dimensions
     * - Board targets align with plant and reporting dimensions
     *
     * @example
     * ```typescript
     * const logger = new Logger();
     * const board = new C1Board(targets, logger);
     * const agentSet = new AgentSet(tensors, states, randomStream, logger, 0.1);
     * const plant = new C1Plant(initialState, logger);
     * const reporting = new C1Reporting(initialMetrics, logger);
     *
     * const org = new Organisation(board, agentSet, plant, reporting, logger);
     * ```
     */
    constructor(board: Board, agentSet: AgentSet, plant: Plant, reporting: Reporting, logger: Logger) {
        this.logger = logger;
        this._log("Initialising Organisation");
        this.board = board;
        this.agentSet = agentSet;
        this.plant = plant;
        this.reporting = reporting;
        this.checkConsistency();
        this._log("Organisation initialised");
    }

    /**
     * Executes one complete state transition across all subsystems.
     *
     * @returns This organisation instance (for method chaining)
     *
     * @remarks
     * This method orchestrates the coordinated state transition of all subsystems
     * in a specific sequence to ensure causal consistency:
     *
     * **Transition Sequence:**
     *
     * 1. **Board** reviews current performance → updates strategic targets
     * 2. **AgentSet** observes targets and environment → agents choose next states
     * 3. **Plant** receives agent control inputs → physical state evolves
     * 4. **Reporting** observes plant and agents → metrics are calculated
     * 5. **AgentSet** receives feedback → behavioral parameters updated via gradient descent
     *
     * **Information Flow:**
     *
     * ```
     * Reporting(t) → Board → Targets(t+1)
     *                          ↓
     * AgentSet observes → Control Inputs(t+1)
     *                          ↓
     *                    Plant State(t+1)
     *                          ↓
     *                    Reporting(t+1)
     *                          ↓
     *              Parameter Updates (gradient descent)
     * ```
     *
     * The clock tick is incremented after each complete transition.
     *
     * @example
     * ```typescript
     * const org = new Organisation(board, agentSet, plant, reporting, logger);
     *
     * // Run simulation for 100 time steps
     * for (let i = 0; i < 100; i++) {
     *   org.transitionState();
     *   console.log(`Tick ${org.getClockTick()}: State = ${org.getStateArray()}`);
     * }
     * ```
     */
    transitionState(): Organisation {
        this._log("Transitioning Organisation state");
        const targets: Targets = this.board.transitionState(this.reporting.getReportingTensor());
        const controlInputTensor: Tensor = this.agentSet.transitionState();
        const plantStateTensor: Tensor = this.plant.transitionState(controlInputTensor);
        const reportOutput: Tensor = this.reporting.transitionState(
            plantStateTensor,
            this.plant.getDeltaTensor(),
            controlInputTensor
        );
        this.agentSet.recalculateParams(targets, plantStateTensor, reportOutput);
        this.clockTick++;
        this._log("Organisation state transitioned");
        return this;
    }

    /**
     * Returns the complete state vector of the organisation.
     *
     * @returns Concatenated state vector `[agent states, plant state, reporting metrics]`
     *
     * @remarks
     * The state array provides a complete snapshot of the organisation at the current
     * clock tick. The vector is structured as:
     *
     * ```
     * [σ₀, σ₁, ..., σₙ, χ₀, χ₁, ..., χₘ, ψ₀, ψ₁, ..., ψₖ]
     * ```
     *
     * Where:
     * - `σᵢ` = State indices of agents (n agents)
     * - `χⱼ` = Plant state variables (m degrees of freedom)
     * - `ψₖ` = Reporting metrics (k degrees of freedom)
     *
     * This vector can be used for:
     * - Time series analysis and visualization
     * - State space trajectory plotting
     * - Persistence and checkpointing
     * - Convergence detection
     *
     * @example
     * ```typescript
     * const state = org.getStateArray();
     * // state = [0, 1, 2, 5.3, 10.2, 0.85, 0.92]
     * //          └─agents─┘ └plant┘ └reporting┘
     *
     * // Track state evolution over time
     * const trajectory: number[][] = [];
     * for (let i = 0; i < 1000; i++) {
     *   org.transitionState();
     *   trajectory.push(org.getStateArray());
     * }
     * ```
     */
    getStateArray(): number[] {
        return [
            ...this.agentSet.getAgentStateArray(),
            ...this.plant.getStateTensor(),
            ...this.reporting.getReportingTensor()
        ];
    }

    /**
     * Returns the current simulation time step.
     *
     * @returns Number of state transitions executed since initialization
     *
     * @remarks
     * The clock tick increments by 1 with each call to `transitionState()`.
     * Starting value is 0 before the first transition.
     *
     * To convert to real time, multiply by the clock tick duration:
     * ```
     * realTimeSeconds = clockTick * clockTickSeconds
     * ```
     *
     * @example
     * ```typescript
     * const org = new Organisation(...);
     * console.log(org.getClockTick());  // 0
     *
     * org.transitionState();
     * console.log(org.getClockTick());  // 1
     *
     * for (let i = 0; i < 99; i++) org.transitionState();
     * console.log(org.getClockTick());  // 100
     * ```
     */
    getClockTick(): number {
        return this.clockTick;
    }

    /**
     * Returns the Board subsystem.
     *
     * @returns Board instance managing strategic targets
     */
    getBoard(): Board {
        return this.board;
    }

    /**
     * Returns the AgentSet subsystem.
     *
     * @returns AgentSet instance managing all agents
     */
    getAgents(): AgentSet {
        return this.agentSet;
    }

    /**
     * Returns the Plant subsystem.
     *
     * @returns Plant instance representing physical system state
     */
    getPlant(): Plant {
        return this.plant;
    }

    /**
     * Returns the Reporting subsystem.
     *
     * @returns Reporting instance calculating performance metrics
     */
    getReporting(): Reporting {
        return this.reporting;
    }

    /**
     * Validates dimensional consistency across all subsystem tensors.
     *
     * @returns `true` if all dimensions are consistent
     * @throws {Error} If any dimensional inconsistency is detected
     *
     * @remarks
     * This method enforces critical dimensional constraints that ensure the organisation
     * components can interact correctly:
     *
     * **Consistency Requirements:**
     *
     * 1. All subsystems must be present (Board, AgentSet, Plant, Reporting)
     * 2. AgentSet internal consistency (tensor dimensions match agent/state counts)
     * 3. Plant degrees of freedom (χ) must equal:
     *    - Board plant target vector length
     *    - AgentSet judgment tensor 4th dimension
     * 4. Reporting degrees of freedom (ψ) must equal:
     *    - Board reporting target vector length
     *    - AgentSet incentive tensor 4th dimension
     *
     * **Dimension Notation:**
     *
     * - χ (chi): Plant state dimension (e.g., production capacity, inventory)
     * - ψ (psi): Reporting metric dimension (e.g., KPIs, performance indicators)
     * - Judgment tensor: `J[α][σ][τ][χ]` - agents must observe all plant variables
     * - Incentive tensor: `I[α][σ][τ][ψ]` - agents must observe all reporting metrics
     *
     * The check is automatically called during construction and will throw an error
     * if inconsistencies are found, preventing invalid simulations from running.
     *
     * @example
     * ```typescript
     * // This will throw if dimensions don't match:
     * const org = new Organisation(board, agentSet, plant, reporting, logger);
     *
     * // Example error scenario:
     * // - Plant has 3 state variables (chi = 3)
     * // - Judgment tensor has shape [10, 5, 5, 2] (expects chi = 2)
     * // → Error: "Judgment matrix tensor dimension inconsistency"
     * ```
     *
     * @internal
     * Called automatically during construction
     */
    checkConsistency(): boolean {
        this._log("Checking organisation tensor dimension consistency");
        try {
            if (!this.board || !this.agentSet || !this.plant || !this.reporting) {
                throw new Error("Missing Board, AgentSet, Plant or Reporting");
            } else {
                if (!this.agentSet.checkConsistency()) throw new Error("Agent set inconsistency");
                const chi = this.plant.getDegreesOfFreedom();
                const psi = this.reporting.getDegreesOfFreedom();

                const plantTargetShape = this.board.getPlan().plantState.length;
                const reportingTargetShape = this.board.getPlan().reporting.length;
                const judgmentMatrixChi = Utils.shape(this.agentSet.getTensors().judgmentTensor)[3];
                const incentiveMatrixPsi = Utils.shape(this.agentSet.getTensors().incentiveTensor)[3];

                if (chi !== plantTargetShape)
                    throw new Error("Plant state tensor dimension inconsistency with Board Plant Targets (chi)");
                if (chi !== judgmentMatrixChi)
                    throw new Error("Judgment matrix tensor dimension inconsistency with Plant state tensor (chi)");
                if (psi !== reportingTargetShape)
                    throw new Error("Reporting tensor dimension inconsistency with Board Reporting Targets (psi)");
                if (psi !== incentiveMatrixPsi)
                    throw new Error("Incentive matrix tensor dimension inconsistency with Reporting tensor (psi)");
            }
        } catch (error: any) {
            this.logger.error({
                sourceObject: this.name,
                message: "Error in Organisation tensor dimension consistency",
                data: { message: error?.message || String(error) || "Unknown error" }
            });
            return false;
        }
        this._log("Organisation tensor dimension consistency check passed");
        return true;
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
