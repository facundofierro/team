# Components Core Package

This package contains reusable UI components for TeamHub applications. All components are built with a consistent design system, centralized color management, and focus on visual behavior and event handlers without business logic.

## 🎨 Design System

### Color Management

All components use the centralized color system from `component-colors.ts`:

```typescript
import { componentColors, componentUtils } from './component-colors'

// Usage examples:
const styles = {
  backgroundColor: componentColors.background.main,
  color: componentColors.text.primary,
  borderColor: componentColors.border.main,
  ...componentUtils.getComponentShadow('md'),
}
```

### Available Color Categories

- **Background**: `main`, `header`, `footer`, `card`, `dropdown`, `modal`, `overlay`
- **Border**: `main`, `header`, `footer`, `card`, `dropdown`, `submenu`, `focus`, `focusStrong`
- **Text**: `primary`, `secondary`, `tertiary`, `inverse`, `brand`, `brandSubtitle`, `disabled`
- **Interactive**: Navigation, submenu, buttons, dropdowns, form elements
- **Brand**: `iconBackground`, `iconColor`, `primary`, `secondary`
- **Status**: `success`, `warning`, `error`, `info`
- **Effects**: `backdropFilter`, `backdropFilterLight`, `backdropFilterDropdown`, `backdropFilterModal`
- **Shadows**: `sm`, `md`, `lg`, `xl`, `2xl`

### Utility Functions

```typescript
// Shadow styles
componentUtils.getComponentShadow('md')

// Hover transforms
componentUtils.getHoverTransform('up') // 'up', 'right', 'down', 'left'

// Focus styles
componentUtils.getFocusStyles()

// Glass morphism effects
componentUtils.getGlassEffect('medium') // 'light', 'medium', 'strong'
```

## 🧩 Component Structure

### Basic Component Template

```typescript
'use client'

import * as React from 'react'
import { componentColors, componentUtils } from './component-colors'

export interface ComponentNameProps {
  // Props interface
  className?: string
  children?: React.ReactNode
  // Add other props as needed
}

export const ComponentName = ({
  className,
  children,
  ...props
}: ComponentNameProps) => {
  // Component logic here

  return (
    <div
      className={`component-name ${className || ''}`}
      style={{
        backgroundColor: componentColors.background.card,
        borderColor: componentColors.border.card,
        color: componentColors.text.primary,
        ...componentUtils.getComponentShadow('sm'),
      }}
      {...props}
    >
      {children}
    </div>
  )
}
```

### Component Guidelines

1. **Always use `'use client'`** for interactive components
2. **Import colors from `component-colors.ts`** - never use hardcoded colors
3. **Define explicit prop interfaces** with TypeScript
4. **Use semantic class names** with component prefix
5. **Include proper event handlers** for interactive elements
6. **Add data-testid attributes** for testing
7. **Export components** from the main index file

### Interactive Component Example

```typescript
'use client'

import * as React from 'react'
import { componentColors, componentUtils } from './component-colors'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className,
}: ButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: componentColors.brand.primary,
          color: componentColors.text.inverse,
        }
      case 'secondary':
        return {
          backgroundColor: componentColors.interactive.buttonDefault,
          color: componentColors.interactive.buttonTextDefault,
        }
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: componentColors.text.primary,
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '8px 12px', fontSize: '12px' }
      case 'md':
        return { padding: '12px 16px', fontSize: '14px' }
      case 'lg':
        return { padding: '16px 24px', fontSize: '16px' }
    }
  }

  return (
    <button
      className={`teamhub-button teamhub-button--${variant} teamhub-button--${size} ${
        className || ''
      }`}
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        border: 'none',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        ...componentUtils.getComponentShadow('sm'),
      }}
      onClick={onClick}
      disabled={disabled}
      data-testid="teamhub-button"
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform =
            componentUtils.getHoverTransform('up')
          e.currentTarget.style.boxShadow =
            componentUtils.getComponentShadow('md').boxShadow
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0px)'
          e.currentTarget.style.boxShadow =
            componentUtils.getComponentShadow('sm').boxShadow
        }
      }}
    >
      {children}
    </button>
  )
}
```

## 🎯 Adding New Colors

When you need new colors for a component:

1. **Add to `component-colors.ts`** in the appropriate category
2. **Use semantic names** that describe the purpose, not the color
3. **Reference the main elegant color system** when possible
4. **Add TypeScript types** for new color categories

```typescript
// In component-colors.ts
export const componentColors = {
  // ... existing colors

  // New category for your component
  newComponent: {
    background: elegantColors.background.dark,
    text: elegantColors.text.primary,
    accent: elegantColors.accent.lavender,
  },
} as const

// Add type export
export type ComponentNewComponentKey = keyof typeof componentColors.newComponent
```

## 🧪 Testing Components

### Test Project

Use the `apps/ux-core-test-server` to test your components:

1. **Add your component** to the test server
2. **Create interactive examples** showing different states
3. **Test all variants and sizes**
4. **Verify responsive behavior**
5. **Check accessibility** (keyboard navigation, screen readers)

### Test Page Example

```typescript
// apps/ux-core-test-server/src/app/components/your-component/page.tsx
'use client'

import { useState } from 'react'
import { YourComponent } from '@teamhub/ux-core'

export default function YourComponentTestPage() {
  const [state, setState] = useState('default')

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold">Your Component Test</h1>

      <div className="space-y-6">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Variants</h2>
          <div className="flex gap-4">
            <YourComponent variant="primary">Primary</YourComponent>
            <YourComponent variant="secondary">Secondary</YourComponent>
            <YourComponent variant="ghost">Ghost</YourComponent>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Interactive States</h2>
          <div className="flex gap-4">
            <YourComponent onClick={() => console.log('Clicked!')}>
              Clickable
            </YourComponent>
            <YourComponent disabled>Disabled</YourComponent>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 📁 File Organization

```
packages/ux-core/src/components-core/
├── README.md                    # This file
├── component-colors.ts          # Centralized color system
├── index.ts                     # Main exports
├── sidebar.tsx                  # Sidebar component
├── button.tsx                   # Button component
├── card.tsx                     # Card component
├── modal.tsx                    # Modal component
├── dropdown.tsx                 # Dropdown component
└── form/                        # Form components
    ├── input.tsx
    ├── select.tsx
    └── checkbox.tsx
```

## 🔄 Component Lifecycle

### 1. Planning

- Define the component's purpose and use cases
- Identify required props and variants
- Plan interactive states and behaviors

### 2. Development

- Create the component file with proper TypeScript interfaces
- Use colors from `component-colors.ts`
- Implement visual behavior and event handlers
- Add proper accessibility attributes

### 3. Testing

- Add to test server with interactive examples
- Test all variants, states, and edge cases
- Verify responsive design and accessibility

### 4. Integration

- Export from `index.ts`
- Update documentation
- Add to component library if needed

## 🎨 Design Principles

1. **Consistency**: Use the same color system and patterns across all components
2. **Accessibility**: Include proper ARIA labels, keyboard navigation, and focus states
3. **Responsive**: Design for mobile-first with proper breakpoints
4. **Performance**: Use React.memo() for expensive components
5. **Type Safety**: Full TypeScript support with proper interfaces
6. **Reusability**: Components should be flexible and composable

## 🚀 Best Practices

- **No business logic**: Components should only handle visual behavior and events
- **Event delegation**: Use callback props for parent components to handle actions
- **Controlled components**: Prefer controlled over uncontrolled when possible
- **Error boundaries**: Handle errors gracefully with fallback UI
- **Loading states**: Provide loading indicators for async operations
- **Documentation**: Include JSDoc comments for complex props

## 📚 Examples

See existing components like `sidebar.tsx` for complete examples of:

- Color system usage
- Interactive states
- Event handling
- Accessibility features
- Responsive design

## 🤝 Contributing

1. Follow the established patterns and color system
2. Add comprehensive tests in the test server
3. Update this README if adding new patterns
4. Ensure all components work across different screen sizes
5. Test with keyboard navigation and screen readers
