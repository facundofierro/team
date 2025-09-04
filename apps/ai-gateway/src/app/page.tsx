import { log } from '@repo/logger'

export default function Home() {
  // Log page access
  if (typeof window !== 'undefined') {
    log.aiGateway.main.info('AI Gateway home page accessed', undefined, {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Agelum AI Gateway
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          AI provider abstraction service for Agelum
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            API Access Only
          </h2>
          <p className="text-gray-600">
            This service is designed for programmatic access only.
            <br />
            Use the API endpoints with proper authentication.
          </p>
        </div>
      </div>
    </div>
  )
}
