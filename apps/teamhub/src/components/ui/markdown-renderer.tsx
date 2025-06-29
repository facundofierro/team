import { ExternalLink } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
  variant?: 'default' | 'memory' | 'chat'
}

export function MarkdownRenderer({
  content,
  className,
  variant = 'default',
}: MarkdownRendererProps) {
  // Variant-specific configurations
  const variantConfig = {
    default: {
      textSize: 'text-base',
      spacing: 'mb-3',
      headingColors: 'text-gray-800 dark:text-gray-200',
      textColors: 'text-gray-700 dark:text-gray-300',
      strongColors: 'text-gray-800 dark:text-gray-200',
      linkSize: 'text-xs',
    },
    memory: {
      textSize: 'text-base',
      spacing: 'mb-3',
      headingColors: 'text-gray-800 dark:text-gray-200',
      textColors: 'text-gray-700 dark:text-gray-300',
      strongColors: 'text-gray-800 dark:text-gray-200',
      linkSize: 'text-xs',
    },
    chat: {
      textSize: 'text-sm',
      spacing: 'mb-2',
      headingColors: 'text-gray-900',
      textColors: 'text-gray-900',
      strongColors: 'text-gray-900',
      linkSize: 'text-sm',
    },
  }

  const config = variantConfig[variant]

  // Process content to handle JSON-wrapped summaries (from memory component)
  const processedContent = (() => {
    if (!content) return ''

    let processedContent = content

    // Safety check: if the content looks like JSON, try to extract the actual content
    if (
      processedContent.trim().startsWith('{') &&
      processedContent.trim().endsWith('}')
    ) {
      try {
        const parsed = JSON.parse(processedContent)
        // If it's a JSON object with summary field, extract it
        if (parsed.summary && typeof parsed.summary === 'string') {
          processedContent = parsed.summary
          console.warn(
            '⚠️ Found JSON-formatted content, extracted:',
            processedContent.substring(0, 100)
          )
        }
      } catch (jsonError) {
        // If JSON parsing fails, use the original content
        console.warn(
          '⚠️ Content looks like JSON but failed to parse, using as-is'
        )
      }
    }

    // Convert plain text URLs to markdown links before processing
    const urlRegex = /(https?:\/\/[^\s\)]+)/g
    return processedContent.replace(urlRegex, (url) => {
      // Only convert if it's not already a markdown link
      const beforeUrl = processedContent.substring(
        0,
        processedContent.indexOf(url)
      )
      if (beforeUrl.endsWith('](')) {
        return url // Already a markdown link
      }
      return `[${url}](${url})`
    })
  })()

  return (
    <div className={cn('leading-relaxed', config.textColors, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom link component
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 underline hover:no-underline transition-colors',
                config.linkSize
              )}
            >
              {children}
              <ExternalLink className="w-3 h-3 inline" />
            </a>
          ),
          // Custom paragraph styling
          p: ({ children }) => (
            <p className={cn(config.spacing, 'last:mb-0')}>{children}</p>
          ),
          // Custom list styling
          ul: ({ children }) => (
            <ul
              className={cn('list-disc list-inside space-y-1', config.spacing)}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              className={cn(
                'list-decimal list-inside space-y-1',
                config.spacing
              )}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ml-2">
              <div className="inline">{children}</div>
            </li>
          ),
          // Custom bold text styling
          strong: ({ children }) => (
            <strong className={cn('font-semibold', config.strongColors)}>
              {children}
            </strong>
          ),
          // Custom italic text styling
          em: ({ children }) => (
            <em className={cn('italic', config.textColors)}>{children}</em>
          ),
          // Custom code styling
          code: ({ children }) => (
            <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
          // Custom code block styling
          pre: ({ children }) => (
            <pre
              className={cn(
                'bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto',
                config.spacing
              )}
            >
              {children}
            </pre>
          ),
          // Custom heading styling
          h1: ({ children }) => (
            <h1
              className={cn(
                'text-xl font-bold',
                config.spacing,
                config.headingColors
              )}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={cn('text-lg font-bold mb-2', config.headingColors)}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className={cn('text-base font-bold mb-2', config.headingColors)}
            >
              {children}
            </h3>
          ),
          // Custom blockquote styling
          blockquote: ({ children }) => (
            <blockquote
              className={cn(
                'border-l-4 border-orange-300 pl-4 italic',
                config.spacing,
                'text-gray-600 dark:text-gray-400'
              )}
            >
              {children}
            </blockquote>
          ),
          // Custom table styling
          table: ({ children }) => (
            <div className={cn('overflow-x-auto', config.spacing)}>
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white dark:bg-gray-900">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 last:border-r-0">
              {children}
            </td>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
