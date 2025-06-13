import { NextRequest, NextResponse } from 'next/server'
import { createOpenAI } from '@ai-sdk/openai'
import { embed, embedMany } from 'ai'

const API_KEY = process.env.AI_GATEWAY_API_KEY

function checkApiKey(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!API_KEY || !auth || auth !== `Bearer ${API_KEY}`) {
    return false
  }
  return true
}

const openaiAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
})

const models = {
  openai: openaiAI.embedding('text-embedding-3-small'),
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

  const { text, texts, provider = 'openai' } = body

  if (!models[provider as Provider]) {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
  }

  try {
    if (typeof text === 'string') {
      const { embedding } = await embed({
        model: models[provider as Provider],
        value: text,
      })
      return NextResponse.json({ embedding })
    } else if (Array.isArray(texts)) {
      const { embeddings } = await embedMany({
        model: models[provider as Provider],
        values: texts,
      })
      return NextResponse.json({ embeddings })
    } else {
      return NextResponse.json(
        { error: 'Missing text or texts' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Embedding failed' },
      { status: 500 }
    )
  }
}
