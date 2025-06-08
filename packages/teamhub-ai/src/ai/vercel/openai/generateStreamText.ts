import { Message as VercelMessage, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const openaiAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
})

export async function generateOpenAIStream(params: {
  messages: VercelMessage[]
  systemPrompt: string
  tools?: Record<string, any>
}) {
  const { messages, systemPrompt = '', tools } = params

  const result = streamText({
    model: openaiAI('gpt-4o'),
    system: systemPrompt,
    messages,
    tools,
    maxSteps: 5,
  })

  return result.toDataStreamResponse()
}
