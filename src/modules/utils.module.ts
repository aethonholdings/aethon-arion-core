import type { Tensor } from "../types/core.types";
export type { Tensor } from "../types/core.types";

/**
 * Utility namespace providing mathematical operations for tensors and matrices.
 *
 * @remarks
 * The Utils module provides high-performance tensor operations optimized for
 * multi-agent simulations. All operations are designed to work with the
 * flexible `Tensor` type which can represent scalars, vectors, matrices,
 * or higher-dimensional tensors.
 *
 * @public
 */
export namespace Utils {
    /**
     * Creates a new tensor of specified shape or returns existing data.
     *
     * @param dataOrShape - Either shape array `[d1, d2, ...]` for new tensor, or existing tensor data
     * @param initialiser - Optional function to initialize each element `(x?, y?) => number`
     * @returns Newly created tensor or the input data
     *
     * @throws {Error} If shape is not an array of non-negative numbers when initialiser is provided
     *
     * @remarks
     * This function has two modes:
     * 1. **Data mode** (no initialiser): Returns the input data as-is
     * 2. **Creation mode** (with initialiser): Creates new tensor with specified shape
     *
     * In creation mode, the initialiser function is called for each element.
     * For 1D tensors, it's called with no arguments. For higher dimensions,
     * it may receive index coordinates (implementation-dependent).
     *
     * @example
     * ```typescript
     * // Create a 3x3 matrix filled with zeros
     * const zeros = Utils.tensor([3, 3], () => 0);
     *
     * // Create a 2x4 matrix filled with random values
     * const random = Utils.tensor([2, 4], () => Math.random());
     *
     * // Create a 3D tensor (2x3x4)
     * const tensor3d = Utils.tensor([2, 3, 4], () => 0);
     *
     * // Return existing data
     * const data = [[1, 2], [3, 4]];
     * const sameTensor = Utils.tensor(data);  // Returns data unchanged
     * ```
     */
    export function tensor(dataOrShape: Tensor, initialiser?: (x?: number, y?: number) => number): Tensor {
        let output = [];
        if (!initialiser) {
            const data = dataOrShape;
            output = data;
        } else {
            const shape = dataOrShape as number[];
            // Validate that shape is an array of numbers
            if (!Array.isArray(shape) || !shape.every(x => typeof x === 'number' && x >= 0)) {
                throw new Error("Shape must be an array of non-negative numbers");
            }
            const nestArray: number[] = JSON.parse(JSON.stringify(shape));
            if (shape.length > 1) nestArray.splice(0, 1);
            for (let i = 0; i < shape[0]; i++) {
                shape.length === 1 ? output.push(initialiser()) : output.push(tensor(nestArray, initialiser));
            }
        }
        return output as Tensor;
    }

    /**
     * Computes the shape (dimensions) of a tensor.
     *
     * @param tensor - Input tensor of any dimensionality
     * @returns Array of dimension sizes `[d1, d2, d3, ...]`
     *
     * @remarks
     * The shape is determined by recursively measuring the length of each nested array level.
     * For irregular (jagged) tensors, returns the shape based on the first element at each level.
     *
     * @example
     * ```typescript
     * const matrix = [[1, 2, 3], [4, 5, 6]];
     * Utils.shape(matrix);  // [2, 3]
     *
     * const tensor3d = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]];
     * Utils.shape(tensor3d);  // [2, 2, 2]
     *
     * const vector = [1, 2, 3, 4, 5];
     * Utils.shape(vector);  // [5]
     * ```
     */
    export function shape(tensor: Tensor): number[] {
        return nest(tensor, undefined, (x) => {
            return x.length;
        });
    }

    /**
     * Computes the Frobenius norm (magnitude) of a tensor.
     *
     * @param a - Input tensor of any dimensionality
     * @param depth - Optional depth limit for computation (default: full depth)
     * @returns Frobenius norm `√(Σ(a[i]²))`
     *
     * @remarks
     * The Frobenius norm generalizes the Euclidean vector norm to tensors:
     *
     * ```
     * ||A||_F = √(Σ Σ ... Σ a[i][j]...[k]²)
     * ```
     *
     * For vectors, this is the L2 norm (Euclidean length).
     * For matrices, it's the square root of the sum of all squared elements.
     *
     * The depth parameter allows computing partial norms by limiting recursion depth.
     *
     * @example
     * ```typescript
     * // Vector magnitude (L2 norm)
     * const vector = [3, 4];
     * Utils.modulo(vector);  // 5.0 (√(3² + 4²))
     *
     * // Matrix Frobenius norm
     * const matrix = [[1, 2], [3, 4]];
     * Utils.modulo(matrix);  // √(1² + 2² + 3² + 4²) = √30 ≈ 5.48
     *
     * // 3D tensor norm
     * const tensor3d = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]];
     * Utils.modulo(tensor3d);  // √(1² + 2² + ... + 8²) = √204 ≈ 14.28
     * ```
     */
    export function modulo(a: Tensor, depth?: number): number {
        const shp: number[] = shape(a);
        if (!depth) depth = shp.length;
        return Math.sqrt(sumSquares(a, depth));
    }

    /**
     * Recursively computes the sum of squared elements in a tensor up to a given depth.
     *
     * @param a - Input tensor
     * @param depth - Remaining recursion depth
     * @returns Sum of all squared elements at the specified depth
     *
     * @internal
     */
    function sumSquares(a: Tensor, depth: number): number {
        let sumSq = 0;
        const arr = a as any[];
        for (let i = 0; i < arr.length; i++) {
            if (depth > 1) {
                sumSq += sumSquares(arr[i] as Tensor, depth - 1);
            } else {
                const val = arr[i] as number;
                sumSq += val * val;
            }
        }
        return sumSq;
    }

}

/**
 * Recursively measures the length of nested arrays to determine tensor shape.
 *
 * @param nestArray - Current level of nested array
 * @param nestVector - Accumulator for dimension sizes
 * @param nestFunction - Function to extract length at each level
 * @returns Array of dimension sizes
 *
 * @internal
 */
function nest(nestArray: any, nestVector?: number[], nestFunction?: (x: any) => number): number[] {
    if (!nestVector) nestVector = [];
    if (nestArray.length > 0 && nestFunction) {
        nestVector.push(nestFunction(nestArray));
        if (nestArray[0] instanceof Array) {
            nest(nestArray[0], nestVector, nestFunction);
        }
    }
    return nestVector;
}
