import React from 'react'
import { cn } from '../../utils/cn'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const containerSizes = {
  sm: 'max-w-4xl',
  md: 'max-w-6xl',
  lg: 'max-w-7xl',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
}

const containerPadding = {
  none: '',
  sm: 'px-4 sm:px-6',
  md: 'px-6 sm:px-8',
  lg: 'px-8 sm:px-12',
  xl: 'px-12 sm:px-16',
}

export function Container({
  children,
  className,
  size = 'lg',
  padding = 'md',
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        containerSizes[size],
        containerPadding[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
