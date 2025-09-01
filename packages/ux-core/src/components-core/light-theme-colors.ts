/**
 * Light Theme Color System
 * Colors for components-core components that use light backgrounds
 * Used by: buttons, forms, cards, and other light-themed components
 * Based on elegantColors but optimized for light backgrounds
 */

import { elegantColors } from '../styles/color-tokens'

export const coreColors = {
  // Background colors for light theme
  background: {
    primary: elegantColors.background.tertiary, // White
    secondary: elegantColors.background.primary, // Light gray
    tertiary: elegantColors.background.secondary, // Very light gray
    card: elegantColors.background.tertiary, // White
    footer: elegantColors.background.tertiary, // White
  },

  // Text colors for light theme
  text: {
    primary: elegantColors.text.primary, // Dark gray #2D1B2E
    secondary: elegantColors.text.secondary, // Medium gray #5A365C
    tertiary: elegantColors.text.tertiary, // Light gray #847F8A
    inverse: elegantColors.text.inverse, // White
    disabled: elegantColors.text.quaternary, // Very light gray #AFABB3
  },

  // Border colors for light theme
  border: {
    light: elegantColors.border.light, // Very light border
    medium: elegantColors.border.medium, // Medium border
    strong: elegantColors.border.strong, // Strong border
    focus: elegantColors.border.focus, // Purple focus border
  },

  // Interactive states for light theme
  interactive: {
    // Button states
    buttonDefault: 'transparent',
    buttonHover: elegantColors.interactive.ghostHover, // Light gray hover
    buttonActive: elegantColors.interactive.ghostActive, // Slightly darker gray
    buttonTextDefault: elegantColors.text.secondary, // Medium gray text
    buttonTextHover: elegantColors.text.primary, // Dark gray text on hover
    buttonTextActive: elegantColors.text.primary, // Dark gray text when active

    // Primary button states
    primaryDefault: elegantColors.background.primaryGradient, // Purple gradient
    primaryHover: elegantColors.background.primaryGradient, // Same gradient
    primaryText: elegantColors.text.inverse, // White text

    // Action button states
    actionDefault: elegantColors.primary[500], // Solid purple
    actionHover: elegantColors.primary[600], // Darker purple
    actionText: elegantColors.text.inverse, // White text

    // Ghost button states
    ghostDefault: 'transparent',
    ghostHover: elegantColors.interactive.ghostHover, // Light gray
    ghostText: elegantColors.text.secondary, // Medium gray text
  },

  // Focus styles (no blue!)
  focus: {
    ring: elegantColors.border.focus, // Purple focus ring
    ringOffset: elegantColors.background.tertiary, // White ring offset
  },

  // Brand colors
  brand: {
    primary: elegantColors.primary[500], // Main purple
    secondary: elegantColors.secondary[500], // Coral/pink
    accent: elegantColors.accent.lavender, // Lavender
  },

  // Status colors
  status: {
    success: elegantColors.status.success[500],
    warning: elegantColors.status.warning[500],
    error: elegantColors.status.error[500],
    info: elegantColors.status.info[500],
  },
} as const

// Utility functions for core components
export const coreUtils = {
  // Get focus styles without blue
  getFocusStyles: () => ({
    outline: 'none',
    boxShadow: `0 0 0 2px ${coreColors.focus.ring}`,
  }),

  // Get button hover styles
  getButtonHover: (type: 'default' | 'primary' | 'action' | 'ghost') => {
    const styles = {
      default: {
        backgroundColor: coreColors.interactive.buttonHover,
        color: coreColors.interactive.buttonTextHover,
      },
      primary: {
        background: coreColors.interactive.primaryHover,
        color: coreColors.interactive.primaryText,
      },
      action: {
        backgroundColor: coreColors.interactive.actionHover,
        color: coreColors.interactive.actionText,
      },
      ghost: {
        backgroundColor: coreColors.interactive.ghostHover,
        color: coreColors.interactive.ghostText,
      },
    }
    return styles[type]
  },

  // Get button default styles
  getButtonDefault: (type: 'default' | 'primary' | 'action' | 'ghost') => {
    const styles = {
      default: {
        backgroundColor: coreColors.interactive.buttonDefault,
        color: coreColors.interactive.buttonTextDefault,
      },
      primary: {
        background: coreColors.interactive.primaryDefault,
        color: coreColors.interactive.primaryText,
      },
      action: {
        backgroundColor: coreColors.interactive.actionDefault,
        color: coreColors.interactive.actionText,
      },
      ghost: {
        backgroundColor: coreColors.interactive.ghostDefault,
        color: coreColors.interactive.ghostText,
      },
    }
    return styles[type]
  },
} as const

// Type exports
export type CoreColorKey = keyof typeof coreColors
export type CoreInteractiveKey = keyof typeof coreColors.interactive
