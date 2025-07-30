import {
  Message as VercelMessage,
  streamText,
  tool,
  createDataStreamResponse,
  StreamData,
} from 'ai'
import { MemoryWithTypes, Memory, AgentToolPermission } from '@teamhub/db'
import { generateDeepseekStream } from './deepseek/generateStreamText'
import { generateOpenAIStream } from './openai/generateStreamText'
import { getAISDKTool } from '../../tools'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createOpenAI } from '@ai-sdk/openai'

export type AIProvider = 'deepseek' | 'openai'

// Tool call metadata interface for tracking
interface ToolCallMetadata {
  id: string
  name: string
  arguments: Record<string, any>
  result?: any
  status: 'pending' | 'success' | 'error'
  timestamp: Date
  stepNumber: number
}

export async function generateStreamText(params: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  summary?: string
  agentId: string
  systemPrompt?: string
  memories: MemoryWithTypes[]
  provider?: AIProvider
  tools?: AgentToolPermission[]
}) {
  const {
    provider = 'deepseek',
    systemPrompt = '',
    summary,
    memories,
    messages: inputMessages,
    tools = [],
  } = params

  console.log('🤖 GenerateStreamText: Starting text generation')
  console.log('🤖 GenerateStreamText: Provider:', provider)
  console.log('🤖 GenerateStreamText: Agent ID:', params.agentId)
  console.log(
    '🤖 GenerateStreamText: Input messages count:',
    inputMessages.length
  )
  console.log('🤖 GenerateStreamText: Memories count:', memories.length)
  console.log('🤖 GenerateStreamText: Tools count:', tools.length)
  console.log('🤖 GenerateStreamText: Has summary:', !!summary)

  // Validate messages parameter
  if (
    !inputMessages ||
    !Array.isArray(inputMessages) ||
    inputMessages.length === 0
  ) {
    console.error('❌ GenerateStreamText: Invalid messages parameter')
    throw new Error(
      'Messages parameter is required and must be a non-empty array'
    )
  }

  // Set up AI provider models
  const deepseekAI = createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY ?? '',
  })

  const openaiAI = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
  })

  const models = {
    deepseek: deepseekAI('deepseek-chat'),
    openai: openaiAI('gpt-4o'),
  }

  console.log(
    `🎯 GenerateStreamText: Selected AI Provider: ${provider.toUpperCase()}`
  )

  const memoryMessages: VercelMessage[] = memories.reduce(
    (acc: VercelMessage[], memory: Memory) => {
      if (!memory.content) {
        return acc
      }
      // memory.content is JSONB, so it can be an object, array, or primitive.
      // We need to convert it to a meaningful string.
      let contentString: string
      if (typeof memory.content === 'string') {
        contentString = memory.content
      } else {
        contentString = JSON.stringify(memory.content)
      }

      // Filter out empty/useless content
      if (
        contentString.trim().length === 0 ||
        contentString === '{}' ||
        contentString === '[]'
      ) {
        return acc
      }

      acc.push({
        id: crypto.randomUUID(),
        role: 'user' as const,
        content: `Recalled memory titled '${memory.title}': ${contentString}`,
      })
      return acc
    },
    []
  )

  console.log(
    '💭 GenerateStreamText: Memory messages count:',
    memoryMessages.length
  )

  // Convert input messages to Vercel format
  const conversationMessages: VercelMessage[] = inputMessages.map((msg) => ({
    id: crypto.randomUUID(),
    role: msg.role,
    content: msg.content.trim() || 'Hello', // Ensure we always have content
  }))

  // Add summary message if available (before memory messages for context)
  const summaryMessages: VercelMessage[] = summary
    ? [
        {
          id: crypto.randomUUID(),
          role: 'system' as const,
          content: `Previous conversation summary: ${summary}`,
        },
      ]
    : []

  const messages: VercelMessage[] = [
    ...summaryMessages,
    ...memoryMessages,
    ...conversationMessages,
  ]

  console.log('📨 GenerateStreamText: Total messages count:', messages.length)
  if (summary) {
    console.log('📋 GenerateStreamText: Summary included in context')
  }

  // Convert agent tools to AI SDK tools format
  const aiTools: Record<string, any> = {}

  if (tools.length > 0) {
    console.log('🔧 GenerateStreamText: Converting tools to AI SDK format...')

    for (const agentTool of tools) {
      try {
        console.log(`🔧 GenerateStreamText: Converting tool:`, {
          id: (agentTool as any).id,
          type: (agentTool as any).type,
          name: (agentTool as any).name,
        })

        const aiTool = await getAISDKTool(agentTool)
        if (aiTool) {
          const toolKey = (agentTool as any).id || (agentTool as any).type
          aiTools[toolKey] = aiTool
          console.log(
            `✅ GenerateStreamText: Successfully converted tool: ${toolKey}`
          )
        } else {
          console.warn(
            `⚠️ GenerateStreamText: Tool conversion returned null for: ${
              (agentTool as any).id
            }`
          )
        }
      } catch (error) {
        console.error(
          `❌ GenerateStreamText: Failed to convert tool ${
            (agentTool as any).id
          }:`,
          error
        )
      }
    }

    console.log('🔧 GenerateStreamText: Converted tools:', Object.keys(aiTools))
  } else {
    console.log('🔧 GenerateStreamText: No tools to convert')
  }

  console.log(
    '🎛️ GenerateStreamText: Calling generator with tools:',
    Object.keys(aiTools).length
  )

  console.log('📦 GenerateStreamText: Final payload to be sent to AI:', {
    systemPrompt: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
      toolInvocations: (m as any).toolInvocations,
    })),
    tools: Object.keys(aiTools),
  })

  console.log(
    `🚀 GenerateStreamText: Creating data stream response with tool tracking...`
  )

  // Create response with custom data streaming
  return createDataStreamResponse({
    execute: async (dataStream) => {
      console.log('🎯 GenerateStreamText: Starting data stream execution')

      // Tool call tracking
      const allToolCalls: ToolCallMetadata[] = []

      // Use streamText with tool call tracking
      const result = streamText({
        model: models[provider],
        system: systemPrompt,
        messages,
        tools: aiTools,
        maxSteps: 5,
        onStepFinish: async ({
          stepType,
          toolCalls,
          toolResults,
          finishReason,
          usage,
        }) => {
          console.log(`🎯 Step finished: ${stepType}`, {
            toolCallsCount: toolCalls.length,
            toolResultsCount: toolResults.length,
            finishReason,
            usage,
          })

          // Track tool calls and their results
          if (toolCalls.length > 0) {
            for (let i = 0; i < toolCalls.length; i++) {
              const toolCall = toolCalls[i]
              const toolResult = toolResults[i]

              const metadata: ToolCallMetadata = {
                id: toolCall.toolCallId,
                name: toolCall.toolName,
                arguments: toolCall.args,
                result: toolResult?.result,
                status: toolResult ? 'success' : 'pending',
                timestamp: new Date(),
                stepNumber: allToolCalls.length,
              }

              allToolCalls.push(metadata)

              console.log(`🔧 Tool executed: ${toolCall.toolName}`, {
                id: toolCall.toolCallId,
                args: toolCall.args,
                hasResult: !!toolResult,
                resultPreview:
                  typeof toolResult?.result === 'string'
                    ? toolResult.result.substring(0, 100) + '...'
                    : JSON.stringify(toolResult?.result || {}).substring(
                        0,
                        100
                      ) + '...',
              })

              // Stream tool call information to frontend
              dataStream.writeData({
                type: 'tool-call',
                toolCall: {
                  id: metadata.id,
                  name: metadata.name,
                  arguments: metadata.arguments,
                  result: metadata.result,
                  status: metadata.status,
                  timestamp: metadata.timestamp.toISOString(),
                  stepNumber: metadata.stepNumber,
                },
              })
            }
          }
        },
        onFinish: async ({ toolCalls, toolResults }) => {
          console.log('🏁 Generation finished with tool summary:', {
            totalToolCalls: toolCalls.length,
            totalToolResults: toolResults.length,
            allTrackedCalls: allToolCalls.length,
          })

          // Ensure all tool calls are marked as completed
          for (let i = 0; i < toolCalls.length; i++) {
            const toolCall = toolCalls[i]
            const toolResult = toolResults[i]

            const existingCall = allToolCalls.find(
              (tc) => tc.id === toolCall.toolCallId
            )
            if (existingCall && !existingCall.result) {
              existingCall.result = toolResult?.result
              existingCall.status = 'success'

              // Stream final tool call status
              dataStream.writeData({
                type: 'tool-call-complete',
                toolCall: {
                  id: existingCall.id,
                  name: existingCall.name,
                  arguments: existingCall.arguments,
                  result: existingCall.result,
                  status: existingCall.status,
                  timestamp: existingCall.timestamp.toISOString(),
                  stepNumber: existingCall.stepNumber,
                },
              })
            }
          }

          // Send final summary of all tool calls
          dataStream.writeData({
            type: 'tool-calls-summary',
            totalCalls: allToolCalls.length,
            toolCalls: allToolCalls.map((tc) => ({
              id: tc.id,
              name: tc.name,
              arguments: tc.arguments,
              result: tc.result,
              status: tc.status,
              timestamp: tc.timestamp.toISOString(),
              stepNumber: tc.stepNumber,
            })),
          })
        },
      })

      console.log(
        `✅ GenerateStreamText: ${provider.toUpperCase()} streamText created`
      )

      // Merge the AI stream into our data stream
      result.mergeIntoDataStream(dataStream)
    },
    onError: (error) => {
      console.error('❌ GenerateStreamText: Data stream error:', error)
      return error instanceof Error ? error.message : String(error)
    },
  })
}
