import { NextRequest, NextResponse } from 'next/server'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

// --- Simple API Key Middleware ---
const API_KEY = process.env.AI_GATEWAY_API_KEY

function checkApiKey(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!API_KEY || !auth || auth !== `Bearer ${API_KEY}`) {
    return false
  }
  return true
}

// --- Provider Setup ---
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    prompt,
    systemPrompt = '',
    provider = 'deepseek',
    temperature = 0.7,
    maxTokens = 1000,
  } = body

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid prompt' },
      { status: 400 }
    )
  }

  if (!models[provider as Provider]) {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
  }

  try {
    const result = await generateText({
      model: models[provider as Provider],
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature,
      maxTokens,
    })
    return NextResponse.json({ text: result.text })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    )
  }
}
