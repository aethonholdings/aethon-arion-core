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

[classes/logger.class.ts:9](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/logger.class.ts#L9)

## Methods

### error()

> **error**(`message`): `void`

#### Parameters

• **message**: `LogMessage`

#### Returns

`void`

#### Defined in

[classes/logger.class.ts:32](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/logger.class.ts#L32)

***

### getObservable$()

> **getObservable$**(): `Observable`\<[`LogLine`](../interfaces/LogLine.md)\>

#### Returns

`Observable`\<[`LogLine`](../interfaces/LogLine.md)\>

#### Defined in

[classes/logger.class.ts:16](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/logger.class.ts#L16)

***

### info()

> **info**(`message`): [`LogLine`](../interfaces/LogLine.md)

#### Parameters

• **message**: `LogMessage`

#### Returns

[`LogLine`](../interfaces/LogLine.md)

#### Defined in

[classes/logger.class.ts:20](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/logger.class.ts#L20)

***

### trace()

> **trace**(`message`): `null` \| [`LogLine`](../interfaces/LogLine.md)

#### Parameters

• **message**: `LogMessage`

#### Returns

`null` \| [`LogLine`](../interfaces/LogLine.md)

#### Defined in

[classes/logger.class.ts:24](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/logger.class.ts#L24)

***

### warning()

> **warning**(`message`): [`LogLine`](../interfaces/LogLine.md)

#### Parameters

• **message**: `LogMessage`

#### Returns

[`LogLine`](../interfaces/LogLine.md)

#### Defined in

[classes/logger.class.ts:28](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/logger.class.ts#L28)
