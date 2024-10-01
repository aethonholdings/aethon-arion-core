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

[classes/class.board.ts:9](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.board.ts#L9)

## Properties

### logger

> `protected` **logger**: [`Logger`](Logger.md)

#### Defined in

[classes/class.board.ts:7](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.board.ts#L7)

***

### name

> `protected` **name**: `string` = `"Board"`

#### Defined in

[classes/class.board.ts:5](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.board.ts#L5)

***

### plan

> `protected` **plan**: [`Targets`](../interfaces/Targets.md)

#### Defined in

[classes/class.board.ts:6](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.board.ts#L6)

## Methods

### \_log()

> `protected` **\_log**(`message`, `data`?): `void`

#### Parameters

• **message**: `string`

• **data?**: `any`

#### Returns

`void`

#### Defined in

[classes/class.board.ts:23](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.board.ts#L23)

***

### getPlan()

> **getPlan**(): [`Targets`](../interfaces/Targets.md)

#### Returns

[`Targets`](../interfaces/Targets.md)

#### Defined in

[classes/class.board.ts:19](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.board.ts#L19)

***

### transitionState()

> `abstract` **transitionState**(`reportingTensor`): [`Targets`](../interfaces/Targets.md)

#### Parameters

• **reportingTensor**: `number`[]

#### Returns

[`Targets`](../interfaces/Targets.md)

#### Defined in

[classes/class.board.ts:17](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.board.ts#L17)
