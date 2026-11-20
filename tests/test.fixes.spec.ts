import { AgentSet } from "../src/classes/agent-set.class";
import { Logger } from "../src/classes/logger.class";
import { StaticRandomStream } from "../src/classes/random-stream.class";
import { RandomStreamFactory } from "../src/classes/random-stream-factory.class";
import { AgentSetTensors, LogLine } from "../src/interfaces/core.interfaces";
import { TestStateA, TestStateB } from "./init/test.init.model";

// one agent, two states, one plant variable, one reporting variable
const tensors = (p: number[][], j: number): AgentSetTensors => ({
    priorityTensor: [p],
    influenceTensor: [[[[0, 0], [0, 0]]]],
    judgmentTensor: [[[[j], [-j]], [[j], [-j]]]],
    incentiveTensor: [[[[0], [0]], [[0], [0]]]]
});
const agentSet = (t: AgentSetTensors, deltaT: number) =>
    new AgentSet(t, [new TestStateA(), new TestStateB()], new StaticRandomStream(1), new Logger(), deltaT);

describe("Core fixes", () => {
    it("applies updates smaller than 5e-5 (no 4-decimal rounding)", () => {
        const a = agentSet(tensors([[0.5, 0.5], [0.5, 0.5]], 1), 1e-4);
        for (let i = 0; i < 1000; i++) a.recalculateParams({ plantState: [0], reporting: [0] }, [0.1], [0]);
        expect(a.getTensors().priorityTensor[0][0][0]).toBeGreaterThan(0.5);
    });

    it("does not make a saturated probability absorbing", () => {
        const a = agentSet(tensors([[0.5, 0.5], [0.5, 0.5]], 1), 1);
        for (let i = 0; i < 50; i++) a.recalculateParams({ plantState: [0], reporting: [0] }, [10], [0]);
        expect(a.getTensors().priorityTensor[0][0][1]).toBeGreaterThan(0);
        expect(a.getTensors().priorityTensor[0][0][1]).toBeLessThan(1e-3);
        for (let i = 0; i < 50; i++) a.recalculateParams({ plantState: [0], reporting: [0] }, [-10], [0]);
        expect(a.getTensors().priorityTensor[0][0][1]).toBeGreaterThan(0.5);
    });

    it("keeps a configured zero transition probability at zero", () => {
        const a = agentSet(tensors([[1, 0], [0.5, 0.5]], 1), 1);
        for (let i = 0; i < 50; i++) a.recalculateParams({ plantState: [0], reporting: [0] }, [-10], [0]);
        expect(a.getTensors().priorityTensor[0][0][1]).toBe(0);
    });

    it("does not mutate the caller's tensors", () => {
        const t = tensors([[0.5, 0.5], [0.5, 0.5]], 1);
        const before = JSON.stringify(t);
        const a = agentSet(t, 1);
        for (let i = 0; i < 10; i++) a.recalculateParams({ plantState: [0], reporting: [0] }, [1], [0]);
        expect(JSON.stringify(t)).toBe(before);
    });

    it("rejects a priority row that is not a probability distribution", () => {
        expect(() => agentSet(tensors([[0.2, 0.2], [0.5, 0.5]], 1), 1)).toThrow();
    });

    it("delivers log lines to every subscriber and does not throw on error", () => {
        const logger = new Logger();
        const a: LogLine[] = [];
        const b: LogLine[] = [];
        logger.getObservable$().subscribe((l) => a.push(l));
        logger.getObservable$().subscribe((l) => b.push(l));
        expect(() => logger.error({ sourceObject: "test", message: "boom" })).not.toThrow();
        logger.info({ sourceObject: "test", message: "info" });
        expect(a.length).toBe(2);
        expect(b.length).toBe(2);
    });

    it("gives unrelated streams for consecutive static seeds", () => {
        const s1 = new StaticRandomStream(1);
        const s2 = new StaticRandomStream(2);
        const x = Array.from({ length: 50 }, () => s1.next());
        const y = Array.from({ length: 50 }, () => s2.next());
        // the old sin(seed++) construction made y equal to x shifted by one
        expect(y.slice(0, 49)).not.toEqual(x.slice(1));
        expect(x.every((v) => v >= 0 && v < 1)).toBe(true);
    });

    it("derives reproducible, distinct streams from keys", () => {
        const draws = (f: RandomStreamFactory) => [f.newStream().next(), f.newStream().next()];
        expect(draws(RandomStreamFactory.seeded(7, 1))).toEqual(draws(RandomStreamFactory.seeded(7, 1)));
        expect(draws(RandomStreamFactory.seeded(7, 1))).not.toEqual(draws(RandomStreamFactory.seeded(7, 2)));
        const f = RandomStreamFactory.seeded(7, 1);
        expect(f.newStream().next()).not.toEqual(f.newStream().next());
    });

    it("measures incentive gaps relative to the target", () => {
        expect(AgentSet.relativeGap(50, 100)).toBe(-0.5);
        expect(AgentSet.relativeGap(150, 100)).toBeCloseTo(1 / 3, 12);
        expect(AgentSet.relativeGap(0, 0)).toBe(0);
        expect(AgentSet.relativeGap(5, 0)).toBe(1);
        expect(AgentSet.relativeGap(0, 100)).toBe(-1);
    });
});
