import { createSSEStream } from '@drizzle/reactive'
import { auth } from '@/auth'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const organizationId = searchParams.get('organizationId')

  if (!organizationId) {
    return new Response('Organization ID required', { status: 400 })
  }

  // TODO: Verify user has access to this organization
  // For now, we'll trust the session but in production you should verify
  // that the user has access to the requested organization

  console.log(
    `🔥 SSE: Creating event stream for organization ${organizationId}, user ${session.user.id}`
  )

  try {
    return createSSEStream(organizationId)
  } catch (error) {
    console.error('❌ SSE: Failed to create event stream:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
