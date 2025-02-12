import { NextRequest } from 'next/server'
import { sendChat } from '@teamhub/ai'

export async function POST(req: NextRequest) {
  const { text, agentId, agentCloneId, memoryRules, storeRule } =
    await req.json()

  const response = await sendChat({
    text,
    agentId,
    agentCloneId,
    memoryRules,
    storeRule,
  })

  return response
}
