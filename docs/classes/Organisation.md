[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Organisation

# Class: Organisation

## Constructors

### new Organisation()

> **new Organisation**(`board`, `agentSet`, `plant`, `reporting`, `logger`): [`Organisation`](Organisation.md)

#### Parameters

• **board**: [`Board`](Board.md)

• **agentSet**: [`AgentSet`](AgentSet.md)

• **plant**: [`Plant`](Plant.md)

• **reporting**: [`Reporting`](Reporting.md)

• **logger**: [`Logger`](Logger.md)

#### Returns

[`Organisation`](Organisation.md)

#### Defined in

[classes/organisation.class.ts:18](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L18)

## Properties

### agentSet

> `protected` **agentSet**: [`AgentSet`](AgentSet.md)

#### Defined in

[classes/organisation.class.ts:12](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L12)

***

### board

> `protected` **board**: [`Board`](Board.md)

#### Defined in

[classes/organisation.class.ts:11](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L11)

***

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/organisation.class.ts:15](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L15)

***

### name

> `protected` **name**: `string` = `"Organisation"`

#### Defined in

[classes/organisation.class.ts:10](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L10)

***

### plant

> `protected` **plant**: [`Plant`](Plant.md)

#### Defined in

[classes/organisation.class.ts:13](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L13)

***

### reporting

> `protected` **reporting**: [`Reporting`](Reporting.md)

#### Defined in

[classes/organisation.class.ts:14](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L14)

## Methods

### \_log()

> `protected` **\_log**(`message`, `data`?): `void`

#### Parameters

• **message**: `string`

• **data?**: `any`

#### Returns

`void`

#### Defined in

[classes/organisation.class.ts:108](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L108)

***

### checkConsistency()

> **checkConsistency**(): `boolean`

#### Returns

`boolean`

#### Defined in

[classes/organisation.class.ts:72](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L72)

***

### getAgents()

> **getAgents**(): [`AgentSet`](AgentSet.md)

#### Returns

[`AgentSet`](AgentSet.md)

#### Defined in

[classes/organisation.class.ts:60](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L60)

***

### getBoard()

> **getBoard**(): [`Board`](Board.md)

#### Returns

[`Board`](Board.md)

#### Defined in

[classes/organisation.class.ts:56](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L56)

***

### getClockTick()

> **getClockTick**(): `number`

#### Returns

`number`

#### Defined in

[classes/organisation.class.ts:52](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L52)

***

### getPlant()

> **getPlant**(): [`Plant`](Plant.md)

#### Returns

[`Plant`](Plant.md)

#### Defined in

[classes/organisation.class.ts:64](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L64)

***

### getReporting()

> **getReporting**(): [`Reporting`](Reporting.md)

#### Returns

[`Reporting`](Reporting.md)

#### Defined in

[classes/organisation.class.ts:68](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L68)

***

### getStateArray()

> **getStateArray**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/organisation.class.ts:45](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L45)

***

### transitionState()

> **transitionState**(): [`Organisation`](Organisation.md)

#### Returns

[`Organisation`](Organisation.md)

#### Defined in

[classes/organisation.class.ts:29](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/organisation.class.ts#L29)
