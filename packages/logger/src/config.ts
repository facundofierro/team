// Logger configuration for the TeamHub monorepo
// Log types are organized by their source (packages and apps)

import { LogLevel, LogConfig } from './types'
import { getLogLevel } from './utils'

// Default config with environment-based log levels
// Organized by source (packages and apps)
export const getDefaultConfig = (): LogConfig => {
  const isQuiet = process.env.QUIET_LOGS === 'true'
  const isConsoleTest =
    process.env.NODE_ENV !== 'production' &&
    (process.argv.some((arg) => arg.includes('console.ts')) ||
      process.argv.some((arg) => arg.includes('test:local')))

  return {
    enabled: !isQuiet && !isConsoleTest,
    types: {
      // Agelum Apps Log Types
      agelum: { level: getLogLevel('LOG_AGELUM', 'INFO') },
      'agelum-auth': { level: getLogLevel('LOG_AGELUM_AUTH', 'INFO') },
      'agelum-api': { level: getLogLevel('LOG_AGELUM_API', 'INFO') },
      'agelum-ui': { level: getLogLevel('LOG_AGELUM_UI', 'INFO') },
      'agelum-agent': { level: getLogLevel('LOG_AGELUM_AGENT', 'INFO') },
      'agelum-chat': { level: getLogLevel('LOG_AGELUM_CHAT', 'INFO') },
      'agelum-memory': { level: getLogLevel('LOG_AGELUM_MEMORY', 'INFO') },

      'ai-gateway': { level: getLogLevel('LOG_AI_GATEWAY', 'INFO') },
      'ai-gateway-provider': {
        level: getLogLevel('LOG_AI_GATEWAY_PROVIDER', 'INFO'),
      },
      'ai-gateway-request': {
        level: getLogLevel('LOG_AI_GATEWAY_REQUEST', 'INFO'),
      },

      'browser-service': { level: getLogLevel('LOG_BROWSER_SERVICE', 'INFO') },
      'browser-service-automation': {
        level: getLogLevel('LOG_BROWSER_SERVICE_AUTOMATION', 'INFO'),
      },

      // Agelum Packages Log Types
      'agelum-db': { level: getLogLevel('LOG_AGELUM_DB', 'INFO') },
      'agelum-db-schema': {
        level: getLogLevel('LOG_AGELUM_DB_SCHEMA', 'INFO'),
      },
      'agelum-db-query': {
        level: getLogLevel('LOG_AGELUM_DB_QUERY', 'INFO'),
      },
      'agelum-db-migration': {
        level: getLogLevel('LOG_AGELUM_DB_MIGRATION', 'INFO'),
      },

      'agelum-ai': { level: getLogLevel('LOG_AGELUM_AI', 'INFO') },
      'agelum-ai-agent': {
        level: getLogLevel('LOG_AGELUM_AI_AGENT', 'INFO'),
      },
      'agelum-ai-tool': { level: getLogLevel('LOG_AGELUM_AI_TOOL', 'INFO') },
      'agelum-ai-memory': {
        level: getLogLevel('LOG_AGELUM_AI_MEMORY', 'INFO'),
      },

      'ai-services': { level: getLogLevel('LOG_AI_SERVICES', 'INFO') },
      'ai-services-provider': {
        level: getLogLevel('LOG_AI_SERVICES_PROVIDER', 'INFO'),
      },
      'ai-services-discovery': {
        level: getLogLevel('LOG_AI_SERVICES_DISCOVERY', 'INFO'),
      },
      'ai-services-generation': {
        level: getLogLevel('LOG_AI_SERVICES_GENERATION', 'INFO'),
      },

      'drizzle-reactive': {
        level: getLogLevel('LOG_DRIZZLE_REACTIVE', 'INFO'),
      },
      'drizzle-reactive-client': {
        level: getLogLevel('LOG_DRIZZLE_REACTIVE_CLIENT', 'INFO'),
      },
      'drizzle-reactive-server': {
        level: getLogLevel('LOG_DRIZZLE_REACTIVE_SERVER', 'INFO'),
      },
      'drizzle-reactive-trpc': {
        level: getLogLevel('LOG_DRIZZLE_REACTIVE_TRPC', 'INFO'),
      },

      // General/System Log Types
      system: { level: getLogLevel('LOG_SYSTEM', 'ERROR') },
      'system-startup': { level: getLogLevel('LOG_SYSTEM_STARTUP', 'INFO') },
      'system-error': { level: getLogLevel('LOG_SYSTEM_ERROR', 'ERROR') },
      'system-performance': {
        level: getLogLevel('LOG_SYSTEM_PERFORMANCE', 'ERROR'),
      },
      'system-auth': { level: getLogLevel('LOG_SYSTEM_AUTH', 'INFO') },
      'system-database': { level: getLogLevel('LOG_SYSTEM_DATABASE', 'INFO') },
      'system-api': { level: getLogLevel('LOG_SYSTEM_API', 'INFO') },

      // Legacy/Compatibility Log Types (for backward compatibility)
      db: { level: getLogLevel('LOG_DB', 'INFO') }, // Alias for agelum-db
      'db-query': { level: getLogLevel('LOG_DB_QUERY', 'INFO') }, // Alias for agelum-db-query
      ai: { level: getLogLevel('LOG_AI', 'INFO') }, // Alias for agelum-ai
      auth: { level: getLogLevel('LOG_AUTH', 'INFO') }, // Alias for system-auth
      api: { level: getLogLevel('LOG_API', 'INFO') }, // Alias for system-api
      startup: { level: getLogLevel('LOG_STARTUP', 'INFO') }, // Alias for system-startup
      general: { level: getLogLevel('LOG_GENERAL', 'ERROR') }, // Alias for system
    },
  }
}
