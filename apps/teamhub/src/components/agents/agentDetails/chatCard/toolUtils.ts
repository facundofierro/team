import type { ToolCall } from '@agelum/db'

// Helper function to parse tool execution errors and extract user-friendly messages
export function parseToolError(toolCall: ToolCall): {
  title: string
  description: string
  variant: 'destructive' | 'default'
} {
  const toolName = getToolDisplayName(toolCall.name)

  // Get error content from either result or arguments
  const errorContent = JSON.stringify(
    toolCall.result || toolCall.arguments || {}
  )

  // Check if this is a token expiry error
  if (
    errorContent.includes('token has expired') ||
    errorContent.includes('401 Unauthorized')
  ) {
    return {
      title: `${toolName} - Authentication Error`,
      description:
        'The API token has expired and needs to be refreshed. Please contact your administrator.',
      variant: 'destructive',
    }
  }

  // Check for rate limit errors
  if (errorContent.includes('rate limit') || errorContent.includes('429')) {
    return {
      title: `${toolName} - Rate Limit`,
      description:
        'API rate limit exceeded. Please try again in a few minutes.',
      variant: 'destructive',
    }
  }

  // Check for network errors
  if (
    errorContent.includes('network') ||
    errorContent.includes('timeout') ||
    errorContent.includes('ECONNREFUSED')
  ) {
    return {
      title: `${toolName} - Network Error`,
      description:
        'Network connection failed. Please check your internet connection and try again.',
      variant: 'destructive',
    }
  }

  // Check for quota exceeded errors
  if (errorContent.includes('quota') || errorContent.includes('exceeded')) {
    return {
      title: `${toolName} - Quota Exceeded`,
      description:
        'API quota has been exceeded. Please try again later or contact your administrator.',
      variant: 'destructive',
    }
  }

  // Check for permission errors
  if (
    errorContent.includes('403') ||
    errorContent.includes('Forbidden') ||
    errorContent.includes('permission')
  ) {
    return {
      title: `${toolName} - Permission Error`,
      description:
        'Insufficient permissions to access this resource. Please contact your administrator.',
      variant: 'destructive',
    }
  }

  // Generic error fallback
  return {
    title: `${toolName} - Error`,
    description:
      'Tool execution failed. Please try again or contact support if the issue persists.',
    variant: 'destructive',
  }
}

// Helper function to infer tool name from arguments and other properties
export function inferToolName(toolCall: ToolCall): string {
  // If the name looks like a proper tool name (not a UUID), use it
  if (toolCall.name && !toolCall.name.match(/^[0-9a-f-]+$/i)) {
    return toolCall.name
  }

  // Try to infer from arguments
  const args = toolCall.arguments || {}

  // Check for search-related arguments
  if (args.query || args.searchQuery || args.searchType) {
    // Look for specific search engine indicators
    if (args.searchType === 'web' || args.engine === 'yandex') {
      return 'searchYandex'
    }
    if (args.engine === 'google') {
      return 'googleSearch'
    }
    // Generic web search
    return 'webSearch'
  }

  // Check for other common tool patterns
  if (args.url || args.webpage) {
    return 'webScraper'
  }

  if (args.code || args.language) {
    return 'codeRunner'
  }

  if (args.prompt || args.instruction) {
    return 'aiAssistant'
  }

  // If we can't infer, use the original name or a generic fallback
  return toolCall.name || 'unknownTool'
}

// Helper function to get user-friendly tool names
export function getToolDisplayName(toolName: string): string {
  // First try to infer the real tool name if this looks like an ID
  const actualToolName = toolName.match(/^[0-9a-f-]+$/i) ? toolName : toolName

  // Display friendly tool names
  if (actualToolName === 'searchYandex') return 'Yandex Search'
  if (actualToolName === 'webSearch') return 'Web Search'
  if (actualToolName === 'googleSearch') return 'Google Search'
  if (actualToolName === 'webScraper') return 'Web Scraper'
  if (actualToolName === 'codeRunner') return 'Code Runner'
  if (actualToolName === 'aiAssistant') return 'AI Assistant'
  if (actualToolName === 'unknownTool') return 'Unknown Tool'

  // Convert camelCase to Title Case
  return actualToolName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

// Helper function to check if a tool is a search tool
export function isSearchTool(toolName: string): boolean {
  return (
    toolName === 'searchYandex' || toolName.toLowerCase().includes('search')
  )
}

// Helper function to parse search results from various formats
export function parseSearchResults(result: any): any[] {
  let searchResults: any[] = []

  try {
    // Handle different result formats
    if (Array.isArray(result)) {
      searchResults = result
    } else if (typeof result === 'string') {
      // Try to parse JSON string
      try {
        const parsed = JSON.parse(result)
        if (Array.isArray(parsed)) {
          searchResults = parsed
        } else if (parsed && typeof parsed === 'object') {
          // Check for nested result arrays
          if (parsed.results && Array.isArray(parsed.results)) {
            searchResults = parsed.results
          } else if (parsed.items && Array.isArray(parsed.items)) {
            searchResults = parsed.items
          } else if (parsed.data && Array.isArray(parsed.data)) {
            searchResults = parsed.data
          }
        }
      } catch (parseError) {
        // If JSON parsing fails, try to extract results from the text
        console.warn(
          'Failed to parse JSON, looking for structured data in text:',
          parseError
        )

        // Look for array-like structures in the text
        const arrayMatch = result.match(/\[\s*{[\s\S]*}\s*\]/)
        if (arrayMatch) {
          try {
            const extractedArray = JSON.parse(arrayMatch[0])
            if (Array.isArray(extractedArray)) {
              searchResults = extractedArray
            }
          } catch (extractError) {
            console.warn('Failed to extract array from text:', extractError)
          }
        }
      }
    } else if (result && typeof result === 'object') {
      // Check for common search result structures
      if (result.results && Array.isArray(result.results)) {
        searchResults = result.results
      } else if (result.items && Array.isArray(result.items)) {
        searchResults = result.items
      } else if (result.data && Array.isArray(result.data)) {
        searchResults = result.data
      } else if (result.webPages && result.webPages.value) {
        // Bing search format
        searchResults = result.webPages.value
      } else if (result.organic_results) {
        // SerpAPI format
        searchResults = result.organic_results
      }
    }
  } catch (error) {
    console.error('Failed to parse search results:', error, 'Result:', result)
  }

  return searchResults
}
