[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Simulation

# Class: Simulation

Top-level simulation orchestrator that runs multi-agent organisational simulations over time.

## Remarks

The Simulation class manages the temporal execution of an organisation's state transitions
across a specified time period. It converts real-world time (days) into discrete clock ticks
and provides an Observable stream for monitoring simulation progress.

**Time Conversion:**

Real time is discretized into clock ticks based on the configured tick duration:
```
clockTicks = (days × 8 hours × 3600 seconds) / clockTickSeconds
```

For example, with `clockTickSeconds = 0.1` (100ms ticks):
- 1 work day (8 hours) = 288,000 ticks
- 30 days = 8,640,000 ticks

**Observable Pattern:**

The simulation emits [StepOutput](../interfaces/StepOutput.md) objects for each clock tick, enabling:
- Real-time monitoring and visualization
- Streaming data to databases or files
- Early termination based on convergence criteria
- Progress reporting for long-running simulations

**Usage Pattern:**

```typescript
const simulation = new Simulation(config, logger, randomFactory, organisation);

simulation.run$().subscribe({
  next: (step) => {
    console.log(`Tick ${step.clockTick}: ${step.organisation.getStateArray()}`);
    // Save to database, check convergence, update UI, etc.
  },
  complete: () => {
    console.log('Simulation complete');
  }
});
```

## Constructors

### new Simulation()

> **new Simulation**(`simConfig`, `logger`, `randomStreamFactory`, `organisation`): [`Simulation`](Simulation.md)

Creates a new Simulation with the specified configuration.

#### Parameters

• **simConfig**: [`SimulationConfig`](../interfaces/SimulationConfig.md)

Complete simulation configuration (duration, org config, etc.)

• **logger**: [`Logger`](Logger.md)

Observable logging system

• **randomStreamFactory**: [`RandomStreamFactory`](RandomStreamFactory.md)

Factory for generating reproducible random streams

• **organisation**: [`Organisation`](Organisation.md)

Organisation instance to simulate

#### Returns

[`Simulation`](Simulation.md)

#### Remarks

The constructor calculates the total number of clock ticks based on:
- `simConfig.days`: Number of work days to simulate
- `simConfig.orgConfig.clockTickSeconds`: Duration of each tick in seconds

**Clock Tick Calculation:**
```
clockTicks = (days × 8 hours/day × 3600 seconds/hour) / clockTickSeconds
```

This assumes an 8-hour work day. To simulate a 30-day period with 0.1-second ticks:
```
clockTicks = (30 × 8 × 3600) / 0.1 = 8,640,000 ticks
```

#### Example

```typescript
const config: SimulationConfig = {
  days: 30,
  orgConfig: {
    clockTickSeconds: 0.1,
    // ... other org configuration
  }
};

const simulation = new Simulation(
  config,
  logger,
  randomStreamFactory,
  organisation
);
```

#### Defined in

[classes/simulation.class.ts:102](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/simulation.class.ts#L102)

## Properties

### clockTicks

> `protected` **clockTicks**: `number`

#### Defined in

[classes/simulation.class.ts:58](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/simulation.class.ts#L58)

***

### config

> `protected` **config**: [`SimulationConfig`](../interfaces/SimulationConfig.md)

#### Defined in

[classes/simulation.class.ts:54](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/simulation.class.ts#L54)

***

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/simulation.class.ts:57](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/simulation.class.ts#L57)

***

### name

> `protected` **name**: `string` = `"Simulation"`

#### Defined in

[classes/simulation.class.ts:53](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/simulation.class.ts#L53)

***

### orgModelConfig

> `protected` **orgModelConfig**: [`OrgModelConfig`](../interfaces/OrgModelConfig.md)

#### Defined in

[classes/simulation.class.ts:55](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/simulation.class.ts#L55)

***

### organisation

> `protected` **organisation**: [`Organisation`](Organisation.md)

#### Defined in

[classes/simulation.class.ts:59](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/simulation.class.ts#L59)

***

### randomStreamFactory

> `protected` **randomStreamFactory**: [`RandomStreamFactory`](RandomStreamFactory.md)

#### Defined in

[classes/simulation.class.ts:56](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/simulation.class.ts#L56)

## Methods

### run$()

> **run$**(): `Observable`\<[`StepOutput`](../interfaces/StepOutput.md)\>

Runs the simulation and returns an Observable stream of time steps.

#### Returns

`Observable`\<[`StepOutput`](../interfaces/StepOutput.md)\>

Observable emitting [StepOutput](../interfaces/StepOutput.md) for each clock tick

#### Remarks

This method executes the simulation loop, transitioning the organisation's state
for each clock tick and emitting the results as an observable stream.

**Execution Flow:**

For each tick from 0 to `clockTicks - 1`:
1. Call `organisation.transitionState()`
2. Emit `{ clockTick, organisation }` to subscribers
3. Continue until all ticks complete
4. Call `subscriber.complete()`

**Observable Characteristics:**

- **Synchronous**: All ticks execute immediately when subscribed
- **Cold Observable**: Starts execution only when subscribed
- **Single emission per tick**: One StepOutput object per clock tick
- **Completes automatically**: After all ticks are executed

**Use Cases:**

```typescript
// Real-time monitoring
simulation.run$().subscribe(step => {
  console.log(`Progress: ${step.clockTick}/${totalTicks}`);
  updateUI(step.organisation.getStateArray());
});

// Save to database
simulation.run$()
  .pipe(bufferCount(1000))  // Batch for efficiency
  .subscribe(batch => database.saveBatch(batch));

// Early termination on convergence
simulation.run$()
  .pipe(takeUntil(convergenceDetected$))
  .subscribe(step => analyzeStep(step));

// Collect complete trajectory
const trajectory: StepOutput[] = [];
simulation.run$().subscribe({
  next: step => trajectory.push(step),
  complete: () => console.log(`Collected ${trajectory.length} steps`)
});
```

#### Example

```typescript
const simulation = new Simulation(config, logger, randomFactory, org);

simulation.run$().subscribe({
  next: (step) => {
    console.log(`Tick ${step.clockTick}`);
    console.log(`State: ${step.organisation.getStateArray()}`);
  },
  error: (err) => console.error('Simulation error:', err),
  complete: () => console.log('Simulation complete')
});
```

#### Defined in

[classes/simulation.class.ts:183](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/simulation.class.ts#L183)
