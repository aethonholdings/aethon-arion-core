import { lastValueFrom, toArray } from "rxjs";
import { AgentSet } from "../src/classes/agent-set.class";
import { Board } from "../src/classes/board.class";
import { Logger } from "../src/classes/logger.class";
import { Organisation } from "../src/classes/organisation.class";
import { Plant } from "../src/classes/plant.class";
import { RandomStreamFactory } from "../src/classes/random-stream-factory.class";
import { StaticRandomStream } from "../src/classes/random-stream.class";
import { Reporting } from "../src/classes/reporting.class";
import { Simulation } from "../src/classes/simulation.class";
import { Targets } from "../src/interfaces/core.interfaces";
import { Utils } from "../src/modules/utils.module";
import { TestStateA, TestStateB } from "./init/test.init.model";

// minimal concrete model: plant = AND of agent outputs, reporting counts producing ticks
class TestBoard extends Board {
    transitionState(): Targets {
        return this.plan;
    }
}
class TestPlant extends Plant {
    transitionState(input: number[][]): number[] {
        const x = input.reduce((acc, row) => acc * row[0], 1);
        this.delta = [x - this.stateTensor[0]];
        this.stateTensor = [x];
        return this.stateTensor;
    }
}
class TestReporting extends Reporting {
    transitionState(state: number[]): number[] {
        this.reportingTensor = [this.reportingTensor[0] + state[0]];
        return this.reportingTensor;
    }
}
const tensors = (agents: number, chi = 1, psi = 1) => ({
    priorityTensor: Array.from({ length: agents }, () => [
        [0.9, 0.1],
        [0.9, 0.1]
    ]),
    influenceTensor: Array.from({ length: agents }, () => Array.from({ length: agents }, () => [[0, 0], [0, 0]])),
    judgmentTensor: Array.from({ length: agents }, () => [[Array(chi).fill(0), Array(chi).fill(0)], [Array(chi).fill(0), Array(chi).fill(0)]]),
    incentiveTensor: Array.from({ length: agents }, () => [[Array(psi).fill(0), Array(psi).fill(0)], [Array(psi).fill(0), Array(psi).fill(0)]])
});
const organisation = (plan: Targets, t = tensors(2), plant = [0], reporting = [0]) => {
    const logger = new Logger();
    const agents = new AgentSet(t as any, [new TestStateA(), new TestStateB()], new StaticRandomStream(1), logger, 1);
    return new Organisation(new TestBoard(plan, logger), agents, new TestPlant(plant, logger), new TestReporting(reporting, logger), logger);
};

describe("Core base classes", () => {
    it("builds a consistent organisation and steps it", () => {
        const o = organisation({ plantState: [1], reporting: [0] });
        o.transitionState();
        expect(o.getClockTick()).toBe(1);
        expect(o.getStateArray().length).toBe(2 + 1 + 1);
    });

    it("rejects inconsistent plant, reporting and tensor dimensions", () => {
        expect(() => organisation({ plantState: [1, 1], reporting: [0] })).toThrow(); // plan chi != plant chi
        expect(() => organisation({ plantState: [1], reporting: [0, 0] })).toThrow(); // plan psi != reporting psi
        expect(() => organisation({ plantState: [1, 1], reporting: [0] }, tensors(2, 2), [0, 0])).not.toThrow();
        expect(() => organisation({ plantState: [1], reporting: [0] }, tensors(2, 1, 2))).toThrow(); // incentive psi
    });

    it("rejects a non-integer or empty simulation horizon", () => {
        const o = organisation({ plantState: [1], reporting: [0] });
        const sim = (days: number, tick: number) =>
            new Simulation({ days, randomStreamType: "static", orgConfig: { clockTickSeconds: tick } as any }, new Logger(), new RandomStreamFactory(), o);
        expect(() => sim(1, 7)).toThrow();
        expect(() => sim(0, 300)).toThrow();
        expect(sim(1, 300).getClockTicks()).toBe(96);
    });

    it("emits one step per clock tick and exposes the organisation", async () => {
        const o = organisation({ plantState: [1], reporting: [0] });
        const s = new Simulation({ days: 1, randomStreamType: "static", orgConfig: { clockTickSeconds: 3600 } as any }, new Logger(), new RandomStreamFactory(), o);
        const steps = await lastValueFrom(s.run$().pipe(toArray()));
        expect(steps.map((x) => x.clockTick)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
        expect(s.getOrganisation()).toBe(o);
        expect(o.getClockTick()).toBe(8);
    });

    it("copies the initial plant and reporting vectors", () => {
        const plant = [0], reporting = [0];
        const o = organisation({ plantState: [1], reporting: [0] }, tensors(2), plant, reporting);
        o.transitionState();
        expect(plant).toEqual([0]);
        expect(reporting).toEqual([0]);
    });
});

describe("Utils", () => {
    it("creates, measures and norms tensors", () => {
        const t = Utils.tensor([2, 3], () => 1) as number[][];
        expect(Utils.shape(t)).toEqual([2, 3]);
        expect(Utils.modulo([[3, 4]])).toBe(5);
        expect(Utils.modulo([1, 2, 2])).toBe(3);
    });
});

describe("RandomStreamFactory modes", () => {
    it("cycles a static seed list and reproduces it", () => {
        const a = new RandomStreamFactory([1, 2]);
        const draws = [a.newStream().next(), a.newStream().next(), a.newStream().next()];
        const b = new RandomStreamFactory([1, 2]);
        expect([b.newStream().next(), b.newStream().next(), b.newStream().next()]).toEqual(draws);
        expect(draws[2]).toBe(draws[0]); // the list is reused cyclically
        expect(a.getType()).toBe("static");
    });

    it("reports its type", () => {
        expect(new RandomStreamFactory().getType()).toBe("random");
        expect(RandomStreamFactory.seeded(1).getType()).toBe("derived");
    });
});
