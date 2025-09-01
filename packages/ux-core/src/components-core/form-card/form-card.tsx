import React from 'react'
import { cn } from '../../utils/cn'
import { elegantColors } from '../../styles/color-tokens'

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
        backgroundColor: elegantColors.background.tertiary,
        borderColor: elegantColors.border.light,
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }}
    >
      {(title || headerContent || headerAction || Icon) && (
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-2 bg-gray-50 rounded-lg">
                <Icon className="w-5 h-5 text-purple-600" />
              </div>
            )}
            <div>
              <h3
                className="text-base font-semibold"
                style={{ color: elegantColors.text.primary }}
              >
                {title}
              </h3>
              {subtitle && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: elegantColors.text.secondary }}
                >
                  {subtitle}
                </p>
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
          style={{ borderColor: elegantColors.border.light }}
        >
          {footerContent}
        </div>
      )}
    </div>
  )
}
