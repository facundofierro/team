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

  console.log('🔵 [OPENAI] === OPENAI GENERATOR CALLED ===')
  console.log('🔵 [OPENAI] Messages count:', messages.length)
  console.log('🔵 [OPENAI] Tools count:', Object.keys(tools || {}).length)
  console.log('🔵 [OPENAI] System prompt length:', systemPrompt.length)
  console.log('🌊 [OpenAI] Calling Vercel AI SDK streamText...')

  const result = streamText({
    model: openaiAI('gpt-4o'),
    system: systemPrompt,
    messages,
    tools,
    maxSteps: 5,
  })

  console.log(
    '🌊 [OpenAI] streamText returned. Creating and returning Response stream...'
  )
  console.log('🔵 [OPENAI] === OPENAI RESPONSE READY ===')
  return result.toDataStreamResponse()
}
