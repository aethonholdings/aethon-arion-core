[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Board

# Class: `abstract` Board

## Constructors

### new Board()

> **new Board**(`plan`, `logger`): [`Board`](Board.md)

#### Parameters

• **plan**: [`Targets`](../interfaces/Targets.md)

• **logger**: [`Logger`](Logger.md)

#### Returns

[`Board`](Board.md)

#### Defined in

[classes/board.class.ts:9](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/board.class.ts#L9)

## Properties

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/board.class.ts:7](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/board.class.ts#L7)

***

### name

> `protected` **name**: `string` = `"Board"`

#### Defined in

[classes/board.class.ts:5](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/board.class.ts#L5)

***

### plan

> `protected` **plan**: [`Targets`](../interfaces/Targets.md)

#### Defined in

[classes/board.class.ts:6](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/board.class.ts#L6)

## Methods

### \_log()

> `protected` **\_log**(`message`, `data`?): `void`

#### Parameters

• **message**: `string`

• **data?**: `any`

#### Returns

`void`

#### Defined in

[classes/board.class.ts:23](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/board.class.ts#L23)

***

### getPlan()

> **getPlan**(): [`Targets`](../interfaces/Targets.md)

#### Returns

[`Targets`](../interfaces/Targets.md)

#### Defined in

[classes/board.class.ts:19](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/board.class.ts#L19)

***

### transitionState()

> `abstract` **transitionState**(`reportingTensor`): [`Targets`](../interfaces/Targets.md)

#### Parameters

• **reportingTensor**: `number`[]

#### Returns

[`Targets`](../interfaces/Targets.md)

#### Defined in

[classes/board.class.ts:17](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/board.class.ts#L17)
