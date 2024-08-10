import { runAgentSetTest } from "./test.agent.set.spec";
import { complexC1SimulationConfig, complexC1SimulationConfigResult300, simpleC1SimulationConfig, simpleC1SimulationConfigResult100, simpleC1SimulationConfigResult300 } from "./init/test.init.simconfig";
import { runSimulationTest } from "./test.simulation.spec";
import { loggerTest } from "./test.logger.spec";

loggerTest();

runAgentSetTest(
    "Simple C1 AgentSet, 1 second clock tick",
    simpleC1SimulationConfig,
    simpleC1SimulationConfigResult100,
    false
);
runAgentSetTest(
    "Simple C1 AgentSet, 300 second clock tick",
    simpleC1SimulationConfig,
    simpleC1SimulationConfigResult300,
    false,
    300
);
runAgentSetTest(
    "Complex C1 AgentSet, 300 second clock tick",
    complexC1SimulationConfig,
    complexC1SimulationConfigResult300,
    false,
    300
);
runSimulationTest("Simple C1 Simulation", simpleC1SimulationConfig, true);
