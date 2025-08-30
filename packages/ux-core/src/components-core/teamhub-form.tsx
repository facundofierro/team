import React from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/shadcn/form'
import { cn } from '../utils/cn'
import { FormProps } from '../types'

export const TeamHubForm: React.FC<FormProps> = ({
  children,
  onSubmit,
  defaultValues,
  className,
  ...props
}) => {
  // Note: The Form component from react-hook-form is just FormProvider
  // It doesn't handle onSubmit directly. Users should use useForm hook
  // and pass the form object to this component
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  )
}

export default TeamHubForm
