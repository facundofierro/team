import { eq, and, sql } from 'drizzle-orm'
import { db } from '../index'
import { embedding } from '../schema'
import type { Embedding, NewEmbedding } from '../types'

export async function createEmbedding(data: NewEmbedding): Promise<Embedding> {
  const [result] = await db.insert(embedding).values(data).returning()
  return result
}

export async function getEmbedding(id: string): Promise<Embedding | null> {
  const [result] = await db.select().from(embedding).where(eq(embedding.id, id))
  return result || null
}

export async function searchSimilarEmbeddings(
  vector: number[],
  type: string,
  limit: number = 5
): Promise<(Embedding & { similarity: number })[]> {
  const results = await db
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
      organizationId: embedding.organizationId,
      similarity: sql<number>`1 - (${embedding.vector} <=> ${vector}::float[])`,
    })
    .from(embedding)
    .where(and(eq(embedding.type, type), eq(embedding.isDeleted, false)))
    .orderBy(sql`${embedding.vector} <=> ${vector}::float[]`)
    .limit(limit)

  return results
}

export async function deleteEmbedding(id: string): Promise<void> {
  await db
    .update(embedding)
    .set({ isDeleted: true })
    .where(eq(embedding.id, id))
}

export async function bulkCreateEmbeddings(
  data: NewEmbedding[]
): Promise<Embedding[]> {
  return db.insert(embedding).values(data).returning()
}
