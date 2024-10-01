[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Simulation

# Class: `abstract` Simulation

## Constructors

### new Simulation()

> **new Simulation**(`simConfig`, `logger`, `randomStreamFactory`): [`Simulation`](Simulation.md)

#### Parameters

• **simConfig**: [`SimulationConfig`](../interfaces/SimulationConfig.md)

• **logger**: [`Logger`](Logger.md)

• **randomStreamFactory**: [`RandomStreamFactory`](RandomStreamFactory.md)

#### Returns

[`Simulation`](Simulation.md)

#### Defined in

[classes/class.simulation.ts:16](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.simulation.ts#L16)

## Properties

### clockTicks

> `protected` **clockTicks**: `number`

#### Defined in

[classes/class.simulation.ts:13](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.simulation.ts#L13)

***

### config

> `protected` **config**: [`SimulationConfig`](../interfaces/SimulationConfig.md)

#### Defined in

[classes/class.simulation.ts:9](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.simulation.ts#L9)

***

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/class.simulation.ts:12](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.simulation.ts#L12)

***

### name

> `protected` **name**: `string` = `"Simulation"`

#### Defined in

[classes/class.simulation.ts:8](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.simulation.ts#L8)

***

### orgModelConfig

> `protected` **orgModelConfig**: [`OrgModelConfig`](../interfaces/OrgModelConfig.md)

#### Defined in

[classes/class.simulation.ts:10](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.simulation.ts#L10)

***

### organisation

> `protected` **organisation**: [`Organisation`](Organisation.md)

#### Defined in

[classes/class.simulation.ts:14](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.simulation.ts#L14)

***

### randomStreamFactory

> `protected` **randomStreamFactory**: [`RandomStreamFactory`](RandomStreamFactory.md)

#### Defined in

[classes/class.simulation.ts:11](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.simulation.ts#L11)

## Methods

### initialiseOrg()

> `abstract` `protected` **initialiseOrg**(): [`Organisation`](Organisation.md)

#### Returns

[`Organisation`](Organisation.md)

#### Defined in

[classes/class.simulation.ts:41](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.simulation.ts#L41)

***

### run$()

> **run$**(): `Observable`\<[`StepOutput`](../interfaces/StepOutput.md)\>

#### Returns

`Observable`\<[`StepOutput`](../interfaces/StepOutput.md)\>

#### Defined in

[classes/class.simulation.ts:27](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.simulation.ts#L27)
