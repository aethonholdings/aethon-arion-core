/**
 * Tensor types broadly aligned with the [tfjs](https://www.tensorflow.org/js) schema
 */
export type Tensor = number[] | number[][] | number[][][] | number[][][][] | number[][][][][];

/**
 * Log message types aligned with the [tslog](https://tslog.js.org/) schema
 */
export type LogType = "silly" | "trace" | "debug" | "info" | "warn" | "error" | "fatal";
