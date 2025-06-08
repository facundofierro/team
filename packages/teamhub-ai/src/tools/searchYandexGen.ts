import { ToolTypeDefinition } from '../tools'
import { z } from 'zod'

export type SearchYandexGenParameters = {
  query: string
  context?: string
  site?: string[]
  host?: string[]
  url?: string[]
  fixMisspell?: boolean
  enableNrfmDocs?: boolean
  dateFilter?: string
  langFilter?: string
  formatFilter?:
    | 'pdf'
    | 'xls'
    | 'ods'
    | 'rtf'
    | 'ppt'
    | 'odp'
    | 'swf'
    | 'odt'
    | 'odg'
    | 'doc'
}

export type SearchYandexGenResult = {
  content: string
  sources: Array<{
    url: string
    title: string
    used: boolean
  }>
  searchQueries: Array<{
    text: string
    reqId: string
  }>
  fixedMisspellQuery?: string
  isAnswerRejected: boolean
  isBulletAnswer: boolean
}

export const searchYandexGen: ToolTypeDefinition = {
  id: 'searchYandexGen',
  type: 'searchYandexGen',
  description:
    'Search the internet using Yandex Gen Search API with AI-generated responses and source citations (Note: This tool may face rate limiting or authentication challenges)',
  canBeManaged: true,
  managedPrice: 0,
  managedPriceDescription: 'Free tier available with usage limits',
  monthlyUsage: 0,
  isActive: true,
  createdAt: null,
  allowedUsage: 500,
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
    context: z
      .string()
      .optional()
      .describe('Additional context for the search query'),
    site: z
      .array(z.string())
      .optional()
      .describe('Restrict search to specific websites'),
    host: z
      .array(z.string())
      .optional()
      .describe('Restrict search to specific hosts'),
    url: z
      .array(z.string())
      .optional()
      .describe('Restrict search to specific pages'),
    fixMisspell: z
      .boolean()
      .optional()
      .describe('Fix query misspells automatically'),
    enableNrfmDocs: z
      .boolean()
      .optional()
      .describe('Use documents inaccessible from front page'),
    dateFilter: z
      .string()
      .optional()
      .describe('Restrict by document date (Yandex search operators)'),
    langFilter: z
      .string()
      .optional()
      .describe('Restrict by document language (ISO 639-1 codes)'),
    formatFilter: z
      .enum([
        'pdf',
        'xls',
        'ods',
        'rtf',
        'ppt',
        'odp',
        'swf',
        'odt',
        'odg',
        'doc',
      ])
      .optional()
      .describe('Restrict by document format'),
  }),
  resultSchema: z.object({
    content: z.string().describe('The AI-generated response content'),
    sources: z
      .array(
        z.object({
          url: z.string().describe('Source document URL'),
          title: z.string().describe('Source document title'),
          used: z
            .boolean()
            .describe('Whether the source was used in the response'),
        })
      )
      .describe('Source documents used for the response'),
    searchQueries: z
      .array(
        z.object({
          text: z.string().describe('Search query text'),
          reqId: z.string().describe('Query ID in Yandex Search'),
        })
      )
      .describe('Search queries refined by YandexGPT'),
    fixedMisspellQuery: z
      .string()
      .optional()
      .describe('Query with fixed misspells'),
    isAnswerRejected: z
      .boolean()
      .describe('Whether the answer was rejected due to ethical concerns'),
    isBulletAnswer: z
      .boolean()
      .describe('Whether the response is a bullet-point answer'),
  }),
  handler: async (
    params: unknown,
    configuration: Record<string, string>
  ): Promise<unknown> => {
    console.log('🔍 Yandex Gen Search Tool: Starting execution')
    console.log(
      '📋 Yandex Gen Search Tool: Received params:',
      JSON.stringify(params, null, 2)
    )
    console.log(
      '⚙️ Yandex Gen Search Tool: Received configuration keys:',
      Object.keys(configuration)
    )

    const {
      query,
      context,
      site,
      host,
      url,
      fixMisspell,
      enableNrfmDocs,
      dateFilter,
      langFilter,
      formatFilter,
    } = params as SearchYandexGenParameters

    console.log(
      `🔍 Yandex Gen Search Tool: Query="${query}", Context="${
        context || 'none'
      }"`
    )

    // Get API keys from configuration or environment variables
    const YANDEX_API_KEY =
      configuration.YANDEX_API_KEY || process.env.YANDEX_API_KEY
    const YANDEX_USER_ID =
      configuration.YANDEX_USER_KEY || process.env.YANDEX_USER_KEY

    console.log(
      '🔑 Yandex Gen Search Tool: API Key available:',
      !!YANDEX_API_KEY
    )
    console.log(
      '🔑 Yandex Gen Search Tool: User ID available:',
      !!YANDEX_USER_ID
    )
    if (YANDEX_API_KEY) {
      console.log(
        '🔑 Yandex Gen Search Tool: API Key preview:',
        YANDEX_API_KEY.substring(0, 8) + '...'
      )
      console.log(
        '🔑 Yandex Gen Search Tool: API Key length:',
        YANDEX_API_KEY.length
      )
    }
    if (YANDEX_USER_ID) {
      console.log(
        '🔑 Yandex Gen Search Tool: User ID preview:',
        YANDEX_USER_ID.substring(0, 8) + '...'
      )
      console.log(
        '🔑 Yandex Gen Search Tool: User ID length:',
        YANDEX_USER_ID.length
      )
    }

    try {
      if (!YANDEX_API_KEY) {
        console.error('❌ Yandex Gen Search Tool: YANDEX_API_KEY is missing')
        throw new Error(
          'YANDEX_API_KEY must be set in configuration or environment'
        )
      }

      if (!YANDEX_USER_ID) {
        console.error(
          '❌ Yandex Gen Search Tool: YANDEX_USER_KEY (User ID) is missing'
        )
        throw new Error(
          'YANDEX_USER_KEY (User ID) must be set in configuration or environment'
        )
      }

      // Build messages array for the conversation
      const messages = [
        {
          content: query,
          role: 'ROLE_USER',
        },
      ]

      // Add context as a previous assistant message if provided
      if (context) {
        messages.unshift({
          content: context,
          role: 'ROLE_ASSISTANT',
        })
      }

      // Build search scope restriction (only one of site, host, url can be used)
      let searchScope = {}
      if (site && site.length > 0) {
        searchScope = { site: { site } }
      } else if (host && host.length > 0) {
        searchScope = { host: { host } }
      } else if (url && url.length > 0) {
        searchScope = { url: { url } }
      }

      // Build search filters
      const searchFilters = []
      if (dateFilter) {
        searchFilters.push({ date: dateFilter })
      }
      if (langFilter) {
        searchFilters.push({ lang: langFilter })
      }
      if (formatFilter) {
        const formatMap = {
          pdf: 'DOC_FORMAT_PDF',
          xls: 'DOC_FORMAT_XLS',
          ods: 'DOC_FORMAT_ODS',
          rtf: 'DOC_FORMAT_RTF',
          ppt: 'DOC_FORMAT_PPT',
          odp: 'DOC_FORMAT_ODP',
          swf: 'DOC_FORMAT_SWF',
          odt: 'DOC_FORMAT_ODT',
          odg: 'DOC_FORMAT_ODG',
          doc: 'DOC_FORMAT_DOC',
        }
        searchFilters.push({ format: formatMap[formatFilter] })
      }

      // Build the Yandex Cloud Gen Search API request
      const requestParams = {
        messages,
        folderId: YANDEX_USER_ID,
        ...searchScope,
        fixMisspell: fixMisspell ?? false,
        enableNrfmDocs: enableNrfmDocs ?? false,
        ...(searchFilters.length > 0 && { searchFilters }),
      }

      console.log(
        '📤 Yandex Gen Search Tool: Sending request params:',
        JSON.stringify(requestParams, null, 2)
      )
      console.log('🌐 Yandex Gen Search Tool: Making API request to Yandex...')

      // Use Yandex Cloud Gen Search API endpoint
      const apiUrl = 'https://searchapi.api.cloud.yandex.net/v2/gen/search'

      console.log('🔗 Yandex Gen Search Tool: API URL:', apiUrl)
      console.log(
        '📤 Yandex Gen Search Tool: Request payload:',
        JSON.stringify(requestParams, null, 2)
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
        body: JSON.stringify(requestParams),
      })

      console.log(
        '📥 Yandex Gen Search Tool: Response status:',
        response.status
      )
      console.log(
        '📥 Yandex Gen Search Tool: Response headers:',
        Object.fromEntries(response.headers.entries())
      )

      const responseText = await response.text()
      console.log(
        '📊 Yandex Gen Search Tool: Raw response (first 1000 chars):',
        responseText.substring(0, 1000)
      )

      // Check if we got a captcha page instead of search results
      if (
        responseText.includes('Are you not a robot') ||
        responseText.includes('robot') ||
        response.headers.get('x-yandex-captcha')
      ) {
        console.error(
          '❌ Yandex Gen Search Tool: Received captcha challenge instead of search results'
        )
        throw new Error(
          'Yandex API blocked the request with captcha. This may indicate invalid credentials, rate limiting, or the need for a different authentication method. Please verify your YANDEX_API_KEY and YANDEX_USER_KEY are correct for the Yandex Cloud Gen Search API.'
        )
      }

      if (!response.ok) {
        console.error(
          '❌ Yandex Gen Search Tool: API error response:',
          responseText
        )
        throw new Error(
          `Yandex Gen Search API error: ${response.status} ${
            response.statusText
          } - ${responseText.substring(0, 500)}`
        )
      }

      // Parse JSON response from Yandex Cloud Gen Search API
      let jsonResponse
      try {
        jsonResponse = JSON.parse(responseText)
        console.log(
          '📊 Yandex Gen Search Tool: Parsed JSON response:',
          JSON.stringify(jsonResponse, null, 2)
        )
      } catch (error) {
        console.error(
          '❌ Yandex Gen Search Tool: Failed to parse JSON response:',
          error
        )
        throw new Error(`Failed to parse API response as JSON: ${error}`)
      }

      // Extract the result from the JSON response
      const result: SearchYandexGenResult = {
        content: jsonResponse.message?.content || 'No content generated',
        sources: jsonResponse.sources || [],
        searchQueries: jsonResponse.searchQueries || [],
        fixedMisspellQuery: jsonResponse.fixedMisspellQuery,
        isAnswerRejected: jsonResponse.isAnswerRejected || false,
        isBulletAnswer: jsonResponse.isBulletAnswer || false,
      }

      // Check for API errors in the response
      if (jsonResponse.error) {
        console.error(
          '❌ Yandex Gen Search Tool: API returned error:',
          jsonResponse.error
        )
        throw new Error(
          `Yandex Gen Search API error: ${
            jsonResponse.error.message || 'Unknown error'
          }`
        )
      }

      // Check if the answer was rejected
      if (result.isAnswerRejected) {
        console.warn(
          '⚠️ Yandex Gen Search Tool: Answer was rejected due to ethical concerns'
        )
      }

      console.log(
        `✅ Yandex Gen Search Tool: Successfully generated response with ${result.sources.length} sources`
      )
      console.log('🎯 Yandex Gen Search Tool: Final result:', {
        contentLength: result.content.length,
        sourcesCount: result.sources.length,
        queriesCount: result.searchQueries.length,
        isRejected: result.isAnswerRejected,
        isBullet: result.isBulletAnswer,
      })

      return result
    } catch (error) {
      console.error('💥 Yandex Gen Search Tool: Error occurred:', error)
      console.error(
        '💥 Yandex Gen Search Tool: Error stack:',
        error instanceof Error ? error.stack : 'No stack trace'
      )
      throw new Error(
        `Failed to execute Yandex Gen Search: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  },
}
