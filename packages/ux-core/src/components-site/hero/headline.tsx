import React from 'react'
import { cn } from '../../utils/cn'
import { siteUtils } from '../colors'

interface HeadlineProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  color?: 'white' | 'gray' | 'pink' | 'orange'
  emphasis?: 'none' | 'gradient' | 'highlight'
  emphasisColor?: 'pink' | 'orange' | 'blue'
  align?: 'left' | 'center' | 'right'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const headlineSizes = {
  sm: 'text-3xl sm:text-4xl lg:text-5xl',
  md: 'text-4xl sm:text-5xl lg:text-6xl',
  lg: 'text-5xl sm:text-6xl lg:text-7xl',
  xl: 'text-6xl sm:text-7xl lg:text-8xl',
  '2xl': 'text-7xl sm:text-8xl lg:text-9xl',
}

const headlineColors = {
  white: 'text-white',
  gray: 'text-gray-800',
  pink: 'text-[#F45584]',
  orange: 'text-[#FF8C42]',
}

const headlineAlign = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-3xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
  full: 'max-w-full',
}

export function Headline({
  children,
  className,
  size = 'lg',
  color = 'white',
  emphasis = 'none',
  emphasisColor = 'pink',
  align = 'center',
  maxWidth = 'lg',
}: HeadlineProps) {
  const renderEmphasizedText = (text: string) => {
    if (emphasis === 'none') return text

    // Split text by common emphasis patterns
    const words = text.split(' ')
    const emphasizedWords = words.map((word, index) => {
      // Apply emphasis to specific words (you can customize this logic)
      if (
        emphasis === 'highlight' &&
        (word.toLowerCase().includes('ai') ||
          word.toLowerCase().includes('success') ||
          word.toLowerCase().includes('automation'))
      ) {
        return (
          <span
            key={index}
            className={cn(
              'text-transparent bg-clip-text bg-gradient-to-r',
              emphasisColor === 'pink' && 'from-[#F45584] to-[#8B5CF6]',
              emphasisColor === 'orange' && 'from-[#FF8C42] to-[#F45584]',
              emphasisColor === 'blue' && 'from-[#4F9CF9] to-[#3B82F6]'
            )}
          >
            {word}
          </span>
        )
      }
      return word + ' '
    })

    return emphasizedWords
  }

  return (
    <h1
      className={cn(
        'font-bold leading-tight tracking-tight',
        headlineSizes[size],
        headlineColors[color],
        headlineAlign[align],
        maxWidthClasses[maxWidth],
        'mx-auto',
        className
      )}
    >
      {typeof children === 'string' ? renderEmphasizedText(children) : children}
    </h1>
  )
}

// SubHeadline component for supporting text
interface SubHeadlineProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'white' | 'gray300' | 'gray200'
  align?: 'left' | 'center' | 'right'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

const subHeadlineSizes = {
  sm: 'text-lg sm:text-xl',
  md: 'text-xl sm:text-2xl',
  lg: 'text-2xl sm:text-3xl',
}

const subHeadlineColors = {
  white: 'text-white',
  gray300: 'text-gray-300',
  gray200: 'text-gray-200',
}

export function SubHeadline({
  children,
  className,
  size = 'md',
  color = 'white',
  align = 'center',
  maxWidth = 'lg',
}: SubHeadlineProps) {
  return (
    <p
      className={cn(
        'font-normal leading-relaxed opacity-90',
        subHeadlineSizes[size],
        subHeadlineColors[color],
        headlineAlign[align],
        maxWidthClasses[maxWidth],
        'mx-auto mt-6',
        className
      )}
    >
      {children}
    </p>
  )
}
