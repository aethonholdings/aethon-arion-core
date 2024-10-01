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

[classes/class.agent.set.ts:29](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L29)

## Properties

### incentiveTensor

> `protected` **incentiveTensor**: `number`[][][][]

#### Defined in

[classes/class.agent.set.ts:13](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L13)

***

### influenceTensor

> `protected` **influenceTensor**: `number`[][][][]

#### Defined in

[classes/class.agent.set.ts:11](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L11)

***

### judgmentTensor

> `protected` **judgmentTensor**: `number`[][][][]

#### Defined in

[classes/class.agent.set.ts:12](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L12)

***

### name

> `protected` **name**: `string` = `"AgentSet"`

#### Defined in

[classes/class.agent.set.ts:9](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L9)

***

### priorityTensor

> `protected` **priorityTensor**: `number`[][][]

#### Defined in

[classes/class.agent.set.ts:10](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L10)

## Methods

### \_log()

> `protected` **\_log**(`message`, `data`?): `void`

#### Parameters

• **message**: `string`

• **data?**: `any`

#### Returns

`void`

#### Defined in

[classes/class.agent.set.ts:327](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L327)

***

### checkConsistency()

> **checkConsistency**(): `boolean`

#### Returns

`boolean`

#### Defined in

[classes/class.agent.set.ts:243](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L243)

***

### emitControlInputTensor()

> **emitControlInputTensor**(): `number`[][]

#### Returns

`number`[][]

#### Defined in

[classes/class.agent.set.ts:112](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L112)

***

### getAgentCount()

> **getAgentCount**(): `number`

#### Returns

`number`

#### Defined in

[classes/class.agent.set.ts:141](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L141)

***

### getAgentStateArray()

> **getAgentStateArray**(): `number`[]

#### Returns

`number`[]

#### Defined in

[classes/class.agent.set.ts:135](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L135)

***

### getDeltaP()

> **getDeltaP**(): `number`[][][]

#### Returns

`number`[][][]

#### Defined in

[classes/class.agent.set.ts:149](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L149)

***

### getStateCount()

> **getStateCount**(): `number`

#### Returns

`number`

#### Defined in

[classes/class.agent.set.ts:145](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L145)

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

[classes/class.agent.set.ts:121](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L121)

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

[classes/class.agent.set.ts:153](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L153)

***

### transitionState()

> **transitionState**(): `number`[][]

#### Returns

`number`[][]

#### Defined in

[classes/class.agent.set.ts:73](https://github.com/aethonholdings/aethon-arion-core/blob/40d07c6762895a9f0e8c1c4a732afbc5a7189263/src/classes/class.agent.set.ts#L73)
