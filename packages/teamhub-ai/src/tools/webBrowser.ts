import { z } from 'zod'
import type { ToolTypeDefinition } from '../tools'

// webBrowser tool disabled due to Playwright build issues

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
    // WebBrowser tool is temporarily disabled due to Playwright build issues
    throw new Error(
      'WebBrowser tool is temporarily disabled due to build compatibility issues. Please use alternative methods for web automation.'
    )
  },
}

export default webBrowser
