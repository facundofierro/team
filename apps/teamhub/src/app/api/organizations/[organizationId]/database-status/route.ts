import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@teamhub/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { organizationId } = await params

    // Get organization info to verify ownership
    const organizations = await db.getOrganizations(session.user.id)
    const organization = organizations.find((org) => org.id === organizationId)

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Use the existing database utility function instead of direct pg connection
    try {
      const { createOrgDatabaseAndSchemas } = await import(
        '@teamhub/db/src/db/functions/utils/database'
      )

      // Ensure database and schemas exist - this will create everything if missing
      await createOrgDatabaseAndSchemas(organization.databaseName)

      return NextResponse.json({
        organizationId,
        databaseName: organization.databaseName,
        status: 'ready',
        message: 'Database and schemas verified and ensured',
      })
    } catch (error: any) {
      return NextResponse.json({
        organizationId,
        databaseName: organization.databaseName,
        status: 'error',
        error: error.message,
      })
    }
  } catch (error) {
    console.error('Error checking database status:', error)
    return NextResponse.json(
      { error: 'Failed to check database status' },
      { status: 500 }
    )
  }
}
