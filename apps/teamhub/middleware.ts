export { auth as middleware } from '@/auth'

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
}
