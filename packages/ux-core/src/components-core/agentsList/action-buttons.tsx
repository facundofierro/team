import React from 'react'
import { Search, Filter, List, TreePine, Plus } from 'lucide-react'
import { coreColors } from '../light-theme-colors'
import type { ViewMode } from './types'

// Action buttons component
export const ActionButtons: React.FC<{
  searchMode: 'search' | 'filter'
  viewMode: ViewMode
  onSearchModeChange: (mode: 'search' | 'filter') => void
  onViewModeChange: (mode: ViewMode) => void
  onNew?: () => void
}> = ({
  searchMode,
  viewMode,
  onSearchModeChange,
  onViewModeChange,
  onNew,
}) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Search/Filter Mode Switcher */}
      <div
        className="flex items-center rounded-xl p-0.5"
        style={{ backgroundColor: coreColors.background.secondary }}
      >
        <button
          onClick={() => onSearchModeChange('search')}
          className="p-1.5 rounded-lg transition-colors"
          style={{
            backgroundColor:
              searchMode === 'search'
                ? coreColors.background.card
                : 'transparent',
            color:
              searchMode === 'search'
                ? coreColors.text.primary
                : coreColors.text.tertiary,
            boxShadow:
              searchMode === 'search' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (searchMode !== 'search') {
              e.currentTarget.style.color = coreColors.text.secondary
            }
          }}
          onMouseLeave={(e) => {
            if (searchMode !== 'search') {
              e.currentTarget.style.color = coreColors.text.tertiary
            }
          }}
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSearchModeChange('filter')}
          className="p-1.5 rounded-lg transition-colors"
          style={{
            backgroundColor:
              searchMode === 'filter'
                ? coreColors.background.card
                : 'transparent',
            color:
              searchMode === 'filter'
                ? coreColors.text.primary
                : coreColors.text.tertiary,
            boxShadow:
              searchMode === 'filter' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (searchMode !== 'filter') {
              e.currentTarget.style.color = coreColors.text.secondary
            }
          }}
          onMouseLeave={(e) => {
            if (searchMode !== 'filter') {
              e.currentTarget.style.color = coreColors.text.tertiary
            }
          }}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* View Mode Switcher */}
      <div
        className="flex items-center rounded-xl p-0.5"
        style={{ backgroundColor: coreColors.background.secondary }}
      >
        <button
          onClick={() => onViewModeChange('list')}
          className="p-1.5 rounded-lg transition-colors"
          style={{
            backgroundColor:
              viewMode === 'list' ? coreColors.background.card : 'transparent',
            color:
              viewMode === 'list'
                ? coreColors.text.primary
                : coreColors.text.tertiary,
            boxShadow:
              viewMode === 'list' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (viewMode !== 'list') {
              e.currentTarget.style.color = coreColors.text.secondary
            }
          }}
          onMouseLeave={(e) => {
            if (viewMode !== 'list') {
              e.currentTarget.style.color = coreColors.text.tertiary
            }
          }}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange('hierarchical')}
          className="p-1.5 rounded-lg transition-colors"
          style={{
            backgroundColor:
              viewMode === 'hierarchical'
                ? coreColors.background.card
                : 'transparent',
            color:
              viewMode === 'hierarchical'
                ? coreColors.text.primary
                : coreColors.text.tertiary,
            boxShadow:
              viewMode === 'hierarchical'
                ? '0 1px 3px rgba(0, 0, 0, 0.1)'
                : 'none',
          }}
          onMouseEnter={(e) => {
            if (viewMode !== 'hierarchical') {
              e.currentTarget.style.color = coreColors.text.secondary
            }
          }}
          onMouseLeave={(e) => {
            if (viewMode !== 'hierarchical') {
              e.currentTarget.style.color = coreColors.text.tertiary
            }
          }}
        >
          <TreePine className="w-4 h-4" />
        </button>
      </div>

      {/* New Button */}
      {onNew && (
        <button
          onClick={onNew}
          className="flex items-center px-4 py-2 space-x-2 text-sm font-medium rounded-xl shadow-sm transition-all duration-200"
          style={{
            backgroundColor: coreColors.interactive.actionDefault,
            color: coreColors.interactive.actionText,
          }}
        >
          <Plus className="w-4 h-4" />
          <span>New</span>
        </button>
      )}
    </div>
  )
}
