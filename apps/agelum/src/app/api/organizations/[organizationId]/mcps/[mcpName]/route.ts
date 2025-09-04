import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { MCPContainerManager } from '@agelum/ai'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; mcpName: string }> }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { organizationId, mcpName } = await params

    // TODO: Verify user has access to this organization

    // Parse request body to get action
    const body = await request.json()
    const { action, port } = body

    if (!action || !['start', 'stop'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "start" or "stop"' },
        { status: 400 }
      )
    }

    console.log(
      `${
        action === 'start' ? 'Starting' : 'Stopping'
      } MCP "${mcpName}" for organization: ${organizationId}`
    )

    // Get container manager instance
    const containerManager = MCPContainerManager.getInstance()

    // Perform the action
    if (action === 'start') {
      await containerManager.startMCP(organizationId, mcpName, port)
    } else {
      await containerManager.stopMCP(organizationId, mcpName)
    }

    return NextResponse.json({
      success: true,
      message: `MCP "${mcpName}" ${
        action === 'start' ? 'started' : 'stopped'
      } successfully`,
      mcp: {
        name: mcpName,
        status: action === 'start' ? 'running' : 'stopped',
      },
    })
  } catch (error) {
    console.error(`Error managing MCP:`, error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to manage MCP',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; mcpName: string }> }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { organizationId, mcpName } = await params

    // TODO: Verify user has access to this organization

    console.log(`Removing MCP "${mcpName}" for organization: ${organizationId}`)

    // Get container manager instance
    const containerManager = MCPContainerManager.getInstance()

    // Stop the MCP first, then remove its files
    try {
      await containerManager.stopMCP(organizationId, mcpName)
    } catch (error) {
      // MCP might not be running, continue with removal
      console.log(`MCP "${mcpName}" was not running, proceeding with removal`)
    }

    // Remove MCP files
    await containerManager.execInContainer(organizationId, [
      'rm',
      '-rf',
      `/mcp/servers/${mcpName}`,
    ])

    // Remove PID file if exists
    await containerManager.execInContainer(organizationId, [
      'rm',
      '-f',
      `/mcp/data/${mcpName}.pid`,
    ])

    return NextResponse.json({
      success: true,
      message: `MCP "${mcpName}" removed successfully`,
    })
  } catch (error) {
    console.error(`Error removing MCP:`, error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to remove MCP',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
