# Example: Adding a New Log Type

This example shows how to add a new log type for a hypothetical "analytics" package.

## Step 1: Add to config.ts (ONLY THIS FILE NEEDS TO CHANGE!)

```typescript
// In packages/logger/src/config.ts, add to the types object:

types: {
  // ... existing types ...

  // Analytics Package Log Types (NEW!)
  'analytics': { level: getLogLevel('LOG_ANALYTICS', 'ERROR') },
  'analytics-tracking': { level: getLogLevel('LOG_ANALYTICS_TRACKING', 'INFO') },
  'analytics-events': { level: getLogLevel('LOG_ANALYTICS_EVENTS', 'DEBUG') },
}
```

## Step 2: Add to types.ts (if it's a new category)

```typescript
// In packages/logger/src/types.ts, add new interface:

export interface AnalyticsLoggers {
  main: TypeLogger
  tracking: TypeLogger
  events: TypeLogger
}

// Update the main Logger interface:
export interface Logger {
  // ... existing loggers ...

  // Analytics Package Loggers (NEW!)
  analytics: AnalyticsLoggers
}
```

## Step 3: Add to logic.ts (if it's a new category)

```typescript
// In packages/logger/src/logic.ts, add to createLogger function:

export const createLogger = (): Logger => ({
  // ... existing loggers ...

  // Analytics Package Loggers (NEW!)
  analytics: {
    main: createTypeLogger('analytics'),
    tracking: createTypeLogger('analytics-tracking'),
    events: createTypeLogger('analytics-events'),
  },
})
```

## Step 4: Use in your code immediately!

```typescript
import { log } from '@repo/logger'

// Analytics logging
log.analytics.main.info('Analytics service started', 'user123')
log.analytics.tracking.debug('User action tracked', 'user456', {
  action: 'click',
  page: '/home',
})
log.analytics.events.error('Event processing failed', 'user789', {
  eventId: 'evt_123',
  error: 'timeout',
})
```

## Environment Configuration

```bash
# Control analytics logging levels
LOG_ANALYTICS=INFO
LOG_ANALYTICS_TRACKING=DEBUG
LOG_ANALYTICS_EVENTS=ERROR

# User-specific analytics logging
USER_LOG_CONFIG="user123:analytics:DEBUG,user456:analytics-tracking:INFO"
```

## Summary

**Before refactoring**: Had to modify 2+ files to add new log types
**After refactoring**: Only need to modify `config.ts` for simple additions!

The new structure makes it incredibly easy to add new logging capabilities while maintaining clean separation of concerns.
