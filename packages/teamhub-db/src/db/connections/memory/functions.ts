import { eq, and, sql, inArray } from 'drizzle-orm'
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http'
import { memory } from './schema'
import type { Memory, NewMemory, MemoryWithTypes } from './types'
import * as schema from './schema'

export const getFunctions = (database: NeonHttpDatabase<typeof schema>) => {
  return {
    createMemory: async (data: NewMemory): Promise<MemoryWithTypes> => {
      const [result] = await database.insert(memory).values(data).returning()
      return {
        ...result,
        structuredData:
          result.structuredData as MemoryWithTypes['structuredData'],
      }
    },
    getMemory: async (id: string): Promise<MemoryWithTypes | null> => {
      const [result] = await database
        .select()
        .from(memory)
        .where(eq(memory.id, id))
      return result
        ? {
            ...result,
            structuredData:
              result.structuredData as MemoryWithTypes['structuredData'],
          }
        : null
    },
    deleteMemory: async (id: string): Promise<void> => {
      await database.delete(memory).where(eq(memory.id, id))
    },
    getAgentMemories: async (
      agentId: string,
      agentCloneId?: string,
      type?: string,
      categories?: string[]
    ): Promise<MemoryWithTypes[]> => {
      const conditions = [eq(memory.agentId, agentId)]

      if (agentCloneId) {
        conditions.push(eq(memory.agentCloneId, agentCloneId))
      }
      if (type) {
        conditions.push(eq(memory.type, type))
      }
      if (categories?.length) {
        conditions.push(inArray(memory.category, categories))
      }

      const results = await database
        .select()
        .from(memory)
        .where(and(...conditions))

      return results.map((result) => ({
        ...result,
        structuredData:
          result.structuredData as MemoryWithTypes['structuredData'],
      }))
    },
  }
}
