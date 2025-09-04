# @repo/logger

Unified logging system for the TeamHub monorepo with organized, typed logging by source.

## Structure

The logger is organized into modular files for better maintainability:

- **`types.ts`** - Type definitions only
- **`config.ts`** - Configuration object and helper functions
- **`logic.ts`** - All implementation logic
- **`index.ts`** - Clean exports only

## Usage

### Basic Logging

```typescript
import { log } from '@repo/logger'

// TeamHub Apps
log.agelum.main.info('Application started', 'user123')
log.agelum.auth.info('User logged in', 'user456')
log.agelum.api.info('API request received', 'user789')
log.agelum.agent.info('Agent created', 'user101')
log.agelum.chat.info('Chat message sent', 'user202')
log.agelum.memory.info('Memory stored', 'user303')

// AI Gateway
log.aiGateway.main.info('Gateway initialized', 'user404')
log.aiGateway.provider.info('Provider selected', 'user505')
log.aiGateway.request.info('Request processed', 'user606')

// Browser Service
log.browserService.main.info('Service started', 'user707')
log.browserService.automation.info('Automation completed', 'user808')

// TeamHub Packages
log.agelumDb.main.info('Database connected', 'user909')
log.agelumDb.query.info('Query executed', 'user101')
log.agelumDb.schema.info('Schema updated', 'user202')

log.agelumAi.main.info('AI service ready', 'user303')
log.agelumAi.agent.info('Agent processing', 'user404')
log.agelumAi.tool.info('Tool executed', 'user505')
log.agelumAi.memory.info('Memory retrieved', 'user606')

log.aiServices.main.info('AI services ready', 'user707')
log.aiServices.provider.info('Provider configured', 'user808')
log.aiServices.discovery.info('Model discovered', 'user909')

log.drizzleReactive.main.info('Reactive DB ready', 'user101')
log.drizzleReactive.client.info('Client connected', 'user202')
log.drizzleReactive.server.info('Server started', 'user303')
log.drizzleReactive.trpc.info('tRPC initialized', 'user404')

// System
log.system.main.info('System operational', 'user505')
log.system.startup.info('Startup complete', 'user606')
log.system.auth.info('Authentication check', 'user707')
log.system.database.info('Database status', 'user808')
log.system.api.info('API status', 'user909')
```

### Log Levels

- `ERROR` - Only critical errors
- `WARN` - Warning messages and non-critical issues
- `INFO` - Essential information (default for most types)
- `DEBUG` - Detailed debugging information
- `OFF` - No logging for this type

### Environment Configuration

Control log levels via environment variables:

```bash
# TeamHub Apps
LOG_TEAMHUB=INFO
LOG_TEAMHUB_AUTH=DEBUG
LOG_TEAMHUB_API=INFO
LOG_TEAMHUB_AGENT=WARN
LOG_TEAMHUB_CHAT=INFO
LOG_TEAMHUB_MEMORY=INFO

# AI Gateway
LOG_AI_GATEWAY=INFO
LOG_AI_GATEWAY_PROVIDER=DEBUG
LOG_AI_GATEWAY_REQUEST=INFO

# Browser Service
LOG_BROWSER_SERVICE=INFO
LOG_BROWSER_SERVICE_AUTOMATION=DEBUG

# TeamHub Packages
LOG_TEAMHUB_DB=INFO
LOG_TEAMHUB_DB_QUERY=DEBUG
LOG_TEAMHUB_DB_SCHEMA=INFO
LOG_TEAMHUB_DB_MIGRATION=INFO

LOG_TEAMHUB_AI=INFO
LOG_TEAMHUB_AI_AGENT=DEBUG
LOG_TEAMHUB_AI_TOOL=INFO
LOG_TEAMHUB_AI_MEMORY=INFO

LOG_AI_SERVICES=INFO
LOG_AI_SERVICES_PROVIDER=DEBUG
LOG_AI_SERVICES_DISCOVERY=INFO
LOG_AI_SERVICES_GENERATION=INFO

LOG_DRIZZLE_REACTIVE=INFO
LOG_DRIZZLE_REACTIVE_CLIENT=DEBUG
LOG_DRIZZLE_REACTIVE_SERVER=INFO
LOG_DRIZZLE_REACTIVE_TRPC=INFO

# System
LOG_SYSTEM=ERROR
LOG_SYSTEM_STARTUP=INFO
LOG_SYSTEM_ERROR=ERROR
LOG_SYSTEM_PERFORMANCE=ERROR
LOG_SYSTEM_AUTH=INFO
LOG_SYSTEM_DATABASE=INFO
LOG_SYSTEM_API=INFO

# Global control
QUIET_LOGS=true  # Disable all logging
```

### User-Specific Logging

Enable detailed logging for specific users:

```bash
# Format: userId:logType:logLevel,userId2:logType2:logLevel2
USER_LOG_CONFIG="user123:agelum-auth:DEBUG,user456:agelum-db-query:DEBUG"
```

## Adding New Log Types

To add a new log type, you only need to modify **one file**: `config.ts`

### Step 1: Add to config.ts

```typescript
// In config.ts, add to the types object:
types: {
  // ... existing types ...

  // New package/app
  'new-package': { level: getLogLevel('LOG_NEW_PACKAGE', 'INFO') },
  'new-package-function': { level: getLogLevel('LOG_NEW_PACKAGE_FUNCTION', 'INFO') },
}
```

### Step 2: Add to types.ts (if it's a new category)

```typescript
// In types.ts, add new interface if needed:
export interface NewPackageLoggers {
  main: TypeLogger
  function: TypeLogger
}

// Update the main Logger interface:
export interface Logger {
  // ... existing loggers ...
  newPackage: NewPackageLoggers
}
```

### Step 3: Add to logic.ts

```typescript
// In logic.ts, add to createLogger function:
export const createLogger = (): Logger => ({
  // ... existing loggers ...

  newPackage: {
    main: createTypeLogger('new-package'),
    function: createTypeLogger('new-package-function'),
  },
})
```

### Step 4: Use in your code

```typescript
import { log } from '@repo/logger'

log.newPackage.main.info('Operation started', 'user123')
log.newPackage.function.debug('Function called', 'user456', { params: 'data' })
```

## Benefits of New Structure

1. **Single file to modify** - Add new log types by only editing `config.ts`
2. **Clear separation of concerns** - Types, config, logic, and exports are separate
3. **Easy maintenance** - No need to touch multiple files for simple additions
4. **Type safety** - Full TypeScript support with clear interfaces
5. **Backward compatibility** - Existing code continues to work

## Migration from Old Structure

The new structure maintains full backward compatibility. All existing imports and usage patterns continue to work:

```typescript
// Old way (still works)
import { logInfo, logError } from '@repo/logger'
logInfo('Message')
logError('Error')

// New way (recommended)
import { log } from '@repo/logger'
log.system.main.info('Message')
log.system.main.error('Error')
```
