[**aethon-arion-core**](../../../README.md) • **Docs**

***

[aethon-arion-core](../../../globals.md) / [Utils](../README.md) / mmult

# Function: mmult()

> **mmult**(`A`, `B`): `number`[][]

Multiplies two matrices using standard matrix multiplication.

## Parameters

• **A**: `number`[][]

Left matrix `[m][n]`

• **B**: `number`[][]

Right matrix `[n][p]`

## Returns

`number`[][]

Product matrix `[m][p]`

## Throws

If matrix dimensions are inconsistent (A's columns ≠ B's rows)

## Remarks

Performs standard matrix multiplication where each element `C[i][j]` is the dot product
of row `i` from A and column `j` from B:

```
C[i][j] = Σ(A[i][k] * B[k][j]) for k = 0 to n-1
```

Time complexity: O(m × n × p)

**Important**: Checks for empty matrices before accessing elements to prevent runtime errors.

## Example

```typescript
const A = [[1, 2], [3, 4]];  // 2x2
const B = [[5, 6], [7, 8]];  // 2x2
const C = Utils.mmult(A, B);
// Result: [[19, 22], [43, 50]]

const D = [[1, 2, 3]];       // 1x3
const E = [[4], [5], [6]];   // 3x1
const F = Utils.mmult(D, E);
// Result: [[32]]  (1x1)
```

## Defined in

[modules/utils.module.ts:171](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/modules/utils.module.ts#L171)
