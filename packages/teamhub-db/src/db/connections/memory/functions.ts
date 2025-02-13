import { eq, and, sql } from 'drizzle-orm'
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
    getMemoryByAgentId: async (agentId: string): Promise<MemoryWithTypes[]> => {
      const results = await database
        .select()
        .from(memory)
        .where(eq(memory.agentId, agentId))
      return results.map((result) => ({
        ...result,
        structuredData:
          result.structuredData as MemoryWithTypes['structuredData'],
      }))
    },
    getMemoryByAgentCloneId: async (
      agentCloneId: string
    ): Promise<MemoryWithTypes[]> => {
      const results = await database
        .select()
        .from(memory)
        .where(eq(memory.agentCloneId, agentCloneId))
      return results.map((result) => ({
        ...result,
        structuredData:
          result.structuredData as MemoryWithTypes['structuredData'],
      }))
    },
  }
}
