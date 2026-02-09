import { State } from "./state.class";

/**
 * Represents an individual autonomous agent within an AgentSet.
 *
 * @remarks
 * The Agent class encapsulates the current state of a single agent in the multi-agent
 * simulation. Each agent:
 * - Maintains a reference to its current state (via state index)
 * - Can transition between states based on behavioral tensors
 * - Emits control signals to workstations based on its state
 *
 * **State Representation:**
 *
 * Agents don't store state objects directly, but rather an index into a shared
 * state array. This design:
 * - Reduces memory overhead for large agent populations
 * - Enables efficient state transition calculations in AgentSet
 * - Allows state definitions to be shared across all agents
 *
 * **Control Emission:**
 *
 * Each state defines control signals emitted to workstations/resources.
 * The agent's current state determines what control tensor it emits,
 * which aggregates with other agents to form the plant control input.
 *
 * **Lifecycle:**
 *
 * Agents are typically created and managed by AgentSet, not instantiated directly.
 * The AgentSet handles:
 * - Probabilistic state transitions based on behavioral tensors
 * - Parameter updates via gradient descent
 * - Aggregation of agent states for reporting
 *
 * @example
 * ```typescript
 * // Typically created by AgentSet, but can be instantiated:
 * const states = [
 *   new IdleState(),
 *   new WorkingState(),
 *   new MaintenanceState()
 * ];
 *
 * const agent = new Agent(0, states);  // Starts in Idle (index 0)
 *
 * // Get current state
 * console.log(agent.getStateIndex());  // 0
 *
 * // Emit control signals based on current state
 * const control = agent.emitWorkstationControlTensor();
 * // control = [0, 0, 0] (Idle state emits zeros)
 *
 * // Transition to Working state
 * agent.transitionState(1);
 * const newControl = agent.emitWorkstationControlTensor();
 * // newControl = [1, 0, 0] (Working state emits to workstation 0)
 * ```
 *
 * @public
 */
export class Agent {
    protected name: string = "Agent";
    protected stateIndex: number;
    private states: State[];

    /**
     * Creates a new Agent with specified initial state.
     *
     * @param initialStateIndex - Index of the starting state in the states array
     * @param states - Array of all possible states the agent can occupy
     *
     * @remarks
     * The states array is shared across all agents in an AgentSet to minimize
     * memory usage. Each agent stores only its current state index.
     *
     * @example
     * ```typescript
     * const states = [new IdleState(), new WorkingState()];
     * const agent = new Agent(0, states);  // Start in Idle
     * ```
     */
    constructor(initialStateIndex: number, states: State[]) {
        this.stateIndex = initialStateIndex;
        this.states = states;
    }

    /**
     * Returns the agent's current state index.
     *
     * @returns Index in the states array (0 to stateCount-1)
     *
     * @remarks
     * The state index is used by AgentSet to:
     * - Index into behavioral tensors (priority, influence, judgment, incentive)
     * - Track state distributions across the agent population
     * - Calculate state transition probabilities
     */
    getStateIndex(): number {
        return this.stateIndex;
    }

    /**
     * Directly sets the agent's state index.
     *
     * @param stateIndex - New state index
     *
     * @remarks
     * This method is typically called by AgentSet after calculating
     * probabilistic state transitions. For controlled transitions,
     * prefer using `transitionState()` which returns the new index.
     */
    setStateIndex(stateIndex: number): void {
        this.stateIndex = stateIndex;
    }

    /**
     * Transitions the agent to a new state.
     *
     * @param stateIndex - Target state index
     * @returns The new state index (same as input)
     *
     * @remarks
     * This method is functionally equivalent to `setStateIndex()` but
     * follows a state machine pattern by returning the new state.
     * Typically called by AgentSet during state transition calculations.
     *
     * @example
     * ```typescript
     * const agent = new Agent(0, states);  // Idle
     * const newState = agent.transitionState(1);  // Working
     * console.log(newState);  // 1
     * console.log(agent.getStateIndex());  // 1
     * ```
     */
    transitionState(stateIndex: number): number {
        this.stateIndex = stateIndex;
        return this.stateIndex;
    }

    /**
     * Emits the control signal tensor for the agent's current state.
     *
     * @returns Control signal vector for workstations/resources
     *
     * @remarks
     * The control tensor defines how the agent's current state affects
     * workstations or resources. For example:
     * - Idle state: `[0, 0, 0]` (no workstation control)
     * - Working at station 0: `[1, 0, 0]` (activates station 0)
     * - Working at station 2: `[0, 0, 1]` (activates station 2)
     *
     * AgentSet aggregates these control tensors across all agents to
     * produce the total plant control input.
     *
     * @example
     * ```typescript
     * class WorkingState extends State {
     *   emit() { return [1, 0, 0]; }  // Control workstation 0
     * }
     *
     * const agent = new Agent(1, [idleState, workingState]);
     * const control = agent.emitWorkstationControlTensor();
     * // control = [1, 0, 0]
     * ```
     */
    emitWorkstationControlTensor(): number[] {
        return this.states[this.stateIndex].emit();
    }
}
