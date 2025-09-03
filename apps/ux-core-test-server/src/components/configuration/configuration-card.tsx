import React from 'react'
import { cn } from '@agelum/ux-core'

export interface ConfigurationCardProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  headerContent?: React.ReactNode
  headerAction?: React.ReactNode
  footer?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
}

export function ConfigurationCard({
  children,
  className,
  title,
  subtitle,
  headerContent,
  headerAction,
  footer,
  icon: Icon,
}: ConfigurationCardProps) {
  return (
    <div
      className={cn('bg-white rounded-lg border p-4', className)}
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(215, 213, 217, 0.6)',
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-gray-50">
              <Icon className="h-5 w-5 text-purple-600" />
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
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {headerAction && (
          <div className="flex items-center space-x-2">{headerAction}</div>
        )}
        {headerContent && <div>{headerContent}</div>}
      </div>
      <div className="space-y-3">{children}</div>
      {footer && (
        <div
          className="mt-4 pt-3 border-t"
          style={{ borderColor: 'rgba(215, 213, 217, 0.6)' }}
        >
          {footer}
        </div>
      )}
    </div>
  )
}
