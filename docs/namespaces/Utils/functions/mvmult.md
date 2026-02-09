[**aethon-arion-core**](../../../README.md) • **Docs**

***

[aethon-arion-core](../../../globals.md) / [Utils](../README.md) / mvmult

# Function: mvmult()

> **mvmult**(`A`, `b`): `number`[]

Multiplies a matrix by a vector.

## Parameters

• **A**: `number`[][]

Matrix `[m][n]`

• **b**: `number`[]

Vector `[n]`

## Returns

`number`[]

Result vector `[m]`

## Throws

If dimensions are inconsistent (A's columns ≠ b's length)

## Remarks

Performs matrix-vector multiplication where each element `c[i]` is the dot product
of row `i` from A and vector b:

```
c[i] = Σ(A[i][k] * b[k]) for k = 0 to n-1
```

This is equivalent to `mmult(A, [[b[0]], [b[1]], ...])` but more efficient.

Time complexity: O(m × n)

## Example

```typescript
const A = [[1, 2, 3], [4, 5, 6]];  // 2x3
const b = [7, 8, 9];                // 3x1
const c = Utils.mvmult(A, b);
// Result: [50, 122]
// Because: [1*7 + 2*8 + 3*9, 4*7 + 5*8 + 6*9]
```

## Defined in

[modules/utils.module.ts:219](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/modules/utils.module.ts#L219)
