// Logger type definitions for the TeamHub monorepo

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

// Main logger structure types for TeamHub Apps
export interface TeamHubLoggers {
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

// Main logger structure types for TeamHub Packages
export interface TeamHubDbLoggers {
  main: TypeLogger
  schema: TypeLogger
  query: TypeLogger
  migration: TypeLogger
}

export interface TeamHubAiLoggers {
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
  // TeamHub Apps Loggers
  teamhub: TeamHubLoggers
  aiGateway: AiGatewayLoggers
  browserService: BrowserServiceLoggers

  // TeamHub Packages Loggers
  teamhubDb: TeamHubDbLoggers
  teamhubAi: TeamHubAiLoggers
  aiServices: AiServicesLoggers
  drizzleReactive: DrizzleReactiveLoggers

  // System Loggers
  system: SystemLoggers

  // Legacy compatibility - these will be deprecated but maintained
  db: TypeLogger // Alias for teamhubDb.main
  'db-query': TypeLogger // Alias for teamhubDb.query
  ai: TypeLogger // Alias for teamhubAi.main
  auth: TypeLogger // Alias for system.auth
  api: TypeLogger // Alias for system.api
  startup: TypeLogger // Alias for system.startup
  general: TypeLogger // Alias for system.main
}
