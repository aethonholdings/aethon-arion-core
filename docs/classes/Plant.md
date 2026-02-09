[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Plant

# Class: `abstract` Plant

Abstract base class representing the physical or operational system state.

## Remarks

The Plant models the dynamic physical or operational system that agents control.
Examples include:
- Manufacturing systems (production capacity, inventory, WIP)
- Service operations (queue lengths, utilization rates)
- Energy systems (generation capacity, storage levels)

**State Evolution:**

The plant state evolves based on agent control inputs:
```
χ(t+1) = f(χ(t), u(t))
```

Where:
- `χ(t)` = Plant state at time t (state tensor)
- `u(t)` = Control input from agents (aggregated agent actions)
- `f()` = State transition function (defined in concrete implementations)

**Delta Tracking:**

The plant maintains `delta`, the change in state from the previous time step:
```
Δχ(t) = χ(t) - χ(t-1)
```

This is used by the Reporting subsystem to calculate performance metrics
based on rates of change (e.g., production rate, growth rate).

**Degrees of Freedom:**

The number of state variables (χ) defines the plant's degrees of freedom.
This must match:
- Board plant target vector length
- AgentSet judgment tensor 4th dimension

## Example

```typescript
// Example concrete implementation
class ProductionPlant extends Plant {
  transitionState(inputTensor: Tensor): number[] {
    const controlInput = inputTensor as number[];
    const newState = [...this.stateTensor];

    // State dynamics: inventory changes based on production and demand
    newState[0] += controlInput[0] - 10.0;  // Production - demand
    newState[0] = Math.max(0, newState[0]);  // Non-negative constraint

    // Calculate delta
    this.delta = newState.map((s, i) => s - this.stateTensor[i]);
    this.stateTensor = newState;

    return this.stateTensor;
  }
}

// Usage
const initialState = [50.0, 100.0];  // [inventory, capacity]
const plant = new ProductionPlant(initialState, logger);
```

## Constructors

### new Plant()

> **new Plant**(`initialStateTensor`, `logger`): [`Plant`](Plant.md)

Creates a new Plant with specified initial state.

#### Parameters

• **initialStateTensor**: `number`[]

Initial values for all plant state variables

• **logger**: [`Logger`](Logger.md)

Observable logging system

#### Returns

[`Plant`](Plant.md)

#### Remarks

The delta tensor is initialized to zeros with the same shape as the state tensor.
Delta values are updated during each `transitionState()` call to track
rates of change.

#### Example

```typescript
const initialState = [100.0, 50.0, 75.0];
const plant = new C1Plant(initialState, logger);
```

#### Defined in

[classes/plant.class.ts:94](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/plant.class.ts#L94)

## Properties

### delta

> `protected` **delta**: `number`[]

#### Defined in

[classes/plant.class.ts:74](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/plant.class.ts#L74)

***

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/plant.class.ts:75](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/plant.class.ts#L75)

***

### name

> `protected` **name**: `string` = `"Plant"`

#### Defined in

[classes/plant.class.ts:72](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/plant.class.ts#L72)

***

### stateTensor

> `protected` **stateTensor**: `number`[]

#### Defined in

[classes/plant.class.ts:73](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/plant.class.ts#L73)

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

[classes/plant.class.ts:193](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/plant.class.ts#L193)

***

### getDegreesOfFreedom()

> **getDegreesOfFreedom**(): `number`

Returns the number of state variables (χ).

#### Returns

`number`

Dimensionality of the plant state space

#### Remarks

This value must match:
- Board plant target vector length
- AgentSet judgment tensor 4th dimension

#### Defined in

[classes/plant.class.ts:159](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/plant.class.ts#L159)

***

### getDeltaTensor()

> **getDeltaTensor**(): `number`[]

Returns the change in plant state from the previous time step.

#### Returns

`number`[]

Delta vector `Δχ = χ(t) - χ(t-1)`

#### Remarks

Used by Reporting to calculate performance metrics based on
rates of change (e.g., production rate, growth rate).

#### Defined in

[classes/plant.class.ts:181](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/plant.class.ts#L181)

***

### getStateTensor()

> **getStateTensor**(): `number`[]

Returns the current plant state.

#### Returns

`number`[]

Current values of all plant state variables

#### Defined in

[classes/plant.class.ts:168](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/plant.class.ts#L168)

***

### transitionState()

> `abstract` **transitionState**(`inputTensor`): `number`[]

Advances plant state based on control inputs from agents.

#### Parameters

• **inputTensor**: [`Tensor`](../type-aliases/Tensor.md)

Aggregated control inputs from all agents

#### Returns

`number`[]

Updated plant state tensor

#### Remarks

This abstract method must be implemented by concrete Plant subclasses.
It defines the physical or operational dynamics of the system.

**Implementation Requirements:**

1. Compute new state: `χ(t+1) = f(χ(t), u(t))`
2. Calculate delta: `Δχ = χ(t+1) - χ(t)`
3. Update `this.stateTensor` and `this.delta`
4. Return new state

**Common Patterns:**

- **Integrator dynamics**: `χ(t+1) = χ(t) + u(t) × Δt`
- **First-order lag**: `χ(t+1) = χ(t) + α × (u(t) - χ(t))`
- **Constrained dynamics**: Apply bounds (e.g., non-negativity, capacity limits)
- **Coupled dynamics**: State variables influence each other

#### Example

```typescript
class InventoryPlant extends Plant {
  transitionState(inputTensor: Tensor): number[] {
    const production = (inputTensor as number[])[0];
    const demand = 10.0;  // Constant demand

    const oldInventory = this.stateTensor[0];
    const newInventory = Math.max(0, oldInventory + production - demand);

    this.delta[0] = newInventory - oldInventory;
    this.stateTensor[0] = newInventory;

    return this.stateTensor;
  }
}
```

#### Defined in

[classes/plant.class.ts:147](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/plant.class.ts#L147)
