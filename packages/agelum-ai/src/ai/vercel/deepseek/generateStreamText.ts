import { Message as VercelMessage, streamText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'

const deepseekApiKey = process.env.DEEPSEEK_API_KEY

if (!deepseekApiKey) {
  console.error(
    '❌ Missing DEEPSEEK_API_KEY environment variable. The application will not be able to connect to the AI service.'
  )
}

const deepseekAI = createDeepSeek({
  apiKey: deepseekApiKey ?? '',
})

export async function generateDeepseekStream(params: {
  messages: VercelMessage[]
  systemPrompt: string
  tools?: Record<string, any>
}) {
  const { messages, systemPrompt = '', tools } = params

  console.log('🟣 [DEEPSEEK] === DEEPSEEK GENERATOR CALLED ===')
  console.log('🟣 [DEEPSEEK] Messages count:', messages.length)
  console.log('🟣 [DEEPSEEK] Tools count:', Object.keys(tools || {}).length)
  console.log('🟣 [DEEPSEEK] System prompt length:', systemPrompt.length)
  console.log('🌊 [DeepSeek] Calling Vercel AI SDK streamText...')
  try {
    const result = streamText({
      model: deepseekAI('deepseek-chat'),
      system: systemPrompt,
      messages,
      tools,
      maxSteps: 5,
    })
    console.log(
      '🌊 [DeepSeek] streamText returned. Creating and returning Response stream...'
    )
    console.log('🟣 [DEEPSEEK] === DEEPSEEK RESPONSE READY ===')
    return result.toDataStreamResponse()
  } catch (error) {
    console.error('❌ [DeepSeek] Error calling streamText:', error)
    // We must return a Response object here, even in case of an error.
    return new Response(
      JSON.stringify({ error: 'Failed to communicate with AI service' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
