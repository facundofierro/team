import { z } from 'zod'
import type { ToolTypeDefinition } from '../tools'

const BASE_URL =
  process.env.BROWSER_SERVICE_URL || 'http://browser-service:4000'

export const WebBrowserSessionParameters = z.object({
  action: z.enum(['start', 'run', 'close']),
  sessionId: z.string().optional(),
  task: z.string().optional(),
  openaiApiKey: z.string().optional(),
})

export type WebBrowserSessionParameters = z.infer<
  typeof WebBrowserSessionParameters
>

export const WebBrowserSessionResult = z.object({
  success: z.boolean(),
  sessionId: z.string().optional(),
  output: z.any().optional(),
  error: z.string().optional(),
})

export type WebBrowserSessionResult = z.infer<typeof WebBrowserSessionResult>

export const webBrowserSession: ToolTypeDefinition = {
  id: 'webBrowserSession',
  type: 'webBrowserSession',
  description:
    'Control a persistent browser session via the browser-service API (start, run, close tasks).',
  canBeManaged: false,
  managedPrice: 0,
  managedPriceDescription: '',
  monthlyUsage: 0,
  isActive: true,
  createdAt: null,
  allowedUsage: 0,
  allowedTimeStart: '',
  allowedTimeEnd: '',
  configurationParams: {},
  parametersSchema: WebBrowserSessionParameters,
  resultSchema: WebBrowserSessionResult,
  handler: async (params: unknown) => {
    // WebBrowserSession tool is temporarily disabled due to build compatibility issues
    return {
      success: false,
      error:
        'WebBrowserSession tool is temporarily disabled due to build compatibility issues. Please use alternative methods for web automation.',
    }
  },
}

export default webBrowserSession
