import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(req: NextRequest) {
  try {
    // Get authenticated session
    const session = await auth()
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Get tool type from query parameters
    const { searchParams } = new URL(req.url)
    const toolType = searchParams.get('type')

    if (!toolType) {
      return new Response('Tool type is required', { status: 400 })
    }

    // Get configuration for managed tools based on type
    let configuration: Record<string, string> = {}

    switch (toolType) {
      case 'searchYandex':
        configuration = {
          YANDEX_API_KEY: process.env.YANDEX_API_KEY || '',
          YANDEX_USER_KEY: process.env.YANDEX_USER_KEY || '',
        }
        break
      case 'searchGoogle':
        configuration = {
          GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
          GOOGLE_CX: process.env.GOOGLE_CX || '',
        }
        break
      case 'searchDuckDuckGo':
        configuration = {
          DUCKDUCKGO_API_KEY: process.env.DUCKDUCKGO_API_KEY || '',
        }
        break
      default:
        // For unknown tool types, return empty configuration
        configuration = {}
    }

    // Filter out empty values (don't expose unset environment variables)
    const filteredConfiguration = Object.fromEntries(
      Object.entries(configuration).filter(([_, value]) => value !== '')
    )

    return NextResponse.json({
      toolType,
      configuration: filteredConfiguration,
    })
  } catch (error) {
    console.error('Error getting managed tool configuration:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
