/**
 * Components Core Color System
 * Centralized colors for all components-core components using the main elegant color system
 */

import { elegantColors, elegantUtils } from '../styles/color-tokens'

export const componentColors = {
  // Background colors
  background: {
    main: elegantColors.background.dark,
    header: 'rgba(255, 255, 255, 0.05)',
    footer: 'rgba(255, 255, 255, 0.05)',
    card: 'rgba(255, 255, 255, 0.1)',
    dropdown: 'rgba(68, 51, 122, 0.95)',
    modal: 'rgba(68, 51, 122, 0.98)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Border colors
  border: {
    main: 'rgba(255, 255, 255, 0.1)',
    header: 'rgba(255, 255, 255, 0.1)',
    footer: 'rgba(255, 255, 255, 0.1)',
    card: 'rgba(255, 255, 255, 0.2)',
    dropdown: 'rgba(255, 255, 255, 0.2)',
    submenu: 'rgba(255, 255, 255, 0.2)',
    focus: 'rgba(138, 84, 140, 0.5)',
    focusStrong: 'rgba(138, 84, 140, 0.8)',
  },

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.6)',
    inverse: '#FFFFFF',
    brand: '#FFFFFF',
    brandSubtitle: 'rgba(255, 255, 255, 0.6)',
    disabled: 'rgba(255, 255, 255, 0.4)',
  },

  // Interactive states
  interactive: {
    // Navigation items
    navDefault: 'transparent',
    navHover: 'rgba(255, 255, 255, 0.05)',
    navActive: 'rgba(255, 255, 255, 0.1)',
    navTextDefault: 'rgba(255, 255, 255, 0.7)',
    navTextHover: '#FFFFFF',
    navTextActive: '#FFFFFF',

    // Submenu items
    submenuDefault: 'transparent',
    submenuHover: 'rgba(255, 255, 255, 0.05)',
    submenuActive: elegantColors.secondary[500],
    submenuTextDefault: 'rgba(255, 255, 255, 0.6)',
    submenuTextHover: 'rgba(255, 255, 255, 0.8)',
    submenuTextActive: '#FFFFFF',

    // Action buttons
    buttonDefault: 'rgba(255, 255, 255, 0.1)',
    buttonHover: 'rgba(255, 255, 255, 0.15)',
    buttonActive: 'rgba(255, 255, 255, 0.2)',
    buttonTextDefault: 'rgba(255, 255, 255, 0.7)',
    buttonTextHover: '#FFFFFF',
    buttonTextActive: '#FFFFFF',

    // Dropdown items
    dropdownItemDefault: 'transparent',
    dropdownItemHover: 'rgba(255, 255, 255, 0.1)',
    dropdownItemActive: 'rgba(255, 255, 255, 0.1)',
    dropdownTextDefault: 'rgba(255, 255, 255, 0.7)',
    dropdownTextActive: '#FFFFFF',

    // Form elements
    inputDefault: 'rgba(255, 255, 255, 0.1)',
    inputHover: 'rgba(255, 255, 255, 0.15)',
    inputFocus: 'rgba(255, 255, 255, 0.2)',
    inputTextDefault: '#FFFFFF',
    inputTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
  },

  // Brand/Logo colors
  brand: {
    iconBackground: elegantColors.background.accentGradient,
    iconColor: '#FFFFFF',
    primary: elegantColors.primary[500],
    secondary: elegantColors.secondary[500],
  },

  // Status colors
  status: {
    success: elegantColors.status.success,
    warning: elegantColors.status.warning,
    error: elegantColors.status.error,
    info: elegantColors.status.info,
  },

  // Effects
  effects: {
    backdropFilter: 'blur(12px)',
    backdropFilterLight: 'blur(8px)',
    backdropFilterDropdown: 'blur(16px)',
    backdropFilterModal: 'blur(20px)',
  },

  // Shadows
  shadows: {
    sm: elegantUtils.getShadowStyles('sm'),
    md: elegantUtils.getShadowStyles('md'),
    lg: elegantUtils.getShadowStyles('lg'),
    xl: elegantUtils.getShadowStyles('xl'),
    '2xl': elegantUtils.getShadowStyles('2xl'),
  },
} as const

// Utility functions for component styling
export const componentUtils = {
  ...elegantUtils,

  // Component-specific shadow styles
  getComponentShadow: (size: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
    return elegantUtils.getShadowStyles(size)
  },

  // Hover transform effects
  getHoverTransform: (direction: 'up' | 'right' | 'down' | 'left' = 'up') => {
    const transforms = {
      up: 'translateY(-1px)',
      right: 'translateX(4px)',
      down: 'translateY(1px)',
      left: 'translateX(-4px)',
    }
    return transforms[direction]
  },

  // Transition styles
  getTransition: (duration: 'fast' | 'normal' | 'slow' = 'normal') => {
    const durations = {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    }
    return `transition-all duration-${durations[duration]}`
  },

  // Focus styles
  getFocusStyles: (color: string = componentColors.border.focus) => {
    return {
      outline: 'none',
      borderColor: color,
      boxShadow: `0 0 0 2px ${color}`,
    }
  },

  // Glass morphism effects
  getGlassEffect: (intensity: 'light' | 'medium' | 'strong' = 'medium') => {
    const effects = {
      light: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      },
      medium: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
      },
      strong: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      },
    }
    return effects[intensity]
  },
} as const

// Type exports for better TypeScript support
export type ComponentColorKey = keyof typeof componentColors
export type ComponentInteractiveKey = keyof typeof componentColors.interactive
export type ComponentBackgroundKey = keyof typeof componentColors.background
export type ComponentTextKey = keyof typeof componentColors.text
export type ComponentBorderKey = keyof typeof componentColors.border
