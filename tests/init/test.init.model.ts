import { Organisation } from "../../src/classes/class.organisation";
import { State } from "../../src/classes/class.state";
import { SimulationConfig, Targets } from "../../src/interfaces/interfaces";
import { Simulation } from "../../src/classes/class.simulation";
import { Logger } from "../../src/classes/class.logger";
import { RandomStreamFactory } from "../../src/classes/class.random.stream.factory";
import { Board } from "../../src/classes/class.board";


// MODEL STATES -------------------------------------

export class TestStateA extends State {
    constructor() {
        super();
    }
    emit(): number[] {
        return [1];
    }
}

export class TestStateB extends State {
    constructor() {
        super();
    }
    emit(): number[] {
        return [0];
    }
}

// TARGETS -------------------------------------
const testTargetx = [1];
const testTargety = [1, 1, 1, 1, 1, 1, 1, 1];

export const testTargets: Targets = {
    plantState: testTargetx,
    reporting: testTargety
};

// PLANT -------------------------------------
export const testx = [0];

// REPORTING -------------------------------------
export const testy = [0, 0, 0, 0, 0, 0, 0, 0];
