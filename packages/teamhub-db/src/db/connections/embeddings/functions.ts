import { eq, and, sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { embedding } from './schema'
import type { Embedding, NewEmbedding, EmbeddingWithTypes } from './types'
import * as schema from './schema'

export const getFunctions = (database: NodePgDatabase<typeof schema>) => {
  return {
    createEmbedding: async (
      data: NewEmbedding
    ): Promise<EmbeddingWithTypes> => {
      const [result] = await database.insert(embedding).values(data).returning()
      return {
        ...result,
        metadata: result.metadata as EmbeddingWithTypes['metadata'],
      }
    },

    getEmbedding: async (id: string): Promise<EmbeddingWithTypes | null> => {
      const [result] = await database
        .select()
        .from(embedding)
        .where(eq(embedding.id, id))
      return result
        ? {
            ...result,
            metadata: result.metadata as EmbeddingWithTypes['metadata'],
          }
        : null
    },

    searchSimilarEmbeddings: async (
      vector: number[],
      type: string,
      limit: number = 5
    ): Promise<(EmbeddingWithTypes & { similarity: number })[]> => {
      const results = await database
        .select({
          id: embedding.id,
          type: embedding.type,
          referenceId: embedding.referenceId,
          vector: embedding.vector,
          version: embedding.version,
          model: embedding.model,
          dimension: embedding.dimension,
          isDeleted: embedding.isDeleted,
          metadata: embedding.metadata,
          createdAt: embedding.createdAt,
          similarity: sql<number>`1 - (${embedding.vector} <=> ${vector}::float[])`,
        })
        .from(embedding)
        .where(and(eq(embedding.type, type), eq(embedding.isDeleted, false)))
        .orderBy(sql`${embedding.vector} <=> ${vector}::float[]`)
        .limit(limit)

      return results.map((result) => ({
        ...result,
        metadata: result.metadata as EmbeddingWithTypes['metadata'],
      }))
    },

    deleteEmbedding: async (id: string): Promise<void> => {
      await database
        .update(embedding)
        .set({ isDeleted: true })
        .where(eq(embedding.id, id))
    },

    bulkCreateEmbeddings: async (
      data: NewEmbedding[]
    ): Promise<EmbeddingWithTypes[]> => {
      const results = await database.insert(embedding).values(data).returning()
      return results.map((result) => ({
        ...result,
        metadata: result.metadata as EmbeddingWithTypes['metadata'],
      }))
    },
  }
}
