# Components Core Package

This package contains reusable UI components for Agelum applications. All components are built with a consistent design system, centralized color management, and focus on visual behavior and event handlers without business logic.

## 🎨 Design System

### Color Management

We have **two separate color systems** for different use cases. See [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) for detailed information about our color organization.

#### Light Theme Colors (for buttons, forms, cards)

```typescript
import { coreColors, coreUtils } from '@agelum/ux-core'

// Usage examples:
const styles = {
  ...coreUtils.getButtonDefault('primary'),
  ...coreUtils.getFocusStyles(), // Purple focus ring, no blue!
}
```

#### Dark Theme Colors (for sidebar, navigation)

```typescript
import { componentColors, componentUtils } from '@agelum/ux-core'

// Usage examples:
const styles = {
  backgroundColor: componentColors.background.main,
  color: componentColors.text.primary,
  borderColor: componentColors.border.main,
  ...componentUtils.getComponentShadow('md'),
}
```

### Key Features

- **No Blue Colors Policy**: Both systems eliminate blue colors from our design
- **Purple Focus Rings**: Consistent purple focus states instead of default blue
- **Theme Separation**: Clear distinction between light and dark themed components
- **Utility Functions**: Pre-built styles for common patterns

For complete color system documentation, see [COLOR_SYSTEM.md](./COLOR_SYSTEM.md).

## 🧩 Available Components

### Button Components (Light Theme)

All button components use the light theme color system (`coreColors`, `coreUtils`):

- **PrimaryButton** - Gradient background button with purple focus ring
- **ActionButton** - Solid background button for primary actions
- **TertiaryButton** - Outline button for secondary actions
- **GhostButton** - Transparent button for header actions
- **SaveButton** - Pre-configured save action button
- **ResetButton** - Pre-configured reset action button
- **AddButton** - Pre-configured add action button

### Sidebar Components (Dark Theme)

Sidebar components use the dark theme color system (`componentColors`, `componentUtils`):

- **Sidebar** - Main sidebar component with navigation
- **defaultAgelumItems** - Pre-configured navigation items

### User Components

- **UserProfile** - User profile display component
- **UserMenu** - User menu dropdown component

### Form Components (Light Theme)

- **FormCard** - Card wrapper for form content

### Typography Components

- **TitleWithSubtitle** - Typography component for titles with subtitles

### Switcher Components (Light Theme)

- **ActiveIndicator** - Active state indicator component

### Component Guidelines

1. **Always use `'use client'`** for interactive components
2. **Import the correct color system** - `coreColors` for light theme, `componentColors` for dark theme
3. **Never use hardcoded colors** - always use the color system
4. **Define explicit prop interfaces** with TypeScript
5. **Use semantic class names** with component prefix
6. **Include proper event handlers** for interactive elements
7. **Add data-testid attributes** for testing
8. **Export components** from the main index file

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

When you need new colors for a component, follow the guidelines in [COLOR_SYSTEM.md](./COLOR_SYSTEM.md):

1. **Choose the right color system**:

   - Use `light-theme-colors.ts` for buttons, forms, cards (light backgrounds)
   - Use `dark-theme-colors.ts` for sidebar, navigation (dark backgrounds)

2. **Add to the appropriate color file** in the correct category
3. **Use semantic names** that describe the purpose, not the color
4. **Maintain the no-blue policy** - use purple for focus states
5. **Add TypeScript types** for new color categories

```typescript
// For light theme components
// In light-theme-colors.ts
export const coreColors = {
  // ... existing colors
  newComponent: {
    background: '#ffffff',
    text: '#1a1a1a',
    accent: '#8b5cf6', // Purple, not blue
  },
} as const

// For dark theme components
// In dark-theme-colors.ts
export const componentColors = {
  // ... existing colors
  newComponent: {
    background: '#1a1a1a',
    text: '#ffffff',
    accent: '#8b5cf6', // Purple, not blue
  },
} as const
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
import { YourComponent } from '@agelum/ux-core'

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
├── COLOR_SYSTEM.md              # Color system documentation
├── index.ts                     # Main exports
├── light-theme-colors.ts        # Light theme color system
├── dark-theme-colors.ts         # Dark theme color system
├── buttons/                     # Button components (light theme)
│   ├── index.ts
│   ├── primary-button.tsx
│   ├── action-button.tsx
│   ├── tertiary-button.tsx
│   └── ghost-button.tsx
├── sidebar/                     # Sidebar components (dark theme)
│   ├── index.ts
│   ├── sidebar.tsx
│   └── navigation-items.tsx
├── user/                        # User components
│   ├── index.ts
│   └── user-profile.tsx
├── form-card/                   # Form components (light theme)
│   ├── index.ts
│   └── form-card.tsx
├── typography/                  # Typography components
│   ├── index.ts
│   └── title-with-subtitle.tsx
└── switchers/                   # Switcher components (light theme)
    ├── index.ts
    └── active-indicator.tsx
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

See existing components for complete examples:

### Light Theme Components

- **PrimaryButton** (`buttons/primary-button.tsx`) - Shows light theme color usage
- **FormCard** (`form-card/form-card.tsx`) - Form component with light theme
- **ActiveIndicator** (`switchers/active-indicator.tsx`) - Switcher with light theme

### Dark Theme Components

- **Sidebar** (`sidebar/sidebar.tsx`) - Shows dark theme color usage and navigation

All components demonstrate:

- Proper color system usage
- Interactive states and hover effects
- Event handling patterns
- Accessibility features (ARIA labels, keyboard navigation)
- Responsive design principles

## 🤝 Contributing

1. **Follow the established patterns and color system** - see [COLOR_SYSTEM.md](./COLOR_SYSTEM.md)
2. **Choose the right color system** for your component:
   - Light theme (`coreColors`) for buttons, forms, cards
   - Dark theme (`componentColors`) for sidebar, navigation
3. **Add comprehensive tests** in the test server (`apps/ux-core-test-server`)
4. **Update this README** if adding new patterns or components
5. **Ensure all components work** across different screen sizes
6. **Test with keyboard navigation and screen readers**
7. **Maintain the no-blue policy** - use purple for focus states
8. **Export new components** from the appropriate index files
