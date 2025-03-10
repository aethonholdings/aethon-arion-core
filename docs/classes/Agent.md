[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Agent

# Class: Agent

## Constructors

### new Agent()

> **new Agent**(`initialStateIndex`, `states`): [`Agent`](Agent.md)

#### Parameters

• **initialStateIndex**: `number`

• **states**: [`State`](State.md)[]

#### Returns

[`Agent`](Agent.md)

#### Defined in

[classes/agent.class.ts:8](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/agent.class.ts#L8)

## Properties

### name

> `protected` **name**: `string` = `"Agent"`

#### Defined in

[classes/agent.class.ts:4](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/agent.class.ts#L4)

***

### stateIndex

> `protected` **stateIndex**: `number`

#### Defined in

[classes/agent.class.ts:5](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/agent.class.ts#L5)

## Methods

### emitWorkstationControlTensor()

> **emitWorkstationControlTensor**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/agent.class.ts:26](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/agent.class.ts#L26)

***

### getStateIndex()

> **getStateIndex**(): `number`

#### Returns

`number`

#### Defined in

[classes/agent.class.ts:13](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/agent.class.ts#L13)

***

### setStateIndex()

> **setStateIndex**(`stateIndex`): `void`

#### Parameters

• **stateIndex**: `number`

#### Returns

`void`

#### Defined in

[classes/agent.class.ts:17](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/agent.class.ts#L17)

***

### transitionState()

> **transitionState**(`stateIndex`): `number`

#### Parameters

• **stateIndex**: `number`

#### Returns

`number`

#### Defined in

[classes/agent.class.ts:21](https://github.com/aethonholdings/aethon-arion-core/blob/269f5bb4f274bbec10e2951e3d1cb3071c1a2811/src/classes/agent.class.ts#L21)
