import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/shadcn/card'
import { cn } from '../utils/cn'

export interface TeamHubCardProps {
  className?: string
  children: React.ReactNode
}

export interface TeamHubCardHeaderProps {
  className?: string
  children: React.ReactNode
}

export interface TeamHubCardTitleProps {
  className?: string
  children: React.ReactNode
}

export interface TeamHubCardDescriptionProps {
  className?: string
  children: React.ReactNode
}

export interface TeamHubCardContentProps {
  className?: string
  children: React.ReactNode
}

export interface TeamHubCardFooterProps {
  className?: string
  children: React.ReactNode
}

const TeamHubCard = React.forwardRef<HTMLDivElement, TeamHubCardProps>(
  ({ className, children, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(
        // TeamHub design system classes
        'border-teamhub-border bg-teamhub-card',
        'shadow-sm hover:shadow-md transition-shadow duration-200',
        'rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  )
)

const TeamHubCardHeader = React.forwardRef<
  HTMLDivElement,
  TeamHubCardHeaderProps
>(({ className, children, ...props }, ref) => (
  <CardHeader
    ref={ref}
    className={cn('pb-4', 'border-b border-teamhub-border/50', className)}
    {...props}
  >
    {children}
  </CardHeader>
))

const TeamHubCardTitle = React.forwardRef<
  HTMLParagraphElement,
  TeamHubCardTitleProps
>(({ className, children, ...props }, ref) => (
  <CardTitle
    ref={ref}
    className={cn(
      'text-lg font-semibold text-teamhub-foreground',
      'leading-tight',
      className
    )}
    {...props}
  >
    {children}
  </CardTitle>
))

const TeamHubCardDescription = React.forwardRef<
  HTMLParagraphElement,
  TeamHubCardDescriptionProps
>(({ className, children, ...props }, ref) => (
  <CardDescription
    ref={ref}
    className={cn(
      'text-sm text-teamhub-muted-foreground',
      'leading-relaxed',
      className
    )}
    {...props}
  >
    {children}
  </CardDescription>
))

const TeamHubCardContent = React.forwardRef<
  HTMLDivElement,
  TeamHubCardContentProps
>(({ className, children, ...props }, ref) => (
  <CardContent
    ref={ref}
    className={cn('pt-4', 'text-teamhub-foreground', className)}
    {...props}
  >
    {children}
  </CardContent>
))

const TeamHubCardFooter = React.forwardRef<
  HTMLDivElement,
  TeamHubCardFooterProps
>(({ className, children, ...props }, ref) => (
  <CardFooter
    ref={ref}
    className={cn(
      'pt-4',
      'border-t border-teamhub-border/50',
      'flex items-center justify-between',
      className
    )}
    {...props}
  >
    {children}
  </CardFooter>
))

TeamHubCard.displayName = 'TeamHubCard'
TeamHubCardHeader.displayName = 'TeamHubCardHeader'
TeamHubCardTitle.displayName = 'TeamHubCardTitle'
TeamHubCardDescription.displayName = 'TeamHubCardDescription'
TeamHubCardContent.displayName = 'TeamHubCardContent'
TeamHubCardFooter.displayName = 'TeamHubCardFooter'

export {
  TeamHubCard,
  TeamHubCardHeader,
  TeamHubCardTitle,
  TeamHubCardDescription,
  TeamHubCardContent,
  TeamHubCardFooter,
}
