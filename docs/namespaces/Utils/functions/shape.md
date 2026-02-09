[**aethon-arion-core**](../../../README.md) • **Docs**

***

[aethon-arion-core](../../../globals.md) / [Utils](../README.md) / shape

# Function: shape()

> **shape**(`tensor`): `number`[]

Computes the shape (dimensions) of a tensor.

## Parameters

• **tensor**: [`Tensor`](../../../type-aliases/Tensor.md)

Input tensor of any dimensionality

## Returns

`number`[]

Array of dimension sizes `[d1, d2, d3, ...]`

## Remarks

The shape is determined by recursively measuring the length of each nested array level.
For irregular (jagged) tensors, returns the shape based on the first element at each level.

## Example

```typescript
const matrix = [[1, 2, 3], [4, 5, 6]];
Utils.shape(matrix);  // [2, 3]

const tensor3d = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]];
Utils.shape(tensor3d);  // [2, 2, 2]

const vector = [1, 2, 3, 4, 5];
Utils.shape(vector);  // [5]
```

## Defined in

[modules/utils.module.ts:93](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/modules/utils.module.ts#L93)
