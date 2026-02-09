import * as Matrix from "ml-matrix"; // https://www.npmjs.com/package/ml-matrix
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
     * Transposes a 2D matrix (swaps rows and columns).
     *
     * @param matrix - Input matrix `[rows][cols]`
     * @returns Transposed matrix `[cols][rows]`
     *
     * @throws {Error} If matrix is empty or has no columns
     *
     * @remarks
     * The transpose operation swaps rows and columns such that `result[i][j] = matrix[j][i]`.
     * Time complexity: O(rows × cols)
     *
     * @example
     * ```typescript
     * const matrix = [
     *   [1, 2, 3],
     *   [4, 5, 6]
     * ];
     * const transposed = Utils.transposeMatrix(matrix);
     * // Result: [[1, 4], [2, 5], [3, 6]]
     * ```
     */
    export function transposeMatrix(matrix: number[][]): number[][] {
        if (matrix.length > 0 && matrix[0].length > 0) {
            const transpose = tensor([matrix[0].length, matrix.length], () => {
                return 0;
            }) as number[][];
            for (let row = 0; row < matrix.length; row++) {
                for (let column = 0; column < matrix[0].length; column++) {
                    transpose[column][row] = matrix[row][column];
                }
            }
            return transpose;
        } else {
            throw new Error("Incorrect matrix transposition input");
        }
    }

    /**
     * Multiplies two matrices using standard matrix multiplication.
     *
     * @param A - Left matrix `[m][n]`
     * @param B - Right matrix `[n][p]`
     * @returns Product matrix `[m][p]`
     *
     * @throws {Error} If matrix dimensions are inconsistent (A's columns ≠ B's rows)
     *
     * @remarks
     * Performs standard matrix multiplication where each element `C[i][j]` is the dot product
     * of row `i` from A and column `j` from B:
     *
     * ```
     * C[i][j] = Σ(A[i][k] * B[k][j]) for k = 0 to n-1
     * ```
     *
     * Time complexity: O(m × n × p)
     *
     * **Important**: Checks for empty matrices before accessing elements to prevent runtime errors.
     *
     * @example
     * ```typescript
     * const A = [[1, 2], [3, 4]];  // 2x2
     * const B = [[5, 6], [7, 8]];  // 2x2
     * const C = Utils.mmult(A, B);
     * // Result: [[19, 22], [43, 50]]
     *
     * const D = [[1, 2, 3]];       // 1x3
     * const E = [[4], [5], [6]];   // 3x1
     * const F = Utils.mmult(D, E);
     * // Result: [[32]]  (1x1)
     * ```
     */
    export function mmult(A: number[][], B: number[][]): number[][] {
        if (A.length > 0 && B.length > 0 && A[0].length === B.length) {
            const output = tensor([A.length, B[0].length], () => {
                return 0;
            }) as number[][];
            for (let row = 0; row < output.length; row++) {
                for (let column = 0; column < output[0].length; column++) {
                    for (let i = 0; i < B.length; i++) {
                        output[row][column] = output[row][column] + A[row][i] * B[i][column];
                    }
                }
            }
            return output;
        } else {
            throw new Error("Inconsistent matrix dimensions in multiplication");
        }
    }

    /**
     * Multiplies a matrix by a vector.
     *
     * @param A - Matrix `[m][n]`
     * @param b - Vector `[n]`
     * @returns Result vector `[m]`
     *
     * @throws {Error} If dimensions are inconsistent (A's columns ≠ b's length)
     *
     * @remarks
     * Performs matrix-vector multiplication where each element `c[i]` is the dot product
     * of row `i` from A and vector b:
     *
     * ```
     * c[i] = Σ(A[i][k] * b[k]) for k = 0 to n-1
     * ```
     *
     * This is equivalent to `mmult(A, [[b[0]], [b[1]], ...])` but more efficient.
     *
     * Time complexity: O(m × n)
     *
     * @example
     * ```typescript
     * const A = [[1, 2, 3], [4, 5, 6]];  // 2x3
     * const b = [7, 8, 9];                // 3x1
     * const c = Utils.mvmult(A, b);
     * // Result: [50, 122]
     * // Because: [1*7 + 2*8 + 3*9, 4*7 + 5*8 + 6*9]
     * ```
     */
    export function mvmult(A: number[][], b: number[]): number[] {
        if (A.length > 0 && b.length > 0 && A[0].length === b.length) {
            const output = tensor([A.length], () => {
                return 0;
            }) as number[];
            for (let row = 0; row < output.length; row++) {
                output[row] = dotProduct(A[row], b);
            }
            return output;
        } else {
            throw new Error("Inconsistent matrix dimensions in multiplication");
        }
    }

    /**
     * Computes the dot product of two vectors.
     *
     * @param a - First vector `[n]`
     * @param b - Second vector `[n]`
     * @returns Scalar dot product `Σ(a[i] * b[i])`
     *
     * @throws {Error} If vectors have different lengths
     *
     * @remarks
     * The dot product (also called inner product or scalar product) is defined as:
     *
     * ```
     * a · b = Σ(a[i] * b[i]) for i = 0 to n-1
     * ```
     *
     * Time complexity: O(n)
     *
     * @example
     * ```typescript
     * const a = [1, 2, 3];
     * const b = [4, 5, 6];
     * const result = Utils.dotProduct(a, b);
     * // Result: 32 (because 1*4 + 2*5 + 3*6 = 32)
     *
     * // Orthogonal vectors (perpendicular) have dot product of 0
     * const x = [1, 0];
     * const y = [0, 1];
     * Utils.dotProduct(x, y);  // 0
     * ```
     */
    export function dotProduct(a: number[], b: number[]): number {
        if (a.length === b.length) {
            let output: number = 0;
            for (let i = 0; i < a.length; i++) output = output + a[i] * b[i];
            return output;
        } else {
            throw new Error("Inconsistent matrix dimensions in multiplication");
        }
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

    /**
     * Computes the Moore-Penrose pseudo-inverse of a matrix.
     *
     * @param A - Input matrix `[m][n]`
     * @returns Pseudo-inverse matrix `[n][m]`
     *
     * @remarks
     * The pseudo-inverse (denoted A⁺) generalizes the matrix inverse to non-square matrices.
     * It satisfies:
     * - `A * A⁺ * A = A`
     * - `A⁺ * A * A⁺ = A⁺`
     * - `(A * A⁺)ᵀ = A * A⁺`
     * - `(A⁺ * A)ᵀ = A⁺ * A`
     *
     * For full-rank matrices:
     * - If m ≥ n (tall): `A⁺ = (AᵀA)⁻¹Aᵀ`
     * - If m < n (wide): `A⁺ = Aᵀ(AAᵀ)⁻¹`
     *
     * Uses the ml-matrix library's SVD-based implementation for numerical stability.
     *
     * @example
     * ```typescript
     * // Least squares solution
     * const A = [[1, 2], [3, 4], [5, 6]];  // 3x2 (overdetermined)
     * const Ap = Utils.pseudoInverse(A);    // 2x3
     * // Can solve Ax = b approximately using x = A⁺b
     *
     * // For square invertible matrices, A⁺ = A⁻¹
     * const I = [[1, 0], [0, 1]];
     * const Ip = Utils.pseudoInverse(I);
     * // Ip equals I (identity is its own pseudo-inverse)
     * ```
     */
    export function pseudoInverse(A: number[][]): number[][] {
        return Matrix.pseudoInverse(A).to2DArray() as number[][];
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
