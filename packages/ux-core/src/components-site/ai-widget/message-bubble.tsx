import React from 'react'
import { cn } from '../../utils/cn'

interface MessageBubbleProps {
  message: string
  type?: 'user' | 'bot' | 'system'
  timestamp?: string
  avatar?: React.ReactNode
  className?: string
  showAvatar?: boolean
  showTimestamp?: boolean
  isTyping?: boolean
}

const messageTypes = {
  user: {
    container: 'flex-row-reverse',
    bubble: 'bg-teamhub-primary text-white',
    avatar: 'ml-2',
  },
  bot: {
    container: 'flex-row',
    bubble:
      'bg-teamhub-background border border-teamhub-border/20 text-teamhub-secondary',
    avatar: 'mr-2',
  },
  system: {
    container: 'flex-row justify-center',
    bubble: 'bg-teamhub-muted/20 text-teamhub-muted text-center text-sm',
    avatar: '',
  },
}

export function MessageBubble({
  message,
  type = 'bot',
  timestamp,
  avatar,
  className,
  showAvatar = true,
  showTimestamp = false,
  isTyping = false,
}: MessageBubbleProps) {
  const messageType = messageTypes[type]

  if (type === 'system') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div
          className={cn('px-4 py-2 rounded-lg max-w-xs', messageType.bubble)}
        >
          <span>{message}</span>
          {showTimestamp && timestamp && (
            <div className="text-xs opacity-70 mt-1">{timestamp}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-start space-x-2',
        messageType.container,
        className
      )}
    >
      {/* Avatar */}
      {showAvatar && avatar && (
        <div className={cn('flex-shrink-0', messageType.avatar)}>{avatar}</div>
      )}

      {/* Message Content */}
      <div className="flex flex-col max-w-xs">
        <div
          className={cn(
            'px-4 py-3 rounded-lg',
            messageType.bubble,
            type === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
          )}
        >
          {isTyping ? (
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="w-2 h-2 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
              <span className="ml-2">typing...</span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{message}</p>
          )}
        </div>

        {/* Timestamp */}
        {showTimestamp && timestamp && (
          <div
            className={cn(
              'text-xs text-teamhub-muted mt-1',
              type === 'user' ? 'text-right' : 'text-left'
            )}
          >
            {timestamp}
          </div>
        )}
      </div>
    </div>
  )
}

// Bot Avatar component
interface BotAvatarProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  status?: 'online' | 'offline' | 'busy'
}

const avatarSizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
}

const statusColors = {
  online: 'bg-teamhub-success',
  offline: 'bg-teamhub-muted',
  busy: 'bg-teamhub-warning',
}

export function BotAvatar({
  className,
  size = 'md',
  status = 'online',
}: BotAvatarProps) {
  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'bg-gradient-to-br from-teamhub-primary to-teamhub-accent rounded-full flex items-center justify-center text-white font-semibold',
          avatarSizes[size]
        )}
      >
        <svg
          className={cn(
            'w-4 h-4',
            size === 'sm' && 'w-3 h-3',
            size === 'lg' && 'w-5 h-5'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div
        className={cn(
          'absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full',
          statusColors[status]
        )}
      />
    </div>
  )
}

// User Avatar component
interface UserAvatarProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  initials?: string
  image?: string
}

export function UserAvatar({
  className,
  size = 'md',
  initials = 'U',
  image,
}: UserAvatarProps) {
  if (image) {
    return (
      <div
        className={cn(
          'rounded-full bg-cover bg-center',
          avatarSizes[size],
          className
        )}
        style={{ backgroundImage: `url(${image})` }}
      />
    )
  }

  return (
    <div
      className={cn(
        'bg-teamhub-hot-pink rounded-full flex items-center justify-center text-white font-semibold',
        avatarSizes[size],
        className
      )}
    >
      <span
        className={cn(
          'text-xs',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base'
        )}
      >
        {initials}
      </span>
    </div>
  )
}
