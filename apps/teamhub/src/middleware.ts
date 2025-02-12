import { auth } from '@/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/api/auth')

  if (!isLoggedIn && !isAuthPage) {
    const signInUrl = new URL('/api/auth/signin', req.nextUrl.origin)
    return Response.redirect(signInUrl)
  }
})

// Optionally configure which paths to protect
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
