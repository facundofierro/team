/**
 * Components Site Color System
 * Colors for components-site components (landing pages, marketing)
 * Uses Tailwind CSS classes and custom CSS variables
 */

// Site-specific color tokens that extend the base design system
export const siteColors = {
  // Brand colors for marketing/landing pages
  brand: {
    primary: 'var(--teamhub-primary)', // Purple
    secondary: 'var(--teamhub-secondary)', // Coral/Pink
    accent: 'var(--teamhub-accent)', // Lavender
    background: 'var(--teamhub-background)', // Light background
    foreground: 'var(--teamhub-foreground)', // Dark text
  },

  // Marketing-specific colors
  marketing: {
    hero: {
      background: 'var(--teamhub-hero-bg)',
      text: 'var(--teamhub-hero-text)',
      accent: 'var(--teamhub-hero-accent)',
    },
    cta: {
      primary: 'var(--teamhub-cta-primary)',
      secondary: 'var(--teamhub-cta-secondary)',
      text: 'var(--teamhub-cta-text)',
    },
    features: {
      background: 'var(--teamhub-features-bg)',
      card: 'var(--teamhub-features-card)',
      text: 'var(--teamhub-features-text)',
    },
  },

  // Status colors for site components
  status: {
    success: 'var(--teamhub-success)',
    warning: 'var(--teamhub-warning)',
    error: 'var(--teamhub-error)',
    info: 'var(--teamhub-info)',
  },

  // Interactive states for site components
  interactive: {
    hover: 'var(--teamhub-hover)',
    active: 'var(--teamhub-active)',
    focus: 'var(--teamhub-focus)',
    disabled: 'var(--teamhub-disabled)',
  },
} as const

// Utility functions for site components
export const siteUtils = {
  // Get Tailwind classes for common patterns
  getButtonClasses: (
    variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  ) => {
    const classes = {
      primary: 'bg-teamhub-primary text-white hover:bg-teamhub-primary/90',
      secondary:
        'bg-teamhub-secondary text-white hover:bg-teamhub-secondary/90',
      outline:
        'border-teamhub-primary text-teamhub-primary hover:bg-teamhub-primary hover:text-white',
      ghost: 'text-teamhub-primary hover:bg-teamhub-primary/10',
    }
    return classes[variant]
  },

  // Get gradient classes
  getGradientClasses: (
    direction: 'horizontal' | 'vertical' | 'diagonal' = 'horizontal'
  ) => {
    const gradients = {
      horizontal: 'bg-gradient-to-r from-teamhub-primary to-teamhub-accent',
      vertical: 'bg-gradient-to-b from-teamhub-primary to-teamhub-accent',
      diagonal: 'bg-gradient-to-br from-teamhub-primary to-teamhub-accent',
    }
    return gradients[direction]
  },

  // Get text color classes
  getTextClasses: (variant: 'primary' | 'secondary' | 'muted' | 'inverse') => {
    const classes = {
      primary: 'text-teamhub-foreground',
      secondary: 'text-teamhub-secondary',
      muted: 'text-teamhub-muted',
      inverse: 'text-white',
    }
    return classes[variant]
  },

  // Get background classes
  getBackgroundClasses: (
    variant: 'primary' | 'secondary' | 'card' | 'hero'
  ) => {
    const classes = {
      primary: 'bg-teamhub-background',
      secondary: 'bg-teamhub-secondary/5',
      card: 'bg-white',
      hero: 'bg-teamhub-hero-bg',
    }
    return classes[variant]
  },
} as const

// Type exports
export type SiteColorKey = keyof typeof siteColors
export type SiteBrandKey = keyof typeof siteColors.brand
export type SiteMarketingKey = keyof typeof siteColors.marketing
