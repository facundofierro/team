import { NextRequest, NextResponse } from 'next/server'
import { MCPDiscoveryService, type MCPDiscoveryParameters } from '@agelum/ai'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const params: MCPDiscoveryParameters = {
      searchQuery: searchParams.get('searchQuery') || undefined,
      category: (searchParams.get('category') as any) || 'all',
      source: (searchParams.get('source') as any) || 'all',
      limit: parseInt(searchParams.get('limit') || '50'),
    }

    // Get GitHub token from server environment
    const githubToken = process.env.GITHUB_TOKEN

    const result = await MCPDiscoveryService.searchMCPServers(
      params,
      githubToken
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('MCP Discovery API error:', error)
    return NextResponse.json(
      {
        success: false,
        totalFound: 0,
        servers: [],
        sources: [],
        message: 'Failed to discover MCP servers',
      },
      { status: 500 }
    )
  }
}
