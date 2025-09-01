'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { Input } from '../../components/shadcn/input'
import { Button } from '../../components/shadcn/button'
import { Card } from '../../components/shadcn/card'
import { Badge } from '../../components/shadcn/badge'
import { Separator } from '../../components/shadcn/separator'
import {
  Search as SearchIcon,
  X,
  Command,
  Filter,
  Clock,
  TrendingUp,
  History,
  Sparkles,
} from 'lucide-react'

export interface SearchResult {
  id: string
  title: string
  description?: string
  type: 'agent' | 'workflow' | 'document' | 'tool' | 'task'
  url?: string
  tags?: string[]
  lastAccessed?: string
  relevance?: number
}

export interface SearchProps {
  className?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  onClear?: () => void
  results?: SearchResult[]
  loading?: boolean
  showResults?: boolean
  variant?: 'default' | 'minimal' | 'expanded'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  autoFocus?: boolean
}

export function Search({
  className,
  placeholder = 'Search TeamHub...',
  value = '',
  onChange,
  onSearch,
  onClear,
  results = [],
  loading = false,
  showResults = false,
  variant = 'default',
  size = 'md',
  disabled = false,
  autoFocus = false,
}: SearchProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && onSearch) {
      onSearch(value.trim())
      setShowSuggestions(false)
    }
  }

  const handleClear = () => {
    if (onChange) onChange('')
    if (onClear) onClear()
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'agent':
        return <Sparkles className="h-4 w-4" />
      case 'workflow':
        return <TrendingUp className="h-4 w-4" />
      case 'document':
        return <History className="h-4 w-4" />
      case 'tool':
        return <Filter className="h-4 w-4" />
      case 'task':
        return <Clock className="h-4 w-4" />
      default:
        return <SearchIcon className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'agent':
        return 'bg-[#F45584] text-white'
      case 'workflow':
        return 'bg-[#A091DA] text-white'
      case 'document':
        return 'bg-[#E6D24D] text-white'
      case 'tool':
        return 'bg-[#847F42] text-white'
      case 'task':
        return 'bg-[#9B8FA7] text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'h-8 text-sm'
      case 'lg':
        return 'h-12 text-base'
      default:
        return 'h-10 text-sm'
    }
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('relative', className)}>
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'pl-10 pr-8 bg-white/10 border-white/20 text-white placeholder:text-white/50',
            'focus:bg-white/20 focus:border-white/40',
            'transition-colors duration-200',
            getSizeClasses(size)
          )}
          disabled={disabled}
          autoFocus={autoFocus}
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 text-white/50 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value)
            setShowSuggestions(e.target.value.length > 0)
          }}
          onFocus={() => {
            setIsFocused(true)
            if (value.length > 0) setShowSuggestions(true)
          }}
          onBlur={() => {
            setIsFocused(false)
            // Delay hiding suggestions to allow clicking on them
            setTimeout(() => setShowSuggestions(false), 200)
          }}
          className={cn(
            'pl-10 pr-8 bg-white/10 border-white/20 text-white placeholder:text-white/50',
            'focus:bg-white/20 focus:border-white/40',
            'transition-colors duration-200',
            getSizeClasses(size)
          )}
          disabled={disabled}
          autoFocus={autoFocus}
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 text-white/50 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (value.length > 0 || results.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-white/95 border-white/20 shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-2">
            {/* Quick Actions */}
            <div className="mb-2">
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                <Command className="h-3 w-3" />
                <span>Quick Actions</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs bg-white/50 border-gray-200 hover:bg-white/80"
                >
                  Create Agent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs bg-white/50 border-gray-200 hover:bg-white/80"
                >
                  New Workflow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs bg-white/50 border-gray-200 hover:bg-white/80"
                >
                  Upload Document
                </Button>
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Search Results */}
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F45584] mx-auto mb-2"></div>
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg text-white',
                        getTypeColor(result.type)
                      )}
                    >
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      {result.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {result.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {result.tags &&
                        result.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-600"
                          >
                            {tag}
                          </Badge>
                        ))}
                      {result.relevance && (
                        <span className="text-xs text-gray-400">
                          {Math.round(result.relevance * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : value.length > 0 ? (
              <div className="p-4 text-center text-gray-500">
                <SearchIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No results found for "{value}"</p>
                <p className="text-xs mt-1">
                  Try different keywords or check your spelling
                </p>
              </div>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  )
}

// Global search component with keyboard shortcuts
export interface GlobalSearchProps extends SearchProps {
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export function GlobalSearch({
  className,
  open = false,
  onOpenChange,
  ...searchProps
}: GlobalSearchProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange?.(!open)
      }
      if (e.key === 'Escape' && open) {
        onOpenChange?.(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl mx-4">
        <Search
          {...searchProps}
          className={cn('w-full', className)}
          variant="expanded"
          size="lg"
          autoFocus
        />
      </div>
    </div>
  )
}
