import { log, configureLogger, quietLogs, enableLogs } from '..'

jest.spyOn(global.console, 'log')

describe('@repo/logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    enableLogs() // Ensure logs are enabled for tests
  })

  describe('typed logging by source', () => {
    it('supports tol.db.info pattern for TOL packages', () => {
      log.tol.db.info('Database operation completed', 'user123')
      expect(console.log).toBeCalledWith(
        '(tol-db) Database operation completed [user123]'
      )
    })

    it('supports tol.dbFunction.error pattern for TOL packages', () => {
      log.tol.dbFunction.error('Database connection failed', 'user456')
      expect(console.log).toBeCalledWith(
        '(tol-db-function) Database connection failed [user456]'
      )
    })

    it('supports kadiel.pay.info pattern for Kadiel packages', () => {
      log.kadiel.pay.info('Payment processed', 'user789')
      expect(console.log).toBeCalledWith(
        '(kadiel-pay) Payment processed [user789]'
      )
    })

    it('supports api.telegram.info pattern for API packages', () => {
      log.api.telegram.info('Message received', 'user101')
      expect(console.log).toBeCalledWith(
        '(api-telegram) Message received [user101]'
      )
    })

    it('supports bot.function.info pattern for apps', () => {
      log.bot.function.info('Bot function called', 'user202')
      expect(console.log).toBeCalledWith(
        '(bot-function) Bot function called [user202]'
      )
    })

    it('supports system.startup.info pattern for system logs', () => {
      log.system.startup.info('Service started successfully', 'user303')
      expect(console.log).toBeCalledWith(
        '(system-startup) Service started successfully [user303]'
      )
    })
  })

  describe('legacy compatibility', () => {
    it('maintains backward compatibility with legacy log.db pattern', () => {
      log.db.info('Legacy db log', 'user123')
      expect(console.log).toBeCalledWith('(db) Legacy db log [user123]')
    })

    it('maintains backward compatibility with legacy log.correction pattern', () => {
      log.correction.info('Legacy correction log', 'user456')
      expect(console.log).toBeCalledWith(
        '(correction) Legacy correction log [user456]'
      )
    })

    it('maintains backward compatibility with legacy log.user pattern', () => {
      log.user.info('Legacy user log', 'user789')
      expect(console.log).toBeCalledWith('(user) Legacy user log [user789]')
    })
  })

  describe('log level filtering', () => {
    it('respects ERROR level - only shows errors', () => {
      configureLogger({
        types: {
          'tol-db': { level: 'ERROR' },
        },
      })

      log.tol.db.info('This should not show', 'user123')
      log.tol.db.error('This should show', 'user123')
      log.tol.db.debug('This should not show', 'user123')

      expect(console.log).toBeCalledTimes(1)
      expect(console.log).toBeCalledWith('(tol-db) This should show [user123]')
    })

    it('respects INFO level - shows info and errors', () => {
      configureLogger({
        types: {
          'kadiel-pay': { level: 'INFO' },
        },
      })

      log.kadiel.pay.info('This should show', 'user123')
      log.kadiel.pay.error('This should show', 'user123')
      log.kadiel.pay.debug('This should not show', 'user123')

      expect(console.log).toBeCalledTimes(2)
    })

    it('respects DEBUG level - shows all levels', () => {
      configureLogger({
        types: {
          'bot-function': { level: 'DEBUG' },
        },
      })

      log.bot.function.info('This should show', 'user123')
      log.bot.function.error('This should show', 'user123')
      log.bot.function.debug('This should show', 'user123')

      expect(console.log).toBeCalledTimes(3)
    })

    it('respects OFF level - shows nothing', () => {
      configureLogger({
        types: {
          'api-telegram': { level: 'OFF' },
        },
      })

      log.api.telegram.info('This should not show', 'user123')
      log.api.telegram.error('This should not show', 'user123')
      log.api.telegram.debug('This should not show', 'user123')

      expect(console.log).not.toBeCalled()
    })
  })

  describe('global controls', () => {
    it('can be completely disabled with quietLogs', () => {
      quietLogs()

      log.tol.db.info('This should not show', 'user123')
      expect(console.log).not.toBeCalled()
    })

    it('can be re-enabled with enableLogs', () => {
      quietLogs()
      enableLogs()

      log.tol.db.info('This should show', 'user123')
      expect(console.log).toBeCalledWith('(tol-db) This should show [user123]')
    })
  })

  describe('user-specific logging', () => {
    beforeEach(() => {
      // Set up user-specific config
      process.env.USER_LOG_CONFIG =
        'user123:tol-db:DEBUG,user456:kadiel-pay:ERROR'
    })

    afterEach(() => {
      delete process.env.USER_LOG_CONFIG
    })

    it('respects user-specific log levels for new log types', () => {
      // user123 has DEBUG level for tol-db
      log.tol.db.info('This should show for user123', 'user123')
      log.tol.db.debug('This should show for user123', 'user123')

      // user456 has ERROR level for kadiel-pay
      log.kadiel.pay.info('This should not show for user456', 'user456')
      log.kadiel.pay.error('This should show for user456', 'user456')

      expect(console.log).toBeCalledTimes(3)
    })
  })

  describe('environment variable configuration', () => {
    beforeEach(() => {
      delete process.env.LOG_TOL_DB
    })

    afterEach(() => {
      delete process.env.LOG_TOL_DB
    })

    it('reads log levels from environment variables for new log types', () => {
      process.env.LOG_TOL_DB = 'INFO'

      // Re-import to get fresh config
      jest.resetModules()
      const { log: freshLog } = require('..')

      freshLog.tol.db.info('This should show', 'user123')
      freshLog.tol.db.debug('This should not show', 'user123')

      expect(console.log).toBeCalledTimes(1)
    })
  })

  describe('backward compatibility functions', () => {
    it('logInfo uses system.main logger', () => {
      const { logInfo } = require('..')
      logInfo('Test info message')
      expect(console.log).toBeCalledWith('(system) Test info message')
    })

    it('logError uses system.main logger', () => {
      const { logError } = require('..')
      logError('Test error message')
      expect(console.log).toBeCalledWith('(system) Test error message')
    })

    it('logStartup uses system.startup logger', () => {
      const { logStartup } = require('..')
      logStartup('TestService', 'Test startup message')
      expect(console.log).toBeCalledWith(
        '(system-startup) TestService: Test startup message'
      )
    })

    it('logTelegram uses api.telegram logger', () => {
      const { logTelegram } = require('..')
      logTelegram('Test telegram message')
      expect(console.log).toBeCalledWith('(api-telegram) Test telegram message')
    })
  })
})
