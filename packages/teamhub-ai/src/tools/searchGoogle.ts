import { ToolTypeDefinition } from '@/tools'
import { z } from 'zod'

export type SearchGoogleParameters = {
  query: string
  numResults: number
}

export type SearchGoogleResult = {
  title: string
  link: string
  snippet: string
}

export const searchGoogle: ToolTypeDefinition = {
  id: 'searchGoogle',
  type: 'searchGoogle',
  description: 'Search the internet using Google Search API',
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
    GOOGLE_API_KEY: {
      type: 'string',
      description: 'The Google API key',
    },
    GOOGLE_CX: {
      type: 'string',
      description: 'The Google Custom Search Engine ID',
    },
  },
  parametersSchema: z.object({
    query: z.string().describe('The search query to execute'),
    numResults: z
      .number()
      .min(1)
      .max(10)
      .default(5)
      .describe('Number of results to return (max 10)'),
  }),
  resultSchema: z.object({
    title: z.string().describe('The title of the search result'),
    link: z.string().describe('The link of the search result'),
    snippet: z.string().describe('The snippet of the search result'),
  }),
  handler: async (
    params: unknown,
    configuration: Record<string, string>
  ): Promise<unknown[]> => {
    const GOOGLE_API_KEY =
      configuration.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY
    const GOOGLE_CX = configuration.GOOGLE_CX || process.env.GOOGLE_CX

    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY must be set')
    }

    if (!GOOGLE_CX) {
      throw new Error('GOOGLE_CX must be set')
    }

    const { query, numResults } = params as SearchGoogleParameters
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(
          query
        )}&num=${numResults}`
      )

      if (!response.ok) {
        throw new Error(`Google API error: ${response.statusText}`)
      }

      const data = await response.json()

      return data.items.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      }))
    } catch (error) {
      console.error('Error searching Google:', error)
      throw new Error('Failed to search Google')
    }
  },
}
