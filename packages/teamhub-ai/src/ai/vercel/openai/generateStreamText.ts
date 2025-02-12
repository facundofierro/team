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

  const { textStream } = streamText({
    model: openaiAI('gpt-4o'),
    prompt: systemPrompt,
    messages,
    maxSteps: 5,
  })

  return textStream
}
