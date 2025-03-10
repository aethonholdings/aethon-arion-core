export abstract class State {
    constructor() {}
    abstract emit(params?: any): number[];
}
