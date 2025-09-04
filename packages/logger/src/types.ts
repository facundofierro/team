// Logger type definitions for the TeamHub monorepo

export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'OFF'

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
  warn: LoggerFunction
  info: LoggerFunction
  debug: LoggerFunction
  off: LoggerFunction
}

// Main logger structure types for Agelum Apps
export interface AgelumLoggers {
  main: TypeLogger
  auth: TypeLogger
  api: TypeLogger
  ui: TypeLogger
  agent: TypeLogger
  chat: TypeLogger
  memory: TypeLogger
}

export interface AiGatewayLoggers {
  main: TypeLogger
  provider: TypeLogger
  request: TypeLogger
}

export interface BrowserServiceLoggers {
  main: TypeLogger
  automation: TypeLogger
}

// Main logger structure types for Agelum Packages
export interface AgelumDbLoggers {
  main: TypeLogger
  schema: TypeLogger
  query: TypeLogger
  migration: TypeLogger
}

export interface AgelumAiLoggers {
  main: TypeLogger
  agent: TypeLogger
  tool: TypeLogger
  memory: TypeLogger
}

export interface AiServicesLoggers {
  main: TypeLogger
  provider: TypeLogger
  discovery: TypeLogger
  generation: TypeLogger
}

export interface DrizzleReactiveLoggers {
  main: TypeLogger
  client: TypeLogger
  server: TypeLogger
  trpc: TypeLogger
}

export interface SystemLoggers {
  main: TypeLogger
  startup: TypeLogger
  error: TypeLogger
  performance: TypeLogger
  auth: TypeLogger
  database: TypeLogger
  api: TypeLogger
}

// Main logger interface
export interface Logger {
  // Agelum Apps Loggers
  agelum: AgelumLoggers
  aiGateway: AiGatewayLoggers
  browserService: BrowserServiceLoggers

  // Agelum Packages Loggers
  agelumDb: AgelumDbLoggers
  agelumAi: AgelumAiLoggers
  aiServices: AiServicesLoggers
  drizzleReactive: DrizzleReactiveLoggers

  // System Loggers
  system: SystemLoggers

  // Legacy compatibility - these will be deprecated but maintained
  db: TypeLogger // Alias for agelumDb.main
  'db-query': TypeLogger // Alias for agelumDb.query
  ai: TypeLogger // Alias for agelumAi.main
  auth: TypeLogger // Alias for system.auth
  api: TypeLogger // Alias for system.api
  startup: TypeLogger // Alias for system.startup
  general: TypeLogger // Alias for system.main
}
