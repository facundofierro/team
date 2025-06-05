import { Message as VercelMessage, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const openaiAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
})

export async function generateOpenAIStream(params: {
  messages: VercelMessage[]
  systemPrompt: string
}) {
  const { messages, systemPrompt = '' } = params

  const result = streamText({
    model: openaiAI('gpt-4o'),
    system: systemPrompt,
    messages,
    maxSteps: 5,
  })

  return result.toDataStreamResponse()
}
