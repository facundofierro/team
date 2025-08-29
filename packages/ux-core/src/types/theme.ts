// Theme type definitions
export type Theme = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  defaultTheme: Theme
  enableSystem: boolean
  enableTransition: boolean
}

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
  enableTransition?: boolean
}
