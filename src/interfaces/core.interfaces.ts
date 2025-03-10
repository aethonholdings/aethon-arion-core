import type { LogType, Tensor } from "../types/core.types";
import { Plant } from "../classes/plant.class";
import { RandomStream } from "../classes/random-stream.class";
import { Reporting } from "../classes/reporting.class";
import { Board } from "../classes/board.class";
import { AgentSet } from "../classes/agent-set.class";
import { Organisation } from "../classes/organisation.class";

// CONFIG ---------------------------------

export interface OrgModelConfig {
    type: string;
    clockTickSeconds: number;
    board: BoardConfig;
    agentSet: AgentSetTensors;
    plant: PlantConfig;
    reporting: ReportingConfig;
}

export interface SimulationConfig {
    days: number;
    randomStreamType: "static" | "random";
    orgConfig: OrgModelConfig;
}

export interface BoardConfig {}

export interface PlantConfig {}

export interface ReportingConfig {}

// MODEL PARAM COLLECTIONS ---------------------------------

export interface AgentSetTensors {
    priorityTensor: Tensor;
    influenceTensor: Tensor;
    judgmentTensor: Tensor;
    incentiveTensor: Tensor;
}

export interface OrgParameters {
    agentSet: AgentSet;
    board: Board;
    plant: Plant;
    reporting: Reporting;
    randomStream: RandomStream;
}

export interface Targets {
    plantState: number[];
    reporting: number[];
}

// SIMULATION ---------------------------------

export interface StepOutput {
    clockTick: number;
    organisation: Organisation;
}

export interface LogMessage {
    sourceObject: string;
    message: string;
    data?: any;
}

export interface LogLine {
    type: LogType;
    timeStamp: number;
    message: LogMessage;
}
