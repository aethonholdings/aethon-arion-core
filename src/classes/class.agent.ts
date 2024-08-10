import { State } from "./class.state";

export class Agent {
    protected name: string = "Agent";
    protected stateIndex: number;
    private states: State[]

    constructor(initialStateIndex: number, states: State[]) {
        this.stateIndex = initialStateIndex;
        this.states = states;
    }

    getStateIndex(): number {
        return this.stateIndex;
    }

    setStateIndex(stateIndex: number): void {
        this.stateIndex = stateIndex;
    }

    transitionState(stateIndex: number): number {
        this.stateIndex = stateIndex;
        return this.stateIndex;
    }

    emitWorkstationControlTensor(): number[] {
        return this.states[this.stateIndex].emit();
    }
}
