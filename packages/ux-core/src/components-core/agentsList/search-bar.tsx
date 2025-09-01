import React from 'react'
import { Search } from 'lucide-react'
import { coreColors } from '../light-theme-colors'

// Search bar component
export const SearchBar: React.FC<{
  value: string
  onChange: (value: string) => void
  placeholder?: string
}> = ({ value, onChange, placeholder = 'Search agents...' }) => {
  return (
    <div className="relative mb-4">
      <Search
        className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2"
        style={{ color: coreColors.text.tertiary }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="py-2 pr-4 pl-10 w-full text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2"
        style={{
          backgroundColor: coreColors.background.card,
          borderColor: coreColors.border.light,
          color: coreColors.text.primary,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = coreColors.border.focus
          e.target.style.boxShadow = `0 0 0 2px ${coreColors.focus.ring}`
        }}
        onBlur={(e) => {
          e.target.style.borderColor = coreColors.border.light
          e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>
  )
}
