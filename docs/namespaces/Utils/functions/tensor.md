[**aethon-arion-core**](../../../README.md) • **Docs**

***

[aethon-arion-core](../../../globals.md) / [Utils](../README.md) / tensor

# Function: tensor()

> **tensor**(`dataOrShape`, `initialiser`?): [`Tensor`](../../../type-aliases/Tensor.md)

Creates a new tensor of specified shape or returns existing data.

## Parameters

• **dataOrShape**: [`Tensor`](../../../type-aliases/Tensor.md)

Either shape array `[d1, d2, ...]` for new tensor, or existing tensor data

• **initialiser?**

Optional function to initialize each element `(x?, y?) => number`

## Returns

[`Tensor`](../../../type-aliases/Tensor.md)

Newly created tensor or the input data

## Throws

If shape is not an array of non-negative numbers when initialiser is provided

## Remarks

This function has two modes:
1. **Data mode** (no initialiser): Returns the input data as-is
2. **Creation mode** (with initialiser): Creates new tensor with specified shape

In creation mode, the initialiser function is called for each element.
For 1D tensors, it's called with no arguments. For higher dimensions,
it may receive index coordinates (implementation-dependent).

## Example

```typescript
// Create a 3x3 matrix filled with zeros
const zeros = Utils.tensor([3, 3], () => 0);

// Create a 2x4 matrix filled with random values
const random = Utils.tensor([2, 4], () => Math.random());

// Create a 3D tensor (2x3x4)
const tensor3d = Utils.tensor([2, 3, 4], () => 0);

// Return existing data
const data = [[1, 2], [3, 4]];
const sameTensor = Utils.tensor(data);  // Returns data unchanged
```

## Defined in

[modules/utils.module.ts:51](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/modules/utils.module.ts#L51)
