/**
 * Abstract source of uniformly distributed pseudo-random numbers in [0, 1).
 */
export abstract class RandomStream {
    constructor() {}

    abstract next(): number;
}

/**
 * Non-reproducible stream backed by `Math.random`.
 */
export class DynamicRandomStream extends RandomStream {
    constructor() {
        super();
    }

    next(): number {
        return Math.random();
    }
}

/**
 * 32-bit integer mixing function (the splitmix32 / murmur3 finaliser). Maps nearby or structured integer inputs to
 * statistically unrelated outputs, so that consecutive seeds produce unrelated streams.
 */
export function mixSeed(value: number): number {
    let z = (value >>> 0) + 0x9e3779b9;
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35);
    return (z ^ (z >>> 16)) >>> 0;
}

/**
 * Reproducible stream (mulberry32 generator, period 2^32) seeded through {@link mixSeed}.
 *
 * @remarks
 * Replaces the previous `sin(seed++)` construction, under which the stream for seed s + 1 was the stream for seed s
 * shifted by one draw, so consecutive seeds gave overlapping sequences.
 */
export class StaticRandomStream extends RandomStream {
    private state: number;

    constructor(seed: number) {
        super();
        this.state = mixSeed(Math.floor(seed));
    }

    next(): number {
        this.state = (this.state + 0x6d2b79f5) >>> 0;
        let t = this.state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}
