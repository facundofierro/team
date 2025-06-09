import { NextRequest, NextResponse } from 'next/server'
import { dbMemories } from '@teamhub/db'
import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const types = searchParams.get('types')?.split(',')
    const categories = searchParams.get('categories')?.split(',')

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    // Get database connection for the organization
    const memoryDb = await dbMemories(organizationId)

    let memories

    if (search && search.trim()) {
      // Use search function if search term provided
      memories = await memoryDb.searchMemories(params.agentId, search, {
        types,
        categories,
        limit,
      })
    } else {
      // Get all memories for the agent, ordered by creation time (most recent first)
      memories = await memoryDb.getAgentMemories(params.agentId, {
        types,
        categories,
        limit,
        orderBy: 'recent',
      })
    }

    return NextResponse.json({ memories })
  } catch (error) {
    console.error('Error fetching memories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 }
    )
  }
}
