import { z } from 'zod'
import { chromium, Browser, Page } from 'playwright'
import { auto } from 'auto-playwright/dist/auto'
import type { ToolTypeDefinition } from '../tools'

export const WebBrowserParameters = z.object({
  tasks: z
    .array(z.string().min(1))
    .describe('List of natural language tasks to execute'),
  credentials: z
    .object({
      username: z.string().optional().describe('Username for login'),
      password: z.string().optional().describe('Password for login'),
    })
    .optional()
    .describe('Credentials for login (optional)'),
  headless: z.boolean().default(true).describe('Run browser in headless mode'),
})

export type WebBrowserParameters = z.infer<typeof WebBrowserParameters>

export const WebBrowserResult = z.object({
  results: z
    .array(
      z.object({
        task: z.string().describe('The natural language task'),
        success: z.boolean().describe('Whether the task succeeded'),
        output: z.any().optional().describe('Output from the task'),
        error: z.string().optional().describe('Error message if failed'),
      })
    )
    .describe('Results for each task'),
})

export type WebBrowserResult = z.infer<typeof WebBrowserResult>

export const webBrowser: ToolTypeDefinition = {
  id: 'webBrowser',
  type: 'webBrowser',
  description:
    'Automate browser tasks using Playwright and auto-playwright natural language AI.',
  canBeManaged: false,
  managedPrice: 0,
  managedPriceDescription: '',
  monthlyUsage: 0,
  isActive: true,
  createdAt: null,
  allowedUsage: 0,
  allowedTimeStart: '',
  allowedTimeEnd: '',
  configurationParams: {
    OPENAI_API_KEY: {
      type: 'string',
      description: 'OpenAI API Key',
    },
  },
  parametersSchema: WebBrowserParameters,
  resultSchema: WebBrowserResult,
  handler: async (params: unknown, configuration: Record<string, string>) => {
    const { tasks, credentials, headless } = WebBrowserParameters.parse(params)
    const openaiApiKey =
      configuration.OPENAI_API_KEY || process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      throw new Error(
        'OPENAI_API_KEY is required in configuration or environment'
      )
    }
    const browser: Browser = await chromium.launch({ headless })
    const page: Page = await browser.newPage()
    const results: WebBrowserResult['results'] = []
    try {
      // Optionally, handle login if credentials are provided
      if (credentials?.username && credentials?.password) {
        // You can add a login step here if needed, or let the user specify it in tasks
      }
      for (const task of tasks) {
        try {
          const output = await auto(
            task,
            { page: page as any },
            { openaiApiKey }
          )
          results.push({ task, success: true, output })
        } catch (error: any) {
          results.push({
            task,
            success: false,
            error: error?.message || String(error),
          })
        }
      }
    } finally {
      await browser.close()
    }
    return { results }
  },
}

export default webBrowser
