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

[classes/class.organisation.ts:18](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L18)

## Properties

### agentSet

> `protected` **agentSet**: [`AgentSet`](AgentSet.md)

#### Defined in

[classes/class.organisation.ts:12](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L12)

***

### board

> `protected` **board**: [`Board`](Board.md)

#### Defined in

[classes/class.organisation.ts:11](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L11)

***

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/class.organisation.ts:15](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L15)

***

### name

> `protected` **name**: `string` = `"Organisation"`

#### Defined in

[classes/class.organisation.ts:10](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L10)

***

### plant

> `protected` **plant**: [`Plant`](Plant.md)

#### Defined in

[classes/class.organisation.ts:13](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L13)

***

### reporting

> `protected` **reporting**: [`Reporting`](Reporting.md)

#### Defined in

[classes/class.organisation.ts:14](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L14)

## Methods

### \_log()

> `protected` **\_log**(`message`, `data`?): `void`

#### Parameters

• **message**: `string`

• **data?**: `any`

#### Returns

`void`

#### Defined in

[classes/class.organisation.ts:114](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L114)

***

### checkConsistency()

> **checkConsistency**(): `boolean`

#### Returns

`boolean`

#### Defined in

[classes/class.organisation.ts:78](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L78)

***

### getAgents()

> **getAgents**(): [`AgentSet`](AgentSet.md)

#### Returns

[`AgentSet`](AgentSet.md)

#### Defined in

[classes/class.organisation.ts:66](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L66)

***

### getBoard()

> **getBoard**(): [`Board`](Board.md)

#### Returns

[`Board`](Board.md)

#### Defined in

[classes/class.organisation.ts:62](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L62)

***

### getClockTick()

> **getClockTick**(): `number`

#### Returns

`number`

#### Defined in

[classes/class.organisation.ts:58](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L58)

***

### getPlant()

> **getPlant**(): [`Plant`](Plant.md)

#### Returns

[`Plant`](Plant.md)

#### Defined in

[classes/class.organisation.ts:70](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L70)

***

### getReporting()

> **getReporting**(): [`Reporting`](Reporting.md)

#### Returns

[`Reporting`](Reporting.md)

#### Defined in

[classes/class.organisation.ts:74](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L74)

***

### getStateArray()

> **getStateArray**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/class.organisation.ts:51](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L51)

***

### transitionState()

> **transitionState**(): [`Organisation`](Organisation.md)

#### Returns

[`Organisation`](Organisation.md)

#### Defined in

[classes/class.organisation.ts:35](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.organisation.ts#L35)
