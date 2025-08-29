// Component type definitions
export interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends ComponentProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  onClick?: () => void
}

export interface CardProps extends ComponentProps {
  variant?: 'default' | 'outline'
}

export interface InputProps extends ComponentProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export interface DialogProps extends ComponentProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
}

export interface FormProps extends ComponentProps {
  onSubmit?: (data: any) => void
  defaultValues?: any
}
