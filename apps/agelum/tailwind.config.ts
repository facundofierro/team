import { type Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ux-core/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        menu: 'rgb(51, 51, 51)',
        menuText: 'rgb(162, 164, 167)',
        menu2: 'rgb(135, 131, 131)',
        foreground: 'rgb(53, 57, 69)',
        background: 'rgb(249, 250, 251)',
        cardBig: 'rgb(174, 177, 185)',
        cardDark: 'rgb(106, 109, 118)',
        cardLight: 'rgb(233, 234, 236)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border))',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
