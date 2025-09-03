import React from 'react'
import { cn } from '@agelum/ux-core'
import { Check, X } from 'lucide-react'

export interface ToolAssignmentItemProps {
  id: string
  name: string
  description: string
  enabled: boolean
  onToggle: (id: string, enabled: boolean) => void
  onRemove: (id: string) => void
  className?: string
}

export function ToolAssignmentItem({
  id,
  name,
  description,
  enabled,
  onToggle,
  onRemove,
  className,
}: ToolAssignmentItemProps) {
  return (
    <div
      className={cn(
        'flex items-start space-x-2.5 p-2.5 rounded-xl border transition-all',
        className
      )}
      style={{
        backgroundColor: enabled ? 'rgba(138, 84, 140, 0.12)' : '#F4F3F5',
        borderColor: enabled
          ? 'rgba(138, 84, 140, 0.3)'
          : 'rgba(215, 213, 217, 0.6)',
      }}
    >
      <div
        className="w-4 h-4 mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center cursor-pointer"
        style={{
          borderColor: enabled ? '#8A548C' : '#9B8FA7',
          backgroundColor: enabled ? '#8A548C' : 'transparent',
        }}
        onClick={() => onToggle(id, !enabled)}
      >
        {enabled && <Check className="w-2.5 h-2.5 text-white" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium" style={{ color: '#2D1B2E' }}>
            {name}
          </h4>
          <button
            onClick={() => onRemove(id)}
            className="p-1 rounded transition-colors"
            style={{ color: '#847F8A' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                'rgba(244, 243, 245, 0.8)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        <p
          className="text-xs mt-0.5 leading-relaxed"
          style={{ color: '#847F8A' }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
