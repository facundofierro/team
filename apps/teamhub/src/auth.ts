import NextAuth from 'next-auth'
import Yandex from 'next-auth/providers/yandex'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { authAdapter } from '@teamhub/db'

const allowedEmails = process.env.ALLOWED_EMAILS?.split(',') || []

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET must be set')
}

export const { handlers, auth, signIn, signOut } = NextAuth({
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

    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
              },
            },
          }),
        ]
      : []),

    ...(process.env.NODE_ENV === 'development' ||
    process.env.ENABLE_CREDENTIALS_AUTH === 'true'
      ? [
          Credentials({
            id: 'credentials',
            name: 'Email and Password',
            credentials: {
              email: {
                label: 'Email',
                type: 'email',
                placeholder: 'Enter your email',
              },
              password: {
                label: 'Password',
                type: 'password',
                placeholder: 'Enter your password',
              },
            },
            async authorize(credentials) {
              if (!credentials?.email || !credentials?.password) {
                return null
              }

              // For testing - check against test user credentials
              const testEmail = process.env.TEST_USER_EMAIL
              const testPassword = process.env.TEST_USER_PASSWORD

              if (
                testEmail &&
                testPassword &&
                credentials.email === testEmail &&
                credentials.password === testPassword
              ) {
                const userId = 'test-user-1'

                // Check if user exists in database, create if not
                const { getUserByEmail, createUser } = await import(
                  '@teamhub/db'
                )
                let user = await getUserByEmail(testEmail)

                if (!user) {
                  user = await createUser({
                    id: userId,
                    email: testEmail,
                    name: process.env.TEST_USER_NAME || 'Test User',
                    image: process.env.TEST_USER_IMAGE || null,
                  })
                }

                return {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  image: user.image,
                }
              }

              // Add your actual user validation logic here
              // For now, reject all other attempts
              return null
            },
          }),
        ]
      : []),

    ...(process.env.TEST_USER_EMAIL &&
    (process.env.NODE_ENV === 'development' ||
      process.env.ENABLE_TEST_USER === 'true')
      ? [
          Credentials({
            id: 'test-user',
            name: 'Test User (Dev Only)',
            credentials: {},
            async authorize() {
              const userId = 'test-user-dev'
              const email = process.env.TEST_USER_EMAIL!

              // Check if user exists in database, create if not
              const { getUserByEmail, createUser } = await import('@teamhub/db')
              let user = await getUserByEmail(email)

              if (!user) {
                user = await createUser({
                  id: userId,
                  email: email,
                  name: process.env.TEST_USER_NAME || 'Test User',
                  image: process.env.TEST_USER_IMAGE || null,
                })
              }

              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
              }
            },
          }),
        ]
      : []),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async redirect() {
      return '/dashboard'
    },
    async signIn({ user }) {
      const email = user.email ?? ''
      const isAllowed = allowedEmails.includes(email)
      if (!isAllowed) {
        console.warn(`Access denied for email: ${email}`)
        return false
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
