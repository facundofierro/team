import React from 'react'
import { cn } from '../../utils/cn'
import { siteColors, siteUtils } from '../colors'

interface GradientButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const buttonVariants = {
  primary: siteUtils.button.primary,
  secondary: siteUtils.button.secondary,
  outline: siteUtils.button.outline,
  ghost: siteUtils.button.ghost,
}

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
}

export function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
}: GradientButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#F45584] focus:ring-offset-2',
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
        className
      )}
    >
      {/* Background gradient overlay for better text contrast */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#F45584] to-[#8B5CF6] rounded-lg opacity-90" />
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </div>
    </button>
  )
}

// Specialized button variants for common use cases
export function CTAButton({
  children,
  ...props
}: Omit<GradientButtonProps, 'variant' | 'size'>) {
  return (
    <GradientButton variant="primary" size="lg" {...props}>
      {children}
    </GradientButton>
  )
}

export function SecondaryButton({
  children,
  ...props
}: Omit<GradientButtonProps, 'variant'>) {
  return (
    <GradientButton variant="secondary" {...props}>
      {children}
    </GradientButton>
  )
}

export function OutlineButton({
  children,
  ...props
}: Omit<GradientButtonProps, 'variant'>) {
  return (
    <GradientButton variant="outline" {...props}>
      {children}
    </GradientButton>
  )
}
