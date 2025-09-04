import { eq, and } from 'drizzle-orm'
import { db } from '../index'
import { users, accounts, sessions, verificationTokens } from '../schema'
import type {
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from '@auth/core/adapters'

export async function createUser(
  data: Partial<AdapterUser>
): Promise<AdapterUser> {
  const [user] = await db
    .insert(users)
    .values({
      ...data,
      email: data.email || '',
    })
    .returning()
  return user as AdapterUser
}

export async function getUser(id: string): Promise<AdapterUser | null> {
  const [user] = await db.select().from(users).where(eq(users.id, id))
  return user as AdapterUser | null
}

export async function getUserByEmail(
  email: string
): Promise<AdapterUser | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email))
  return user as AdapterUser | null
}

export async function getUserByAccount(
  providerAccountId: string,
  provider: string
): Promise<AdapterUser | null> {
  const [result] = await db
    .select({
      user: users,
    })
    .from(users)
    .innerJoin(accounts, eq(users.id, accounts.userId))
    .where(
      and(
        eq(accounts.providerAccountId, providerAccountId),
        eq(accounts.provider, provider)
      )
    )
  return result?.user as AdapterUser | null
}

export async function updateUser(id: string, data: Partial<AdapterUser>) {
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning()
  return user as AdapterUser
}

export async function deleteUser(userId: string) {
  await db.delete(users).where(eq(users.id, userId))
}

export async function linkAccount(data: AdapterAccount): Promise<void> {
  await db.insert(accounts).values(data)
}

export async function unlinkAccount(
  providerAccountId: string,
  provider: string
) {
  await db
    .delete(accounts)
    .where(
      and(
        eq(accounts.providerAccountId, providerAccountId),
        eq(accounts.provider, provider)
      )
    )
}

export async function createSession(
  data: AdapterSession
): Promise<AdapterSession> {
  const [session] = await db.insert(sessions).values(data).returning()
  return session
}

export async function getSessionAndUser(sessionToken: string) {
  const [result] = await db
    .select({
      session: sessions,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.sessionToken, sessionToken))

  if (!result) return null
  return {
    session: result.session as AdapterSession,
    user: result.user as AdapterUser,
  }
}

export async function updateSession(
  sessionToken: string,
  data: Partial<AdapterSession>
): Promise<AdapterSession> {
  const [session] = await db
    .update(sessions)
    .set(data)
    .where(eq(sessions.sessionToken, sessionToken))
    .returning()
  return session
}

export async function deleteSession(sessionToken: string) {
  await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken))
}

export async function createVerificationToken(
  data: VerificationToken
): Promise<VerificationToken> {
  const [token] = await db.insert(verificationTokens).values(data).returning()
  return token
}

export async function useVerificationToken(
  identifier: string,
  token: string
): Promise<VerificationToken | null> {
  const [verificationToken] = await db
    .delete(verificationTokens)
    .where(
      and(
        eq(verificationTokens.identifier, identifier),
        eq(verificationTokens.token, token)
      )
    )
    .returning()
  return verificationToken
}
