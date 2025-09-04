import { ToolTypeDefinition } from '../tools'
import { z } from 'zod'

export type SearchDuckDuckGoParameters = {
  query: string
  numResults: number
}

export type SearchDuckDuckGoResult = {
  title: string
  link: string
  snippet: string
}

export const searchDuckDuckGo: ToolTypeDefinition = {
  id: 'searchDuckDuckGo',
  type: 'searchDuckDuckGo',
  description: 'Search the internet using DuckDuckGo API',
  canBeManaged: true,
  managedPrice: 0,
  managedPriceDescription: 'Free',
  monthlyUsage: 0,
  isActive: true,
  createdAt: null,
  allowedUsage: 1000,
  allowedTimeStart: '00:00',
  allowedTimeEnd: '23:59',
  configurationParams: {
    DUCKDUCKGO_API_KEY: {
      type: 'string',
      description: 'The DuckDuckGo API key',
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
    const { query, numResults } = params as SearchDuckDuckGoParameters
    try {
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(
          query
        )}&format=json&pretty=1`
      )

      if (!response.ok) {
        throw new Error(`DuckDuckGo API error: ${response.statusText}`)
      }

      const data = await response.json()

      // DuckDuckGo returns different types of results, we'll combine them
      const results = [
        ...(data.AbstractText
          ? [
              {
                title: data.Heading,
                link: data.AbstractURL,
                snippet: data.AbstractText,
              },
            ]
          : []),
        ...(data.RelatedTopics || [])
          .slice(0, numResults - 1)
          .map((topic: any) => ({
            title: topic.FirstURL.split('/').pop() || topic.FirstURL,
            link: topic.FirstURL,
            snippet: topic.Text,
          })),
      ]

      return results.slice(0, numResults)
    } catch (error) {
      console.error('Error searching DuckDuckGo:', error)
      throw new Error('Failed to search DuckDuckGo')
    }
  },
}
