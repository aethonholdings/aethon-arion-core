[**aethon-arion-core**](../../../README.md) • **Docs**

***

[aethon-arion-core](../../../globals.md) / [Utils](../README.md) / transposeMatrix

# Function: transposeMatrix()

> **transposeMatrix**(`matrix`): `number`[][]

Transposes a 2D matrix (swaps rows and columns).

## Parameters

• **matrix**: `number`[][]

Input matrix `[rows][cols]`

## Returns

`number`[][]

Transposed matrix `[cols][rows]`

## Throws

If matrix is empty or has no columns

## Remarks

The transpose operation swaps rows and columns such that `result[i][j] = matrix[j][i]`.
Time complexity: O(rows × cols)

## Example

```typescript
const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];
const transposed = Utils.transposeMatrix(matrix);
// Result: [[1, 4], [2, 5], [3, 6]]
```

## Defined in

[modules/utils.module.ts:121](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/modules/utils.module.ts#L121)
