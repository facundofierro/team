import { ExternalLink } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { memo, useMemo, useCallback } from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
  variant?: 'default' | 'memory' | 'chat'
  isStreaming?: boolean
}

// Memoized URL regex for performance
const URL_REGEX = /(https?:\/\/[^\s\)]+)/g

// Memoized variant configurations to prevent recreation
const VARIANT_CONFIGS = {
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
} as const

// Memoized content processing function
const processContent = (content: string): string => {
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
  return processedContent.replace(URL_REGEX, (url) => {
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
}

// Memoized component factory to prevent recreation of custom components
const createMarkdownComponents = (
  config: (typeof VARIANT_CONFIGS)[keyof typeof VARIANT_CONFIGS]
) => ({
  // Custom link component
  a: ({ href, children }: any) => (
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
  p: ({ children }: any) => (
    <p className={cn(config.spacing, 'last:mb-0')}>{children}</p>
  ),
  // Custom list styling
  ul: ({ children }: any) => (
    <ul className={cn('list-disc pl-5 space-y-1', config.spacing)}>
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className={cn('list-decimal pl-5 space-y-1', config.spacing)}>
      {children}
    </ol>
  ),
  li: ({ children }: any) => <li className="text-left">{children}</li>,
  // Custom bold text styling
  strong: ({ children }: any) => (
    <strong className={cn('font-semibold', config.strongColors)}>
      {children}
    </strong>
  ),
  // Custom italic text styling
  em: ({ children }: any) => (
    <em className={cn('italic', config.textColors)}>{children}</em>
  ),
  // Custom code styling
  code: ({ children }: any) => (
    <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),
  // Custom code block styling
  pre: ({ children }: any) => (
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
  h1: ({ children }: any) => (
    <h1
      className={cn('text-xl font-bold', config.spacing, config.headingColors)}
    >
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className={cn('text-lg font-bold mb-2', config.headingColors)}>
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className={cn('text-base font-bold mb-2', config.headingColors)}>
      {children}
    </h3>
  ),
  // Custom blockquote styling
  blockquote: ({ children }: any) => (
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
  table: ({ children }: any) => (
    <div className={cn('overflow-x-auto', config.spacing)}>
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
  ),
  tbody: ({ children }: any) => (
    <tbody className="bg-white dark:bg-gray-900">{children}</tbody>
  ),
  tr: ({ children }: any) => (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {children}
    </tr>
  ),
  th: ({ children }: any) => (
    <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600 last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="px-4 py-2 text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 last:border-r-0">
      {children}
    </td>
  ),
})

export const MarkdownRenderer = memo(
  function MarkdownRenderer({
    content,
    className,
    variant = 'default',
    isStreaming = false,
  }: MarkdownRendererProps) {
    // Get config for the variant
    const config = VARIANT_CONFIGS[variant]

    // Memoized content processing - only recalculate when content changes
    const processedContent = useMemo(() => {
      return processContent(content)
    }, [content])

    // Memoized markdown components - only recreate when config changes
    const markdownComponents = useMemo(() => {
      return createMarkdownComponents(config)
    }, [config])

    // Progressive rendering for streaming content
    const renderContent = useMemo(() => {
      if (!isStreaming) {
        return processedContent
      }

      // For streaming content, we can add a subtle optimization
      // by checking if the content ends with incomplete markdown
      const trimmedContent = processedContent.trim()

      // If content ends with incomplete markdown syntax, defer full processing
      if (
        trimmedContent.endsWith('`') ||
        trimmedContent.endsWith('*') ||
        trimmedContent.endsWith('[') ||
        trimmedContent.endsWith('#')
      ) {
        // Return content as-is for now to avoid flicker during streaming
        return trimmedContent
      }

      return processedContent
    }, [processedContent, isStreaming])

    return (
      <div className={cn('leading-relaxed', config.textColors, className)}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {renderContent}
        </ReactMarkdown>
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return (
      prevProps.content === nextProps.content &&
      prevProps.variant === nextProps.variant &&
      prevProps.className === nextProps.className &&
      prevProps.isStreaming === nextProps.isStreaming
    )
  }
)

MarkdownRenderer.displayName = 'MarkdownRenderer'
