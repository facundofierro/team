import { NextRequest } from 'next/server'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'

const API_KEY = process.env.AI_GATEWAY_API_KEY

function checkApiKey(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!API_KEY || !auth || auth !== `Bearer ${API_KEY}`) {
    return false
  }
  return true
}

const deepseekAI = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
})
const openaiAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
})

const models = {
  deepseek: deepseekAI('deepseek-chat'),
  openai: openaiAI('gpt-4'),
}

type Provider = keyof typeof models

export async function POST(req: NextRequest) {
  if (!checkApiKey(req)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
    })
  }

  const {
    messages,
    provider = 'deepseek',
    systemPrompt = '',
    temperature = 0.7,
    maxTokens = 1000,
  } = body

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid messages' }),
      { status: 400 }
    )
  }

  if (!models[provider as Provider]) {
    return new Response(JSON.stringify({ error: 'Invalid provider' }), {
      status: 400,
    })
  }

  try {
    const result = await streamText({
      model: models[provider as Provider],
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature,
      maxTokens,
    })
    return result.toDataStreamResponse()
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Streaming failed' }),
      { status: 500 }
    )
  }
}
