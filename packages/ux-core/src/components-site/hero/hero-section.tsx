import React from 'react'
import { cn } from '@teamhub/ux-core/utils'
import { Container } from '../layout'

interface HeroSectionProps {
  children: React.ReactNode
  className?: string
  background?:
    | 'none'
    | 'dark'
    | 'gradient'
    | 'teamhub-primary'
    | 'teamhub-secondary'
  fullHeight?: boolean
  centered?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  overlay?: boolean
  overlayColor?: string
}

const backgroundClasses = {
  none: '',
  dark: 'bg-gradient-to-br from-teamhub-secondary to-teamhub-secondary/80',
  gradient:
    'bg-gradient-to-br from-teamhub-primary via-teamhub-accent to-teamhub-hot-pink',
  'teamhub-primary': 'bg-teamhub-primary',
  'teamhub-secondary': 'bg-teamhub-secondary',
}

const paddingClasses = {
  sm: 'py-16 sm:py-20',
  md: 'py-20 sm:py-24',
  lg: 'py-24 sm:py-32',
  xl: 'py-32 sm:py-40',
  '2xl': 'py-40 sm:py-48',
}

export function HeroSection({
  children,
  className,
  background = 'dark',
  fullHeight = false,
  centered = true,
  padding = 'xl',
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.4)',
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        fullHeight && 'min-h-screen',
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
    >
      {/* Background Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 z-10"
          style={{ backgroundColor: overlayColor }}
        />
      )}

      {/* Content */}
      <div
        className={cn(
          'relative z-20',
          centered && 'flex items-center justify-center'
        )}
      >
        <Container size="lg" padding="md">
          <div className={cn(centered && 'text-center')}>{children}</div>
        </Container>
      </div>

      {/* Background Pattern (optional) */}
      {background === 'gradient' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
        </div>
      )}
    </section>
  )
}
