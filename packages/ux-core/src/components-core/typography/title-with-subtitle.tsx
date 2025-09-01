import React from 'react'
import { cn } from '../../utils/cn'

export interface TitleWithSubtitleProps {
  title: string
  subtitle?: string
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export function TitleWithSubtitle({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: TitleWithSubtitleProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <h1
        className={cn('text-xl font-bold', titleClassName)}
        style={{ color: '#2D1B2E' }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={cn('text-xs mt-0.5', subtitleClassName)}
          style={{ color: '#5A365C' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
