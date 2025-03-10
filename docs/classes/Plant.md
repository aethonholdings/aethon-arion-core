[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Plant

# Class: `abstract` Plant

## Constructors

### new Plant()

> **new Plant**(`initialStateTensor`, `logger`): [`Plant`](Plant.md)

#### Parameters

• **initialStateTensor**: `number`[]

• **logger**: [`Logger`](Logger.md)

#### Returns

[`Plant`](Plant.md)

#### Defined in

[classes/plant.class.ts:11](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/plant.class.ts#L11)

## Properties

### delta

> `protected` **delta**: `number`[]

#### Defined in

[classes/plant.class.ts:8](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/plant.class.ts#L8)

***

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/plant.class.ts:9](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/plant.class.ts#L9)

***

### name

> `protected` **name**: `string` = `"Plant"`

#### Defined in

[classes/plant.class.ts:6](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/plant.class.ts#L6)

***

### stateTensor

> `protected` **stateTensor**: `number`[]

#### Defined in

[classes/plant.class.ts:7](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/plant.class.ts#L7)

## Methods

### \_log()

> `protected` **\_log**(`message`, `data`?): `void`

#### Parameters

• **message**: `string`

• **data?**: `any`

#### Returns

`void`

#### Defined in

[classes/plant.class.ts:36](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/plant.class.ts#L36)

***

### getDegreesOfFreedom()

> **getDegreesOfFreedom**(): `number`

#### Returns

`number`

#### Defined in

[classes/plant.class.ts:24](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/plant.class.ts#L24)

***

### getDeltaTensor()

> **getDeltaTensor**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/plant.class.ts:32](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/plant.class.ts#L32)

***

### getStateTensor()

> **getStateTensor**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/plant.class.ts:28](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/plant.class.ts#L28)

***

### transitionState()

> `abstract` **transitionState**(`inputTensor`): `number`[]

#### Parameters

• **inputTensor**: [`Tensor`](../type-aliases/Tensor.md)

#### Returns

`number`[]

#### Defined in

[classes/plant.class.ts:22](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/plant.class.ts#L22)
