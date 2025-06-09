import { NextRequest, NextResponse } from 'next/server'
import { dbMemories } from '@teamhub/db'
import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { agentId } = await params
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

    // For now, return empty memories array if database connection fails
    // This prevents the 500 error while the database setup is being resolved
    try {
      const memoryDb = await dbMemories(organizationId)

      let memories

      if (search && search.trim()) {
        memories = await memoryDb.searchMemories(agentId, search, {
          types,
          categories,
          limit,
        })
      } else {
        memories = await memoryDb.getAgentMemories(agentId, {
          types,
          categories,
          limit,
          orderBy: 'recent',
        })
      }

      return NextResponse.json({ memories })
    } catch (dbError) {
      console.warn('Database not ready for organization:', organizationId)
      // Return empty memories array when database is not set up yet
      return NextResponse.json({ memories: [] })
    }
  } catch (error) {
    console.error('Error fetching memories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 }
    )
  }
}
