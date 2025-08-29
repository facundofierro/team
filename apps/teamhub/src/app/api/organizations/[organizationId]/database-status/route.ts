import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getOrganizations, reactiveDb } from '@teamhub/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const organizationId = String(resolvedParams.organizationId)

    // Get organization info to verify ownership
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

    // Skip deep internal imports during Next build; return basic status based on lookup
    return NextResponse.json({
      organizationId,
      databaseName: organization.databaseName,
      status: 'unknown',
      message:
        'Database existence check is handled by backend setup scripts outside Next build.',
    })
  } catch (error) {
    console.error('Error checking database status:', error)
    return NextResponse.json(
      { error: 'Failed to check database status' },
      { status: 500 }
    )
  }
}
