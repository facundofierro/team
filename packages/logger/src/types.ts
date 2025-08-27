// Logger type definitions for the entire monorepo

export type LogLevel = 'ERROR' | 'INFO' | 'DEBUG' | 'OFF'

export interface LogTypeConfig {
  level: LogLevel
}

export interface LogConfig {
  enabled: boolean
  types: Record<string, LogTypeConfig>
}

// User-specific logging configuration
export type UserLogConfig = {
  userId: string
  logType: string
  logLevel: LogLevel
}

// Logger function signature
export type LoggerFunction = (
  message: string,
  userId?: string,
  data?: any
) => void

// Logger object for a specific type
export interface TypeLogger {
  error: LoggerFunction
  info: LoggerFunction
  debug: LoggerFunction
  off: LoggerFunction
}

// Main logger structure types
export interface TolLoggers {
  db: TypeLogger
  dbFunction: TypeLogger
  core: TypeLogger
  zoho: TypeLogger
  payment: TypeLogger
  student: TypeLogger
  register: TypeLogger
  correction: TypeLogger
  user: TypeLogger
  teacher: TypeLogger
  schedule: TypeLogger
  notification: TypeLogger
  wallet: TypeLogger
}

export interface KadielLoggers {
  pay: TypeLogger
  kucoin: TypeLogger
  ton: TypeLogger
}

export interface ApiLoggers {
  facebook: TypeLogger
  instagram: TypeLogger
  telegram: TypeLogger
  vk: TypeLogger
}

export interface BotLoggers {
  main: TypeLogger
  function: TypeLogger
  lesson: TypeLogger
  user: TypeLogger
  correction: TypeLogger
}

export interface SiteLoggers {
  main: TypeLogger
  auth: TypeLogger
  payment: TypeLogger
  user: TypeLogger
}

export interface TolAppLoggers {
  main: TypeLogger
  function: TypeLogger
  user: TypeLogger
  teacher: TypeLogger
}

export interface SystemLoggers {
  main: TypeLogger
  startup: TypeLogger
  error: TypeLogger
  performance: TypeLogger
}

// Main logger interface
export interface Logger {
  // TOL Package Loggers (from @tol/* packages)
  tol: TolLoggers

  // Kadiel Package Loggers (from @repo/kadiel-* packages)
  kadiel: KadielLoggers

  // API Package Loggers (from @repo/api-* packages)
  api: ApiLoggers

  // App Loggers (from apps/*)
  bot: BotLoggers
  site: SiteLoggers
  tolApp: TolAppLoggers
  market: TypeLogger
  cron: TypeLogger
  remotion: TypeLogger

  // System Loggers
  system: SystemLoggers

  // Legacy compatibility - these will be deprecated but maintained
  db: TypeLogger // Alias for tol.db
  dbFunction: TypeLogger // Alias for tol.dbFunction
  dbCorrection: TypeLogger // Alias for tol.correction
  user: TypeLogger // Alias for tol.user
  student: TypeLogger // Alias for tol.student
  register: TypeLogger // Alias for tol.register
  telegram: TypeLogger // Alias for api.telegram
  startup: TypeLogger // Alias for system.startup
  general: TypeLogger // Alias for system.main
}
