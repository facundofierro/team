import React from 'react'
import { cn } from '@teamhub/ux-core'
import {
  Check,
  Pause,
  Play,
  Edit3,
  Trash2,
  Calendar,
  Clock,
} from 'lucide-react'

export interface ScheduledExecutionItemProps {
  id: string
  name: string
  description: string
  schedule: string
  nextExecution: string
  status: 'active' | 'inactive'
  onToggle: (id: string, status: 'active' | 'inactive') => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  className?: string
}

export function ScheduledExecutionItem({
  id,
  name,
  description,
  schedule,
  nextExecution,
  status,
  onToggle,
  onEdit,
  onDelete,
  className,
}: ScheduledExecutionItemProps) {
  return (
    <div
      className={cn(
        'flex items-start space-x-2.5 p-2.5 rounded-lg border transition-all',
        className
      )}
      style={{
        backgroundColor:
          status === 'active' ? 'rgba(138, 84, 140, 0.12)' : '#F4F3F5',
        borderColor:
          status === 'active'
            ? 'rgba(138, 84, 140, 0.3)'
            : 'rgba(215, 213, 217, 0.6)',
      }}
    >
      <div
        className="w-3 h-3 mt-1.5 flex-shrink-0 rounded-full transition-colors"
        style={{
          backgroundColor: status === 'active' ? '#22C55E' : '#9B8FA7',
        }}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium" style={{ color: '#2D1B2E' }}>
            {name}
          </h4>
          <div className="flex items-center space-x-1">
            <button
              onClick={() =>
                onToggle(id, status === 'active' ? 'inactive' : 'active')
              }
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
              {status === 'active' ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={() => onEdit(id)}
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
              <Edit3 className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-1 rounded transition-colors"
              style={{ color: '#847F8A' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#FEF2F2')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#847F8A' }}>
          {description}
        </p>
        <div className="flex items-center space-x-3 mt-2">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" style={{ color: '#847F8A' }} />
            <span className="text-xs" style={{ color: '#847F8A' }}>
              {schedule}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" style={{ color: '#847F8A' }} />
            <span className="text-xs" style={{ color: '#847F8A' }}>
              Next: {nextExecution}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
