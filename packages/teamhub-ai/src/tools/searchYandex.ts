import { ToolTypeDefinition } from '@/tools'
import { z } from 'zod'

const YANDEX_API_KEY = process.env.YANDEX_API_KEY
const YANDEX_USER_KEY = process.env.YANDEX_USER_KEY

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
  description: 'Search the internet using Yandex Search API',
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
      description: 'The Yandex API key',
    },
    YANDEX_USER_KEY: {
      type: 'string',
      description: 'The Yandex user key',
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
    try {
      if (!YANDEX_API_KEY) {
        throw new Error('YANDEX_API_KEY must be set')
      }

      if (!YANDEX_USER_KEY) {
        throw new Error('YANDEX_USER_KEY must be set')
      }

      const requestBody = {
        query: {
          searchType,
          queryText: query,
          familyMode: familyMode || 'moderate',
          page: page || 1,
          fixTypoMode: fixTypoMode || 'on',
        },
        sortSpec: sortMode && {
          sortMode,
          sortOrder: sortOrder || 'descending',
        },
        groupSpec: groupMode && {
          groupMode,
          groupsOnPage: groupsPerPage || 10,
          docsInGroup: docsPerGroup || 3,
        },
        maxPassages: maxPassages || 4,
        region,
        l10N: language || 'en',
        folderId: configuration.YANDEX_USER_KEY || YANDEX_USER_KEY,
        responseFormat: 'json',
        userAgent: 'TeamHub Search',
      }

      const response = await fetch('https://search-maps.yandex.ru/v2/search', {
        method: 'POST',
        headers: {
          Authorization: `Api-Key ${
            configuration.YANDEX_API_KEY || YANDEX_API_KEY
          }`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Yandex API error: ${response.statusText}`)
      }

      const data = await response.json()

      return data.items.map((item: any) => ({
        title: item.title,
        link: item.url,
        snippet: item.snippet,
      }))
    } catch (error) {
      console.error('Error searching Yandex:', error)
      throw new Error('Failed to search Yandex')
    }
  },
}
