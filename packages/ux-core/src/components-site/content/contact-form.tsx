import React, { useState } from 'react'
import { cn } from '../../utils/cn'

interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
    message?: string
  }
}

interface ContactFormProps {
  fields: FormField[]
  className?: string
  title?: string
  subtitle?: string
  submitText?: string
  onSubmit?: (data: any) => void
  showLabels?: boolean
  layout?: 'vertical' | 'horizontal' | 'grid'
  cols?: 1 | 2
  size?: 'sm' | 'md' | 'lg'
}

const layoutClasses = {
  vertical: 'flex flex-col space-y-4',
  horizontal: 'grid grid-cols-1 lg:grid-cols-2 gap-4',
  grid: 'grid grid-cols-1 lg:grid-cols-2 gap-4',
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const inputSizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
}

export function ContactForm({
  fields,
  className,
  title,
  subtitle,
  submitText = 'Send Message',
  onSubmit,
  showLabels = true,
  layout = 'vertical',
  cols = 1,
  size = 'md',
}: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (
    fieldId: string,
    value: string | boolean,
    field: FormField
  ) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: '' }))
    }
  }

  const validateField = (field: FormField, value: any): string => {
    if (field.required && !value) {
      return `${field.label} is required`
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }

    if (field.validation) {
      const { pattern, minLength, maxLength } = field.validation

      if (pattern && value && !new RegExp(pattern).test(value)) {
        return field.validation.message || 'Invalid format'
      }

      if (minLength && value && value.length < minLength) {
        return `${field.label} must be at least ${minLength} characters`
      }

      if (maxLength && value && value.length > maxLength) {
        return `${field.label} must be no more than ${maxLength} characters`
      }
    }

    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors: Record<string, string> = {}
    fields.forEach((field) => {
      const error = validateField(field, formData[field.id])
      if (error) {
        newErrors[field.id] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit?.(formData)
      // Reset form on successful submission
      setFormData({})
      setErrors({})
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const fieldError = errors[field.id]
    const fieldValue = formData[field.id] || ''

    const commonProps = {
      id: field.id,
      name: field.id,
      value: fieldValue,
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => handleInputChange(field.id, e.target.value, field),
      className: cn(
        'w-full border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teamhub-primary focus:border-transparent',
        inputSizes[size],
        fieldError
          ? 'border-teamhub-warning'
          : 'border-teamhub-border/20 hover:border-teamhub-border/40'
      ),
      placeholder: field.placeholder,
      required: field.required,
    }

    const label = (
      <label
        htmlFor={field.id}
        className={cn(
          'block font-medium text-teamhub-secondary mb-2',
          sizeClasses[size]
        )}
      >
        {field.label}
        {field.required && <span className="text-teamhub-warning ml-1">*</span>}
      </label>
    )

    const errorMessage = fieldError && (
      <p className="text-sm text-teamhub-warning mt-1">{fieldError}</p>
    )

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} className={cols === 2 ? 'lg:col-span-2' : ''}>
            {showLabels && label}
            <textarea
              {...commonProps}
              rows={4}
              className={cn(commonProps.className, 'resize-none')}
            />
            {errorMessage}
          </div>
        )

      case 'select':
        return (
          <div key={field.id}>
            {showLabels && label}
            <select {...commonProps}>
              <option value="">
                {field.placeholder || 'Select an option'}
              </option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errorMessage}
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.id}
              name={field.id}
              checked={fieldValue || false}
              onChange={(e) =>
                handleInputChange(field.id, e.target.checked, field)
              }
              className="w-4 h-4 text-teamhub-primary border-teamhub-border/20 rounded focus:ring-teamhub-primary focus:ring-2"
            />
            {showLabels && (
              <label
                htmlFor={field.id}
                className="text-sm text-teamhub-secondary"
              >
                {field.label}
                {field.required && (
                  <span className="text-teamhub-warning ml-1">*</span>
                )}
              </label>
            )}
            {errorMessage}
          </div>
        )

      case 'radio':
        return (
          <div key={field.id}>
            {showLabels && label}
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${field.id}-${option.value}`}
                    name={field.id}
                    value={option.value}
                    checked={fieldValue === option.value}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value, field)
                    }
                    className="w-4 h-4 text-teamhub-primary border-teamhub-border/20 focus:ring-teamhub-primary focus:ring-2"
                  />
                  <label
                    htmlFor={`${field.id}-${option.value}`}
                    className="text-sm text-teamhub-secondary"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {errorMessage}
          </div>
        )

      default:
        return (
          <div key={field.id}>
            {showLabels && label}
            <input {...commonProps} type={field.type} />
            {errorMessage}
          </div>
        )
    }
  }

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-2xl font-bold text-teamhub-secondary mb-2">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-teamhub-muted">{subtitle}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} className={layoutClasses[layout]}>
        {fields.map(renderField)}

        <div className={cols === 2 ? 'lg:col-span-2' : ''}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full bg-teamhub-primary hover:bg-teamhub-primary/90 disabled:bg-teamhub-muted disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors',
              inputSizes[size]
            )}
          >
            {isSubmitting ? 'Sending...' : submitText}
          </button>
        </div>
      </form>
    </div>
  )
}

// Simple Contact Form for basic contact needs
interface SimpleContactFormProps {
  className?: string
  title?: string
  subtitle?: string
  onSubmit?: (data: { name: string; email: string; message: string }) => void
}

export function SimpleContactForm({
  className,
  title = 'Get in Touch',
  subtitle = "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  onSubmit,
}: SimpleContactFormProps) {
  const fields: FormField[] = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Your full name',
      required: true,
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'your.email@example.com',
      required: true,
    },
    {
      id: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Tell us about your project or question...',
      required: true,
      validation: {
        minLength: 10,
        message: 'Message must be at least 10 characters long',
      },
    },
  ]

  return (
    <ContactForm
      fields={fields}
      title={title}
      subtitle={subtitle}
      submitText="Send Message"
      onSubmit={onSubmit}
      layout="vertical"
      size="md"
      className={className}
    />
  )
}
