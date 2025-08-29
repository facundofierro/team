// Common type definitions
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type Variant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'

export interface BaseProps {
  id?: string
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

export interface LoadingProps {
  loading?: boolean
  loadingText?: string
}

export interface DisabledProps {
  disabled?: boolean
}
