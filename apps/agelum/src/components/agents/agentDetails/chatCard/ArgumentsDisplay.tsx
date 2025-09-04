import { Code, Search } from 'lucide-react'

interface ArgumentsDisplayProps {
  arguments: Record<string, any>
  toolName?: string
}

export function ArgumentsDisplay({
  arguments: args,
  toolName,
}: ArgumentsDisplayProps) {
  // Special handling for Yandex search tool
  if (toolName === 'searchYandex') {
    const { query, numResults, searchType, ...otherArgs } = args

    return (
      <div className="space-y-2">
        {/* Single row for main Yandex search parameters */}
        <div className="flex items-center gap-3 p-2 bg-blue-50 rounded border border-blue-200">
          <div className="flex items-center gap-2 min-w-0 flex-[4]">
            <Search className="w-3 h-3 text-blue-600 flex-shrink-0" />
            <span className="text-xs font-medium text-blue-700">Query:</span>
            <span className="text-xs text-gray-800 font-medium break-words">
              {query || 'N/A'}
            </span>
          </div>

          {numResults && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-blue-700">
                  Results
                </span>
              </div>
              <div className="flex-shrink-0">
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded border font-mono">
                  {numResults}
                </span>
              </div>
            </>
          )}

          {searchType && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-blue-700">Type</span>
              </div>
              <div className="flex-shrink-0">
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded border">
                  {searchType}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Show other arguments if any */}
        {Object.keys(otherArgs).length > 0 && (
          <div className="space-y-2">
            {Object.entries(otherArgs).map(([key, value]) => (
              <div
                key={key}
                className="flex items-start gap-3 p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Code className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-700 capitalize truncate">
                    {key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  {typeof value === 'string' ? (
                    <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border break-words">
                      {value}
                    </span>
                  ) : typeof value === 'number' ? (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-mono border">
                      {value}
                    </span>
                  ) : typeof value === 'boolean' ? (
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium border ${
                        value
                          ? 'text-green-700 bg-green-50 border-green-200'
                          : 'text-red-700 bg-red-50 border-red-200'
                      }`}
                    >
                      {value ? 'True' : 'False'}
                    </span>
                  ) : (
                    <pre className="text-xs bg-white p-2 rounded border max-h-20 overflow-y-auto break-words whitespace-pre-wrap">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default layout for other tools
  return (
    <div className="space-y-2">
      {Object.entries(args).map(([key, value]) => (
        <div
          key={key}
          className="flex items-start gap-3 p-2 bg-gray-50 rounded"
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Code className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-700 capitalize truncate">
              {key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase())}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            {typeof value === 'string' ? (
              <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border break-words">
                {value}
              </span>
            ) : typeof value === 'number' ? (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-mono border">
                {value}
              </span>
            ) : typeof value === 'boolean' ? (
              <span
                className={`text-xs px-2 py-1 rounded font-medium border ${
                  value
                    ? 'text-green-700 bg-green-50 border-green-200'
                    : 'text-red-700 bg-red-50 border-red-200'
                }`}
              >
                {value ? 'True' : 'False'}
              </span>
            ) : (
              <pre className="text-xs bg-white p-2 rounded border max-h-20 overflow-y-auto break-words whitespace-pre-wrap">
                {JSON.stringify(value, null, 2)}
              </pre>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
