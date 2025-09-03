import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { MCPContainerManager, type MCPInstallRequest } from '@agelum/ai'

// Simple validation function
function validateInstallRequest(body: any): {
  name: string
  source: string
  configuration: Record<string, string>
} {
  if (
    !body.name ||
    typeof body.name !== 'string' ||
    body.name.trim().length === 0
  ) {
    throw new Error('MCP name is required')
  }
  if (
    !body.source ||
    typeof body.source !== 'string' ||
    body.source.trim().length === 0
  ) {
    throw new Error('MCP source is required')
  }

  return {
    name: body.name,
    source: body.source,
    configuration: body.configuration || {},
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
    // const hasAccess = await checkOrganizationAccess(session.user.id, organizationId)
    // if (!hasAccess) {
    //   return NextResponse.json(
    //     { error: 'Forbidden' },
    //     { status: 403 }
    //   )
    // }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = validateInstallRequest(body)

    const installRequest: MCPInstallRequest = {
      name: validatedData.name,
      source: validatedData.source,
      configuration: validatedData.configuration,
    }

    console.log(
      `Installing MCP "${installRequest.name}" for organization: ${organizationId}`
    )

    // Get container manager instance
    const containerManager = MCPContainerManager.getInstance()

    // Install the MCP
    await containerManager.installMCP(organizationId, installRequest)

    return NextResponse.json({
      success: true,
      message: `MCP "${installRequest.name}" installed successfully`,
      mcp: {
        name: installRequest.name,
        source: installRequest.source,
        status: 'installed',
      },
    })
  } catch (error) {
    console.error('Error installing MCP:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    if (errorMessage.includes('required') || errorMessage.includes('Invalid')) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          message: errorMessage,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to install MCP',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
