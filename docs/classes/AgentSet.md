[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / AgentSet

# Class: AgentSet

Represents a collection of autonomous agents with behavioral tensors governing their state transitions and interactions.

## Remarks

The AgentSet class manages a collection of agents whose behaviors are governed by four key tensors:
- **Priority Tensor** (`P[α][σ][τ]`): Probability of agent α transitioning from state σ to state τ
- **Influence Tensor** (`W[α][β][σ][τ]`): Influence of agent β on agent α's transition from σ to τ
- **Judgment Tensor** (`J[α][σ][τ][χ]`): Agent α's response to plant state variable χ when transitioning from σ to τ
- **Incentive Tensor** (`I[α][σ][τ][ψ]`): Agent α's response to reporting metric ψ when transitioning from σ to τ

The priority tensor is dynamically updated, incorporating
influence from other agents, plant state deviations, and reporting metrics.

## Example

```typescript
const agentSet = new AgentSet(
  agentSetTensors,
  states,
  randomStream,
  logger,
  0.1  // 0.1 second clock tick
);

// Transition all agent states
const controlInputs = agentSet.transitionState();

// Recalculate parameters based on targets
agentSet.recalculateParams(targets, plantState, reporting);
```

## Constructors

### new AgentSet()

> **new AgentSet**(`agentSetTensors`, `states`, `randomStream`, `logger`, `clockTick`): [`AgentSet`](AgentSet.md)

Creates a new AgentSet instance with specified behavioral tensors.

#### Parameters

• **agentSetTensors**: [`AgentSetTensors`](../interfaces/AgentSetTensors.md)

Object containing the four behavioral tensors

• **states**: [`State`](State.md)[]

Array of possible agent states

• **randomStream**: [`RandomStream`](RandomStream.md)

Random number generator for stochastic transitions

• **logger**: [`Logger`](Logger.md)

Logger instance for diagnostics

• **clockTick**: `number`

Simulation time step in seconds (default: 0.1)

#### Returns

[`AgentSet`](AgentSet.md)

#### Throws

If tensor dimensions are inconsistent

#### Remarks

The constructor performs the following initialization steps:
1. Validates tensor dimensions for consistency
2. Extracts dimensional parameters (agent count, state count, etc.)
3. Initializes each agent with a starting state
4. Allocates ΔP and ΔW tensors for gradient calculations

#### Defined in

[classes/agent-set.class.ts:107](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L107)

## Properties

### incentiveTensor

> `protected` **incentiveTensor**: `number`[][][][]

4D tensor `I[α][σ][τ][ψ]` representing agent incentives relative to reporting metrics

#### Defined in

[classes/agent-set.class.ts:54](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L54)

***

### influenceTensor

> `protected` **influenceTensor**: `number`[][][][]

4D tensor `W[α][β][σ][τ]` representing inter-agent influence

#### Defined in

[classes/agent-set.class.ts:48](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L48)

***

### judgmentTensor

> `protected` **judgmentTensor**: `number`[][][][]

4D tensor `J[α][σ][τ][χ]` representing agent judgment relative to plant states

#### Defined in

[classes/agent-set.class.ts:51](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L51)

***

### name

> `protected` **name**: `string` = `"AgentSet"`

Name identifier for logging purposes

#### Defined in

[classes/agent-set.class.ts:42](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L42)

***

### priorityTensor

> `protected` **priorityTensor**: `number`[][][]

3D tensor `P[α][σ][τ]` representing state transition probabilities for each agent

#### Defined in

[classes/agent-set.class.ts:45](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L45)

## Methods

### \_log()

> `protected` **\_log**(`message`, `data`?): `void`

**`Internal`**

Internal trace logging helper.

#### Parameters

• **message**: `string`

Log message

• **data?**: `any`

Optional data payload

#### Returns

`void`

#### Defined in

[classes/agent-set.class.ts:552](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L552)

***

### checkConsistency()

> **checkConsistency**(): `boolean`

**`Internal`**

Validates dimensional consistency of all behavioral tensors.

#### Returns

`boolean`

`true` if all tensors are dimensionally consistent, `false` otherwise

#### Throws

If critical inconsistencies are detected (via logger.error)

#### Remarks

Checks the following constraints:
- Priority tensor: `[α][σ][τ]` with α = agentCount, σ = τ = stateCount
- Influence tensor: `[α][β][σ][τ]` with β = agentCount
- Judgment tensor: `[α][σ][τ][χ]` with χ = plantDegreesOfFreedom
- Incentive tensor: `[α][σ][τ][ψ]` with ψ = reportingDimensions

#### Defined in

[classes/agent-set.class.ts:460](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L460)

***

### emitControlInputTensor()

> **emitControlInputTensor**(): `number`[][]

**`Internal`**

Emits control input tensor from all agents based on their current states.

#### Returns

`number`[][]

2D tensor `[α][χ]` where each row is an agent's control tensor

#### Defined in

[classes/agent-set.class.ts:223](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L223)

***

### getAgentCount()

> **getAgentCount**(): `number`

Returns the total number of agents in the set.

#### Returns

`number`

Agent count (α dimension)

#### Defined in

[classes/agent-set.class.ts:277](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L277)

***

### getAgentStateArray()

> **getAgentStateArray**(): `number`[]

Returns array of current agent state indices.

#### Returns

`number`[]

Array where `result[α]` is agent α's current state index

#### Example

```typescript
const states = agentSet.getAgentStateArray();
// states = [0, 2, 1, 0, 1] means:
// Agent 0 is in state 0, Agent 1 in state 2, etc.
```

#### Defined in

[classes/agent-set.class.ts:266](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L266)

***

### getDeltaP()

> **getDeltaP**(): `number`[][][]

Returns the priority tensor update (ΔP) from the most recent recalculation.

#### Returns

`number`[][][]

3D tensor `ΔP[α][σ][τ]` representing priority updates

#### Remarks

Useful for analyzing learning dynamics and convergence behavior.

#### Defined in

[classes/agent-set.class.ts:298](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L298)

***

### getStateCount()

> **getStateCount**(): `number`

Returns the total number of possible states.

#### Returns

`number`

State count (σ, τ dimensions)

#### Defined in

[classes/agent-set.class.ts:286](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L286)

***

### getTensors()

> **getTensors**(): `object`

Retrieves all behavioral tensors.

#### Returns

`object`

Object containing priority, influence, judgment, and incentive tensors

##### incentiveTensor

> **incentiveTensor**: `number`[][][][]

##### influenceTensor

> **influenceTensor**: `number`[][][][]

##### judgmentTensor

> **judgmentTensor**: `number`[][][][]

##### priorityTensor

> **priorityTensor**: `number`[][][]

#### Remarks

The returned tensors are references to the internal state - modifications will affect
the agent set behavior. Use with caution.

#### Defined in

[classes/agent-set.class.ts:240](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L240)

***

### recalculateParams()

> **recalculateParams**(`targets`, `plantState`, `reporting`): [`AgentSet`](AgentSet.md)

Recalculates priority tensor using gradient descent based on system feedback.

#### Parameters

• **targets**: [`Targets`](../interfaces/Targets.md)

Target values for plant state and reporting metrics

• **plantState**: `number`[]

Current plant state vector `[χ]`

• **reporting**: `number`[]

Current reporting metrics vector `[ψ]`

#### Returns

[`AgentSet`](AgentSet.md)

This AgentSet instance for method chaining

#### Remarks

The priority tensor update algorithm:

1. **Calculate ΔW** (gradient of objective function):
   ```
   ΔW[α][σ][τ] = Σ(W[α][β][σ][τ] * (P[α][σ][τ] - P[β][σ][τ])) * Δt
               + Σ(J[α][σ][τ][χ] * (x[χ] - x*[χ])) * Δt
               + Σ(I[α][σ][τ][ψ] * (r[ψ] - r*[ψ])) * Δt
   ```

2. **Calculate ΔP** (using Jacobian of simplex constraint):
   ```
   ΔP[α][σ][τ] = Σ(P[α][σ][τ] * (δ[τ,λ] - P[α][σ][λ]) * ΔW[α][σ][λ])
   ```

3. **Apply saturation limits** (prevent probabilities from going negative or > 1)

4. **Normalize** each row to ensure `Σ P[α][σ][τ] = 1` (simplex constraint)

If normalization encounters a zero-sum row (degenerate case), the row is reset
to uniform distribution and a warning is logged.

#### Example

```typescript
agentSet.recalculateParams(
  { plantState: [10, 20], reporting: [100] },
  [11, 19],  // current plant state
  [98]       // current reporting
);
```

#### Defined in

[classes/agent-set.class.ts:341](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L341)

***

### transitionState()

> **transitionState**(): `number`[][]

Transitions all agents to new states based on stochastic priority tensor.

#### Returns

`number`[][]

2D tensor of control inputs `[α][χ]` emitted by each agent

#### Remarks

The state transition algorithm:
1. Generates random numbers `r[α] ∈ [0,1)` for each agent
2. Computes cumulative distribution: `CDF[α][σ][τ] = Σ(P[α][σ][k] for k ≤ τ)`
3. Selects new state τ where `CDF[α][σ][τ-1] < r[α] ≤ CDF[α][σ][τ]`
4. Each agent emits control tensor based on new state

The cumulative distribution is normalized to exactly 1.0 at the final state
to prevent floating-point precision issues from making the last state unreachable.

#### Example

```typescript
const controlInputs = agentSet.transitionState();
// controlInputs[0] contains agent 0's control tensor
// controlInputs[i][j] is agent i's control value for plant variable j
```

#### Defined in

[classes/agent-set.class.ts:173](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/agent-set.class.ts#L173)
