import { RandomStream, StaticRandomStream, DynamicRandomStream, mixSeed } from "./random-stream.class";

/**
 * Creates the random streams used by one simulation run (one per stochastic component, e.g. agent set and plant).
 *
 * @remarks
 * Three modes:
 * - `new RandomStreamFactory()`: non-reproducible streams (`Math.random`)
 * - `RandomStreamFactory.seeded(...keys)`: reproducible streams derived from integer keys, e.g.
 *   `(simConfigId, runIndex)`. Stream k is seeded from a hash of the keys and k, so streams within a run and across
 *   runs are unrelated. This is the recommended mode for distributed Monte Carlo runs.
 * - `new RandomStreamFactory(seeds)`: reproducible streams taking seeds from the list in order (legacy). The list is
 *   reused cyclically once exhausted, so create one factory per run.
 */
export class RandomStreamFactory {
    streams: RandomStream[] = [];
    private seeds: number[];
    private seedIndex: number;
    private type: "static" | "random" | "derived";
    private baseSeed: number;

    constructor(seeds?: number[]) {
        if (seeds && seeds.length > 0) {
            this.seeds = seeds;
            this.type = "static";
        } else {
            this.seeds = [];
            this.type = "random";
        }
        this.seedIndex = 0;
        this.baseSeed = 0;
    }

    /**
     * Reproducible factory whose streams are derived from the given integer keys.
     */
    static seeded(...keys: number[]): RandomStreamFactory {
        const factory = new RandomStreamFactory();
        factory.type = "derived";
        factory.baseSeed = keys.reduce((acc: number, key: number) => mixSeed(acc ^ mixSeed(Math.floor(key))), 0);
        return factory;
    }

    getType(): "static" | "random" | "derived" {
        return this.type;
    }

    newStream(): RandomStream {
        let stream: RandomStream;
        switch (this.type) {
            case "static": {
                stream = new StaticRandomStream(this.seeds[this.seedIndex++]);
                if (this.seedIndex === this.seeds.length) this.seedIndex = 0;
                break;
            }
            case "derived": {
                stream = new StaticRandomStream(mixSeed(this.baseSeed ^ mixSeed(this.streams.length + 1)));
                break;
            }
            default: {
                stream = new DynamicRandomStream();
                break;
            }
        }
        this.streams.push(stream);
        return stream;
    }
}
