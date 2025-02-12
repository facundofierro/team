import type { Adapter, AdapterAccount } from '@auth/core/adapters'
import * as auth from './functions/auth'

export const authAdapter: Adapter = {
  createUser: auth.createUser,
  getUser: auth.getUser,
  getUserByEmail: auth.getUserByEmail,
  getUserByAccount: ({
    providerAccountId,
    provider,
  }: Pick<AdapterAccount, 'provider' | 'providerAccountId'>) =>
    auth.getUserByAccount(providerAccountId, provider),
  updateUser: ({ id, ...data }) => auth.updateUser(id, data),
  deleteUser: auth.deleteUser,
  linkAccount: auth.linkAccount,
  unlinkAccount: ({ providerAccountId, provider }) =>
    auth.unlinkAccount(providerAccountId, provider),
  createSession: auth.createSession,
  getSessionAndUser: auth.getSessionAndUser,
  updateSession: ({ sessionToken, ...data }) =>
    auth.updateSession(sessionToken, data),
  deleteSession: auth.deleteSession,
  createVerificationToken: auth.createVerificationToken,
  useVerificationToken: ({ identifier, token }) =>
    auth.useVerificationToken(identifier, token),
}
