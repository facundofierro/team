import { acknowledgeEvent } from '@drizzle/reactive'
import { auth } from '@/auth'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { eventId } = await request.json()

    if (!eventId || typeof eventId !== 'string') {
      return new Response('Event ID is required', { status: 400 })
    }

    console.log(
      `✅ SSE: Acknowledging event ${eventId} for user ${session.user.id}`
    )

    acknowledgeEvent(eventId)

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('❌ SSE: Failed to acknowledge event:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
