[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Organisation

# Class: Organisation

Orchestrates the coordinated state transitions of all organizational subsystems.

## Remarks

The Organisation class is the central coordinator that manages the interactions between
four key subsystems in each simulation time step:

1. **Board**: Strategic planning and target setting
2. **AgentSet**: Collection of autonomous agents with behavioral tensors
3. **Plant**: Physical system state (e.g., production capacity, inventory)
4. **Reporting**: Performance metrics and KPIs

**State Transition Sequence:**

Each clock tick follows a deterministic order:
1. Board reviews current performance and updates targets
2. Agents choose their next states based on incentives and judgment
3. Plant state evolves based on agent control inputs
4. Reporting metrics are calculated from plant and agent states
5. Agent behavioral parameters are updated via gradient descent

**Tensor Dimension Consistency:**

The organisation enforces dimensional consistency across all tensors:
- Plant degrees of freedom (χ) must match Board plant targets and AgentSet judgment tensor
- Reporting degrees of freedom (ψ) must match Board reporting targets and AgentSet incentive tensor

## Example

```typescript
const organisation = new Organisation(
  board,
  agentSet,
  plant,
  reporting,
  logger
);

// Advance one time step
organisation.transitionState();

// Get current state vector
const state = organisation.getStateArray();
// state = [...agentStates, ...plantState, ...reportingMetrics]
```

## Constructors

### new Organisation()

> **new Organisation**(`board`, `agentSet`, `plant`, `reporting`, `logger`): [`Organisation`](Organisation.md)

Creates a new Organisation with all required subsystems.

#### Parameters

• **board**: [`Board`](Board.md)

Strategic planning subsystem

• **agentSet**: [`AgentSet`](AgentSet.md)

Collection of autonomous agents

• **plant**: [`Plant`](Plant.md)

Physical system state model

• **reporting**: [`Reporting`](Reporting.md)

Performance metrics calculator

• **logger**: [`Logger`](Logger.md)

Observable logging system

#### Returns

[`Organisation`](Organisation.md)

#### Throws

If tensor dimension consistency checks fail

#### Remarks

The constructor validates dimensional consistency between all subsystems
before the organisation can be used. This ensures that:
- Agent judgment tensors match plant state dimensions
- Agent incentive tensors match reporting metric dimensions
- Board targets align with plant and reporting dimensions

#### Example

```typescript
const logger = new Logger();
const board = new C1Board(targets, logger);
const agentSet = new AgentSet(tensors, states, randomStream, logger, 0.1);
const plant = new C1Plant(initialState, logger);
const reporting = new C1Reporting(initialMetrics, logger);

const org = new Organisation(board, agentSet, plant, reporting, logger);
```

#### Defined in

[classes/organisation.class.ts:94](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L94)

## Properties

### agentSet

> `protected` **agentSet**: [`AgentSet`](AgentSet.md)

#### Defined in

[classes/organisation.class.ts:59](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L59)

***

### board

> `protected` **board**: [`Board`](Board.md)

#### Defined in

[classes/organisation.class.ts:58](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L58)

***

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/organisation.class.ts:62](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L62)

***

### name

> `protected` **name**: `string` = `"Organisation"`

#### Defined in

[classes/organisation.class.ts:57](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L57)

***

### plant

> `protected` **plant**: [`Plant`](Plant.md)

#### Defined in

[classes/organisation.class.ts:60](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L60)

***

### reporting

> `protected` **reporting**: [`Reporting`](Reporting.md)

#### Defined in

[classes/organisation.class.ts:61](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L61)

## Methods

### \_log()

> `protected` **\_log**(`message`, `data`?): `void`

**`Internal`**

Logs a trace-level diagnostic message.

#### Parameters

• **message**: `string`

Message content

• **data?**: `any`

Optional structured data to include

#### Returns

`void`

#### Defined in

[classes/organisation.class.ts:366](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L366)

***

### checkConsistency()

> **checkConsistency**(): `boolean`

**`Internal`**

Validates dimensional consistency across all subsystem tensors.

#### Returns

`boolean`

`true` if all dimensions are consistent

#### Throws

If any dimensional inconsistency is detected

#### Remarks

This method enforces critical dimensional constraints that ensure the organisation
components can interact correctly:

**Consistency Requirements:**

1. All subsystems must be present (Board, AgentSet, Plant, Reporting)
2. AgentSet internal consistency (tensor dimensions match agent/state counts)
3. Plant degrees of freedom (χ) must equal:
   - Board plant target vector length
   - AgentSet judgment tensor 4th dimension
4. Reporting degrees of freedom (ψ) must equal:
   - Board reporting target vector length
   - AgentSet incentive tensor 4th dimension

**Dimension Notation:**

- χ (chi): Plant state dimension (e.g., production capacity, inventory)
- ψ (psi): Reporting metric dimension (e.g., KPIs, performance indicators)
- Judgment tensor: `J[α][σ][τ][χ]` - agents must observe all plant variables
- Incentive tensor: `I[α][σ][τ][ψ]` - agents must observe all reporting metrics

The check is automatically called during construction and will throw an error
if inconsistencies are found, preventing invalid simulations from running.

#### Example

```typescript
// This will throw if dimensions don't match:
const org = new Organisation(board, agentSet, plant, reporting, logger);

// Example error scenario:
// - Plant has 3 state variables (chi = 3)
// - Judgment tensor has shape [10, 5, 5, 2] (expects chi = 2)
// → Error: "Judgment matrix tensor dimension inconsistency"
```

Called automatically during construction

#### Defined in

[classes/organisation.class.ts:322](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L322)

***

### getAgents()

> **getAgents**(): [`AgentSet`](AgentSet.md)

Returns the AgentSet subsystem.

#### Returns

[`AgentSet`](AgentSet.md)

AgentSet instance managing all agents

#### Defined in

[classes/organisation.class.ts:255](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L255)

***

### getBoard()

> **getBoard**(): [`Board`](Board.md)

Returns the Board subsystem.

#### Returns

[`Board`](Board.md)

Board instance managing strategic targets

#### Defined in

[classes/organisation.class.ts:246](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L246)

***

### getClockTick()

> **getClockTick**(): `number`

Returns the current simulation time step.

#### Returns

`number`

Number of state transitions executed since initialization

#### Remarks

The clock tick increments by 1 with each call to `transitionState()`.
Starting value is 0 before the first transition.

To convert to real time, multiply by the clock tick duration:
```
realTimeSeconds = clockTick * clockTickSeconds
```

#### Example

```typescript
const org = new Organisation(...);
console.log(org.getClockTick());  // 0

org.transitionState();
console.log(org.getClockTick());  // 1

for (let i = 0; i < 99; i++) org.transitionState();
console.log(org.getClockTick());  // 100
```

#### Defined in

[classes/organisation.class.ts:237](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L237)

***

### getPlant()

> **getPlant**(): [`Plant`](Plant.md)

Returns the Plant subsystem.

#### Returns

[`Plant`](Plant.md)

Plant instance representing physical system state

#### Defined in

[classes/organisation.class.ts:264](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L264)

***

### getReporting()

> **getReporting**(): [`Reporting`](Reporting.md)

Returns the Reporting subsystem.

#### Returns

[`Reporting`](Reporting.md)

Reporting instance calculating performance metrics

#### Defined in

[classes/organisation.class.ts:273](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L273)

***

### getStateArray()

> **getStateArray**(): `number`[]

Returns the complete state vector of the organisation.

#### Returns

`number`[]

Concatenated state vector `[agent states, plant state, reporting metrics]`

#### Remarks

The state array provides a complete snapshot of the organisation at the current
clock tick. The vector is structured as:

```
[σ₀, σ₁, ..., σₙ, χ₀, χ₁, ..., χₘ, ψ₀, ψ₁, ..., ψₖ]
```

Where:
- `σᵢ` = State indices of agents (n agents)
- `χⱼ` = Plant state variables (m degrees of freedom)
- `ψₖ` = Reporting metrics (k degrees of freedom)

This vector can be used for:
- Time series analysis and visualization
- State space trajectory plotting
- Persistence and checkpointing
- Convergence detection

#### Example

```typescript
const state = org.getStateArray();
// state = [0, 1, 2, 5.3, 10.2, 0.85, 0.92]
//          └─agents─┘ └plant┘ └reporting┘

// Track state evolution over time
const trajectory: number[][] = [];
for (let i = 0; i < 1000; i++) {
  org.transitionState();
  trajectory.push(org.getStateArray());
}
```

#### Defined in

[classes/organisation.class.ts:203](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L203)

***

### transitionState()

> **transitionState**(): [`Organisation`](Organisation.md)

Executes one complete state transition across all subsystems.

#### Returns

[`Organisation`](Organisation.md)

This organisation instance (for method chaining)

#### Remarks

This method orchestrates the coordinated state transition of all subsystems
in a specific sequence to ensure causal consistency:

**Transition Sequence:**

1. **Board** reviews current performance → updates strategic targets
2. **AgentSet** observes targets and environment → agents choose next states
3. **Plant** receives agent control inputs → physical state evolves
4. **Reporting** observes plant and agents → metrics are calculated
5. **AgentSet** receives feedback → behavioral parameters updated via gradient descent

**Information Flow:**

```
Reporting(t) → Board → Targets(t+1)
                         ↓
AgentSet observes → Control Inputs(t+1)
                         ↓
                   Plant State(t+1)
                         ↓
                   Reporting(t+1)
                         ↓
             Parameter Updates (gradient descent)
```

The clock tick is incremented after each complete transition.

#### Example

```typescript
const org = new Organisation(board, agentSet, plant, reporting, logger);

// Run simulation for 100 time steps
for (let i = 0; i < 100; i++) {
  org.transitionState();
  console.log(`Tick ${org.getClockTick()}: State = ${org.getStateArray()}`);
}
```

#### Defined in

[classes/organisation.class.ts:149](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/organisation.class.ts#L149)
