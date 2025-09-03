import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { MCPContainerManager } from '@agelum/ai'

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

    console.log(`Getting MCP status for organization: ${organizationId}`)

    // Get container manager instance
    const containerManager = MCPContainerManager.getInstance()

    // Get container info
    const containerInfo = await containerManager.getContainerInfo(
      organizationId
    )

    if (!containerInfo) {
      return NextResponse.json({
        success: true,
        container: null,
        mcps: [],
        message: 'No MCP container found for this organization',
      })
    }

    // Get MCP status
    const mcpStatuses = await containerManager.getMCPStatus(organizationId)

    return NextResponse.json({
      success: true,
      container: {
        status: containerInfo.status,
        created: containerInfo.created,
        mcpCount: containerInfo.mcpCount,
      },
      mcps: mcpStatuses,
      message: `Found ${mcpStatuses.length} MCPs`,
    })
  } catch (error) {
    console.error('Error getting MCP status:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to get MCP status',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
