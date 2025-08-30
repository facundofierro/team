import React from 'react'
import { cn } from '@/utils'
import { Grid, GridItem } from '../layout'

interface FeatureGridProps {
  children: React.ReactNode
  className?: string
  cols?: 2 | 3 | 4 | 5 | 6
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  centered?: boolean
  responsive?: boolean
}

const gridCols = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
}

const gridGaps = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
}

export function FeatureGrid({
  children,
  className,
  cols = 3,
  gap = 'lg',
  centered = true,
  responsive = true,
}: FeatureGridProps) {
  return (
    <div
      className={cn(
        'w-full',
        responsive ? gridCols[cols] : `grid-cols-${cols}`,
        gridGaps[gap],
        centered && 'mx-auto',
        'grid',
        className
      )}
    >
      {children}
    </div>
  )
}

// FeatureGridItem component for individual feature items
interface FeatureGridItemProps {
  children: React.ReactNode
  className?: string
  span?: 'full' | 'auto'
  align?: 'left' | 'center' | 'right'
}

const itemAlign = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export function FeatureGridItem({
  children,
  className,
  span = 'auto',
  align = 'center',
}: FeatureGridItemProps) {
  return (
    <div
      className={cn(
        'flex flex-col',
        span === 'full' && 'col-span-full',
        itemAlign[align],
        className
      )}
    >
      {children}
    </div>
  )
}
