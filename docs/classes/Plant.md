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

[classes/class.plant.ts:11](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.plant.ts#L11)

## Properties

### delta

> `protected` **delta**: `number`[]

#### Defined in

[classes/class.plant.ts:8](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.plant.ts#L8)

***

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/class.plant.ts:9](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.plant.ts#L9)

***

### name

> `protected` **name**: `string` = `"Plant"`

#### Defined in

[classes/class.plant.ts:6](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.plant.ts#L6)

***

### stateTensor

> `protected` **stateTensor**: `number`[]

#### Defined in

[classes/class.plant.ts:7](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.plant.ts#L7)

## Methods

### \_log()

> `protected` **\_log**(`message`, `data`?): `void`

#### Parameters

• **message**: `string`

• **data?**: `any`

#### Returns

`void`

#### Defined in

[classes/class.plant.ts:36](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.plant.ts#L36)

***

### getDegreesOfFreedom()

> **getDegreesOfFreedom**(): `number`

#### Returns

`number`

#### Defined in

[classes/class.plant.ts:24](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.plant.ts#L24)

***

### getDeltaTensor()

> **getDeltaTensor**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/class.plant.ts:32](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.plant.ts#L32)

***

### getStateTensor()

> **getStateTensor**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/class.plant.ts:28](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.plant.ts#L28)

***

### transitionState()

> `abstract` **transitionState**(`inputTensor`): `number`[]

#### Parameters

• **inputTensor**: [`Tensor`](../type-aliases/Tensor.md)

#### Returns

`number`[]

#### Defined in

[classes/class.plant.ts:22](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.plant.ts#L22)
