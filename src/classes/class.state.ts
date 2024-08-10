export abstract class State {
    constructor(params?: any) {}
    abstract emit(params?: any): number[];
}
