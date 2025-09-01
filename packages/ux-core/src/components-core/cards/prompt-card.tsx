'use client'

import React from 'react'
import { cn } from '../../utils/cn'
import { ConfigurationCard, PromptEditor } from '../configuration-cards'
import { Sparkles, FileText } from 'lucide-react'

export interface PromptCardProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  className?: string
}

export function PromptCard({
  value,
  onChange,
  maxLength = 4000,
  placeholder = 'Enter your prompt here...',
  className,
}: PromptCardProps) {
  return (
    <ConfigurationCard
      title="Prompt"
      className={className}
      headerContent={
        <div className="flex items-center space-x-2">
          <button
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              color: '#5A365C',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                'rgba(244, 243, 245, 0.8)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
            onClick={() => console.log('AI button clicked')}
          >
            <Sparkles className="w-3 h-3" style={{ color: '#8A548C' }} />
            <span>AI</span>
          </button>
          <button
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              color: '#5A365C',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                'rgba(244, 243, 245, 0.8)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
            onClick={() => console.log('Templates button clicked')}
          >
            <FileText className="w-3 h-3" />
            <span>Templates</span>
          </button>
        </div>
      }
    >
      <PromptEditor
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
      />
    </ConfigurationCard>
  )
}
