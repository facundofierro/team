import React from 'react'
import { cn } from '@teamhub/ux-core/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  background?:
    | 'none'
    | 'light'
    | 'dark'
    | 'gradient'
    | 'teamhub-primary'
    | 'teamhub-secondary'
  fullWidth?: boolean
  id?: string
}

const sectionPadding = {
  none: '',
  sm: 'py-8 sm:py-12',
  md: 'py-12 sm:py-16',
  lg: 'py-16 sm:py-20',
  xl: 'py-20 sm:py-24',
  '2xl': 'py-24 sm:py-32',
}

const sectionBackgrounds = {
  none: '',
  light: 'bg-teamhub-background',
  dark: 'bg-teamhub-secondary text-white',
  gradient:
    'bg-gradient-to-br from-teamhub-primary to-teamhub-accent text-white',
  'teamhub-primary': 'bg-teamhub-primary text-white',
  'teamhub-secondary': 'bg-teamhub-secondary text-white',
}

export function Section({
  children,
  className,
  padding = 'lg',
  background = 'none',
  fullWidth = false,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'w-full',
        !fullWidth && 'px-4 sm:px-6 lg:px-8',
        sectionPadding[padding],
        sectionBackgrounds[background],
        className
      )}
    >
      {children}
    </section>
  )
}

// Section Header component for consistent section titles
interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg'
}

const headerSizes = {
  sm: 'mb-8',
  md: 'mb-12',
  lg: 'mb-16',
}

const headerAlign = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export function SectionHeader({
  title,
  subtitle,
  className,
  align = 'center',
  size = 'md',
}: SectionHeaderProps) {
  return (
    <div
      className={cn('mb-8', headerSizes[size], headerAlign[align], className)}
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teamhub-secondary mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg sm:text-xl text-teamhub-muted max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
