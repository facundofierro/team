import NextAuth from 'next-auth'
import Yandex from '@auth/core/providers/yandex'
import { authAdapter } from '@teamhub/db'

const allowedEmails = process.env.ALLOWED_EMAILS?.split(',') || []

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET must be set')
}

export const { handlers, auth } = NextAuth({
  adapter: authAdapter,
  providers: [
    Yandex({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
      authorization: {
        url: 'https://oauth.yandex.com/authorize',
        params: {
          scope: 'login:email login:info',
          response_type: 'code',
          prompt: 'select_account consent',
          access_type: 'offline',
          force_confirm: '1', // Yandex-specific parameter
        },
      },
      token: 'https://oauth.yandex.com/token',
      userinfo: 'https://login.yandex.ru/info',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET + '=',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user }) {
      return allowedEmails.includes(user.email ?? '')
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // After signin, redirect to dashboard
      if (url.startsWith('/api/auth/signin')) {
        return `${baseUrl}/dashboard`
      }
      // Otherwise allow internal redirects
      if (url.startsWith(baseUrl)) return baseUrl
      return baseUrl
    },
  },
})
