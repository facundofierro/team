// Logger implementation logic for the entire monorepo

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
  const levelPriority = { ERROR: 0, INFO: 1, DEBUG: 2, OFF: -1 }
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
  info: (message: string, userId?: string, data?: any) =>
    coreLog('INFO', type, message, userId, data),
  debug: (message: string, userId?: string, data?: any) =>
    coreLog('DEBUG', type, message, userId, data),
  off: (message: string, userId?: string, data?: any) =>
    coreLog('OFF', type, message, userId, data),
})

// Main typed logger object organized by source
export const createLogger = (): Logger => ({
  // TOL Package Loggers (from @tol/* packages)
  tol: {
    db: createTypeLogger('tol-db'),
    dbFunction: createTypeLogger('tol-db-function'),
    core: createTypeLogger('tol-core'),
    zoho: createTypeLogger('tol-zoho'),
    payment: createTypeLogger('tol-payment'),
    student: createTypeLogger('tol-student'),
    register: createTypeLogger('tol-register'),
    correction: createTypeLogger('tol-correction'),
    user: createTypeLogger('tol-user'),
    teacher: createTypeLogger('tol-teacher'),
    schedule: createTypeLogger('tol-schedule'),
    notification: createTypeLogger('tol-notification'),
    wallet: createTypeLogger('tol-wallet'),
  },

  // Kadiel Package Loggers (from @repo/kadiel-* packages)
  kadiel: {
    pay: createTypeLogger('kadiel-pay'),
    kucoin: createTypeLogger('kadiel-kucoin'),
    ton: createTypeLogger('kadiel-ton'),
  },

  // API Package Loggers (from @repo/api-* packages)
  api: {
    facebook: createTypeLogger('api-facebook'),
    instagram: createTypeLogger('api-instagram'),
    telegram: createTypeLogger('api-telegram'),
    vk: createTypeLogger('api-vk'),
  },

  // App Loggers (from apps/*)
  bot: {
    main: createTypeLogger('bot'),
    function: createTypeLogger('bot-function'),
    lesson: createTypeLogger('bot-lesson'),
    user: createTypeLogger('bot-user'),
    correction: createTypeLogger('bot-correction'),
  },

  site: {
    main: createTypeLogger('site'),
    auth: createTypeLogger('site-auth'),
    payment: createTypeLogger('site-payment'),
    user: createTypeLogger('site-user'),
  },

  tolApp: {
    main: createTypeLogger('tol-app'),
    function: createTypeLogger('tol-app-function'),
    user: createTypeLogger('tol-app-user'),
    teacher: createTypeLogger('tol-app-teacher'),
  },

  market: createTypeLogger('market'),
  cron: createTypeLogger('cron'),
  remotion: createTypeLogger('remotion'),

  // System Loggers
  system: {
    main: createTypeLogger('system'),
    startup: createTypeLogger('system-startup'),
    error: createTypeLogger('system-error'),
    performance: createTypeLogger('system-performance'),
  },

  // Legacy compatibility - these will be deprecated but maintained
  db: createTypeLogger('db'), // Alias for tol.db
  dbFunction: createTypeLogger('db-function'), // Alias for tol.dbFunction
  dbCorrection: createTypeLogger('correction'), // Alias for tol.correction
  user: createTypeLogger('user'), // Alias for tol.user
  student: createTypeLogger('student'), // Alias for tol.student
  register: createTypeLogger('register'), // Alias for tol.register
  telegram: createTypeLogger('telegram'), // Alias for api.telegram
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
    log.api.telegram.info(args.join(' '))
  },

  log_legacy: (...args: unknown[]): void => {
    log.system.main.info(args.join(' '))
  },
})
