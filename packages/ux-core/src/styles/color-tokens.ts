/**
 * Elegant Design System Color Tokens
 * High-end, sophisticated color palette with premium aesthetics
 * Based on the reference design from packages/ux-core/designs/leftnav
 */

export const elegantColors = {
  // Primary Brand Colors - Rich Purple Palette
  primary: {
    50: '#F4F3F5',
    100: '#E9E6EB',
    200: '#D3CDD7',
    300: '#BDB4C3',
    400: '#A79BAF',
    500: '#8A548C', // Main brand color - #8A548C
    600: '#7A4A7C',
    700: '#6A406C',
    800: '#5A365C',
    900: '#4A2C4C',
    950: '#3B2146', // Deep purple - #3B2146
  },

  // Secondary - Warm Coral/Pink Accent
  secondary: {
    50: '#FEF2F4',
    100: '#FDE5E9',
    200: '#FBCBD3',
    300: '#F9B1BD',
    400: '#F797A7',
    500: '#F45584', // Main accent - #F45584
    600: '#E24D7A',
    700: '#D04570',
    800: '#BE3D66',
    900: '#AC355C',
  },

  // Neutral Grays - Sophisticated and Modern
  neutral: {
    50: '#F4F3F5', // Light gray - #F4F3F5
    100: '#EBEAEC',
    200: '#D7D5D9',
    300: '#C3C0C6',
    400: '#AFABB3',
    500: '#9B8FA7', // Medium gray - #9B8FA7
    600: '#847F8A',
    700: '#6D6F6D',
    800: '#565F50',
    900: '#3F4F33',
    950: '#282F20',
  },

  // Accent Colors from Palette
  accent: {
    lavender: '#A091DA', // #A091DA
    yellow: '#E6D24D', // #E6D24D
    olive: '#847F42', // #847F42
    purple: '#8A548C', // #8A548C (same as primary)
  },

  // Status Colors - Professional and Clear
  status: {
    success: {
      50: '#F0FDF4',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
    },
    warning: {
      50: '#FFFBEB',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
    },
    error: {
      50: '#FEF2F2',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
    },
    info: {
      50: '#EFF6FF',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
    },
  },

  // Background System
  background: {
    primary: '#F4F3F5', // Light background
    secondary: '#FAFAFA',
    tertiary: '#FFFFFF',
    dark: '#3B2146', // Deep purple dark background
    darkSecondary: '#4A2C4C',
    darkTertiary: '#5A365C',

    // Gradients
    primaryGradient: 'linear-gradient(135deg, #8A548C 0%, #A091DA 100%)',
    darkGradient: 'linear-gradient(135deg, #3B2146 0%, #4A2C4C 100%)',
    subtleGradient: 'linear-gradient(135deg, #F4F3F5 0%, #FAFAFA 100%)',
    accentGradient: 'linear-gradient(135deg, #F45584 0%, #A091DA 100%)',

    // Glass/Blur effects
    glass: 'rgba(255, 255, 255, 0.8)',
    glassStrong: 'rgba(255, 255, 255, 0.95)',
    glassDark: 'rgba(59, 33, 70, 0.8)',
    glassDarkStrong: 'rgba(59, 33, 70, 0.95)',
  },

  // Border System
  border: {
    light: 'rgba(215, 213, 217, 0.6)',
    medium: 'rgba(195, 192, 198, 0.8)',
    strong: 'rgba(175, 171, 179, 0.9)',
    dark: 'rgba(90, 54, 92, 0.6)',
    darkMedium: 'rgba(106, 64, 108, 0.8)',
    darkStrong: 'rgba(122, 74, 124, 0.9)',

    // Interactive borders
    focus: 'rgba(138, 84, 140, 0.5)',
    focusStrong: 'rgba(138, 84, 140, 0.8)',
    hover: 'rgba(138, 84, 140, 0.3)',
  },

  // Text Colors
  text: {
    primary: '#2D1B2E',
    secondary: '#5A365C',
    tertiary: '#847F8A',
    quaternary: '#AFABB3',
    inverse: '#F4F3F5',
    inverseSecondary: '#EBEAEC',
    inverseTertiary: '#D7D5D9',
    brand: '#8A548C',
    accent: '#F45584',
  },

  // Interactive States
  interactive: {
    // Primary interactions
    primaryDefault: '#8A548C',
    primaryHover: '#7A4A7C',
    primaryActive: '#6A406C',
    primaryDisabled: '#C3C0C6',

    // Secondary interactions
    secondaryDefault: 'rgba(138, 84, 140, 0.1)',
    secondaryHover: 'rgba(138, 84, 140, 0.15)',
    secondaryActive: 'rgba(138, 84, 140, 0.2)',

    // Ghost interactions
    ghostHover: 'rgba(244, 243, 245, 0.8)',
    ghostActive: 'rgba(235, 234, 236, 0.9)',
    ghostDarkHover: 'rgba(59, 33, 70, 0.8)',
    ghostDarkActive: 'rgba(74, 44, 76, 0.9)',

    // Selection states
    selected: 'rgba(138, 84, 140, 0.12)',
    selectedBorder: 'rgba(138, 84, 140, 0.3)',
    selectedStrong: 'rgba(138, 84, 140, 0.18)',
  },
} as const

// Agent Status Colors - Elegant theme
export const agentStatusColors = {
  active: {
    color: elegantColors.status.success[600],
    bg: elegantColors.status.success[50],
    border: `rgba(34, 197, 94, 0.2)`,
    dot: elegantColors.status.success[500],
  },
  idle: {
    color: elegantColors.accent.yellow,
    bg: 'rgba(230, 210, 77, 0.1)',
    border: `rgba(230, 210, 77, 0.2)`,
    dot: elegantColors.accent.yellow,
  },
  offline: {
    color: elegantColors.neutral[600],
    bg: elegantColors.neutral[50],
    border: `rgba(132, 127, 138, 0.2)`,
    dot: elegantColors.neutral[500],
  },
} as const

// Utility functions for shadows and effects
export const elegantUtils = {
  getShadowStyles: (size: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
    const shadows = {
      sm: {
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05))',
      },
      md: {
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
      },
      lg: {
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))',
      },
      xl: {
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.1))',
      },
      '2xl': {
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))',
      },
    }
    return shadows[size]
  },
}

// CSS Custom Properties for the Elegant Design System
export const elegantCSSVariables = `
:root {
  /* Primary Brand Colors */
  --elegant-primary-50: ${elegantColors.primary[50]};
  --elegant-primary-100: ${elegantColors.primary[100]};
  --elegant-primary-200: ${elegantColors.primary[200]};
  --elegant-primary-300: ${elegantColors.primary[300]};
  --elegant-primary-400: ${elegantColors.primary[400]};
  --elegant-primary-500: ${elegantColors.primary[500]};
  --elegant-primary-600: ${elegantColors.primary[600]};
  --elegant-primary-700: ${elegantColors.primary[700]};
  --elegant-primary-800: ${elegantColors.primary[800]};
  --elegant-primary-900: ${elegantColors.primary[900]};
  --elegant-primary-950: ${elegantColors.primary[950]};

  /* Secondary Colors */
  --elegant-secondary-50: ${elegantColors.secondary[50]};
  --elegant-secondary-100: ${elegantColors.secondary[100]};
  --elegant-secondary-200: ${elegantColors.secondary[200]};
  --elegant-secondary-300: ${elegantColors.secondary[300]};
  --elegant-secondary-400: ${elegantColors.secondary[400]};
  --elegant-secondary-500: ${elegantColors.secondary[500]};
  --elegant-secondary-600: ${elegantColors.secondary[600]};
  --elegant-secondary-700: ${elegantColors.secondary[700]};
  --elegant-secondary-800: ${elegantColors.secondary[800]};
  --elegant-secondary-900: ${elegantColors.secondary[900]};

  /* Background Colors */
  --elegant-bg-primary: ${elegantColors.background.primary};
  --elegant-bg-secondary: ${elegantColors.background.secondary};
  --elegant-bg-tertiary: ${elegantColors.background.tertiary};
  --elegant-bg-dark: ${elegantColors.background.dark};
  --elegant-bg-dark-secondary: ${elegantColors.background.darkSecondary};
  --elegant-bg-dark-tertiary: ${elegantColors.background.darkTertiary};

  /* Text Colors */
  --elegant-text-primary: ${elegantColors.text.primary};
  --elegant-text-secondary: ${elegantColors.text.secondary};
  --elegant-text-tertiary: ${elegantColors.text.tertiary};
  --elegant-text-inverse: ${elegantColors.text.inverse};
  --elegant-text-brand: ${elegantColors.text.brand};
  --elegant-text-accent: ${elegantColors.text.accent};

  /* Border Colors */
  --elegant-border-light: ${elegantColors.border.light};
  --elegant-border-medium: ${elegantColors.border.medium};
  --elegant-border-strong: ${elegantColors.border.strong};
  --elegant-border-dark: ${elegantColors.border.dark};
}
`

// Export the main colors object for use in components
export const sentryColors = elegantColors
export const sentryUtils = elegantUtils
