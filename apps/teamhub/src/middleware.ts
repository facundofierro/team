import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Check for the session cookie (adjust the cookie name if needed)
  const session = req.cookies.get('next-auth.session-token')
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
