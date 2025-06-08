import { ToolTypeDefinition } from '../tools'
import { z } from 'zod'

export type SearchYandexGrpcParameters = {
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

export type SearchYandexGrpcResult = {
  title: string
  link: string
  snippet: string
}

export const searchYandexGrpc: ToolTypeDefinition = {
  id: 'searchYandexGrpc',
  type: 'searchYandexGrpc',
  description:
    'Search the internet using Yandex Search API with gRPC protocol (recommended by Russian documentation for synchronous requests)',
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
        'The Yandex Cloud IAM Token (Bearer token for API authentication)',
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
    console.log('🔍 Yandex gRPC Search Tool: Starting execution')
    console.log(
      '📋 Yandex gRPC Search Tool: Received params:',
      JSON.stringify(params, null, 2)
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
    } = params as SearchYandexGrpcParameters

    // Get API keys from configuration or environment variables
    const YANDEX_API_KEY =
      configuration.YANDEX_API_KEY || process.env.YANDEX_API_KEY
    const YANDEX_USER_ID =
      configuration.YANDEX_USER_KEY || process.env.YANDEX_USER_KEY

    console.log(
      '🔑 Yandex gRPC Search Tool: API Key available:',
      !!YANDEX_API_KEY
    )
    console.log(
      '🔑 Yandex gRPC Search Tool: User ID available:',
      !!YANDEX_USER_ID
    )

    try {
      if (!YANDEX_API_KEY) {
        throw new Error(
          'YANDEX_API_KEY must be set in configuration or environment'
        )
      }

      if (!YANDEX_USER_ID) {
        throw new Error(
          'YANDEX_USER_KEY (User ID) must be set in configuration or environment'
        )
      }

      // Build gRPC-style request with snake_case parameters according to Russian docs
      const grpcRequestParams = {
        query: {
          search_type: 'SEARCH_TYPE_RU',
          query_text: query,
          family_mode:
            familyMode === 'strict'
              ? 'FAMILY_MODE_STRICT'
              : familyMode === 'off'
              ? 'FAMILY_MODE_NONE'
              : 'FAMILY_MODE_MODERATE',
          page: (page || 0).toString(),
          fix_typo_mode:
            fixTypoMode === 'off' ? 'FIX_TYPO_MODE_OFF' : 'FIX_TYPO_MODE_ON',
        },
        sort_spec: sortMode
          ? {
              sort_mode:
                sortMode === 'date'
                  ? 'SORT_MODE_BY_TIME'
                  : 'SORT_MODE_BY_RELEVANCE',
              sort_order:
                sortOrder === 'ascending'
                  ? 'SORT_ORDER_ASC'
                  : 'SORT_ORDER_DESC',
            }
          : undefined,
        group_spec: {
          group_mode:
            groupMode === 'site' ? 'GROUP_MODE_DEEP' : 'GROUP_MODE_FLAT',
          groups_on_page: groupsPerPage || 20,
          docs_in_group: docsPerGroup || 1,
        },
        max_passages: maxPassages || 4,
        region: region || '225',
        l10n:
          language === 'be'
            ? 'LOCALIZATION_BE'
            : language === 'kk'
            ? 'LOCALIZATION_KK'
            : language === 'uk'
            ? 'LOCALIZATION_UK'
            : 'LOCALIZATION_RU',
        folder_id: YANDEX_USER_ID,
        response_format: 'FORMAT_XML',
        user_agent: 'TeamHub/1.0',
      }

      // Remove undefined values
      const cleanRequestParams = Object.fromEntries(
        Object.entries(grpcRequestParams).filter(
          ([_, value]) => value !== undefined
        )
      )

      console.log(
        '📤 Yandex gRPC Search Tool: Sending gRPC-style request:',
        JSON.stringify(cleanRequestParams, null, 2)
      )

      // Use gRPC-Web endpoint (translates to gRPC calls)
      const apiUrl = 'https://searchapi.api.cloud.yandex.net/v2/web/search'

      console.log('🔗 Yandex gRPC Search Tool: API URL:', apiUrl)

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${YANDEX_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'User-Agent': 'TeamHub/1.0 (gRPC-Web)',
          'X-Requested-With': 'grpc-web', // Indicate gRPC-Web usage
        },
        body: JSON.stringify(cleanRequestParams),
      })

      console.log(
        '📥 Yandex gRPC Search Tool: Response status:',
        response.status
      )

      const responseText = await response.text()
      console.log(
        '📊 Yandex gRPC Search Tool: Raw response (first 500 chars):',
        responseText.substring(0, 500)
      )

      if (!response.ok) {
        console.error(
          '❌ Yandex gRPC Search Tool: API error response:',
          responseText
        )

        if (response.status === 403) {
          throw new Error(
            `Yandex gRPC Search API Permission Denied (403). This typically means:
            1. Your IAM token has expired (they expire every 12 hours)
            2. Your service account lacks the 'search-api.webSearch.user' role (note: different from search-api.user)
            3. The folder ID doesn't exist or you don't have access to it

            To fix this:
            - Generate a new IAM token: \`yc iam create-token\`
            - Verify your service account has the correct role: \`yc iam service-accounts list\`
            - Check the exact role name: it should be 'search-api.webSearch.user' according to Russian docs

            Error details: ${responseText}`
          )
        }

        throw new Error(
          `Yandex gRPC API error: ${response.status} - ${responseText}`
        )
      }

      // Parse response
      let jsonResponse
      try {
        jsonResponse = JSON.parse(responseText)
      } catch (error) {
        console.error('❌ Failed to parse JSON response:', error)
        throw new Error(`Failed to parse API response as JSON: ${error}`)
      }

      // Handle response according to Russian docs
      let rawData
      if (jsonResponse.rawData) {
        rawData = jsonResponse.rawData
        console.log('📊 Direct rawData found in response')
      } else if (jsonResponse.response && jsonResponse.response.rawData) {
        rawData = jsonResponse.response.rawData
        console.log('📊 Nested rawData found in response')
      } else {
        console.error('❌ No rawData found in response')
        console.log('Available keys:', Object.keys(jsonResponse))
        throw new Error('No rawData found in API response')
      }

      // Decode base64 XML response
      let xmlResponse
      try {
        xmlResponse = Buffer.from(rawData, 'base64').toString('utf-8')
        console.log(
          '📊 Decoded XML response (first 500 chars):',
          xmlResponse.substring(0, 500)
        )
      } catch (error) {
        console.error('❌ Failed to decode base64 rawData:', error)
        throw new Error(`Failed to decode rawData: ${error}`)
      }

      // Parse XML response to extract search results
      const results: SearchYandexGrpcResult[] = []

      // Use regex to extract documents from XML
      const docRegex = /<doc[^>]*>([\s\S]*?)<\/doc>/g
      const urlRegex = /<url[^>]*>([\s\S]*?)<\/url>/
      const titleRegex = /<title[^>]*>([\s\S]*?)<\/title>/
      const passagesRegex = /<passages[^>]*>([\s\S]*?)<\/passages>/

      let match
      let docCount = 0
      while (
        (match = docRegex.exec(xmlResponse)) !== null &&
        docCount < numResults
      ) {
        const docContent = match[1]

        const urlMatch = urlRegex.exec(docContent)
        const titleMatch = titleRegex.exec(docContent)
        const passagesMatch = passagesRegex.exec(docContent)

        let snippet = 'No snippet available'
        if (passagesMatch) {
          snippet = passagesMatch[1]
            .replace(/<[^>]*>/g, '') // Remove XML tags
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .trim()
        }

        const result: SearchYandexGrpcResult = {
          title: titleMatch
            ? titleMatch[1].replace(/<[^>]*>/g, '').trim()
            : 'No title',
          link: urlMatch ? urlMatch[1].trim() : 'No URL',
          snippet: snippet,
        }

        results.push(result)
        docCount++
      }

      if (results.length === 0) {
        console.error('❌ No search results found in XML response')
        throw new Error('No search results found')
      }

      console.log(
        `✅ Yandex gRPC Search Tool: Successfully processed ${results.length} results`
      )
      return results
    } catch (error) {
      console.error('💥 Yandex gRPC Search Tool: Error occurred:', error)
      throw new Error(
        `Failed to search Yandex via gRPC: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  },
}
