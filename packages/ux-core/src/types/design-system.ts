// Design system type definitions
export interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  border: string
}

export interface Typography {
  fontFamily: string
  fontSize: Record<string, string>
  fontWeight: Record<string, number>
  lineHeight: Record<string, string>
}

export interface Spacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
}

export interface DesignTokens {
  colors: ColorScheme
  typography: Typography
  spacing: Spacing
  borderRadius: Record<string, string>
  shadows: Record<string, string>
}
