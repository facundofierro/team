/**
 * Components Site Color System
 * Colors from reference design1 - exact color palette used in the reference
 */

// Reference design1 color tokens - exact colors from the reference code
export const siteColors = {
  // Primary colors from reference design1
  primary: {
    pink: '#F45584', // Main pink/red used extensively
    purple: '#8B5CF6', // Purple used in gradients
    orange: '#FF8C42', // Orange accent color
    blue: '#4F9CF9', // Blue accent color
    blueDark: '#3B82F6', // Darker blue variant
    pinkDark: '#E91E63', // Darker pink variant
  },

  // Gradients from reference design1 (converted to Tailwind notation)
  gradients: {
    primary: 'bg-gradient-to-br from-[#F45584] to-[#8B5CF6]',
    cta: 'bg-gradient-to-r from-[#F45584] to-[#E91E63]',
    blue: 'bg-gradient-to-r from-[#F45584] to-[#4F9CF9]',
    orange: 'bg-gradient-to-r from-[#FF8C42] to-[#F45584]',
    blueToBlue: 'bg-gradient-to-br from-[#4F9CF9] to-[#3B82F6]',
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
    pink: 'text-[#F45584]',
    orange: 'text-[#FF8C42]',
  },

  // Border colors from reference design1 (converted to Tailwind notation)
  borders: {
    gray700: 'border-gray-700/50',
    gray600: 'border-gray-600/50',
    white20: 'border-white/20',
    white30: 'border-white/30',
  },
} as const

// Utility functions for easy access to colors
export const siteUtils = {
  // Button styles
  button: {
    primary: `${siteColors.gradients.primary} text-white hover:from-[#F45584]/90 hover:to-[#8B5CF6]/90`,
    secondary: `${siteColors.gradients.blue} text-white hover:from-[#F45584]/90 hover:to-[#4F9CF9]/90`,
    cta: `${siteColors.gradients.cta} text-white hover:from-[#F45584]/90 hover:to-[#E91E63]/90`,
    outline: `border border-[#F45584] text-[#F45584] hover:bg-[#F45584] hover:text-white`,
    ghost: `text-[#F45584] hover:bg-[#F45584]/10`,
  },

  // Card styles
  card: `bg-white border ${siteColors.borders.gray700} rounded-xl shadow-sm`,

  // Hover effects
  hover: {
    pink: `hover:text-[#F45584] hover:bg-[#F45584]/10`,
    orange: `hover:text-[#FF8C42] hover:bg-[#FF8C42]/10`,
    blue: `hover:text-[#4F9CF9] hover:bg-[#4F9CF9]/10`,
  },

  // Status colors
  status: {
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
  },
} as const

// Type exports for reference design1 colors
export type SiteColorKey = keyof typeof siteColors
export type SitePrimaryKey = keyof typeof siteColors.primary
export type SiteGradientKey = keyof typeof siteColors.gradients
export type SiteBackgroundKey = keyof typeof siteColors.backgrounds
export type SiteTextKey = keyof typeof siteColors.text
export type SiteBorderKey = keyof typeof siteColors.borders
