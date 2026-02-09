[**aethon-arion-core**](../../../README.md) • **Docs**

***

[aethon-arion-core](../../../globals.md) / [Utils](../README.md) / modulo

# Function: modulo()

> **modulo**(`a`, `depth`?): `number`

Computes the Frobenius norm (magnitude) of a tensor.

## Parameters

• **a**: [`Tensor`](../../../type-aliases/Tensor.md)

Input tensor of any dimensionality

• **depth?**: `number`

Optional depth limit for computation (default: full depth)

## Returns

`number`

Frobenius norm `√(Σ(a[i]²))`

## Remarks

The Frobenius norm generalizes the Euclidean vector norm to tensors:

```
||A||_F = √(Σ Σ ... Σ a[i][j]...[k]²)
```

For vectors, this is the L2 norm (Euclidean length).
For matrices, it's the square root of the sum of all squared elements.

The depth parameter allows computing partial norms by limiting recursion depth.

## Example

```typescript
// Vector magnitude (L2 norm)
const vector = [3, 4];
Utils.modulo(vector);  // 5.0 (√(3² + 4²))

// Matrix Frobenius norm
const matrix = [[1, 2], [3, 4]];
Utils.modulo(matrix);  // √(1² + 2² + 3² + 4²) = √30 ≈ 5.48

// 3D tensor norm
const tensor3d = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]];
Utils.modulo(tensor3d);  // √(1² + 2² + ... + 8²) = √204 ≈ 14.28
```

## Defined in

[modules/utils.module.ts:308](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/modules/utils.module.ts#L308)
