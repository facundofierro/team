import { z } from 'zod'

export type MCPDiscoveryParameters = {
  searchQuery?: string
  category?: 'productivity' | 'development' | 'data' | 'communication' | 'all'
  source?: 'github' | 'registry' | 'community' | 'all'
  limit?: number
}

export type MCPServerListing = {
  name: string
  description: string
  url: string
  category: string
  author: string
  version?: string
  stars?: number
  lastUpdated?: string
  documentation?: string
  examples?: Array<{
    name: string
    description: string
    url?: string
  }>
  installInstructions?: string
  requirements?: string[]
  tags?: string[]
}

export type MCPDiscoveryResult = {
  success: boolean
  query?: string
  totalFound: number
  servers: MCPServerListing[]
  sources: string[]
  message: string
}

// Built-in registry of popular MCP servers
const POPULAR_MCP_SERVERS: MCPServerListing[] = [
  {
    name: 'File System MCP',
    description:
      'Access and manipulate files and directories on the local filesystem',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    category: 'development',
    author: 'Anthropic',
    version: '1.0.0',
    stars: 1200,
    lastUpdated: '2024-01-15',
    documentation:
      'https://modelcontextprotocol.io/docs/built-in-servers/filesystem',
    examples: [
      {
        name: 'Read project files',
        description: 'Read and analyze codebase files',
      },
      {
        name: 'Write configuration',
        description: 'Create and update config files',
      },
    ],
    installInstructions: 'npx @modelcontextprotocol/server-filesystem',
    requirements: ['Node.js 16+'],
    tags: ['filesystem', 'files', 'directories', 'local'],
  },
  {
    name: 'Web Search MCP',
    description: 'Search the web using various search engines and APIs',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/web-search',
    category: 'productivity',
    author: 'Anthropic',
    version: '1.0.0',
    stars: 800,
    lastUpdated: '2024-01-10',
    documentation:
      'https://modelcontextprotocol.io/docs/built-in-servers/web-search',
    examples: [
      {
        name: 'Research topics',
        description: 'Search for information on any topic',
      },
      {
        name: 'News updates',
        description: 'Get latest news and updates',
      },
    ],
    installInstructions: 'npx @modelcontextprotocol/server-web-search',
    requirements: ['API keys for search engines'],
    tags: ['web', 'search', 'research', 'internet'],
  },
  {
    name: 'Database MCP',
    description:
      'Connect to and query various databases (PostgreSQL, MySQL, SQLite)',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/database',
    category: 'data',
    author: 'Anthropic',
    version: '1.0.0',
    stars: 650,
    lastUpdated: '2024-01-12',
    documentation:
      'https://modelcontextprotocol.io/docs/built-in-servers/database',
    examples: [
      {
        name: 'Query customer data',
        description: 'Retrieve and analyze customer information',
      },
      {
        name: 'Generate reports',
        description: 'Create data-driven reports',
      },
    ],
    installInstructions: 'npx @modelcontextprotocol/server-database',
    requirements: ['Database connection credentials'],
    tags: ['database', 'sql', 'data', 'query'],
  },
  {
    name: 'GitHub MCP',
    description:
      'Interact with GitHub repositories, issues, pull requests, and more',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
    category: 'development',
    author: 'Anthropic',
    version: '1.0.0',
    stars: 950,
    lastUpdated: '2024-01-14',
    documentation:
      'https://modelcontextprotocol.io/docs/built-in-servers/github',
    examples: [
      {
        name: 'Repository analysis',
        description: 'Analyze repository structure and activity',
      },
      {
        name: 'Issue management',
        description: 'Create and manage GitHub issues',
      },
    ],
    installInstructions: 'npx @modelcontextprotocol/server-github',
    requirements: ['GitHub personal access token'],
    tags: ['github', 'git', 'repository', 'development'],
  },
  {
    name: 'Slack MCP',
    description:
      'Send messages, read channels, and interact with Slack workspaces',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
    category: 'communication',
    author: 'Anthropic',
    version: '1.0.0',
    stars: 720,
    lastUpdated: '2024-01-08',
    documentation:
      'https://modelcontextprotocol.io/docs/built-in-servers/slack',
    examples: [
      {
        name: 'Team notifications',
        description: 'Send updates to team channels',
      },
      {
        name: 'Status monitoring',
        description: 'Monitor workspace activity',
      },
    ],
    installInstructions: 'npx @modelcontextprotocol/server-slack',
    requirements: ['Slack bot token'],
    tags: ['slack', 'communication', 'messaging', 'team'],
  },
  {
    name: 'Email MCP',
    description: 'Send and receive emails through various email providers',
    url: 'https://github.com/community/mcp-email-server',
    category: 'communication',
    author: 'Community',
    version: '0.9.0',
    stars: 340,
    lastUpdated: '2024-01-05',
    documentation: 'https://github.com/community/mcp-email-server/README.md',
    examples: [
      {
        name: 'Automated reports',
        description: 'Send automated status reports',
      },
      {
        name: 'Customer outreach',
        description: 'Manage customer communications',
      },
    ],
    installInstructions:
      'git clone https://github.com/community/mcp-email-server && npm install',
    requirements: ['SMTP server credentials'],
    tags: ['email', 'smtp', 'communication', 'automation'],
  },
]

/**
 * MCP Discovery Service
 * Utility service for discovering and searching MCP servers
 * This is not an agent tool, but a service used by the UI
 */
export class MCPDiscoveryService {
  /**
   * Search for MCP servers based on criteria
   */
  static async searchMCPServers(
    params: MCPDiscoveryParameters,
    githubToken?: string
  ): Promise<MCPDiscoveryResult> {
    console.log('🔍 MCP Discovery Service: Starting search')
    console.log(
      '📋 MCP Discovery: Received params:',
      JSON.stringify(params, null, 2)
    )

    const { searchQuery, category = 'all', source = 'all', limit = 20 } = params

    try {
      let allServers: MCPServerListing[] = []
      const searchedSources: string[] = []

      // Search built-in registry
      if (source === 'registry' || source === 'all') {
        console.log('🔍 MCP Discovery: Searching built-in registry')
        allServers.push(...POPULAR_MCP_SERVERS)
        searchedSources.push('registry')
      }

      // Search GitHub (if requested and token available)
      if ((source === 'github' || source === 'all') && githubToken) {
        console.log('🔍 MCP Discovery: Searching GitHub repositories')
        const githubResults = await this.searchGitHubMCPs(
          searchQuery,
          githubToken
        )
        allServers.push(...githubResults)
        searchedSources.push('github')
      }

      // Search npm registry for MCP packages
      if (source === 'community' || source === 'all') {
        console.log('🔍 MCP Discovery: Searching npm registry')
        const npmResults = await this.searchNpmMCPs(searchQuery)
        allServers.push(...npmResults)
        searchedSources.push('npm')
      }

      // Filter by category
      if (category !== 'all') {
        allServers = allServers.filter((server) => server.category === category)
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        allServers = allServers.filter(
          (server) =>
            server.name.toLowerCase().includes(query) ||
            server.description.toLowerCase().includes(query) ||
            server.tags?.some((tag) => tag.toLowerCase().includes(query))
        )
      }

      // Remove duplicates based on name
      allServers = allServers.filter(
        (server, index, self) =>
          index ===
          self.findIndex(
            (s) => s.name.toLowerCase() === server.name.toLowerCase()
          )
      )

      // Sort by relevance (stars, last updated)
      allServers.sort((a, b) => {
        const aScore = (a.stars || 0) + (a.lastUpdated ? 100 : 0)
        const bScore = (b.stars || 0) + (b.lastUpdated ? 100 : 0)
        return bScore - aScore
      })

      // Limit results
      const limitedServers = allServers.slice(0, limit)

      return {
        success: true,
        query: searchQuery,
        totalFound: allServers.length,
        servers: limitedServers,
        sources: searchedSources,
        message: `Found ${allServers.length} MCP servers${
          searchQuery ? ` matching "${searchQuery}"` : ''
        }${category !== 'all' ? ` in category "${category}"` : ''} (showing ${
          limitedServers.length
        })`,
      }
    } catch (error) {
      console.error('❌ MCP Discovery: Search failed:', error)
      return {
        success: false,
        totalFound: 0,
        servers: [],
        sources: [],
        message: `MCP discovery failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      }
    }
  }

  /**
   * Get popular MCP servers from built-in registry
   */
  static getPopularMCPs(category?: string): MCPServerListing[] {
    if (!category || category === 'all') {
      return POPULAR_MCP_SERVERS
    }
    return POPULAR_MCP_SERVERS.filter((server) => server.category === category)
  }

  /**
   * Get MCP server categories
   */
  static getCategories(): string[] {
    const categories = new Set(
      POPULAR_MCP_SERVERS.map((server) => server.category)
    )
    return Array.from(categories).sort()
  }

  /**
   * Search GitHub for MCP repositories
   */
  private static async searchGitHubMCPs(
    searchQuery?: string,
    githubToken?: string
  ): Promise<MCPServerListing[]> {
    if (!githubToken) {
      return []
    }

    try {
      const allRepos: MCPServerListing[] = []

      // Multiple search strategies to find MCP servers
      const searchQueries = [
        searchQuery
          ? `${searchQuery} mcp model context protocol server`
          : 'mcp model context protocol server',
        'mcp-server',
        'model-context-protocol',
        '@modelcontextprotocol/server',
        'mcp server typescript',
        'mcp server python',
      ]

      for (const query of searchQueries) {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(
            query
          )}&sort=stars&order=desc&per_page=10`,
          {
            headers: {
              Authorization: `token ${githubToken}`,
              'User-Agent': 'TeamHub-MCP-Discovery/1.0',
            },
          }
        )

        if (!response.ok) {
          console.warn(
            `GitHub search failed for "${query}":`,
            response.statusText
          )
          continue
        }

        const data = await response.json()
        const repositories = Array.isArray(data.items) ? data.items : []

        const repos = repositories.map((repo: any) => ({
          name: repo.name,
          description: repo.description || 'No description available',
          url: repo.html_url,
          category: this.categorizeRepo(
            repo.name,
            repo.description,
            repo.topics
          ),
          author: repo.owner.login,
          version: 'latest',
          stars: repo.stargazers_count,
          lastUpdated: repo.updated_at,
          documentation: repo.homepage || `${repo.html_url}/README.md`,
          installInstructions: `git clone ${repo.clone_url}`,
          requirements: ['Git', 'Node.js'],
          tags: ['github', 'community', ...(repo.topics || [])],
        }))

        allRepos.push(...repos)
      }

      // Remove duplicates based on URL
      const uniqueRepos = allRepos.filter(
        (repo, index, self) =>
          index === self.findIndex((r) => r.url === repo.url)
      )

      return uniqueRepos
    } catch (error) {
      console.warn('GitHub search error:', error)
      return []
    }
  }

  /**
   * Categorize repository based on name, description, and topics
   */
  private static categorizeRepo(
    name: string,
    description: string,
    topics: string[] = []
  ): string {
    const text = `${name} ${description} ${topics.join(' ')}`.toLowerCase()

    if (
      text.includes('database') ||
      text.includes('sql') ||
      text.includes('postgres') ||
      text.includes('mysql')
    ) {
      return 'data'
    }
    if (
      text.includes('slack') ||
      text.includes('email') ||
      text.includes('chat') ||
      text.includes('message')
    ) {
      return 'communication'
    }
    if (
      text.includes('search') ||
      text.includes('web') ||
      text.includes('browser') ||
      text.includes('productivity')
    ) {
      return 'productivity'
    }
    if (
      text.includes('github') ||
      text.includes('git') ||
      text.includes('code') ||
      text.includes('dev')
    ) {
      return 'development'
    }

    return 'development' // Default category
  }

  /**
   * Search npm registry for MCP packages
   */
  private static async searchNpmMCPs(
    searchQuery?: string
  ): Promise<MCPServerListing[]> {
    try {
      const query = searchQuery
        ? `${searchQuery} mcp model context protocol`
        : 'mcp model context protocol'
      const response = await fetch(
        `https://registry.npmjs.org/-/v1/search?q=${encodeURIComponent(
          query
        )}&size=20`,
        {
          headers: {
            'User-Agent': 'TeamHub-MCP-Discovery/1.0',
          },
        }
      )

      if (!response.ok) {
        console.warn('NPM search failed:', response.statusText)
        return []
      }

      const data = await response.json()
      const packages = Array.isArray(data.objects) ? data.objects : []

      return packages.map((pkg: any) => ({
        name: pkg.package.name,
        description: pkg.package.description || 'No description available',
        url: `https://www.npmjs.com/package/${pkg.package.name}`,
        category: 'development', // Default category for npm packages
        author: pkg.package.author?.name || 'Unknown',
        version: pkg.package.version,
        stars: pkg.package.github_stars || 0,
        lastUpdated: pkg.package.date,
        documentation:
          pkg.package.homepage ||
          `https://www.npmjs.com/package/${pkg.package.name}`,
        installInstructions: `npm install ${pkg.package.name}`,
        requirements: ['Node.js'],
        tags: ['npm', 'package', 'nodejs'],
      }))
    } catch (error) {
      console.warn('NPM search error:', error)
      return []
    }
  }
}
