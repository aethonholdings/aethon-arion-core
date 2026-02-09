[**aethon-arion-core**](../../../README.md) • **Docs**

***

[aethon-arion-core](../../../globals.md) / [Utils](../README.md) / pseudoInverse

# Function: pseudoInverse()

> **pseudoInverse**(`A`): `number`[][]

Computes the Moore-Penrose pseudo-inverse of a matrix.

## Parameters

• **A**: `number`[][]

Input matrix `[m][n]`

## Returns

`number`[][]

Pseudo-inverse matrix `[n][m]`

## Remarks

The pseudo-inverse (denoted A⁺) generalizes the matrix inverse to non-square matrices.
It satisfies:
- `A * A⁺ * A = A`
- `A⁺ * A * A⁺ = A⁺`
- `(A * A⁺)ᵀ = A * A⁺`
- `(A⁺ * A)ᵀ = A⁺ * A`

For full-rank matrices:
- If m ≥ n (tall): `A⁺ = (AᵀA)⁻¹Aᵀ`
- If m < n (wide): `A⁺ = Aᵀ(AAᵀ)⁻¹`

Uses the ml-matrix library's SVD-based implementation for numerical stability.

## Example

```typescript
// Least squares solution
const A = [[1, 2], [3, 4], [5, 6]];  // 3x2 (overdetermined)
const Ap = Utils.pseudoInverse(A);    // 2x3
// Can solve Ax = b approximately using x = A⁺b

// For square invertible matrices, A⁺ = A⁻¹
const I = [[1, 0], [0, 1]];
const Ip = Utils.pseudoInverse(I);
// Ip equals I (identity is its own pseudo-inverse)
```

## Defined in

[modules/utils.module.ts:370](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/modules/utils.module.ts#L370)
