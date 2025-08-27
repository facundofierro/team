// Logger utilities: helpers for env-driven configuration and user overrides

import { LogLevel, UserLogConfig } from './types'

// Helper function to get log level from environment variable
export const getLogLevel = (
  envVarName: string,
  defaultLevel: LogLevel = 'ERROR'
): LogLevel => {
  const value = process.env[envVarName]?.toUpperCase()
  if (value && ['ERROR', 'INFO', 'DEBUG', 'OFF'].includes(value)) {
    return value as LogLevel
  }
  return defaultLevel
}

// Parse user-specific log config from environment variable
// Format: USER_LOG_CONFIG=userId1:logType:DEBUG,userId2:db:ERROR
export const parseUserLogConfig = (): UserLogConfig[] => {
  const configStr = process.env.USER_LOG_CONFIG
  if (!configStr) return []

  return configStr
    .split(',')
    .map((config) => {
      const [userId, logType, logLevel] = config.split(':')
      return {
        userId: userId?.trim(),
        logType: logType?.trim(),
        logLevel: (logLevel?.trim().toUpperCase() || 'DEBUG') as LogLevel,
      }
    })
    .filter((config) => config.userId && config.logType)
}
