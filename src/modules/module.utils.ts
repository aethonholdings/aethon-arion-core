import * as Matrix from "ml-matrix"; // https://www.npmjs.com/package/ml-matrix
import type { Tensor } from "../types/types";
export type { Tensor } from "../types/types";

export namespace Utils {
    export function tensor(dataOrShape: Tensor, initialiser?: (x?: number, y?: number) => number): Tensor {
        let output = [];
        if (!initialiser) {
            const data = dataOrShape;
            output = data;
        } else {
            const shape = dataOrShape as number[];
            let nestArray: number[] = JSON.parse(JSON.stringify(shape));
            if (shape.length > 1) nestArray.splice(0, 1);
            for (let i = 0; i < shape[0]; i++) {
                shape.length == 1 ? output.push(initialiser()) : output.push(tensor(nestArray, initialiser));
            }
        }
        return output as Tensor;
    }

    export function shape(tensor: Tensor): number[] {
        return nest(tensor, undefined, (x) => {
            return x.length;
        });
    }

    export function transposeMatrix(matrix: number[][]): number[][] {
        if ((matrix[0].length > 0, matrix.length > 0)) {
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

    export function mmult(A: number[][], B: number[][]): number[][] {
        if (A[0].length === B.length && A.length > 0 && B.length > 0) {
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

    export function mvmult(A: number[][], b: number[]): number[] {
        if (A[0].length === b.length && A.length > 0 && b.length > 0) {
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

    export function dotProduct(a: number[], b: number[]): number {
        if (a.length === b.length) {
            let output: number = 0;
            for (let i = 0; i < a.length; i++) output = output + a[i] * b[i];
            return output;
        } else {
            throw new Error("Inconsistent matrix dimensions in multiplication");
        }
    }

    export function modulo(a: Tensor, depth?: number): number {
        let sumSq = 0;
        const shp: number[] = shape(a);
        if (!depth) depth = shp.length;
        for (let i = 0; i < shp[0]; i++) {
            if (depth > 1) {
                const nested = a[i] as Tensor;
                sumSq = sumSq + modulo(nested, depth - 1);
            } else {
                const nested = a[i] as number;
                sumSq = sumSq + nested * nested;
            }
        }
        return Math.sqrt(sumSq);
    }

    export function pseudoInverse(A: number[][]): number[][] {
        return Matrix.pseudoInverse(A).to2DArray() as number[][];
    }
}

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
