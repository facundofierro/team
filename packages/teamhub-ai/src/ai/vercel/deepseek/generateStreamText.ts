import { Message as VercelMessage, streamText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'

const deepseekAI = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
})

export async function generateDeepseekStream(params: {
  messages: VercelMessage[]
  systemPrompt: string
  tools?: Record<string, any>
}) {
  const { messages, systemPrompt = '', tools } = params

  const result = streamText({
    model: deepseekAI('deepseek-chat'),
    system: systemPrompt,
    messages,
    tools,
    maxSteps: 5,
  })

  return result.toDataStreamResponse()
}
