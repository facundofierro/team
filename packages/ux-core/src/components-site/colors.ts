/**
 * Components Site Color System
 * Colors from reference design1 - exact color palette used in the reference
 */

// Reference design1 color tokens - exact colors from the reference code
export const siteColors = {
  // Primary colors from reference design1
  primary: {
    red: '#f45584', // Main red/pink used extensively
    orange: '#ff8c42', // Orange accent color
    darkmuted: '#303b58', // Dark muted blue
    lightvibrant: '#ce4c76', // Light vibrant pink/magenta
    darkvibrant: '#6c3350', // Dark vibrant purple/burgundy
    muted: '#74ac64', // Muted green
  },

  // Gradients from reference design1 (converted to Tailwind notation)
  gradients: {
    primary: 'bg-gradient-to-br from-[#f45584] to-[#6c3350]',
    cta: 'bg-gradient-to-r from-[#f45584] to-[#ce4c76]',
    blue: 'bg-gradient-to-r from-[#f45584] to-[#303b58]',
    blueToBlue: 'bg-gradient-to-r from-[#303b58] to-[#303b58]', // Darkmuted to Darkmuted gradient
    orange: 'bg-gradient-to-r from-[#ff8c42] to-[#f45584]',
    green: 'bg-gradient-to-br from-[#74ac64] to-[#303b58]',
    vibrantToMuted: 'bg-gradient-to-r from-[#6c3350] to-[#303b58]',
  },

  // Background colors from reference design1 (converted to Tailwind notation)
  backgrounds: {
    dark: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
    glass: 'bg-gray-800/60 backdrop-blur-sm',
    glassLight: 'bg-white/10 backdrop-blur-sm',
  },

  // Text colors from reference design1 (converted to Tailwind notation)
  text: {
    white: 'text-white',
    gray300: 'text-gray-300',
    gray200: 'text-gray-200',
    gray400: 'text-gray-400',
    red: 'text-[#f45584]',
    pink: 'text-[#f45584]', // Alias for red color
    orange: 'text-[#ff8c42]',
    darkmuted: 'text-[#303b58]',
    lightvibrant: 'text-[#ce4c76]',
    darkvibrant: 'text-[#6c3350]',
    muted: 'text-[#74ac64]',
  },

  // Border colors from reference design1 (converted to Tailwind notation)
  borders: {
    gray700: 'border-gray-700/50',
    gray600: 'border-gray-600/50',
    white20: 'border-white/20',
    white30: 'border-white/30',
    pink500: 'border-pink-500/50',
  },
} as const

// Utility functions for easy access to colors
export const siteUtils = {
  // Button styles
  button: {
    primary: `${siteColors.gradients.primary} text-white hover:from-[#f45584]/90 hover:to-[#6c3350]/90`,
    secondary: `${siteColors.gradients.blue} text-white hover:from-[#f45584]/90 hover:to-[#303b58]/90`,
    cta: `${siteColors.gradients.cta} text-white hover:from-[#f45584]/90 hover:to-[#ce4c76]/90`,
    outline: `border border-[#f45584] text-[#f45584] hover:bg-[#f45584] hover:text-white`,
    ghost: `text-[#f45584] hover:bg-[#f45584]/10`,
  },

  // Card styles
  card: `bg-white border ${siteColors.borders.gray700} rounded-xl shadow-sm`,

  // Hover effects
  hover: {
    red: `hover:text-[#f45584] hover:bg-[#f45584]/10`,
    pink: `hover:text-[#f45584] hover:bg-[#f45584]/10`, // Alias for red hover
    orange: `hover:text-[#ff8c42] hover:bg-[#ff8c42]/10`,
    darkmuted: `hover:text-[#303b58] hover:bg-[#303b58]/10`,
    lightvibrant: `hover:text-[#ce4c76] hover:bg-[#ce4c76]/10`,
    darkvibrant: `hover:text-[#6c3350] hover:bg-[#6c3350]/10`,
    muted: `hover:text-[#74ac64] hover:bg-[#74ac64]/10`,
  },

  // Status colors
  status: {
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
  },

  // Utility functions for component usage
  getBackgroundClasses: (variant: 'dark' | 'glass' | 'glassLight') => {
    return siteColors.backgrounds[variant]
  },

  getButtonClasses: (
    variant: 'primary' | 'secondary' | 'cta' | 'outline' | 'ghost'
  ) => {
    return siteUtils.button[variant]
  },

  getGradientClasses: (
    variant: 'primary' | 'cta' | 'blue' | 'blueToBlue' | 'orange' | 'green'
  ) => {
    return siteColors.gradients[variant]
  },
} as const

// Type exports for reference design1 colors
export type SiteColorKey = keyof typeof siteColors
export type SitePrimaryKey = keyof typeof siteColors.primary
export type SiteGradientKey = keyof typeof siteColors.gradients
export type SiteBackgroundKey = keyof typeof siteColors.backgrounds
export type SiteTextKey = keyof typeof siteColors.text
export type SiteBorderKey = keyof typeof siteColors.borders
