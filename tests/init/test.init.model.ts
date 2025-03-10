import { State } from "../../src/classes/state.class";
import { Targets } from "../../src/interfaces/core.interfaces";

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
