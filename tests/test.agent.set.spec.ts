import { AgentSet } from "../src/classes/class.agent.set";
import { Logger } from "../src/classes/class.logger";
import { StaticRandomStream } from "../src/classes/class.random.stream";
import { SimulationConfig } from "../src/interfaces/interfaces";
import { TestStateA, TestStateB, testTargets, testx, testy } from "./init/test.init.model";

export function runAgentSetTest(
    description: string,
    simConfig: SimulationConfig,
    result: number[][][],
    verbose: boolean = false,
    clockTickSeconds?: number
) {
    describe(description, () => {
        let agentSet: AgentSet;
        let initialPriorityTensor: number[][][] = [];
        let priorityTensor: number[][][] = [];

        beforeAll(() => {
            clockTickSeconds
                ? (simConfig.orgConfig.clockTickSeconds = clockTickSeconds)
                : simConfig.orgConfig.clockTickSeconds;
            verbose ? spyOn(console, "log").and.callThrough() : spyOn(console, "log").and.stub();
        });

        it("can initialise an agent set", () => {
            agentSet = new AgentSet(
                simConfig.orgConfig.agentSet,
                [new TestStateA(), new TestStateB()],
                new StaticRandomStream(1),
                new Logger(),
                simConfig.orgConfig.clockTickSeconds
            );
            initialPriorityTensor = JSON.parse(JSON.stringify(agentSet.getTensors().priorityTensor));
            expect(agentSet).not.toBeNull();
        });
        it("can transition agent states", () => {
            agentSet.transitionState();
        });
        it("can recalculate params", () => {
            agentSet.recalculateParams(testTargets, testx, testy);
            expect(agentSet).not.toBeNull();
        });
        it("calculates consistent dPs", () => {
            for (let alpha = 0; alpha < agentSet.getAgentCount(); alpha++) {
                for (let sigma = 0; sigma < agentSet.getStateCount(); sigma++) {
                    let totalDelta = 0;
                    for (let tau = 0; tau < agentSet.getStateCount(); tau++) {
                        totalDelta += agentSet.getDeltaP()[alpha][sigma][tau];
                    }
                    expect(totalDelta).toBeCloseTo(0);
                }
            }
        });
        it("generates a regular priority tensor", () => {
            for (let alpha = 0; alpha < agentSet.getAgentCount(); alpha++) {
                for (let sigma = 0; sigma < agentSet.getStateCount(); sigma++) {
                    let total = 0;
                    for (let tau = 0; tau < agentSet.getStateCount(); tau++) {
                        total += agentSet.getTensors().priorityTensor[alpha][sigma][tau];
                        expect(agentSet.getTensors().priorityTensor[alpha][sigma][tau]).toBeGreaterThanOrEqual(0);
                        expect(agentSet.getTensors().priorityTensor[alpha][sigma][tau]).toBeLessThanOrEqual(1);
                    }
                    expect(total).toBe(1);
                }
            }
        });
        it("can transition and recalculate params 10 times in a row", () => {
            for (let i = 0; i < 10; i++) {
                agentSet.transitionState();
                agentSet.emitControlInputTensor();
                const updatedAgentSet = agentSet.recalculateParams(testTargets, testx, testy);
                expect(updatedAgentSet).not.toBeNull();
            }
        });
        it("can transition and recalculate params 1000 times in a row", () => {
            for (let i = 0; i < 1000; i++) {
                agentSet.transitionState();
                agentSet.recalculateParams(testTargets, testx, testy);
            }
            priorityTensor = agentSet.getTensors().priorityTensor;
            expect(agentSet).not.toBeNull();
            expect(priorityTensor).toEqual(result);
        });
    });
}
