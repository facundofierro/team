// Logger implementation logic for the TeamHub monorepo

import { LogLevel, LogConfig, UserLogConfig, TypeLogger, Logger } from './types'
import { getDefaultConfig } from './config'
import { parseUserLogConfig } from './utils'

// User-specific configurations
const userConfigs = parseUserLogConfig()

// Get current config
let config = getDefaultConfig()

// Get effective log level for a specific user and type
const getEffectiveLogLevel = (type: string, userId?: string): LogLevel => {
  if (userId) {
    // Check for user-specific configuration
    const userConfig = userConfigs.find(
      (config) => config.userId === userId && config.logType === type
    )
    if (userConfig) {
      return userConfig.logLevel
    }
  }

  // Fallback to global configuration
  const typeConfig = config.types[type]
  return typeConfig ? typeConfig.level : 'ERROR'
}

// Core logging function with level-based filtering
const coreLog = (
  level: LogLevel,
  type: string,
  message: string,
  userId?: string,
  data?: any
): void => {
  if (!config.enabled) return

  const effectiveLevel = getEffectiveLogLevel(type, userId)

  // Check if the current level meets the minimum level for this type
  const levelPriority = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3, OFF: -1 }
  const currentPriority = levelPriority[level]
  const minPriority = levelPriority[effectiveLevel]

  if (currentPriority > minPriority) return

  // Format output based on level
  const userInfo = userId ? ` [${userId}]` : ''
  const typePrefix = `(${type})`

  // console.log('level', level, data)
  if ((level === 'DEBUG' || level === 'OFF') && data !== undefined) {
    console.log(`${typePrefix} ${message}${userInfo}`, data)
  } else {
    console.log(`${typePrefix} ${message}${userInfo}`)
  }
}

// Create a logger for a specific type
const createTypeLogger = (type: string): TypeLogger => ({
  error: (message: string, userId?: string, data?: any) =>
    coreLog('ERROR', type, message, userId, data),
  warn: (message: string, userId?: string, data?: any) =>
    coreLog('WARN', type, message, userId, data),
  info: (message: string, userId?: string, data?: any) =>
    coreLog('INFO', type, message, userId, data),
  debug: (message: string, userId?: string, data?: any) =>
    coreLog('DEBUG', type, message, userId, data),
  off: (message: string, userId?: string, data?: any) =>
    coreLog('OFF', type, message, userId, data),
})

// Main typed logger object organized by source
export const createLogger = (): Logger => ({
  // TeamHub Apps Loggers
  teamhub: {
    main: createTypeLogger('teamhub'),
    auth: createTypeLogger('teamhub-auth'),
    api: createTypeLogger('teamhub-api'),
    ui: createTypeLogger('teamhub-ui'),
    agent: createTypeLogger('teamhub-agent'),
    chat: createTypeLogger('teamhub-chat'),
    memory: createTypeLogger('teamhub-memory'),
  },

  aiGateway: {
    main: createTypeLogger('ai-gateway'),
    provider: createTypeLogger('ai-gateway-provider'),
    request: createTypeLogger('ai-gateway-request'),
  },

  browserService: {
    main: createTypeLogger('browser-service'),
    automation: createTypeLogger('browser-service-automation'),
  },

  // TeamHub Packages Loggers
  teamhubDb: {
    main: createTypeLogger('teamhub-db'),
    schema: createTypeLogger('teamhub-db-schema'),
    query: createTypeLogger('teamhub-db-query'),
    migration: createTypeLogger('teamhub-db-migration'),
  },

  teamhubAi: {
    main: createTypeLogger('teamhub-ai'),
    agent: createTypeLogger('teamhub-ai-agent'),
    tool: createTypeLogger('teamhub-ai-tool'),
    memory: createTypeLogger('teamhub-ai-memory'),
  },

  aiServices: {
    main: createTypeLogger('ai-services'),
    provider: createTypeLogger('ai-services-provider'),
    discovery: createTypeLogger('ai-services-discovery'),
    generation: createTypeLogger('ai-services-generation'),
  },

  drizzleReactive: {
    main: createTypeLogger('drizzle-reactive'),
    client: createTypeLogger('drizzle-reactive-client'),
    server: createTypeLogger('drizzle-reactive-server'),
    trpc: createTypeLogger('drizzle-reactive-trpc'),
  },

  // System Loggers
  system: {
    main: createTypeLogger('system'),
    startup: createTypeLogger('system-startup'),
    error: createTypeLogger('system-error'),
    performance: createTypeLogger('system-performance'),
    auth: createTypeLogger('system-auth'),
    database: createTypeLogger('system-database'),
    api: createTypeLogger('system-api'),
  },

  // Legacy compatibility - these will be deprecated but maintained
  db: createTypeLogger('db'), // Alias for teamhubDb.main
  'db-query': createTypeLogger('db-query'), // Alias for teamhubDb.query
  ai: createTypeLogger('ai'), // Alias for teamhubAi.main
  auth: createTypeLogger('auth'), // Alias for system.auth
  api: createTypeLogger('api'), // Alias for system.api
  startup: createTypeLogger('startup'), // Alias for system.startup
  general: createTypeLogger('general'), // Alias for system.main
})

// Configuration functions
export const configureLogger = (newConfig: Partial<LogConfig>): void => {
  config = { ...config, ...newConfig }
}

export const quietLogs = (): void => {
  config.enabled = false
}

export const enableLogs = (): void => {
  config.enabled = true
}

// Backward compatibility functions
export const createLegacyFunctions = (log: Logger) => ({
  logInfo: (...args: unknown[]): void => {
    log.system.main.info(args.join(' '))
  },

  logSuccess: (...args: unknown[]): void => {
    log.system.main.info(args.join(' '))
  },

  logWarning: (...args: unknown[]): void => {
    log.system.main.info(args.join(' '))
  },

  logError: (...args: unknown[]): void => {
    log.system.main.error(args.join(' '))
  },

  logDebug: (...args: unknown[]): void => {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.VERCEL_ENV === 'local'
    ) {
      log.system.main.debug(args.join(' '))
    }
  },

  logStartup: (service: string, ...args: unknown[]): void => {
    log.system.startup.info(`${service}: ${args.join(' ')}`)
  },

  logTelegram: (...args: unknown[]): void => {
    log.system.api.info(args.join(' '))
  },

  log_legacy: (...args: unknown[]): void => {
    log.system.main.info(args.join(' '))
  },
})
