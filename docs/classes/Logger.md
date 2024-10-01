[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Logger

# Class: Logger

## Constructors

### new Logger()

> **new Logger**(): [`Logger`](Logger.md)

#### Returns

[`Logger`](Logger.md)

#### Defined in

[classes/class.logger.ts:9](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.logger.ts#L9)

## Methods

### error()

> **error**(`message`): `void`

#### Parameters

• **message**: `LogMessage`

#### Returns

`void`

#### Defined in

[classes/class.logger.ts:32](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.logger.ts#L32)

***

### getObservable$()

> **getObservable$**(): `Observable`\<[`LogLine`](../interfaces/LogLine.md)\>

#### Returns

`Observable`\<[`LogLine`](../interfaces/LogLine.md)\>

#### Defined in

[classes/class.logger.ts:16](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.logger.ts#L16)

***

### info()

> **info**(`message`): [`LogLine`](../interfaces/LogLine.md)

#### Parameters

• **message**: `LogMessage`

#### Returns

[`LogLine`](../interfaces/LogLine.md)

#### Defined in

[classes/class.logger.ts:20](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.logger.ts#L20)

***

### trace()

> **trace**(`message`): `null` \| [`LogLine`](../interfaces/LogLine.md)

#### Parameters

• **message**: `LogMessage`

#### Returns

`null` \| [`LogLine`](../interfaces/LogLine.md)

#### Defined in

[classes/class.logger.ts:24](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.logger.ts#L24)

***

### warning()

> **warning**(`message`): [`LogLine`](../interfaces/LogLine.md)

#### Parameters

• **message**: `LogMessage`

#### Returns

[`LogLine`](../interfaces/LogLine.md)

#### Defined in

[classes/class.logger.ts:28](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.logger.ts#L28)
