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

[classes/class.agent.ts:8](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.ts#L8)

## Properties

### name

> `protected` **name**: `string` = `"Agent"`

#### Defined in

[classes/class.agent.ts:4](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.ts#L4)

***

### stateIndex

> `protected` **stateIndex**: `number`

#### Defined in

[classes/class.agent.ts:5](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.ts#L5)

## Methods

### emitWorkstationControlTensor()

> **emitWorkstationControlTensor**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/class.agent.ts:26](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.ts#L26)

***

### getStateIndex()

> **getStateIndex**(): `number`

#### Returns

`number`

#### Defined in

[classes/class.agent.ts:13](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.ts#L13)

***

### setStateIndex()

> **setStateIndex**(`stateIndex`): `void`

#### Parameters

• **stateIndex**: `number`

#### Returns

`void`

#### Defined in

[classes/class.agent.ts:17](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.ts#L17)

***

### transitionState()

> **transitionState**(`stateIndex`): `number`

#### Parameters

• **stateIndex**: `number`

#### Returns

`number`

#### Defined in

[classes/class.agent.ts:21](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.ts#L21)
