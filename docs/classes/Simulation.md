[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Simulation

# Class: Simulation

## Constructors

### new Simulation()

> **new Simulation**(`simConfig`, `logger`, `randomStreamFactory`, `organisation`): [`Simulation`](Simulation.md)

#### Parameters

• **simConfig**: [`SimulationConfig`](../interfaces/SimulationConfig.md)

• **logger**: [`Logger`](Logger.md)

• **randomStreamFactory**: [`RandomStreamFactory`](RandomStreamFactory.md)

• **organisation**: [`Organisation`](Organisation.md)

#### Returns

[`Simulation`](Simulation.md)

#### Defined in

[classes/simulation.class.ts:16](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/simulation.class.ts#L16)

## Properties

### clockTicks

> `protected` **clockTicks**: `number`

#### Defined in

[classes/simulation.class.ts:13](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/simulation.class.ts#L13)

***

### config

> `protected` **config**: [`SimulationConfig`](../interfaces/SimulationConfig.md)

#### Defined in

[classes/simulation.class.ts:9](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/simulation.class.ts#L9)

***

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/simulation.class.ts:12](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/simulation.class.ts#L12)

***

### name

> `protected` **name**: `string` = `"Simulation"`

#### Defined in

[classes/simulation.class.ts:8](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/simulation.class.ts#L8)

***

### orgModelConfig

> `protected` **orgModelConfig**: [`OrgModelConfig`](../interfaces/OrgModelConfig.md)

#### Defined in

[classes/simulation.class.ts:10](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/simulation.class.ts#L10)

***

### organisation

> `protected` **organisation**: [`Organisation`](Organisation.md)

#### Defined in

[classes/simulation.class.ts:14](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/simulation.class.ts#L14)

***

### randomStreamFactory

> `protected` **randomStreamFactory**: [`RandomStreamFactory`](RandomStreamFactory.md)

#### Defined in

[classes/simulation.class.ts:11](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/simulation.class.ts#L11)

## Methods

### run$()

> **run$**(): `Observable`\<[`StepOutput`](../interfaces/StepOutput.md)\>

#### Returns

`Observable`\<[`StepOutput`](../interfaces/StepOutput.md)\>

#### Defined in

[classes/simulation.class.ts:32](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/simulation.class.ts#L32)
