import React from 'react'
import { cn } from '../../utils/cn'

interface QuickReply {
  id: string
  text: string
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  action?: 'button' | 'link' | 'submit'
  href?: string
  onClick?: () => void
}

interface QuickRepliesProps {
  replies: QuickReply[]
  className?: string
  layout?: 'horizontal' | 'vertical' | 'grid'
  size?: 'sm' | 'md' | 'lg'
  maxReplies?: number
  showMore?: boolean
  onShowMore?: () => void
}

const layoutClasses = {
  horizontal: 'flex flex-wrap gap-2',
  vertical: 'flex flex-col gap-2',
  grid: 'grid grid-cols-2 gap-2',
}

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
}

const variantClasses = {
  primary: 'bg-teamhub-primary hover:bg-teamhub-primary/90 text-white',
  secondary:
    'bg-teamhub-background border border-teamhub-border/20 hover:bg-teamhub-border/10 text-teamhub-secondary',
  outline:
    'border border-teamhub-primary text-teamhub-primary hover:bg-teamhub-primary hover:text-white',
  ghost: 'text-teamhub-primary hover:bg-teamhub-primary/10',
}

export function QuickReplies({
  replies,
  className,
  layout = 'vertical',
  size = 'md',
  maxReplies,
  showMore = false,
  onShowMore,
}: QuickRepliesProps) {
  const displayReplies = maxReplies ? replies.slice(0, maxReplies) : replies
  const hasMoreReplies = maxReplies && replies.length > maxReplies

  const renderQuickReply = (reply: QuickReply) => {
    const buttonClasses = cn(
      'inline-flex items-center justify-center space-x-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teamhub-primary focus:ring-offset-2',
      sizeClasses[size],
      variantClasses[reply.variant || 'secondary']
    )

    if (reply.action === 'link' && reply.href) {
      return (
        <a key={reply.id} href={reply.href} className={buttonClasses}>
          {reply.icon && <span className="flex-shrink-0">{reply.icon}</span>}
          <span>{reply.text}</span>
        </a>
      )
    }

    return (
      <button key={reply.id} onClick={reply.onClick} className={buttonClasses}>
        {reply.icon && <span className="flex-shrink-0">{reply.icon}</span>}
        <span>{reply.text}</span>
      </button>
    )
  }

  return (
    <div className={className}>
      <div className={cn(layoutClasses[layout])}>
        {displayReplies.map(renderQuickReply)}

        {hasMoreReplies && showMore && (
          <button
            onClick={onShowMore}
            className={cn(
              'text-teamhub-primary hover:text-teamhub-primary/80 text-sm font-medium underline',
              layout === 'vertical' ? 'text-center' : ''
            )}
          >
            Show more options...
          </button>
        )}
      </div>
    </div>
  )
}

// Quick Reply Button component for individual quick replies
interface QuickReplyButtonProps {
  text: string
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
}

export function QuickReplyButton({
  text,
  icon,
  variant = 'secondary',
  size = 'md',
  onClick,
  className,
}: QuickReplyButtonProps) {
  return (
    <QuickReplies
      replies={[{ id: 'single', text, icon, variant, onClick }]}
      layout="horizontal"
      size={size}
      className={className}
    />
  )
}

// Quick Reply Group component for organizing related quick replies
interface QuickReplyGroupProps {
  title?: string
  replies: QuickReply[]
  className?: string
  layout?: 'horizontal' | 'vertical' | 'grid'
  size?: 'sm' | 'md' | 'lg'
}

export function QuickReplyGroup({
  title,
  replies,
  className,
  layout = 'vertical',
  size = 'md',
}: QuickReplyGroupProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {title && (
        <h4 className="text-sm font-medium text-teamhub-muted">{title}</h4>
      )}
      <QuickReplies replies={replies} layout={layout} size={size} />
    </div>
  )
}
