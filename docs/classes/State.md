[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / State

# Class: `abstract` State

Abstract base class representing an agent state.

## Remarks

The State class defines a single behavioral state that agents can occupy.
Each state specifies the control signals (workstation inputs) emitted when
an agent is in that state.

**State Semantics:**

States represent distinct modes of agent behavior, such as:
- **Idle**: Agent not operating any workstation
- **Working**: Agent operating a specific workstation
- **Maintenance**: Agent performing maintenance tasks
- **Break**: Agent on break

**Control Emission:**

The `emit()` method returns a control vector where each element represents
the signal sent to a corresponding workstation or resource. For example,
in a 3-workstation system:
- `[0, 0, 0]`: No workstations controlled (Idle)
- `[1, 0, 0]`: Workstation 0 controlled
- `[0, 1, 0]`: Workstation 1 controlled
- `[0, 0, 1]`: Workstation 2 controlled

**Implementation Pattern:**

Concrete State subclasses must implement the `emit()` method to define
their control behavior. States are typically stateless (pure functions),
but can accept optional parameters for context-dependent emissions.

## Example

```typescript
// Idle state - no workstation control
class IdleState extends State {
  emit(): number[] {
    return [0, 0, 0];
  }
}

// Working state - controls workstation 0
class WorkingState extends State {
  emit(): number[] {
    return [1, 0, 0];
  }
}

// Parameterized state - workstation chosen at emit time
class DynamicWorkingState extends State {
  emit(params?: { workstationIndex: number }): number[] {
    const index = params?.workstationIndex ?? 0;
    const control = [0, 0, 0];
    control[index] = 1;
    return control;
  }
}

// Usage
const states = [new IdleState(), new WorkingState()];
const agent = new Agent(0, states);

console.log(agent.emitWorkstationControlTensor());  // [0, 0, 0]
agent.transitionState(1);
console.log(agent.emitWorkstationControlTensor());  // [1, 0, 0]
```

## Constructors

### new State()

> **new State**(): [`State`](State.md)

Creates a new State instance.

#### Returns

[`State`](State.md)

#### Remarks

The base constructor is empty. Concrete state subclasses may add
initialization logic if needed (e.g., configuration parameters).

#### Defined in

[classes/state.class.ts:78](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/state.class.ts#L78)

## Methods

### emit()

> `abstract` **emit**(`params`?): `number`[]

Emits the control signal vector for this state.

#### Parameters

• **params?**: `any`

Optional parameters for context-dependent emission

#### Returns

`number`[]

Control signal vector for workstations/resources

#### Remarks

This abstract method must be implemented by concrete State subclasses.
It defines what control signals are sent to the plant when an agent
occupies this state.

**Return Value:**

The returned array length must match the plant's control input dimensions.
Each element typically represents:
- 0: Workstation not controlled
- 1: Workstation controlled (binary control)
- Continuous values: For proportional control

**Parameters:**

The optional `params` argument allows states to emit different control
signals based on context, though most implementations use fixed emissions.

#### Example

```typescript
// Fixed emission (most common)
class IdleState extends State {
  emit(): number[] {
    return [0, 0, 0];
  }
}

// Parameterized emission
class FlexibleState extends State {
  emit(params?: { intensity: number }): number[] {
    const intensity = params?.intensity ?? 1.0;
    return [intensity, 0, 0];
  }
}
```

#### Defined in

[classes/state.class.ts:122](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/state.class.ts#L122)
