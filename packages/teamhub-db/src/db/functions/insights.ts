import {
  eq,
  and,
  asc,
  inArray,
  isNull,
  gte,
  lte,
  sql,
  desc,
  or,
} from 'drizzle-orm'
import { db } from '../index'
import { documents, prospects, prospectEvents, markets } from '../schema'
import type {
  Document,
  NewDocument,
  Prospect,
  NewProspect,
  ProspectEvent,
  NewProspectEvent,
  Market,
  NewMarket,
  MetadataProperty,
} from '../types'

// Genaral functions
export async function getInsightsTables(organizationId: string) {
  return ['documents', 'prospects', 'markets']
}

// Document functions
export async function createDocument(data: NewDocument): Promise<Document> {
  const [doc] = await db.insert(documents).values(data).returning()
  return doc
}

export async function getDocument(id: string): Promise<Document | null> {
  const [doc] = await db.select().from(documents).where(eq(documents.id, id))
  return doc || null
}

export async function getDocumentsByType(type: string): Promise<Document[]> {
  return db
    .select()
    .from(documents)
    .where(and(eq(documents.type, type), eq(documents.isActive, true)))
}

export async function updateDocument(
  id: string,
  data: Partial<NewDocument>
): Promise<Document> {
  const [doc] = await db
    .update(documents)
    .set(data)
    .where(eq(documents.id, id))
    .returning()
  return doc
}

// Prospect functions
export async function createProspect(data: NewProspect): Promise<Prospect> {
  const [prospect] = await db.insert(prospects).values(data).returning()
  return prospect
}

export async function getProspect(id: string): Promise<Prospect | null> {
  const [prospect] = await db
    .select()
    .from(prospects)
    .where(eq(prospects.id, id))
  return prospect || null
}

export async function getProspectsByStatus(
  status: string
): Promise<Prospect[]> {
  return db
    .select()
    .from(prospects)
    .where(eq(prospects.status, status))
    .orderBy(desc(prospects.score))
}

export async function updateProspectScore(
  id: string,
  score: number
): Promise<Prospect> {
  const [prospect] = await db
    .update(prospects)
    .set({ score, updatedAt: new Date() })
    .where(eq(prospects.id, id))
    .returning()
  return prospect
}

// Prospect Events
export async function createProspectEvent(
  data: NewProspectEvent
): Promise<ProspectEvent> {
  const [event] = await db.insert(prospectEvents).values(data).returning()
  return event
}

export async function getProspectEvents(
  prospectId: string
): Promise<ProspectEvent[]> {
  return db
    .select()
    .from(prospectEvents)
    .where(eq(prospectEvents.prospectId, prospectId))
    .orderBy(desc(prospectEvents.createdAt))
}

// Market functions
export async function createMarket(data: NewMarket): Promise<Market> {
  const [market] = await db.insert(markets).values(data).returning()
  return market
}

export async function getMarket(id: string): Promise<Market | null> {
  const [market] = await db.select().from(markets).where(eq(markets.id, id))
  return market || null
}

export async function getMarketsBySegment(segment: string): Promise<Market[]> {
  return db.select().from(markets).where(eq(markets.segment, segment))
}

export async function updateMarketMetadata(
  id: string,
  metadata: Partial<MetadataProperty>
): Promise<Market> {
  const [market] = await db
    .update(markets)
    .set({
      metadata: sql`${markets.metadata}::jsonb || ${JSON.stringify(
        metadata
      )}::jsonb`,
      updatedAt: new Date(),
    })
    .where(eq(markets.id, id))
    .returning()
  return market
}

// Search functions
export async function searchDocuments(
  query: string,
  type?: string
): Promise<Document[]> {
  const conditions = [
    eq(documents.isActive, true),
    or(
      sql`${documents.title} ILIKE ${`%${query}%`}`,
      sql`${documents.content} ILIKE ${`%${query}%`}`
    ),
  ]

  if (type) {
    conditions.push(eq(documents.type, type))
  }

  return db
    .select()
    .from(documents)
    .where(and(...conditions))
    .orderBy(desc(documents.updatedAt))
}

export async function searchProspects(
  query: string,
  status?: string
): Promise<Prospect[]> {
  const conditions = [
    or(
      sql`${prospects.name} ILIKE ${`%${query}%`}`,
      sql`${prospects.company} ILIKE ${`%${query}%`}`
    ),
  ]

  if (status) {
    conditions.push(eq(prospects.status, status))
  }

  return db
    .select()
    .from(prospects)
    .where(and(...conditions))
    .orderBy(desc(prospects.updatedAt))
}
