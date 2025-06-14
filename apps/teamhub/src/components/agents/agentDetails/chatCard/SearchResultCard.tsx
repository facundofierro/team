import { Card, CardContent } from '@/components/ui/card'
import { Globe, ExternalLink } from 'lucide-react'

interface SearchResult {
  title?: string
  link?: string
  snippet?: string
  url?: string
  description?: string
}

interface SearchResultCardProps {
  result: SearchResult
  index: number
}

export function SearchResultCard({ result, index }: SearchResultCardProps) {
  // Handle different property names for link/url
  const link = result.link || result.url
  // Handle different property names for snippet/description
  const snippet = result.snippet || result.description

  return (
    <Card className="p-4 hover:shadow-md transition-shadow border border-gray-200">
      <CardContent className="p-0 space-y-3">
        {result.title && (
          <h4 className="font-semibold text-sm text-gray-900 leading-tight">
            {result.title}
          </h4>
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs hover:underline transition-colors"
            title={link}
          >
            <Globe className="w-3 h-3 flex-shrink-0" />
            <span className="truncate max-w-[200px]">
              {(() => {
                try {
                  const url = new URL(link)
                  const domain = url.hostname.replace('www.', '')
                  const path =
                    url.pathname.length > 20
                      ? url.pathname.substring(0, 20) + '...'
                      : url.pathname
                  return domain + path
                } catch {
                  // Fallback for invalid URLs
                  return link.length > 30 ? link.substring(0, 30) + '...' : link
                }
              })()}
            </span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        )}

        {snippet && (
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
            {snippet}
          </p>
        )}

        {!result.title && !link && !snippet && (
          <p className="text-xs text-gray-500 italic">
            Search result #{index + 1} - No details available
          </p>
        )}
      </CardContent>
    </Card>
  )
}
