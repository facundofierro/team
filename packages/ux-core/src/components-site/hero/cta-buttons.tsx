import React from 'react'
import { cn } from '../../utils'
import { siteColors, siteUtils } from '../colors'
import {
  GradientButton,
  SecondaryButton,
  OutlineButton,
} from './gradient-button'

interface CTAButtonConfig {
  text: string
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: React.ReactNode
  external?: boolean
}

interface CTAButtonsProps {
  buttons: CTAButtonConfig[]
  className?: string
  layout?: 'horizontal' | 'vertical' | 'stacked'
  align?: 'left' | 'center' | 'right'
  spacing?: 'md' | 'lg'
}

const buttonVariants = {
  primary: siteUtils.button.cta,
  secondary: siteUtils.button.primary,
  outline: siteUtils.button.outline,
  ghost: siteUtils.button.ghost,
}

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
}

const layoutClasses = {
  horizontal: 'flex flex-row',
  vertical: 'flex flex-col',
  stacked: 'flex flex-col sm:flex-row',
}

const alignClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

const spacingClasses = {
  sm: 'space-x-2 space-y-2',
  md: 'space-x-4 space-y-4',
  lg: 'space-x-6 space-y-6',
}

export function CTAButtons({
  buttons,
  className,
  layout = 'horizontal',
  align = 'center',
  spacing = 'md',
}: CTAButtonsProps) {
  const renderButton = (button: CTAButtonConfig, index: number) => {
    const buttonClasses = cn(
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F45584] focus:ring-offset-2',
      buttonVariants[button.variant || 'primary'],
      buttonSizes[button.size || 'md'],
      button.icon && 'space-x-2'
    )

    const buttonContent = (
      <>
        {button.icon && <span className="flex-shrink-0">{button.icon}</span>}
        <span>{button.text}</span>
        {button.external && (
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </>
    )

    if (button.onClick) {
      return (
        <button key={index} onClick={button.onClick} className={buttonClasses}>
          {buttonContent}
        </button>
      )
    }

    if (button.href) {
      return (
        <a
          key={index}
          href={button.href}
          className={buttonClasses}
          {...(button.external && {
            target: '_blank',
            rel: 'noopener noreferrer',
          })}
        >
          {buttonContent}
        </a>
      )
    }

    return (
      <button key={index} className={buttonClasses}>
        {buttonContent}
      </button>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-wrap',
        layoutClasses[layout],
        alignClasses[align],
        spacingClasses[spacing],
        layout === 'stacked' && 'sm:space-y-0',
        className
      )}
    >
      {buttons.map((button, index) => renderButton(button, index))}
    </div>
  )
}

// Individual CTA Button component for single button usage
interface SingleCTAButtonProps {
  text: string
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: React.ReactNode
  external?: boolean
  className?: string
}

export function CTAButton({
  text,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  external,
  className,
}: SingleCTAButtonProps) {
  return (
    <CTAButtons
      buttons={[{ text, href, onClick, variant, size, icon, external }]}
      className={className}
    />
  )
}
