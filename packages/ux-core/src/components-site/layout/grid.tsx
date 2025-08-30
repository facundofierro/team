import React from 'react'
import { cn } from '@/utils'

interface GridProps {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
}

const gridGaps = {
  none: '',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
}

export function Grid({
  children,
  className,
  cols = 3,
  gap = 'md',
  responsive = true,
}: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        responsive ? gridCols[cols] : `grid-cols-${cols}`,
        gridGaps[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

// Grid Item component for consistent spacing
interface GridItemProps {
  children: React.ReactNode
  className?: string
  span?: 'full' | 'auto'
}

export function GridItem({
  children,
  className,
  span = 'auto',
}: GridItemProps) {
  return (
    <div
      className={cn(
        'flex flex-col',
        span === 'full' && 'col-span-full',
        className
      )}
    >
      {children}
    </div>
  )
}
