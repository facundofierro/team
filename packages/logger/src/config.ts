// Logger configuration for the entire monorepo
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
      // TOL Package Log Types (from @tol/* packages)
      'tol-db': { level: getLogLevel('LOG_TOL_DB', 'ERROR') },
      'tol-db-function': { level: getLogLevel('LOG_TOL_DB_FUNCTION', 'INFO') },
      'tol-core': { level: getLogLevel('LOG_TOL_CORE', 'ERROR') },
      'tol-zoho': { level: getLogLevel('LOG_TOL_ZOHO', 'ERROR') },
      'tol-payment': { level: getLogLevel('LOG_TOL_PAYMENT', 'ERROR') },
      'tol-student': { level: getLogLevel('LOG_TOL_STUDENT', 'ERROR') },
      'tol-register': { level: getLogLevel('LOG_TOL_REGISTER', 'ERROR') },
      'tol-correction': { level: getLogLevel('LOG_TOL_CORRECTION', 'ERROR') },
      'tol-user': { level: getLogLevel('LOG_TOL_USER', 'ERROR') },
      'tol-teacher': { level: getLogLevel('LOG_TOL_TEACHER', 'ERROR') },
      'tol-schedule': { level: getLogLevel('LOG_TOL_SCHEDULE', 'ERROR') },
      'tol-notification': {
        level: getLogLevel('LOG_TOL_NOTIFICATION', 'ERROR'),
      },
      'tol-wallet': { level: getLogLevel('LOG_TOL_WALLET', 'ERROR') },

      // Kadiel Package Log Types (from @repo/kadiel-* packages)
      'kadiel-pay': { level: getLogLevel('LOG_KADIEL_PAY', 'ERROR') },
      'kadiel-kucoin': { level: getLogLevel('LOG_KADIEL_KUCOIN', 'ERROR') },
      'kadiel-ton': { level: getLogLevel('LOG_KADIEL_TON', 'ERROR') },

      // API Package Log Types (from @repo/api-* packages)
      'api-facebook': { level: getLogLevel('LOG_API_FACEBOOK', 'ERROR') },
      'api-instagram': { level: getLogLevel('LOG_API_INSTAGRAM', 'ERROR') },
      'api-telegram': { level: getLogLevel('LOG_API_TELEGRAM', 'ERROR') },
      'api-vk': { level: getLogLevel('LOG_API_VK', 'ERROR') },

      // App Log Types (from apps/*)
      bot: { level: getLogLevel('LOG_BOT', 'ERROR') },
      'bot-function': { level: getLogLevel('LOG_BOT_FUNCTION', 'INFO') },
      'bot-lesson': { level: getLogLevel('LOG_BOT_LESSON', 'ERROR') },
      'bot-user': { level: getLogLevel('LOG_BOT_USER', 'ERROR') },
      'bot-correction': { level: getLogLevel('LOG_BOT_CORRECTION', 'ERROR') },

      site: { level: getLogLevel('LOG_SITE', 'ERROR') },
      'site-auth': { level: getLogLevel('LOG_SITE_AUTH', 'ERROR') },
      'site-payment': { level: getLogLevel('LOG_SITE_PAYMENT', 'ERROR') },
      'site-user': { level: getLogLevel('LOG_SITE_USER', 'ERROR') },

      'tol-app': { level: getLogLevel('LOG_TOL_APP', 'ERROR') },
      'tol-app-function': {
        level: getLogLevel('LOG_TOL_APP_FUNCTION', 'INFO'),
      },
      'tol-app-user': { level: getLogLevel('LOG_TOL_APP_USER', 'ERROR') },
      'tol-app-teacher': { level: getLogLevel('LOG_TOL_APP_TEACHER', 'ERROR') },

      market: { level: getLogLevel('LOG_MARKET', 'ERROR') },
      cron: { level: getLogLevel('LOG_CRON', 'ERROR') },
      remotion: { level: getLogLevel('LOG_REMOTION', 'ERROR') },

      // General/System Log Types
      system: { level: getLogLevel('LOG_SYSTEM', 'ERROR') },
      'system-startup': { level: getLogLevel('LOG_SYSTEM_STARTUP', 'INFO') },
      'system-error': { level: getLogLevel('LOG_SYSTEM_ERROR', 'ERROR') },
      'system-performance': {
        level: getLogLevel('LOG_SYSTEM_PERFORMANCE', 'ERROR'),
      },

      // Legacy/Compatibility Log Types (for backward compatibility)
      db: { level: getLogLevel('LOG_DB', 'ERROR') }, // Alias for tol-db
      'db-function': { level: getLogLevel('LOG_DB_FUNCTION', 'INFO') }, // Alias for tol-db-function
      correction: { level: getLogLevel('LOG_CORRECTION', 'ERROR') }, // Alias for tol-correction
      user: { level: getLogLevel('LOG_USER', 'ERROR') }, // Alias for tol-user
      student: { level: getLogLevel('LOG_STUDENT', 'ERROR') }, // Alias for tol-student
      register: { level: getLogLevel('LOG_REGISTER', 'ERROR') }, // Alias for tol-register
      telegram: { level: getLogLevel('LOG_TELEGRAM', 'ERROR') }, // Alias for api-telegram
      startup: { level: getLogLevel('LOG_STARTUP', 'INFO') }, // Alias for system-startup
      general: { level: getLogLevel('LOG_GENERAL', 'ERROR') }, // Alias for system
    },
  }
}
