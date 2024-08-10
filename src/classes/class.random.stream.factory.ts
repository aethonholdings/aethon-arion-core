import { RandomStream, StaticRandomStream, DynamicRandomStream } from "./class.random.stream";

export class RandomStreamFactory {
    streams: RandomStream[] = [];
    private seeds: number[];
    private seedIndex: number;
    private type: "static" | "random";

    constructor(seeds?: number[]) {
        if (seeds) {
            this.seeds = seeds;
            this.type = "static";
        } else {
            this.seeds = [];
            this.type = "random";
        }
        this.seedIndex = 0;
    }

    newStream(): RandomStream {
        let stream: RandomStream;
        switch (this.type) {
            case "static": {
                stream = new StaticRandomStream(this.seeds[this.seedIndex++]);
                if (this.seedIndex === this.seeds.length) this.seedIndex = 0;
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
