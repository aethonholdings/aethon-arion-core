[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Reporting

# Class: `abstract` Reporting

## Constructors

### new Reporting()

> **new Reporting**(`initialReportingTensor`, `logger`): [`Reporting`](Reporting.md)

#### Parameters

• **initialReportingTensor**: `number`[]

• **logger**: [`Logger`](Logger.md)

#### Returns

[`Reporting`](Reporting.md)

#### Defined in

[classes/class.reporting.ts:11](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.reporting.ts#L11)

## Properties

### delta

> `protected` **delta**: `number`[]

#### Defined in

[classes/class.reporting.ts:8](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.reporting.ts#L8)

***

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/class.reporting.ts:9](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.reporting.ts#L9)

***

### name

> `protected` **name**: `string` = `"Reporting"`

#### Defined in

[classes/class.reporting.ts:6](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.reporting.ts#L6)

***

### reportingTensor

> `protected` **reportingTensor**: `number`[]

#### Defined in

[classes/class.reporting.ts:7](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.reporting.ts#L7)

## Methods

### \_log()

> `protected` **\_log**(`message`, `data`?): `void`

#### Parameters

• **message**: `string`

• **data?**: `any`

#### Returns

`void`

#### Defined in

[classes/class.reporting.ts:35](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.reporting.ts#L35)

***

### getDegreesOfFreedom()

> **getDegreesOfFreedom**(): `number`

#### Returns

`number`

#### Defined in

[classes/class.reporting.ts:23](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.reporting.ts#L23)

***

### getDeltaTensor()

> **getDeltaTensor**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/class.reporting.ts:31](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.reporting.ts#L31)

***

### getReportingTensor()

> **getReportingTensor**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/class.reporting.ts:27](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.reporting.ts#L27)

***

### transitionState()

> `abstract` **transitionState**(`stateTensor`, `deltaStateTensor`, `controlInputTensor`): `number`[]

#### Parameters

• **stateTensor**: [`Tensor`](../type-aliases/Tensor.md)

• **deltaStateTensor**: [`Tensor`](../type-aliases/Tensor.md)

• **controlInputTensor**: [`Tensor`](../type-aliases/Tensor.md)

#### Returns

`number`[]

#### Defined in

[classes/class.reporting.ts:21](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.reporting.ts#L21)
