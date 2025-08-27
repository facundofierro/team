# @repo/logger

Unified logging system for the entire monorepo with organized, typed logging by source.

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

// TOL packages
log.tol.db.info('Database operation completed', 'user123')
log.tol.zoho.error('API call failed', 'user456', { error: 'timeout' })

// Kadiel packages
log.kadiel.pay.info('Payment processed', 'user789')
log.kadiel.ton.debug('Transaction details', 'user101', { amount: 100 })

// API packages
log.api.telegram.info('Message received', 'user202')

// Apps
log.bot.function.info('Bot function called', 'user303')
log.site.auth.info('User logged in', 'user404')
```

### Log Levels

- `ERROR` - Only critical errors
- `INFO` - Essential information (default for most types)
- `DEBUG` - Detailed debugging information
- `OFF` - No logging for this type

### Environment Configuration

Control log levels via environment variables:

```bash
# TOL packages
LOG_TOL_DB=INFO
LOG_TOL_ZOHO=DEBUG

# Kadiel packages
LOG_KADIEL_PAY=INFO
LOG_KADIEL_TON=ERROR

# Apps
LOG_BOT_FUNCTION=DEBUG
LOG_SITE_AUTH=INFO

# Global control
QUIET_LOGS=true  # Disable all logging
```

### User-Specific Logging

Enable detailed logging for specific users:

```bash
# Format: userId:logType:logLevel,userId2:logType2:logLevel2
USER_LOG_CONFIG="user123:tol-db:DEBUG,user456:kadiel-pay:INFO"
```

## Adding New Log Types

To add a new log type, you only need to modify **one file**: `config.ts`

### Step 1: Add to config.ts

```typescript
// In config.ts, add to the types object:
types: {
  // ... existing types ...

  // New package/app
  'new-package': { level: getLogLevel('LOG_NEW_PACKAGE', 'ERROR') },
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
