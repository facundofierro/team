import { NextRequest, NextResponse } from 'next/server'
import { dbMemories, getOrganizations, reactiveDb } from '@teamhub/db'
import { auth } from '@/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string; memoryId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const agentId = String(resolvedParams.agentId)
    const memoryId = String(resolvedParams.memoryId)
    const body = await request.json()
    const { organizationId } = body

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    // Get organization info to resolve the actual database name
    const organizations = await getOrganizations.execute(
      { userId: session.user.id },
      reactiveDb
    )
    const organization = organizations.find((org) => org.id === organizationId)

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    try {
      // Use the organization's database name, not the organization ID
      const memoryDb = await dbMemories(organization.databaseName)

      // Delete the memory
      await memoryDb.deleteMemory(memoryId)

      return NextResponse.json({
        success: true,
        message: 'Memory deleted successfully',
      })
    } catch (dbError) {
      console.error('Database error when deleting memory:', dbError)
      return NextResponse.json(
        { error: 'Failed to delete memory from database' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error deleting memory:', error)
    return NextResponse.json(
      { error: 'Failed to delete memory' },
      { status: 500 }
    )
  }
}
