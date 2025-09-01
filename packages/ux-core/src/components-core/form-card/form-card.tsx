import React from 'react'
import { cn } from '../../utils/cn'

export interface FormCardProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  headerContent?: React.ReactNode
  headerAction?: React.ReactNode
  footerContent?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
}

export function FormCard({
  children,
  className,
  title,
  subtitle,
  headerContent,
  headerAction,
  footerContent,
  icon: Icon,
}: FormCardProps) {
  return (
    <div
      className={cn('p-4 bg-white rounded-lg border', className)}
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(215, 213, 217, 0.6)',
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }}
    >
      {(title || headerContent || headerAction || Icon) && (
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-2 bg-gray-50 rounded-lg">
                <Icon className="w-5 h-5" style={{ color: '#8A548C' }} />
              </div>
            )}
            <div>
              <h3
                className="text-base font-semibold"
                style={{ color: '#2D1B2E' }}
              >
                {title}
              </h3>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {headerContent && <div>{headerContent}</div>}
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}

      <div className="space-y-3">{children}</div>

      {footerContent && (
        <div
          className="pt-3 mt-4 border-t"
          style={{ borderColor: 'rgba(215, 213, 217, 0.6)' }}
        >
          {footerContent}
        </div>
      )}
    </div>
  )
}
