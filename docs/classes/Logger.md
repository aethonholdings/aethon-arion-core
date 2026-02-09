[**aethon-arion-core**](../README.md) • **Docs**

***

[aethon-arion-core](../globals.md) / Logger

# Class: Logger

Observable-based logging system for simulation diagnostics and monitoring.

## Remarks

The Logger class provides a reactive logging interface using RxJS Observables.
Log messages are broadcast through an observable stream that can be subscribed to
for real-time monitoring, filtering, and persistence.

**Key Features:**
- Multiple log levels: trace, info, warning, error
- Observable stream for reactive log handling
- Structured log messages with timestamps and source attribution
- Automatic error throwing for error-level logs

**Usage Pattern:**
```typescript
const logger = new Logger();

// Subscribe to log stream
logger.getObservable$().subscribe((logLine) => {
  console.log(`[${logLine.type}] ${logLine.message.message}`);
});

// Log messages
logger.info({ sourceObject: "Simulation", message: "Started" });
logger.warning({ sourceObject: "Agent", message: "Saturation detected" });
```

## Constructors

### new Logger()

> **new Logger**(): [`Logger`](Logger.md)

Creates a new Logger instance with an observable log stream.

#### Returns

[`Logger`](Logger.md)

#### Remarks

The logger initializes with a null broadcast subscriber. The subscriber is
set when the observable is subscribed to. Log messages sent before the
first subscription are silently dropped (not buffered).

#### Example

```typescript
const logger = new Logger();

// Subscribe to receive logs
const subscription = logger.getObservable$().subscribe({
  next: (log) => console.log(log),
  error: (err) => console.error(err),
  complete: () => console.log("Logger closed")
});

// Later: unsubscribe to stop receiving logs
subscription.unsubscribe();
```

#### Defined in

[classes/logger.class.ts:65](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/logger.class.ts#L65)

## Methods

### error()

> **error**(`message`): `void`

Logs an error message and throws an Error.

#### Parameters

• **message**: `LogMessage`

Message object containing source and content

#### Returns

`void`

#### Throws

Always throws with the message content

#### Remarks

Error-level logs indicate critical failures that prevent normal operation.
This method broadcasts the error message, then throws an Error, halting execution.

Use this for unrecoverable errors like:
- Invalid tensor dimensions
- Consistency check failures
- Resource initialization failures

#### Example

```typescript
try {
  if (priorityTensor.length === 0) {
    logger.error({
      sourceObject: "AgentSet",
      message: "Invalid priority tensor dimensions",
      data: { shape: priorityTensor.length }
    });
  }
} catch (err) {
  console.error("Fatal error:", err.message);
}
```

#### Defined in

[classes/logger.class.ts:197](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/logger.class.ts#L197)

***

### getObservable$()

> **getObservable$**(): `Observable`\<[`LogLine`](../interfaces/LogLine.md)\>

Returns the observable stream for subscribing to log messages.

#### Returns

`Observable`\<[`LogLine`](../interfaces/LogLine.md)\>

Observable that emits [LogLine](../interfaces/LogLine.md) objects

#### Remarks

Multiple subscribers can listen to the same logger. Each subscriber
receives all log messages emitted after their subscription.

#### Example

```typescript
const logger = new Logger();

// File logger
logger.getObservable$()
  .pipe(filter(log => log.type === 'error'))
  .subscribe(log => fs.appendFileSync('errors.log', JSON.stringify(log)));

// Console logger
logger.getObservable$()
  .subscribe(log => console.log(`[${log.timeStamp}] ${log.type}: ${log.message.message}`));
```

#### Defined in

[classes/logger.class.ts:94](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/logger.class.ts#L94)

***

### info()

> **info**(`message`): [`LogLine`](../interfaces/LogLine.md)

Logs an informational message.

#### Parameters

• **message**: `LogMessage`

Message object containing source and content

#### Returns

[`LogLine`](../interfaces/LogLine.md)

The formatted log line that was broadcast

#### Remarks

Use info-level logs for general operational information, state transitions,
and successful operations.

#### Example

```typescript
logger.info({
  sourceObject: "Organisation",
  message: "State transition completed",
  data: { clockTick: 42, agentCount: 10 }
});
```

#### Defined in

[classes/logger.class.ts:117](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/logger.class.ts#L117)

***

### trace()

> **trace**(`message`): `null` \| [`LogLine`](../interfaces/LogLine.md)

Logs a trace-level diagnostic message.

#### Parameters

• **message**: `LogMessage`

Message object containing source and content

#### Returns

`null` \| [`LogLine`](../interfaces/LogLine.md)

The formatted log line that was broadcast, or null if no subscribers

#### Remarks

Use trace-level logs for detailed diagnostic information during development
and debugging. Trace logs are typically filtered out in production.

#### Example

```typescript
logger.trace({
  sourceObject: "AgentSet",
  message: "Recalculating priority tensor",
  data: { alpha: 0, sigma: 1, deltaP: 0.025 }
});
```

#### Defined in

[classes/logger.class.ts:140](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/logger.class.ts#L140)

***

### warning()

> **warning**(`message`): [`LogLine`](../interfaces/LogLine.md)

Logs a warning message for non-critical issues.

#### Parameters

• **message**: `LogMessage`

Message object containing source and content

#### Returns

[`LogLine`](../interfaces/LogLine.md)

The formatted log line that was broadcast

#### Remarks

Use warnings for recoverable issues, unexpected but handled conditions,
and potential problems that don't prevent normal operation.

#### Example

```typescript
logger.warning({
  sourceObject: "AgentSet",
  message: "Priority tensor saturation detected, tensor was regularised",
  data: { agent: 5, state: 2 }
});
```

#### Defined in

[classes/logger.class.ts:163](https://github.com/aethonholdings/aethon-arion-core/blob/414bb030049a6abc8a30c71711eb4fb731848e17/src/classes/logger.class.ts#L163)
