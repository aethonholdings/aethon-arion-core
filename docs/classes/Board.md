[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Board

# Class: `abstract` Board

Abstract base class for strategic planning and target setting.

## Remarks

The Board represents the strategic decision-making layer that sets performance targets
for the organisation. It observes current performance metrics and updates targets to
guide agent behavior toward desired outcomes.

**Responsibilities:**

- Review current performance (reporting metrics)
- Set or update strategic targets for:
  - Plant state variables (e.g., production capacity, inventory levels)
  - Reporting metrics (e.g., KPIs, performance indicators)
- Provide feedback to guide agent learning via gradient descent

**Implementation Pattern:**

Concrete Board implementations must define the `transitionState()` method to specify
how targets are updated based on current performance. Strategies include:

- **Static targets**: Return fixed plan regardless of performance
- **Adaptive targets**: Adjust based on performance gaps
- **Scheduled targets**: Change targets over time (e.g., growth targets)
- **Reactive targets**: Respond to specific performance thresholds

## Example

```typescript
// Example concrete implementation
class C1Board extends Board {
  transitionState(reportingTensor: number[]): Targets {
    // Static strategy: return unchanging targets
    return this.plan;
  }
}

// Usage
const targets: Targets = {
  plantState: [10.0, 20.0],    // Target plant states
  reporting: [0.95, 0.90]      // Target performance metrics
};
const board = new C1Board(targets, logger);
```

## Constructors

### new Board()

> **new Board**(`plan`, `logger`): [`Board`](Board.md)

Creates a new Board with initial strategic targets.

#### Parameters

• **plan**: [`Targets`](../interfaces/Targets.md)

Initial target values for plant state and reporting metrics

• **logger**: [`Logger`](Logger.md)

Observable logging system

#### Returns

[`Board`](Board.md)

#### Remarks

The plan defines the desired state that agents should drive the organisation toward.
Target dimensions must match:
- `plan.plantState.length` = Plant degrees of freedom (χ)
- `plan.reporting.length` = Reporting degrees of freedom (ψ)

#### Example

```typescript
const targets: Targets = {
  plantState: [100.0, 50.0, 75.0],  // 3 plant variables
  reporting: [0.95, 0.88, 1.2]      // 3 performance metrics
};
const board = new C1Board(targets, logger);
```

#### Defined in

[classes/board.class.ts:76](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/board.class.ts#L76)

## Properties

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/board.class.ts:53](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/board.class.ts#L53)

***

### name

> `protected` **name**: `string` = `"Board"`

#### Defined in

[classes/board.class.ts:51](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/board.class.ts#L51)

***

### plan

> `protected` **plan**: [`Targets`](../interfaces/Targets.md)

#### Defined in

[classes/board.class.ts:52](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/board.class.ts#L52)

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

[classes/board.class.ts:147](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/board.class.ts#L147)

***

### getPlan()

> **getPlan**(): [`Targets`](../interfaces/Targets.md)

Returns the current strategic plan.

#### Returns

[`Targets`](../interfaces/Targets.md)

Current target values for plant state and reporting metrics

#### Defined in

[classes/board.class.ts:135](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/board.class.ts#L135)

***

### transitionState()

> `abstract` **transitionState**(`reportingTensor`): [`Targets`](../interfaces/Targets.md)

Updates strategic targets based on current performance.

#### Parameters

• **reportingTensor**: `number`[]

Current performance metrics

#### Returns

[`Targets`](../interfaces/Targets.md)

Updated targets for the next time step

#### Remarks

This abstract method must be implemented by concrete Board subclasses.
It defines the Board's strategic behavior in response to performance feedback.

**Implementation Strategies:**

- **Static**: Return `this.plan` unchanged (simple baseline)
- **Gap-based**: Increase targets when performance exceeds current targets
- **Time-based**: Update targets according to a schedule
- **Threshold-based**: Change targets when metrics cross thresholds

The returned targets influence agent behavior through the gradient descent
parameter update mechanism.

#### Example

```typescript
// Static strategy
class StaticBoard extends Board {
  transitionState(reportingTensor: number[]): Targets {
    return this.plan;  // Never change targets
  }
}

// Adaptive strategy
class AdaptiveBoard extends Board {
  transitionState(reportingTensor: number[]): Targets {
    const newTargets = { ...this.plan };
    for (let i = 0; i < reportingTensor.length; i++) {
      if (reportingTensor[i] > this.plan.reporting[i] * 1.1) {
        // Exceeded by 10% -> increase target
        newTargets.reporting[i] *= 1.05;
      }
    }
    return newTargets;
  }
}
```

#### Defined in

[classes/board.class.ts:128](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/board.class.ts#L128)
