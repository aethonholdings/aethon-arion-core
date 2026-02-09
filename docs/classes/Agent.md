[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Agent

# Class: Agent

Represents an individual autonomous agent within an AgentSet.

## Remarks

The Agent class encapsulates the current state of a single agent in the multi-agent
simulation. Each agent:
- Maintains a reference to its current state (via state index)
- Can transition between states based on behavioral tensors
- Emits control signals to workstations based on its state

**State Representation:**

Agents don't store state objects directly, but rather an index into a shared
state array. This design:
- Reduces memory overhead for large agent populations
- Enables efficient state transition calculations in AgentSet
- Allows state definitions to be shared across all agents

**Control Emission:**

Each state defines control signals emitted to workstations/resources.
The agent's current state determines what control tensor it emits,
which aggregates with other agents to form the plant control input.

**Lifecycle:**

Agents are typically created and managed by AgentSet, not instantiated directly.
The AgentSet handles:
- Probabilistic state transitions based on behavioral tensors
- Parameter updates via gradient descent
- Aggregation of agent states for reporting

## Example

```typescript
// Typically created by AgentSet, but can be instantiated:
const states = [
  new IdleState(),
  new WorkingState(),
  new MaintenanceState()
];

const agent = new Agent(0, states);  // Starts in Idle (index 0)

// Get current state
console.log(agent.getStateIndex());  // 0

// Emit control signals based on current state
const control = agent.emitWorkstationControlTensor();
// control = [0, 0, 0] (Idle state emits zeros)

// Transition to Working state
agent.transitionState(1);
const newControl = agent.emitWorkstationControlTensor();
// newControl = [1, 0, 0] (Working state emits to workstation 0)
```

## Constructors

### new Agent()

> **new Agent**(`initialStateIndex`, `states`): [`Agent`](Agent.md)

Creates a new Agent with specified initial state.

#### Parameters

• **initialStateIndex**: `number`

Index of the starting state in the states array

• **states**: [`State`](State.md)[]

Array of all possible states the agent can occupy

#### Returns

[`Agent`](Agent.md)

#### Remarks

The states array is shared across all agents in an AgentSet to minimize
memory usage. Each agent stores only its current state index.

#### Example

```typescript
const states = [new IdleState(), new WorkingState()];
const agent = new Agent(0, states);  // Start in Idle
```

#### Defined in

[classes/agent.class.ts:82](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent.class.ts#L82)

## Properties

### name

> `protected` **name**: `string` = `"Agent"`

#### Defined in

[classes/agent.class.ts:62](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent.class.ts#L62)

***

### stateIndex

> `protected` **stateIndex**: `number`

#### Defined in

[classes/agent.class.ts:63](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent.class.ts#L63)

## Methods

### emitWorkstationControlTensor()

> **emitWorkstationControlTensor**(): `number`[]

Emits the control signal tensor for the agent's current state.

#### Returns

`number`[]

Control signal vector for workstations/resources

#### Remarks

The control tensor defines how the agent's current state affects
workstations or resources. For example:
- Idle state: `[0, 0, 0]` (no workstation control)
- Working at station 0: `[1, 0, 0]` (activates station 0)
- Working at station 2: `[0, 0, 1]` (activates station 2)

AgentSet aggregates these control tensors across all agents to
produce the total plant control input.

#### Example

```typescript
class WorkingState extends State {
  emit() { return [1, 0, 0]; }  // Control workstation 0
}

const agent = new Agent(1, [idleState, workingState]);
const control = agent.emitWorkstationControlTensor();
// control = [1, 0, 0]
```

#### Defined in

[classes/agent.class.ts:166](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent.class.ts#L166)

***

### getStateIndex()

> **getStateIndex**(): `number`

Returns the agent's current state index.

#### Returns

`number`

Index in the states array (0 to stateCount-1)

#### Remarks

The state index is used by AgentSet to:
- Index into behavioral tensors (priority, influence, judgment, incentive)
- Track state distributions across the agent population
- Calculate state transition probabilities

#### Defined in

[classes/agent.class.ts:98](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent.class.ts#L98)

***

### setStateIndex()

> **setStateIndex**(`stateIndex`): `void`

Directly sets the agent's state index.

#### Parameters

• **stateIndex**: `number`

New state index

#### Returns

`void`

#### Remarks

This method is typically called by AgentSet after calculating
probabilistic state transitions. For controlled transitions,
prefer using `transitionState()` which returns the new index.

#### Defined in

[classes/agent.class.ts:112](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent.class.ts#L112)

***

### transitionState()

> **transitionState**(`stateIndex`): `number`

Transitions the agent to a new state.

#### Parameters

• **stateIndex**: `number`

Target state index

#### Returns

`number`

The new state index (same as input)

#### Remarks

This method is functionally equivalent to `setStateIndex()` but
follows a state machine pattern by returning the new state.
Typically called by AgentSet during state transition calculations.

#### Example

```typescript
const agent = new Agent(0, states);  // Idle
const newState = agent.transitionState(1);  // Working
console.log(newState);  // 1
console.log(agent.getStateIndex());  // 1
```

#### Defined in

[classes/agent.class.ts:135](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent.class.ts#L135)
