import * as React from 'react'
import {
  Button as ShadcnButton,
  buttonVariants,
} from '../components/shadcn/button'
import { cn } from '../utils/cn'

type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'
type TeamHubVariant = 'teamhub' | 'teamhub-secondary' | 'teamhub-outline'
type AllVariants = ButtonVariant | TeamHubVariant

// TeamHub-specific button variants
const getTeamHubButtonClasses = (
  variant: AllVariants,
  size: ButtonSize,
  className?: string
) => {
  const baseClasses = buttonVariants({ variant: 'default', size, className })

  const teamhubClasses = {
    teamhub:
      'bg-teamhub-primary text-white hover:bg-teamhub-primary/90 border-teamhub-primary',
    'teamhub-secondary':
      'bg-teamhub-secondary text-teamhub-secondary-foreground hover:bg-teamhub-secondary/80',
    'teamhub-outline':
      'border-teamhub-primary text-teamhub-primary hover:bg-teamhub-primary/10',
  }

  // Add TeamHub-specific classes if variant is specified
  if (variant && variant.startsWith('teamhub')) {
    return cn(
      baseClasses,
      teamhubClasses[variant as keyof typeof teamhubClasses]
    )
  }

  // For non-TeamHub variants, use the base buttonVariants
  return buttonVariants({ variant: variant as ButtonVariant, size, className })
}

export interface TeamHubButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AllVariants
  size?: ButtonSize
  asChild?: boolean
}

const TeamHubButton = React.forwardRef<HTMLButtonElement, TeamHubButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      ...props
    },
    ref
  ) => {
    // Handle TeamHub variants separately
    if (variant && variant.startsWith('teamhub')) {
      const teamhubClasses = getTeamHubButtonClasses(variant, size, className)
      return (
        <ShadcnButton
          ref={ref}
          className={cn(
            // TeamHub design system classes
            'font-medium transition-all duration-200',
            'focus:ring-2 focus:ring-teamhub-primary/20 focus:ring-offset-2',
            teamhubClasses
          )}
          variant="default" // Use default variant for TeamHub buttons
          size={size}
          asChild={asChild}
          {...props}
        />
      )
    }

    // For standard variants, use the base button
    return (
      <ShadcnButton
        ref={ref}
        className={cn(
          // TeamHub design system classes
          'font-medium transition-all duration-200',
          'focus:ring-2 focus:ring-teamhub-primary/20 focus:ring-offset-2',
          className
        )}
        variant={variant as ButtonVariant}
        size={size}
        asChild={asChild}
        {...props}
      />
    )
  }
)

TeamHubButton.displayName = 'TeamHubButton'

export { TeamHubButton, getTeamHubButtonClasses }
