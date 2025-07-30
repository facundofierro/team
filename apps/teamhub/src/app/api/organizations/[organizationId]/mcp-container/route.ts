import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { MCPContainerManager, type MCPContainerConfig } from '@teamhub/ai'

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

    // Parse request body to get action and config
    const body = await request.json()
    const { action, config } = body

    if (!action || !['ensure', 'start', 'stop', 'remove'].includes(action)) {
      return NextResponse.json(
        {
          error:
            'Invalid action. Must be "ensure", "start", "stop", or "remove"',
        },
        { status: 400 }
      )
    }

    console.log(
      `Container action "${action}" for organization: ${organizationId}`
    )

    // Get container manager instance
    const containerManager = MCPContainerManager.getInstance()

    let result: any = {}

    // Perform the action
    switch (action) {
      case 'ensure':
        await containerManager.ensureContainer(organizationId, config)
        result = { message: 'Container ensured and ready' }
        break

      case 'start':
        await containerManager.startContainer(organizationId)
        result = { message: 'Container started successfully' }
        break

      case 'stop':
        await containerManager.stopContainer(organizationId)
        result = { message: 'Container stopped successfully' }
        break

      case 'remove':
        await containerManager.removeContainer(organizationId)
        result = { message: 'Container and volumes removed successfully' }
        break
    }

    // Get updated container info
    const containerInfo = await containerManager.getContainerInfo(
      organizationId
    )

    return NextResponse.json({
      success: true,
      ...result,
      container: containerInfo,
    })
  } catch (error) {
    console.error(`Error managing container:`, error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to manage container',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}

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

    console.log(`Getting container info for organization: ${organizationId}`)

    // Get container manager instance
    const containerManager = MCPContainerManager.getInstance()

    // Get container info
    const containerInfo = await containerManager.getContainerInfo(
      organizationId
    )
    const isRunning = await containerManager.isContainerRunning(organizationId)
    const exists = await containerManager.containerExists(organizationId)

    return NextResponse.json({
      success: true,
      exists,
      running: isRunning,
      container: containerInfo,
      message: containerInfo
        ? `Container ${containerInfo.status}`
        : 'No container found',
    })
  } catch (error) {
    console.error(`Error getting container info:`, error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to get container info',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
