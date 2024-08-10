import type { LogType, Tensor } from "../types/types";
import { Plant } from "../classes/class.plant";
import { RandomStream } from "../classes/class.random.stream";
import { Reporting } from "../classes/class.reporting";
import { Board } from "../classes/class.board";
import { AgentSet } from "../classes/class.agent.set";
import { Organisation } from "../classes/class.organisation";

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