import { ToolTypeDefinition } from '../tools'
import { z } from 'zod'

export type SearchYandexParameters = {
  query: string
  numResults: number
  searchType: 'web' | 'news' | 'images'
  familyMode?: 'off' | 'moderate' | 'strict'
  page?: number
  fixTypoMode?: 'off' | 'on'
  sortMode?: 'relevance' | 'date' | 'rank'
  sortOrder?: 'ascending' | 'descending'
  groupMode?: 'off' | 'site' | 'url'
  groupsPerPage?: number
  docsPerGroup?: number
  maxPassages?: number
  region?: string
  language?: string
}

export type SearchYandexResult = {
  title: string
  link: string
  snippet: string
}

export const searchYandex: ToolTypeDefinition = {
  id: 'searchYandex',
  type: 'searchYandex',
  description:
    'Search the internet using Yandex Search API (Note: This tool may face rate limiting or captcha challenges)',
  canBeManaged: true,
  managedPrice: 0,
  managedPriceDescription: '1000 requests per month for free',
  monthlyUsage: 0,
  isActive: true,
  createdAt: null,
  allowedUsage: 1000,
  allowedTimeStart: '00:00',
  allowedTimeEnd: '23:59',
  configurationParams: {
    YANDEX_API_KEY: {
      type: 'string',
      description:
        'The Yandex Cloud IAM Token (Bearer token for API v2 authentication)',
    },
    YANDEX_USER_KEY: {
      type: 'string',
      description:
        'The Yandex Cloud Folder ID (catalog identifier for search requests)',
    },
  },
  parametersSchema: z.object({
    query: z.string().describe('The search query to execute'),
    numResults: z
      .number()
      .min(1)
      .max(100)
      .default(10)
      .describe('Number of results to return'),
    searchType: z
      .enum(['web', 'news', 'images'])
      .default('web')
      .describe('Type of search to perform'),
    familyMode: z
      .enum(['off', 'moderate', 'strict'])
      .optional()
      .describe('Content filtering level'),
    page: z.number().optional().describe('Page number of results'),
    fixTypoMode: z
      .enum(['off', 'on'])
      .optional()
      .describe('Automatic typo correction'),
    sortMode: z
      .enum(['relevance', 'date', 'rank'])
      .optional()
      .describe('How to sort results'),
    sortOrder: z
      .enum(['ascending', 'descending'])
      .optional()
      .describe('Order of sorted results'),
    groupMode: z
      .enum(['off', 'site', 'url'])
      .optional()
      .describe('How to group results'),
    groupsPerPage: z.number().optional().describe('Number of groups per page'),
    docsPerGroup: z
      .number()
      .optional()
      .describe('Number of documents per group'),
    maxPassages: z
      .number()
      .optional()
      .describe('Maximum number of text passages'),
    region: z.string().optional().describe('Region ID for localized results'),
    language: z.string().optional().describe('Notification language'),
  }),
  resultSchema: z.array(
    z.object({
      title: z.string().describe('The title of the search result'),
      link: z.string().describe('The link of the search result'),
      snippet: z.string().describe('The snippet of the search result'),
    })
  ),
  handler: async (
    params: unknown,
    configuration: Record<string, string>
  ): Promise<unknown[]> => {
    console.log('🔍 Yandex Search Tool: Starting execution')
    console.log(
      '📋 Yandex Search Tool: Received params:',
      JSON.stringify(params, null, 2)
    )
    console.log(
      '⚙️ Yandex Search Tool: Received configuration keys:',
      Object.keys(configuration)
    )

    const {
      query,
      numResults,
      searchType,
      familyMode,
      page,
      fixTypoMode,
      sortMode,
      sortOrder,
      groupMode,
      groupsPerPage,
      docsPerGroup,
      maxPassages,
      region,
      language,
    } = params as SearchYandexParameters

    console.log(
      `🔍 Yandex Search Tool: Query="${query}", Results=${numResults}, Type=${searchType}`
    )

    // Get API keys from configuration or environment variables
    const YANDEX_API_KEY =
      configuration.YANDEX_API_KEY || process.env.YANDEX_API_KEY
    const YANDEX_USER_ID =
      configuration.YANDEX_USER_KEY || process.env.YANDEX_USER_KEY

    console.log('🔑 Yandex Search Tool: API Key available:', !!YANDEX_API_KEY)
    console.log('🔑 Yandex Search Tool: User ID available:', !!YANDEX_USER_ID)
    if (YANDEX_API_KEY) {
      console.log(
        '🔑 Yandex Search Tool: API Key preview:',
        YANDEX_API_KEY.substring(0, 8) + '...'
      )
      console.log(
        '🔑 Yandex Search Tool: API Key length:',
        YANDEX_API_KEY.length
      )
    }
    if (YANDEX_USER_ID) {
      console.log(
        '🔑 Yandex Search Tool: User ID preview:',
        YANDEX_USER_ID.substring(0, 8) + '...'
      )
      console.log(
        '🔑 Yandex Search Tool: User ID length:',
        YANDEX_USER_ID.length
      )
    }

    try {
      if (!YANDEX_API_KEY) {
        console.error('❌ Yandex Search Tool: YANDEX_API_KEY is missing')
        throw new Error(
          'YANDEX_API_KEY must be set in configuration or environment'
        )
      }

      if (!YANDEX_USER_ID) {
        console.error(
          '❌ Yandex Search Tool: YANDEX_USER_KEY (User ID) is missing'
        )
        throw new Error(
          'YANDEX_USER_KEY (User ID) must be set in configuration or environment'
        )
      }

      // Build the Yandex Cloud Search API request according to official documentation
      const requestParams = {
        query: {
          searchType: 'SEARCH_TYPE_RU',
          queryText: query,
          familyMode:
            familyMode === 'strict'
              ? 'FAMILY_MODE_STRICT'
              : familyMode === 'off'
              ? 'FAMILY_MODE_NONE'
              : 'FAMILY_MODE_MODERATE',
          page: (page || 0).toString(),
        },
        maxPassages: (maxPassages || 4).toString(),
        region: region || '225',
        folderId: YANDEX_USER_ID,
        userAgent: 'TeamHub/1.0',
      }

      // Remove undefined values
      const cleanRequestParams = Object.fromEntries(
        Object.entries(requestParams).filter(
          ([_, value]) => value !== undefined
        )
      )

      console.log(
        '📤 Yandex Search Tool: Sending request params:',
        JSON.stringify(cleanRequestParams, null, 2)
      )
      console.log('🌐 Yandex Search Tool: Making API request to Yandex...')

      // Use Yandex Cloud Search API endpoint and authentication
      const apiUrl = 'https://searchapi.api.cloud.yandex.net/v2/web/search'

      console.log('🔗 Yandex Search Tool: API URL:', apiUrl)
      console.log(
        '📤 Yandex Search Tool: Request payload:',
        JSON.stringify(cleanRequestParams, null, 2)
          .replace(YANDEX_API_KEY, '[API_KEY]')
          .replace(YANDEX_USER_ID, '[FOLDER_ID]')
      )

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${YANDEX_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'User-Agent':
            'Mozilla/5.0 (compatible; TeamHub/1.0; +http://teamhub.ai)',
        },
        body: JSON.stringify(cleanRequestParams),
      })

      console.log('📥 Yandex Search Tool: Response status:', response.status)
      console.log(
        '📥 Yandex Search Tool: Response headers:',
        Object.fromEntries(response.headers.entries())
      )

      const responseText = await response.text()
      console.log(
        '📊 Yandex Search Tool: Raw response (first 1000 chars):',
        responseText.substring(0, 1000)
      )

      // Check if we got a captcha page instead of search results
      if (
        responseText.includes('Are you not a robot') ||
        responseText.includes('robot') ||
        response.headers.get('x-yandex-captcha')
      ) {
        console.error(
          '❌ Yandex Search Tool: Received captcha challenge instead of search results'
        )
        throw new Error(
          'Yandex API blocked the request with captcha. This may indicate invalid credentials, rate limiting, or the need for a different authentication method. Please verify your YANDEX_API_KEY and YANDEX_USER_KEY are correct for the Yandex Cloud Search API.'
        )
      }

      if (!response.ok) {
        console.error(
          '❌ Yandex Search Tool: API error response:',
          responseText
        )
        throw new Error(
          `Yandex API error: ${response.status} ${
            response.statusText
          } - ${responseText.substring(0, 500)}`
        )
      }

      // Parse response according to official docs: JSON wrapper with rawData containing XML
      let responseData
      try {
        const jsonWrapper = JSON.parse(responseText)
        console.log(
          '📊 Yandex Search Tool: JSON wrapper response:',
          JSON.stringify(jsonWrapper, null, 2).substring(0, 500) + '...'
        )

        if (jsonWrapper.rawData) {
          // The rawData is base64 encoded XML according to docs
          responseData = Buffer.from(jsonWrapper.rawData, 'base64').toString(
            'utf-8'
          )
          console.log(
            '📊 Yandex Search Tool: Decoded XML response (first 1000 chars):',
            responseData.substring(0, 1000)
          )
        } else {
          throw new Error(
            'No rawData field found in response (expected according to official docs)'
          )
        }
      } catch (error) {
        console.error('❌ Yandex Search Tool: Failed to parse response:', error)
        throw new Error(
          `Failed to parse API response according to docs: ${error}`
        )
      }

      // Parse XML response according to official documentation
      const results: SearchYandexResult[] = []

      // Extract search results from XML response using regex parsing
      const docRegex = /<doc[^>]*>(.*?)<\/doc>/gs
      const urlRegex = /<url>(.*?)<\/url>/s
      const titleRegex = /<title>(.*?)<\/title>/s
      const passagesRegex = /<passages>(.*?)<\/passages>/s

      let match
      let docCount = 0
      while (
        (match = docRegex.exec(responseData)) !== null &&
        docCount < numResults
      ) {
        const docContent = match[1]

        const urlMatch = urlRegex.exec(docContent)
        const titleMatch = titleRegex.exec(docContent)
        const passagesMatch = passagesRegex.exec(docContent)

        let snippet = 'No snippet available'
        if (passagesMatch) {
          // Clean up passages by removing XML tags and getting text content
          snippet = passagesMatch[1]
            .replace(/<[^>]*>/g, '') // Remove XML tags
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .trim()
        }

        const result: SearchYandexResult = {
          title: titleMatch
            ? titleMatch[1].replace(/<[^>]*>/g, '').trim()
            : 'No title',
          link: urlMatch ? urlMatch[1] : 'No URL',
          snippet: snippet,
        }

        results.push(result)
        docCount++

        console.log(
          `📄 Yandex Search Tool: Processing result ${results.length}:`,
          {
            title: result.title.substring(0, 50) + '...',
            url: result.link,
            hasSnippet: !!result.snippet,
          }
        )
      }

      // Check for XML error elements
      if (responseData.includes('<error>')) {
        const errorMatch = /<error[^>]*>(.*?)<\/error>/s.exec(responseData)
        const errorText = errorMatch ? errorMatch[1] : 'Unknown XML error'
        console.error(
          '❌ Yandex Search Tool: API returned XML error:',
          errorText
        )
        throw new Error(`Yandex API XML error: ${errorText}`)
      }

      if (results.length === 0) {
        console.error('❌ Yandex Search Tool: No results found in API response')

        // Check if we have a valid XML response structure but no results
        if (responseData && !responseData.includes('<error>')) {
          throw new Error(
            'No search results found - the query may be too specific or there may be no matching content'
          )
        }

        throw new Error('No search results found')
      }

      console.log(
        `✅ Yandex Search Tool: Successfully processed ${results.length} results`
      )
      console.log(
        '🎯 Yandex Search Tool: Final results:',
        JSON.stringify(results, null, 2)
      )

      return results
    } catch (error) {
      console.error('💥 Yandex Search Tool: Error occurred:', error)
      console.error(
        '💥 Yandex Search Tool: Error stack:',
        error instanceof Error ? error.stack : 'No stack trace'
      )
      throw new Error(
        `Failed to search Yandex: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  },
}
