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

  // Gradients from reference design1
  gradients: {
    primary: 'linear-gradient(135deg, #F45584 0%, #8B5CF6 100%)',
    cta: 'linear-gradient(135deg, #F45584 0%, #E91E63 100%)',
    blue: 'linear-gradient(135deg, #F45584 0%, #4F9CF9 100%)',
    orange: 'linear-gradient(135deg, #FF8C42 0%, #F45584 100%)',
    blueToBlue: 'linear-gradient(135deg, #4F9CF9 0%, #3B82F6 100%)',
  },

  // Background colors from reference design1
  backgrounds: {
    dark: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #000000 100%)', // gray-900 via gray-800 to black
    glass: 'rgba(31, 41, 55, 0.6)', // gray-800/60 with backdrop-blur
    glassLight: 'rgba(255, 255, 255, 0.1)', // white/10 with backdrop-blur
  },

  // Text colors from reference design1
  text: {
    white: '#ffffff',
    gray300: '#d1d5db', // gray-300
    gray200: '#e5e7eb', // gray-200
    gray400: '#9ca3af', // gray-400
  },

  // Border colors from reference design1
  borders: {
    gray700: 'rgba(55, 65, 81, 0.5)', // gray-700/50
    gray600: 'rgba(75, 85, 99, 0.5)', // gray-600/50
    white20: 'rgba(255, 255, 255, 0.2)', // white/20
    white30: 'rgba(255, 255, 255, 0.3)', // white/30
  },
} as const

// Utility functions for reference design1 components
export const siteUtils = {
  // Get button classes using reference design colors
  getButtonClasses: (
    variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta'
  ) => {
    const classes = {
      primary:
        'bg-gradient-to-r from-[#F45584] to-[#8B5CF6] text-white hover:from-[#F45584]/90 hover:to-[#8B5CF6]/90',
      secondary:
        'bg-gradient-to-r from-[#F45584] to-[#4F9CF9] text-white hover:from-[#F45584]/90 hover:to-[#4F9CF9]/90',
      cta: 'bg-gradient-to-r from-[#F45584] to-[#E91E63] text-white hover:from-[#F45584]/90 hover:to-[#E91E63]/90',
      outline:
        'border border-[#F45584] text-[#F45584] hover:bg-[#F45584] hover:text-white',
      ghost: 'text-[#F45584] hover:bg-[#F45584]/10',
    }
    return classes[variant]
  },

  // Get gradient classes from reference design
  getGradientClasses: (
    variant: 'primary' | 'cta' | 'blue' | 'orange' | 'blueToBlue'
  ) => {
    const gradients = {
      primary: 'bg-gradient-to-br from-[#F45584] to-[#8B5CF6]',
      cta: 'bg-gradient-to-r from-[#F45584] to-[#E91E63]',
      blue: 'bg-gradient-to-r from-[#F45584] to-[#4F9CF9]',
      orange: 'bg-gradient-to-r from-[#FF8C42] to-[#F45584]',
      blueToBlue: 'bg-gradient-to-br from-[#4F9CF9] to-[#3B82F6]',
    }
    return gradients[variant]
  },

  // Get text color classes from reference design
  getTextClasses: (
    variant: 'white' | 'gray300' | 'gray200' | 'gray400' | 'pink' | 'orange'
  ) => {
    const classes = {
      white: 'text-white',
      gray300: 'text-gray-300',
      gray200: 'text-gray-200',
      gray400: 'text-gray-400',
      pink: 'text-[#F45584]',
      orange: 'text-[#FF8C42]',
    }
    return classes[variant]
  },

  // Get background classes from reference design
  getBackgroundClasses: (variant: 'dark' | 'glass' | 'glassLight' | 'card') => {
    const classes = {
      dark: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
      glass: 'bg-gray-800/60 backdrop-blur-sm',
      glassLight: 'bg-white/10 backdrop-blur-sm',
      card: 'bg-gray-800/60 backdrop-blur-sm border border-gray-700/50',
    }
    return classes[variant]
  },

  // Get border classes from reference design
  getBorderClasses: (
    variant: 'gray700' | 'gray600' | 'white20' | 'white30'
  ) => {
    const classes = {
      gray700: 'border-gray-700/50',
      gray600: 'border-gray-600/50',
      white20: 'border-white/20',
      white30: 'border-white/30',
    }
    return classes[variant]
  },
} as const

// Type exports for reference design1 colors
export type SiteColorKey = keyof typeof siteColors
export type SitePrimaryKey = keyof typeof siteColors.primary
export type SiteGradientKey = keyof typeof siteColors.gradients
export type SiteBackgroundKey = keyof typeof siteColors.backgrounds
export type SiteTextKey = keyof typeof siteColors.text
export type SiteBorderKey = keyof typeof siteColors.borders
