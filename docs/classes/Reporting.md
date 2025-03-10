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

[classes/reporting.class.ts:11](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/reporting.class.ts#L11)

## Properties

### delta

> `protected` **delta**: `number`[]

#### Defined in

[classes/reporting.class.ts:8](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/reporting.class.ts#L8)

***

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/reporting.class.ts:9](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/reporting.class.ts#L9)

***

### name

> `protected` **name**: `string` = `"Reporting"`

#### Defined in

[classes/reporting.class.ts:6](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/reporting.class.ts#L6)

***

### reportingTensor

> `protected` **reportingTensor**: `number`[]

#### Defined in

[classes/reporting.class.ts:7](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/reporting.class.ts#L7)

## Methods

### \_log()

> `protected` **\_log**(`message`, `data`?): `void`

#### Parameters

• **message**: `string`

• **data?**: `any`

#### Returns

`void`

#### Defined in

[classes/reporting.class.ts:35](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/reporting.class.ts#L35)

***

### getDegreesOfFreedom()

> **getDegreesOfFreedom**(): `number`

#### Returns

`number`

#### Defined in

[classes/reporting.class.ts:23](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/reporting.class.ts#L23)

***

### getDeltaTensor()

> **getDeltaTensor**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/reporting.class.ts:31](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/reporting.class.ts#L31)

***

### getReportingTensor()

> **getReportingTensor**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/reporting.class.ts:27](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/reporting.class.ts#L27)

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

[classes/reporting.class.ts:21](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/reporting.class.ts#L21)
