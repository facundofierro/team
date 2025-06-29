import { NextRequest, NextResponse } from 'next/server'
import { dbMemories, db } from '@teamhub/db'
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

    const resolvedParams = await params
    const agentId = String(resolvedParams.agentId)
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

    // Get organization info to resolve the actual database name
    const organizations = await db.getOrganizations(session.user.id)
    const organization = organizations.find((org) => org.id === organizationId)

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // For now, return empty memories array if database connection fails
    // This prevents the 500 error while the database setup is being resolved
    try {
      // Use the organization's database name, not the organization ID
      const memoryDb = await dbMemories(organization.databaseName)

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
      console.warn(
        'Database not ready for organization:',
        organizationId,
        'database:',
        organization.databaseName
      )
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
