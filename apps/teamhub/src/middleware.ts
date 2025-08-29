import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Try both possible cookie names for compatibility
  const session =
    req.cookies.get('__Secure-authjs.session-token') ||
    req.cookies.get('authjs.session-token') ||
    req.cookies.get('next-auth.session-token')

  // Avoid logging cookies/session in production or during normal operation

  const isAuthPage = req.nextUrl.pathname.startsWith('/api/auth')

  if (!session && !isAuthPage) {
    const signInUrl = new URL('/api/auth/signin', req.nextUrl.origin)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

// Optionally configure which paths to protect
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
