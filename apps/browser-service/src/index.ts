import express, { Request, Response } from 'express'
import { chromium, Browser, Page } from 'playwright'
import { auto } from 'auto-playwright/dist/auto'
import { v4 as uuidv4 } from 'uuid'
import { log } from '@repo/logger'

const app = express()
const PORT = 4000

app.use(express.json())

// In-memory session store
interface Session {
  browser: Browser
  page: Page
}
const sessions: Record<string, Session> = {}

// Start a new session
app.post('/session', (req, res) => {
  log.browserService.main.info('Starting new browser session', undefined, {
    timestamp: new Date().toISOString(),
  })

  chromium
    .launch({ headless: true })
    .then((browser) =>
      browser.newPage().then((page) => {
        const sessionId = uuidv4()
        sessions[sessionId] = { browser, page }

        log.browserService.automation.info(
          'Browser session created successfully',
          undefined,
          {
            sessionId,
            browserType: 'chromium',
            headless: true,
          }
        )

        res.json({ sessionId })
      })
    )
    .catch((error) => {
      log.browserService.automation.error(
        'Failed to create browser session',
        undefined,
        {
          error: (error as Error).message,
          stack: (error as Error).stack,
        }
      )
      res.status(500).json({ error: (error as Error).message })
    })
})

// Run a task in a session
app.post('/session/:id/task', (req: Request, res: Response) => {
  const sessionId = req.params.id
  const { task, openaiApiKey } = req.body
  const session = sessions[sessionId]

  if (!session) {
    log.browserService.automation.warn(
      'Session not found for task execution',
      undefined,
      {
        sessionId,
        requestedTask: task,
      }
    )
    return res.status(404).json({ error: 'Session not found' })
  }

  log.browserService.automation.info(
    'Executing task in browser session',
    undefined,
    {
      sessionId,
      task,
      hasOpenAiKey: !!openaiApiKey,
    }
  )

  auto(task, { page: session.page as any }, { openaiApiKey })
    .then((output) => {
      log.browserService.automation.info(
        'Task completed successfully',
        undefined,
        {
          sessionId,
          task,
          outputType: typeof output,
        }
      )
      res.json({ success: true, output })
    })
    .catch((error) => {
      log.browserService.automation.error('Task execution failed', undefined, {
        sessionId,
        task,
        error: (error as Error).message,
        stack: (error as Error).stack,
      })
      res.status(500).json({ success: false, error: (error as Error).message })
    })
})

// Close a session
app.delete('/session/:id', (req: Request, res: Response) => {
  const sessionId = req.params.id
  const session = sessions[sessionId]

  if (!session) {
    log.browserService.automation.warn(
      'Session not found for deletion',
      undefined,
      {
        sessionId,
      }
    )
    return res.status(404).json({ error: 'Session not found' })
  }

  log.browserService.automation.info('Closing browser session', undefined, {
    sessionId,
  })

  session.browser
    .close()
    .then(() => {
      delete sessions[sessionId]
      log.browserService.automation.info(
        'Browser session closed successfully',
        undefined,
        {
          sessionId,
          activeSessionsCount: Object.keys(sessions).length,
        }
      )
      res.json({ success: true })
    })
    .catch((error) => {
      log.browserService.automation.error(
        'Failed to close browser session',
        undefined,
        {
          sessionId,
          error: (error as Error).message,
          stack: (error as Error).stack,
        }
      )
      res.status(500).json({ success: false, error: (error as Error).message })
    })
})

app.get('/', (req, res) => {
  log.browserService.main.info('Health check endpoint accessed', undefined, {
    timestamp: new Date().toISOString(),
    activeSessionsCount: Object.keys(sessions).length,
  })
  res.send('Browser Session Service is running!')
})

app.listen(PORT, () => {
  log.browserService.main.info('Browser Session Service started', undefined, {
    port: PORT,
    timestamp: new Date().toISOString(),
  })
})
