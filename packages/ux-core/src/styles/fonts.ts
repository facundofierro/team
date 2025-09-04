/**
 * Font Configuration for Agelum UX Core
 * Based on the reference design from packages/ux-core/designs/config
 */

export const fonts = {
  // Primary font family - Inter is the main font used in the design
  sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

  // Fallback fonts for better cross-platform compatibility
  fallback: 'Arial, Helvetica, "Times New Roman", Georgia, Roboto, sans-serif',

  // Monospace font for code and technical content
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',

  // Font weights
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Font sizes (in rem)
  sizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },

  // Line heights
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const

// Utility function to get font family with fallbacks
export const getFontFamily = (family: keyof typeof fonts) => {
  return fonts[family]
}

// Utility function to get font weight
export const getFontWeight = (weight: keyof typeof fonts.weights) => {
  return fonts.weights[weight]
}

// Utility function to get font size
export const getFontSize = (size: keyof typeof fonts.sizes) => {
  return fonts.sizes[size]
}

// Type exports for better TypeScript support
export type FontFamily = keyof typeof fonts
export type FontWeight = keyof typeof fonts.weights
export type FontSize = keyof typeof fonts.sizes
