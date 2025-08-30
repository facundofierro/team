import React, { useState } from 'react'
import { cn } from '@/utils'

interface ChatWidgetProps {
  className?: string
  title?: string
  subtitle?: string
  status?: string
  showControls?: boolean
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
  children?: React.ReactNode
  inputPlaceholder?: string
  onSendMessage?: (message: string) => void
  showInput?: boolean
  showFooter?: boolean
  footerText?: string
  position?: 'left' | 'right' | 'bottom-left' | 'bottom-right'
  size?: 'sm' | 'md' | 'lg'
}

const positionClasses = {
  left: 'left-4 top-1/2 -translate-y-1/2',
  right: 'right-4 top-1/2 -translate-y-1/2',
  'bottom-left': 'left-4 bottom-4',
  'bottom-right': 'right-4 bottom-4',
}

const sizeClasses = {
  sm: 'w-80 h-96',
  md: 'w-96 h-[28rem]',
  lg: 'w-[28rem] h-[32rem]',
}

export function ChatWidget({
  className,
  title = 'AI Business Consultant',
  subtitle = 'Online • Ready to help',
  status = 'online',
  showControls = true,
  onMinimize,
  onMaximize,
  onClose,
  children,
  inputPlaceholder = 'Ask about AI transformation...',
  onSendMessage,
  showInput = true,
  showFooter = true,
  footerText = 'Powered by TeamHub AI',
  position = 'left',
  size = 'md',
}: ChatWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
    onMinimize?.()
  }

  const handleSendMessage = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isMinimized) {
    return (
      <div
        className={cn(
          'fixed z-50',
          positionClasses[position],
          'w-16 h-16 bg-teamhub-primary rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200',
          className
        )}
        onClick={handleMinimize}
      >
        <div className="w-full h-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'fixed z-50 bg-white border border-teamhub-border/20 rounded-xl shadow-xl',
        positionClasses[position],
        sizeClasses[size],
        'flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-teamhub-border/20 bg-gradient-to-r from-teamhub-primary to-teamhub-accent rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h4a2 2 0 002-2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-white/80 text-xs">{subtitle}</p>
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMinimize}
              className="p-1 text-white/80 hover:text-white transition-colors"
              aria-label="Minimize"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <button
              onClick={onMaximize}
              className="p-1 text-white/80 hover:text-white transition-colors"
              aria-label="Maximize"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">{children}</div>

      {/* Input Area */}
      {showInput && (
        <div className="p-4 border-t border-teamhub-border/20">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={inputPlaceholder}
              className="flex-1 px-3 py-2 border border-teamhub-border/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teamhub-primary focus:border-transparent text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="p-2 bg-teamhub-hot-pink hover:bg-teamhub-hot-pink/90 disabled:bg-teamhub-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              aria-label="Send message"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      {showFooter && (
        <div className="px-4 py-2 border-t border-teamhub-border/20 bg-teamhub-background rounded-b-xl">
          <p className="text-xs text-teamhub-muted text-center">{footerText}</p>
        </div>
      )}
    </div>
  )
}
