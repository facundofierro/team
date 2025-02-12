import { ToolTypeWithTypes, db } from '@teamhub/db'
import { searchGoogle, SearchGoogleParameters } from './tools/searchGoogle'
import { searchYandex, SearchYandexParameters } from './tools/searchYandex'
import {
  searchDuckDuckGo,
  SearchDuckDuckGoParameters,
} from './tools/searchDuckDuckGo'
import { z } from 'zod'

const TOOLS = [searchGoogle, searchDuckDuckGo, searchYandex]

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

export const getToolHandler = async (toolId: string) => {
  const tool = await db.getTool(toolId)
  if (!tool) {
    throw new Error('Tool not found')
  }

  const toolHandler = TOOLS.find((t) => t.id === tool.id)
  if (!toolHandler) {
    throw new Error('Tool handler not found')
  }

  return async (params: unknown) => {
    const isAllowed = await db.verifyToolUsage(tool.id)
    if (!isAllowed) {
      throw new Error('Tool usage limit exceeded')
    }
    const result = await toolHandler.handler(params, tool.configuration)
    return result
  }
}

export type ToolTypeDefinition = ToolTypeWithTypes & {
  parametersSchema: z.ZodSchema
  resultSchema: z.ZodSchema
  handler: (
    params: unknown,
    configuration: Record<string, string>
  ) => Promise<unknown>
}
