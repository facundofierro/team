// Unified logging system for the entire monorepo
// Supports typed logging with pattern: log.{type}.{level}(message, userId?, data?)

// Export types for external use
export * from './types'

// Export configuration helpers
export { getDefaultConfig } from './config'
export { getLogLevel, parseUserLogConfig } from './utils'

// Create and export the main logger instance
import {
  createLogger,
  configureLogger,
  quietLogs,
  enableLogs,
  createLegacyFunctions,
} from './logic'

export const log = createLogger()

// Export configuration functions
export { configureLogger, quietLogs, enableLogs }

// Export backward compatibility functions
export const {
  logInfo,
  logSuccess,
  logWarning,
  logError,
  logDebug,
  logStartup,
  logTelegram,
  log_legacy,
} = createLegacyFunctions(log)
