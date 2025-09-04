import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { MCPResourceMonitor } from '@agelum/ai'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { organizationId } = await params

    // TODO: Verify user has access to this organization

    console.log(`Getting resource summary for organization: ${organizationId}`)

    // Get resource monitor instance
    const resourceMonitor = MCPResourceMonitor.getInstance()

    // Get comprehensive resource summary
    const summary = await resourceMonitor.getOrganizationResourceSummary(
      organizationId
    )

    return NextResponse.json({
      success: true,
      ...summary,
    })
  } catch (error) {
    console.error('Error getting resource data:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to get resource data',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { organizationId } = await params

    // TODO: Verify user has access to this organization

    // Parse request body to get action
    const body = await request.json()
    const { action } = body

    console.log(
      `Resource monitoring action "${action}" for organization: ${organizationId}`
    )

    // Get resource monitor instance
    const resourceMonitor = MCPResourceMonitor.getInstance()

    let result: any = {}

    // Perform the action
    switch (action) {
      case 'start-monitoring':
        resourceMonitor.startMonitoring()
        result = {
          message: 'Resource monitoring started',
          status: resourceMonitor.getMonitoringStatus(),
        }
        break

      case 'stop-monitoring':
        resourceMonitor.stopMonitoring()
        result = {
          message: 'Resource monitoring stopped',
          status: resourceMonitor.getMonitoringStatus(),
        }
        break

      case 'get-status':
        result = {
          message: 'Monitoring status retrieved',
          status: resourceMonitor.getMonitoringStatus(),
        }
        break

      default:
        return NextResponse.json(
          {
            error:
              'Invalid action. Must be "start-monitoring", "stop-monitoring", or "get-status"',
          },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error(`Error managing resource monitoring:`, error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to manage resource monitoring',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
