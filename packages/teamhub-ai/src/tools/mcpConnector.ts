import { ToolTypeDefinition } from '../tools'
import { z } from 'zod'

export type MCPConnectorParameters = {
  serverUrl: string
  operation: 'list_tools' | 'call_tool' | 'test_connection'
  toolName?: string
  toolArguments?: Record<string, unknown>
}

export type MCPServerInfo = {
  name: string
  version: string
  availableTools: Array<{
    name: string
    description?: string
    inputSchema: Record<string, unknown>
  }>
  capabilities: {
    resources?: boolean
    tools?: boolean
    prompts?: boolean
    logging?: boolean
  }
}

export type MCPConnectorResult = {
  success: boolean
  operation: string
  serverUrl: string
  data?: unknown
  tools?: Array<{
    name: string
    description?: string
    inputSchema: Record<string, unknown>
  }>
  serverInfo?: MCPServerInfo
  error?: string
  message: string
}

export const mcpConnector: ToolTypeDefinition = {
  id: 'mcpConnector',
  type: 'mcpConnector',
  description:
    'Connect to and interact with Model Context Protocol (MCP) servers. Allows discovery of available tools and execution of MCP tools.',
  canBeManaged: false, // Manual configuration required
  managedPrice: 0,
  managedPriceDescription:
    'Direct connection to MCP servers - pricing depends on the target server',
  monthlyUsage: 0,
  isActive: true,
  createdAt: null,
  allowedUsage: 1000,
  allowedTimeStart: '00:00',
  allowedTimeEnd: '23:59',
  configurationParams: {
    MCP_SERVER_URL: {
      type: 'string',
      description:
        'URL of the MCP server to connect to (e.g., http://localhost:3000, wss://mcp-server.com)',
    },
    MCP_AUTH_TOKEN: {
      type: 'string',
      description: 'Authentication token for the MCP server (if required)',
    },
    MCP_TIMEOUT: {
      type: 'string',
      description: 'Connection timeout in milliseconds (default: 30000)',
    },
    MCP_PROTOCOL: {
      type: 'string',
      description: 'Protocol to use: http, websocket, or stdio (default: http)',
    },
  },
  parametersSchema: z.object({
    serverUrl: z
      .string()
      .url()
      .optional()
      .describe('MCP server URL (will use configured URL if not provided)'),
    operation: z
      .enum(['list_tools', 'call_tool', 'test_connection'])
      .describe('Operation to perform on the MCP server'),
    toolName: z
      .string()
      .optional()
      .describe('Name of the tool to call (required for call_tool operation)'),
    toolArguments: z
      .record(z.string(), z.unknown())
      .optional()
      .describe('Arguments to pass to the MCP tool'),
  }),
  resultSchema: z.object({
    success: z.boolean().describe('Whether the operation was successful'),
    operation: z.string().describe('The operation that was performed'),
    serverUrl: z.string().describe('The MCP server URL that was accessed'),
    data: z.unknown().optional().describe('Result data from tool execution'),
    tools: z
      .array(
        z.object({
          name: z.string().describe('Tool name'),
          description: z.string().optional().describe('Tool description'),
          inputSchema: z
            .record(z.string(), z.unknown())
            .describe('Tool input schema definition'),
        })
      )
      .optional()
      .describe('Available tools on the MCP server'),
    serverInfo: z
      .object({
        name: z.string().describe('Server name'),
        version: z.string().describe('Server version'),
        availableTools: z
          .array(
            z.object({
              name: z.string(),
              description: z.string().optional(),
              inputSchema: z.record(z.string(), z.unknown()),
            })
          )
          .describe('List of available tools'),
        capabilities: z
          .object({
            resources: z.boolean().optional(),
            tools: z.boolean().optional(),
            prompts: z.boolean().optional(),
            logging: z.boolean().optional(),
          })
          .describe('Server capabilities'),
      })
      .optional()
      .describe('Information about the MCP server'),
    error: z.string().optional().describe('Error message if operation failed'),
    message: z.string().describe('Human-readable status message'),
  }),
  handler: async (
    params: unknown,
    configuration: Record<string, string>
  ): Promise<MCPConnectorResult> => {
    console.log('🔌 MCP Connector: Starting operation')
    console.log(
      '📋 MCP Connector: Received params:',
      JSON.stringify(params, null, 2)
    )

    const {
      serverUrl: paramServerUrl,
      operation,
      toolName,
      toolArguments = {},
    } = params as MCPConnectorParameters

    try {
      // Get server URL from parameters or configuration
      const serverUrl = paramServerUrl || configuration.MCP_SERVER_URL
      if (!serverUrl) {
        throw new Error(
          'MCP server URL is required either as parameter or in configuration'
        )
      }

      const authToken = configuration.MCP_AUTH_TOKEN
      const timeout = parseInt(configuration.MCP_TIMEOUT || '30000')
      const protocol = configuration.MCP_PROTOCOL || 'http'

      console.log(
        `🔌 MCP Connector: Connecting to ${serverUrl} using ${protocol} protocol`
      )

      // Basic headers setup
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'TeamHub-MCP-Connector/1.0',
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      switch (operation) {
        case 'test_connection':
          return await testMCPConnection(serverUrl, headers, timeout)

        case 'list_tools':
          return await listMCPTools(serverUrl, headers, timeout)

        case 'call_tool':
          if (!toolName) {
            throw new Error('toolName is required for call_tool operation')
          }
          return await callMCPTool(
            serverUrl,
            headers,
            timeout,
            toolName,
            toolArguments
          )

        default:
          throw new Error(`Unsupported operation: ${operation}`)
      }
    } catch (error) {
      console.error('❌ MCP Connector: Operation failed:', error)
      return {
        success: false,
        operation,
        serverUrl: paramServerUrl || configuration.MCP_SERVER_URL || 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: `MCP operation failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      }
    }
  },
}

async function testMCPConnection(
  serverUrl: string,
  headers: Record<string, string>,
  timeout: number
): Promise<MCPConnectorResult> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    // Try to connect and get server info
    const response = await fetch(`${serverUrl}/mcp/info`, {
      method: 'GET',
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const serverInfo = await response.json()

    return {
      success: true,
      operation: 'test_connection',
      serverUrl,
      serverInfo,
      message: `Successfully connected to MCP server: ${
        serverInfo.name || 'Unknown'
      }`,
    }
  } catch (error) {
    return {
      success: false,
      operation: 'test_connection',
      serverUrl,
      error: error instanceof Error ? error.message : 'Connection failed',
      message: `Failed to connect to MCP server: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    }
  }
}

async function listMCPTools(
  serverUrl: string,
  headers: Record<string, string>,
  timeout: number
): Promise<MCPConnectorResult> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(`${serverUrl}/mcp/tools/list`, {
      method: 'GET',
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const tools = Array.isArray(data.tools) ? data.tools : []

    return {
      success: true,
      operation: 'list_tools',
      serverUrl,
      tools,
      message: `Found ${tools.length} tools on MCP server`,
    }
  } catch (error) {
    return {
      success: false,
      operation: 'list_tools',
      serverUrl,
      error: error instanceof Error ? error.message : 'Failed to list tools',
      message: `Failed to list MCP tools: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    }
  }
}

async function callMCPTool(
  serverUrl: string,
  headers: Record<string, string>,
  timeout: number,
  toolName: string,
  toolArguments: Record<string, unknown>
): Promise<MCPConnectorResult> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(`${serverUrl}/mcp/tools/call`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: toolName,
        arguments: toolArguments,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      operation: 'call_tool',
      serverUrl,
      data,
      message: `Successfully executed MCP tool: ${toolName}`,
    }
  } catch (error) {
    return {
      success: false,
      operation: 'call_tool',
      serverUrl,
      error: error instanceof Error ? error.message : 'Tool execution failed',
      message: `Failed to execute MCP tool ${toolName}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    }
  }
}
