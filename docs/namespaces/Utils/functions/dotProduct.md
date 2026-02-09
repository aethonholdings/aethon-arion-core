[**aethon-arion-core**](../../../README.md) • **Docs**

***

[aethon-arion-core](../../../globals.md) / [Utils](../README.md) / dotProduct

# Function: dotProduct()

> **dotProduct**(`a`, `b`): `number`

Computes the dot product of two vectors.

## Parameters

• **a**: `number`[]

First vector `[n]`

• **b**: `number`[]

Second vector `[n]`

## Returns

`number`

Scalar dot product `Σ(a[i] * b[i])`

## Throws

If vectors have different lengths

## Remarks

The dot product (also called inner product or scalar product) is defined as:

```
a · b = Σ(a[i] * b[i]) for i = 0 to n-1
```

Time complexity: O(n)

## Example

```typescript
const a = [1, 2, 3];
const b = [4, 5, 6];
const result = Utils.dotProduct(a, b);
// Result: 32 (because 1*4 + 2*5 + 3*6 = 32)

// Orthogonal vectors (perpendicular) have dot product of 0
const x = [1, 0];
const y = [0, 1];
Utils.dotProduct(x, y);  // 0
```

## Defined in

[modules/utils.module.ts:264](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/modules/utils.module.ts#L264)
