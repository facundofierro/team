import { Message as VercelMessage, streamText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'

const deepseekAI = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
})

export async function generateDeepseekStream(params: {
  messages: VercelMessage[]
  systemPrompt: string
}) {
  const { messages, systemPrompt = '' } = params

  const result = streamText({
    model: deepseekAI('deepseek-chat'),
    system: systemPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}
