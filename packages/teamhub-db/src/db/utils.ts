import { kv, createClient } from '@vercel/kv'
import { db } from './index'
import { eq, and, inArray, isNull } from 'drizzle-orm'
import * as s from './schema'
import * as t from './types'
import * as c from './constants'
import { v4 as uuidv4 } from 'uuid'

export type CachedProps = {
  ttl?: number
  cache?: boolean
}

export type Orderable = {
  order: number
}

export const genRandomId = () => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const randomLetters = Math.random().toString(36).substring(2, 7)
  return `${year}${month}${day}${randomLetters}`
}

export const order = <T extends any[]>(rows: T) => {
  if (rows.every((row) => typeof row === 'object' && 'order' in row)) {
    return (rows as Orderable[]).sort((a, b) => a.order - b.order)
  }
  return rows
}

export const cached = async (
  key: string,
  id: string | null | undefined,
  promise: Promise<any>,
  props?: CachedProps
) => {
  const { ttl = 60 * 60 * 24, cache = true } = props || {}
  // @ts-ignore
  const cachedValue = await kv.get(key + ':' + id)
  if (cachedValue && cache) return cachedValue
  const value = await promise
  // @ts-ignore
  if (value) await kv.set(key, value, { expirationTtl: ttl })
  return value
}

export const keys = async (key: string) => {
  // @ts-ignore
  return await kv.keys(key + ':*')
}

export const get = async (key: string) => {
  // @ts-ignore
  return await kv.get(key)
}

export const set = async (
  key: string,
  value: any,
  { expirationTtl }: { expirationTtl: number } = { expirationTtl: 60 * 60 * 12 }
) => {
  // @ts-ignore
  await kv.set(key, value, { expirationTtl })
  return value
}

export const invalidate = async (key: string, id?: string | null) => {
  // @ts-ignore
  if (id) await kv.del(key + ':' + id)
  // @ts-ignore
  await kv.keys(key + ':*').then((keys) => kv.del(keys))
}
