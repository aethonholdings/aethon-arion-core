import { RandomStreamFactory } from "./random-stream-factory.class";
import { SimulationConfig, OrgModelConfig, StepOutput } from "../interfaces/core.interfaces";
import { Organisation } from "./organisation.class";
import { Logger } from "./logger.class";
import { Observable } from "rxjs";

/**
 * Top-level simulation orchestrator that runs multi-agent organisational simulations over time.
 *
 * @remarks
 * The Simulation class manages the temporal execution of an organisation's state transitions
 * across a specified time period. It converts real-world time (days) into discrete clock ticks
 * and provides an Observable stream for monitoring simulation progress.
 *
 * **Time Conversion:**
 *
 * Real time is discretized into clock ticks based on the configured tick duration:
 * ```
 * clockTicks = (days × 8 hours × 3600 seconds) / clockTickSeconds
 * ```
 *
 * For example, with `clockTickSeconds = 0.1` (100ms ticks):
 * - 1 work day (8 hours) = 288,000 ticks
 * - 30 days = 8,640,000 ticks
 *
 * **Observable Pattern:**
 *
 * The simulation emits {@link StepOutput} objects for each clock tick, enabling:
 * - Real-time monitoring and visualization
 * - Streaming data to databases or files
 * - Early termination based on convergence criteria
 * - Progress reporting for long-running simulations
 *
 * **Usage Pattern:**
 *
 * ```typescript
 * const simulation = new Simulation(config, logger, randomFactory, organisation);
 *
 * simulation.run$().subscribe({
 *   next: (step) => {
 *     console.log(`Tick ${step.clockTick}: ${step.organisation.getStateArray()}`);
 *     // Save to database, check convergence, update UI, etc.
 *   },
 *   complete: () => {
 *     console.log('Simulation complete');
 *   }
 * });
 * ```
 *
 * @public
 */
export class Simulation {
    protected name: string = "Simulation";
    protected config: SimulationConfig;
    protected orgModelConfig: OrgModelConfig;
    protected randomStreamFactory: RandomStreamFactory;
    protected logger: Logger;
    protected clockTicks: number;
    protected organisation: Organisation;

    /**
     * Creates a new Simulation with the specified configuration.
     *
     * @param simConfig - Complete simulation configuration (duration, org config, etc.)
     * @param logger - Observable logging system
     * @param randomStreamFactory - Factory for generating reproducible random streams
     * @param organisation - Organisation instance to simulate
     *
     * @remarks
     * The constructor calculates the total number of clock ticks based on:
     * - `simConfig.days`: Number of work days to simulate
     * - `simConfig.orgConfig.clockTickSeconds`: Duration of each tick in seconds
     *
     * **Clock Tick Calculation:**
     * ```
     * clockTicks = (days × 8 hours/day × 3600 seconds/hour) / clockTickSeconds
     * ```
     *
     * This assumes an 8-hour work day. To simulate a 30-day period with 0.1-second ticks:
     * ```
     * clockTicks = (30 × 8 × 3600) / 0.1 = 8,640,000 ticks
     * ```
     *
     * @example
     * ```typescript
     * const config: SimulationConfig = {
     *   days: 30,
     *   orgConfig: {
     *     clockTickSeconds: 0.1,
     *     // ... other org configuration
     *   }
     * };
     *
     * const simulation = new Simulation(
     *   config,
     *   logger,
     *   randomStreamFactory,
     *   organisation
     * );
     * ```
     */
    constructor(
        simConfig: SimulationConfig,
        logger: Logger,
        randomStreamFactory: RandomStreamFactory,
        organisation: Organisation
    ) {
        this.logger = logger;
        this._log(`Initialising Simulation`);
        this.orgModelConfig = simConfig.orgConfig;
        this.randomStreamFactory = randomStreamFactory;
        this.config = simConfig;
        this.clockTicks = (this.config.days * 8 * 60 * 60) / this.orgModelConfig.clockTickSeconds;
        this.organisation = organisation;
        this._log(`Simulation initialised`);
    }

    /**
     * Runs the simulation and returns an Observable stream of time steps.
     *
     * @returns Observable emitting {@link StepOutput} for each clock tick
     *
     * @remarks
     * This method executes the simulation loop, transitioning the organisation's state
     * for each clock tick and emitting the results as an observable stream.
     *
     * **Execution Flow:**
     *
     * For each tick from 0 to `clockTicks - 1`:
     * 1. Call `organisation.transitionState()`
     * 2. Emit `{ clockTick, organisation }` to subscribers
     * 3. Continue until all ticks complete
     * 4. Call `subscriber.complete()`
     *
     * **Observable Characteristics:**
     *
     * - **Synchronous**: All ticks execute immediately when subscribed
     * - **Cold Observable**: Starts execution only when subscribed
     * - **Single emission per tick**: One StepOutput object per clock tick
     * - **Completes automatically**: After all ticks are executed
     *
     * **Use Cases:**
     *
     * ```typescript
     * // Real-time monitoring
     * simulation.run$().subscribe(step => {
     *   console.log(`Progress: ${step.clockTick}/${totalTicks}`);
     *   updateUI(step.organisation.getStateArray());
     * });
     *
     * // Save to database
     * simulation.run$()
     *   .pipe(bufferCount(1000))  // Batch for efficiency
     *   .subscribe(batch => database.saveBatch(batch));
     *
     * // Early termination on convergence
     * simulation.run$()
     *   .pipe(takeUntil(convergenceDetected$))
     *   .subscribe(step => analyzeStep(step));
     *
     * // Collect complete trajectory
     * const trajectory: StepOutput[] = [];
     * simulation.run$().subscribe({
     *   next: step => trajectory.push(step),
     *   complete: () => console.log(`Collected ${trajectory.length} steps`)
     * });
     * ```
     *
     * @example
     * ```typescript
     * const simulation = new Simulation(config, logger, randomFactory, org);
     *
     * simulation.run$().subscribe({
     *   next: (step) => {
     *     console.log(`Tick ${step.clockTick}`);
     *     console.log(`State: ${step.organisation.getStateArray()}`);
     *   },
     *   error: (err) => console.error('Simulation error:', err),
     *   complete: () => console.log('Simulation complete')
     * });
     * ```
     */
    run$(): Observable<StepOutput> {
        this._log(`Running simulation for ${this.clockTicks} clock ticks`);
        const stepOutput$ = new Observable<StepOutput>((subscriber) => {
            for (let tick: number = 0; tick < this.clockTicks; tick++) {
                this._log(`Beginning clock tick ${tick}`, { clockTick: tick });
                this.organisation.transitionState();
                this._log(`Completed clock tick ${tick}`, { clockTick: tick });
                subscriber.next({ clockTick: tick, organisation: this.organisation });
            }
            subscriber.complete();
        });
        return stepOutput$;
    }

    /**
     * Logs a trace-level diagnostic message.
     *
     * @param message - Message content
     * @param data - Optional structured data to include
     *
     * @internal
     */
    private _log(message: string, data?: any): void {
        this.logger.trace({
            sourceObject: this.name,
            message: message,
            data: data
        });
    }
}
