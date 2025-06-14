import { ToolTypeWithTypes, db } from '@teamhub/db'
import { searchGoogle, SearchGoogleParameters } from './tools/searchGoogle'
import { searchYandex, SearchYandexParameters } from './tools/searchYandex'
import {
  searchYandexGrpc,
  SearchYandexGrpcParameters,
} from './tools/searchYandexGrpc'
import {
  searchYandexGen,
  SearchYandexGenParameters,
} from './tools/searchYandexGen'
import {
  searchDuckDuckGo,
  SearchDuckDuckGoParameters,
} from './tools/searchDuckDuckGo'
import { agentToAgent, A2AParameters } from './tools/agentToAgent'
import {
  agentDiscovery,
  AgentDiscoveryParameters,
} from './tools/agentDiscovery'
import { memorySearch, MemorySearchParameters } from './tools/memorySearch'
import { tool } from 'ai'
import { z } from 'zod'

const TOOLS = [
  searchGoogle,
  searchDuckDuckGo,
  searchYandex,
  searchYandexGrpc,
  searchYandexGen,
  agentToAgent,
  agentDiscovery,
  memorySearch,
]

export const getToolTypes = async () => {
  const toolTypes = TOOLS.map(
    (tool) =>
      ({
        id: tool.id,
        type: tool.type,
        description: tool.description,
        canBeManaged: tool.canBeManaged,
        managedPrice: tool.managedPrice,
        managedPriceDescription: tool.managedPriceDescription,
        configurationParams: tool.configurationParams,
        monthlyUsage: tool.monthlyUsage,
        allowedUsage: tool.allowedUsage,
        allowedTimeStart: tool.allowedTimeStart,
        allowedTimeEnd: tool.allowedTimeEnd,
        isActive: true,
        createdAt: null,
      } as ToolTypeWithTypes)
  )
  return toolTypes
}

export const getToolHandler = (type: string) => {
  const tool = TOOLS.find((t) => t.type === type)
  if (!tool) {
    throw new Error(`Tool ${type} not found`)
  }
  return tool.handler
}

export const getAISDKTool = async (toolRecord: any) => {
  console.log('🔧 Tool Executor: Creating AI SDK tool for:', toolRecord.type)
  console.log(
    '🔧 Tool Executor: Tool record:',
    JSON.stringify(
      {
        id: toolRecord.id,
        type: toolRecord.type,
        isManaged: toolRecord.isManaged,
        hasConfiguration: !!toolRecord.configuration,
        configurationKeys: Object.keys(toolRecord.configuration || {}),
      },
      null,
      2
    )
  )

  const toolDefinition = TOOLS.find((t) => t.type === toolRecord.type)
  if (!toolDefinition) {
    console.error(
      '❌ Tool Executor: Tool definition not found for type:',
      toolRecord.type
    )
    throw new Error(`Tool definition not found for type: ${toolRecord.type}`)
  }

  console.log('✅ Tool Executor: Found tool definition:', toolDefinition.type)

  return tool({
    description: toolDefinition.description || undefined,
    parameters: toolDefinition.parametersSchema,
    execute: async (params) => {
      console.log('🚀 Tool Executor: Starting tool execution')
      console.log('🚀 Tool Executor: Tool type:', toolRecord.type)
      console.log('🚀 Tool Executor: Tool ID:', toolRecord.id)
      console.log(
        '🚀 Tool Executor: Parameters:',
        JSON.stringify(params, null, 2)
      )

      try {
        console.log('⏱️ Tool Executor: Verifying tool usage...')
        const isAllowed = await db.verifyToolUsage(toolRecord.type)
        if (!isAllowed) {
          console.error(
            '❌ Tool Executor: Tool usage limit exceeded for type:',
            toolRecord.type
          )
          throw new Error('Tool usage limit exceeded')
        }
        console.log('✅ Tool Executor: Tool usage verified')

        console.log('🔧 Tool Executor: Calling tool handler...')
        const startTime = Date.now()

        const result = await toolDefinition.handler(
          params,
          toolRecord.configuration
        )

        const endTime = Date.now()
        console.log(
          `⏱️ Tool Executor: Tool execution completed in ${
            endTime - startTime
          }ms`
        )
        console.log('🎯 Tool Executor: Tool result type:', typeof result)
        console.log(
          '🎯 Tool Executor: Tool result length:',
          Array.isArray(result) ? result.length : 'not an array'
        )

        if (Array.isArray(result) && result.length > 0) {
          console.log(
            '🎯 Tool Executor: First result sample:',
            JSON.stringify(result[0], null, 2)
          )
        } else {
          console.log(
            '🎯 Tool Executor: Full result:',
            JSON.stringify(result, null, 2)
          )
        }

        return result
      } catch (error) {
        console.error('💥 Tool Executor: Error during tool execution:', error)
        console.error(
          '💥 Tool Executor: Error stack:',
          error instanceof Error ? error.stack : 'No stack trace'
        )
        throw error
      }
    },
  })
}

export type ToolTypeDefinition = ToolTypeWithTypes & {
  parametersSchema: z.ZodSchema
  resultSchema: z.ZodSchema
  handler: (
    params: unknown,
    configuration: Record<string, string>
  ) => Promise<unknown>
}
