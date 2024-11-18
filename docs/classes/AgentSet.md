[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / AgentSet

# Class: AgentSet

## Constructors

### new AgentSet()

> **new AgentSet**(`agentSetTensors`, `states`, `randomStream`, `logger`, `clockTick`): [`AgentSet`](AgentSet.md)

#### Parameters

• **agentSetTensors**: [`AgentSetTensors`](../interfaces/AgentSetTensors.md)

• **states**: [`State`](State.md)[]

• **randomStream**: [`RandomStream`](RandomStream.md)

• **logger**: [`Logger`](Logger.md)

• **clockTick**: `number`

#### Returns

[`AgentSet`](AgentSet.md)

#### Defined in

[classes/agent-set.class.ts:29](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L29)

## Properties

### incentiveTensor

> `protected` **incentiveTensor**: `number`[][][][]

#### Defined in

[classes/agent-set.class.ts:13](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L13)

***

### influenceTensor

> `protected` **influenceTensor**: `number`[][][][]

#### Defined in

[classes/agent-set.class.ts:11](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L11)

***

### judgmentTensor

> `protected` **judgmentTensor**: `number`[][][][]

#### Defined in

[classes/agent-set.class.ts:12](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L12)

***

### name

> `protected` **name**: `string` = `"AgentSet"`

#### Defined in

[classes/agent-set.class.ts:9](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L9)

***

### priorityTensor

> `protected` **priorityTensor**: `number`[][][]

#### Defined in

[classes/agent-set.class.ts:10](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L10)

## Methods

### \_log()

> `protected` **\_log**(`message`, `data`?): `void`

#### Parameters

• **message**: `string`

• **data?**: `any`

#### Returns

`void`

#### Defined in

[classes/agent-set.class.ts:327](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L327)

***

### checkConsistency()

> **checkConsistency**(): `boolean`

#### Returns

`boolean`

#### Defined in

[classes/agent-set.class.ts:243](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L243)

***

### emitControlInputTensor()

> **emitControlInputTensor**(): `number`[][]

#### Returns

`number`[][]

#### Defined in

[classes/agent-set.class.ts:112](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L112)

***

### getAgentCount()

> **getAgentCount**(): `number`

#### Returns

`number`

#### Defined in

[classes/agent-set.class.ts:141](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L141)

***

### getAgentStateArray()

> **getAgentStateArray**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/agent-set.class.ts:135](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L135)

***

### getDeltaP()

> **getDeltaP**(): `number`[][][]

#### Returns

`number`[][][]

#### Defined in

[classes/agent-set.class.ts:149](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L149)

***

### getStateCount()

> **getStateCount**(): `number`

#### Returns

`number`

#### Defined in

[classes/agent-set.class.ts:145](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L145)

***

### getTensors()

> **getTensors**(): `object`

#### Returns

`object`

##### incentiveTensor

> **incentiveTensor**: `number`[][][][]

##### influenceTensor

> **influenceTensor**: `number`[][][][]

##### judgmentTensor

> **judgmentTensor**: `number`[][][][]

##### priorityTensor

> **priorityTensor**: `number`[][][]

#### Defined in

[classes/agent-set.class.ts:121](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L121)

***

### recalculateParams()

> **recalculateParams**(`targets`, `plantState`, `reporting`): [`AgentSet`](AgentSet.md)

#### Parameters

• **targets**: [`Targets`](../interfaces/Targets.md)

• **plantState**: `number`[]

• **reporting**: `number`[]

#### Returns

[`AgentSet`](AgentSet.md)

#### Defined in

[classes/agent-set.class.ts:153](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L153)

***

### transitionState()

> **transitionState**(): `number`[][]

#### Returns

`number`[][]

#### Defined in

[classes/agent-set.class.ts:73](https://github.com/aethonholdings/aethon-arion-core/blob/614483ba57d5fbb623f57bd4b89da6d2a5843560/src/classes/agent-set.class.ts#L73)
