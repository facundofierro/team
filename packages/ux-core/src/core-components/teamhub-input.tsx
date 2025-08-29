import React from 'react'
import { Input } from '../components/shadcn/input'
import { cn } from '../utils/cn'
import { InputProps } from '../types'

export const TeamHubInput: React.FC<InputProps> = ({
  className,
  type = 'text',
  placeholder,
  value,
  onChange,
  ...props
}) => {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
      className={cn(
        'border-border bg-background text-foreground placeholder:text-muted-foreground',
        'focus:ring-2 focus:ring-primary focus:border-transparent',
        'transition-all duration-200',
        className
      )}
      {...props}
    />
  )
}

export default TeamHubInput
