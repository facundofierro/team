import express, { Request, Response } from 'express'
import { chromium, Browser, Page } from 'playwright'
import { auto } from 'auto-playwright/dist/auto'
import { v4 as uuidv4 } from 'uuid'

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
app.post('/session', (req: Request, res: Response) => {
  chromium
    .launch({ headless: true })
    .then((browser) =>
      browser.newPage().then((page) => {
        const sessionId = uuidv4()
        sessions[sessionId] = { browser, page }
        res.json({ sessionId })
      })
    )
    .catch((error) => {
      res.status(500).json({ error: (error as Error).message })
    })
})

// Run a task in a session
app.post('/session/:id/task', (req: Request, res: Response) => {
  const sessionId = req.params.id
  const { task, openaiApiKey } = req.body
  const session = sessions[sessionId]
  if (!session) {
    return res.status(404).json({ error: 'Session not found' })
  }
  auto(task, { page: session.page as any }, { openaiApiKey })
    .then((output) => {
      res.json({ success: true, output })
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: (error as Error).message })
    })
})

// Close a session
app.delete('/session/:id', (req: Request, res: Response) => {
  const sessionId = req.params.id
  const session = sessions[sessionId]
  if (!session) {
    return res.status(404).json({ error: 'Session not found' })
  }
  session.browser
    .close()
    .then(() => {
      delete sessions[sessionId]
      res.json({ success: true })
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: (error as Error).message })
    })
})

app.get('/', (req: Request, res: Response) => {
  res.send('Browser Session Service is running!')
})

app.listen(PORT, () => {
  console.log(`Browser Session Service listening on port ${PORT}`)
})
