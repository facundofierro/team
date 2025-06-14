import { z } from 'zod'
import type { ToolTypeDefinition } from '../tools'

const BASE_URL = 'http://browser-service:4000'

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
    const { action, sessionId, task, openaiApiKey } =
      WebBrowserSessionParameters.parse(params)
    try {
      if (action === 'start') {
        const resp = await fetch(`${BASE_URL}/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await resp.json()
        if (resp.ok && data.sessionId) {
          return { success: true, sessionId: data.sessionId }
        } else {
          return {
            success: false,
            error: data.error || 'Failed to start session',
          }
        }
      } else if (action === 'run') {
        if (!sessionId || !task)
          return {
            success: false,
            error: 'sessionId and task are required for run',
          }
        const resp = await fetch(`${BASE_URL}/session/${sessionId}/task`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task, openaiApiKey }),
        })
        const data = await resp.json()
        if (resp.ok) {
          return { success: true, output: data.output }
        } else {
          return {
            success: false,
            error: data.error || data.message || 'Task failed',
          }
        }
      } else if (action === 'close') {
        if (!sessionId)
          return { success: false, error: 'sessionId is required for close' }
        const resp = await fetch(`${BASE_URL}/session/${sessionId}`, {
          method: 'DELETE',
        })
        const data = await resp.json()
        if (resp.ok) {
          return { success: true }
        } else {
          return {
            success: false,
            error: data.error || 'Failed to close session',
          }
        }
      } else {
        return { success: false, error: 'Unknown action' }
      }
    } catch (error: any) {
      return { success: false, error: error?.message || String(error) }
    }
  },
}

export default webBrowserSession
