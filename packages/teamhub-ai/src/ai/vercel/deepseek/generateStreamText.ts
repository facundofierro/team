import { Message as VercelMessage, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const deepseekAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
})

export async function generateDeepseekStream(params: {
  messages: VercelMessage[]
  systemPrompt: string
}) {
  const { messages, systemPrompt = '' } = params

  const { textStream } = streamText({
    model: deepseekAI('gpt-4o'),
    prompt: systemPrompt,
    messages,
  })

  return textStream
}
