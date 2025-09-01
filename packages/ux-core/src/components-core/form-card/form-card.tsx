import React from 'react'
import { cn } from '../../utils/cn'
import { elegantColors } from '../../styles/color-tokens'

export interface FormCardProps {
  children: React.ReactNode
  className?: string
  title?: string
  headerContent?: React.ReactNode
  headerAction?: React.ReactNode
  footerContent?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
}

export function FormCard({
  children,
  className,
  title,
  headerContent,
  headerAction,
  footerContent,
  icon: Icon,
}: FormCardProps) {
  return (
    <div
      className={cn('p-4 bg-white rounded-xl border', className)}
      style={{
        backgroundColor: elegantColors.background.tertiary,
        borderColor: elegantColors.border.light,
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }}
    >
      {(title || headerContent || headerAction || Icon) && (
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            {Icon && (
              <div style={{ color: '#847F8A' }}>
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              <h3
                className="text-base font-semibold"
                style={{
                  color: '#2D1B2E',
                  fontFamily:
                    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                }}
              >
                {title}
              </h3>
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
