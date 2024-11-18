export abstract class RandomStream {
    constructor() {}
    abstract next(): number;
}

export class DynamicRandomStream extends RandomStream {
    constructor() {
        super();
    }
    next(): number {
        return Math.random();
    }
}

export class StaticRandomStream extends RandomStream {
    private seed: number;

    constructor(seed: number) {
        super();
        this.seed = seed;
    }

    next(): number {
        const x = Math.sin(this.seed++) * 10000;
        const rand = x - Math.floor(x);
        return rand;
    }
}
