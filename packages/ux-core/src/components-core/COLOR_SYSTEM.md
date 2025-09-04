# Color System Organization

This document explains the color system organization in the `components-core` package.

## 🎨 **Color System Structure**

We have **two separate color systems** for different use cases:

### **1. Light Theme Colors** (`light-theme-colors.ts`)

- **File**: `packages/ux-core/src/components-core/light-theme-colors.ts`
- **Export**: `coreColors`, `coreUtils`
- **Purpose**: Components with light backgrounds (white/light gray)
- **Used by**: Buttons, forms, cards, and other light-themed components

### **2. Dark Theme Colors** (`dark-theme-colors.ts`)

- **File**: `packages/ux-core/src/components-core/dark-theme-colors.ts`
- **Export**: `componentColors`, `componentUtils`
- **Purpose**: Components with dark backgrounds (dark purple/gray)
- **Used by**: Sidebar, navigation, and other dark-themed components

## 📋 **Usage Guidelines**

### **When to Use Light Theme Colors**

```tsx
import { coreColors, coreUtils } from '@agelum/ux-core'

// For buttons, forms, cards on light backgrounds
<button style={{
  ...coreUtils.getButtonDefault('primary'),
  ...coreUtils.getFocusStyles(), // Purple focus ring, no blue!
}}>
```

**Components that use light theme:**

- All button components (`PrimaryButton`, `ActionButton`, `TertiaryButton`, `GhostButton`)
- Form components (`EnhancedInput`, `EnhancedSelect`, `EnhancedTextarea`)
- `FormCard` component
- `ActiveIndicator` component

### **When to Use Dark Theme Colors**

```tsx
import { componentColors, componentUtils } from '@agelum/ux-core'

// For sidebar, navigation on dark backgrounds
<div style={{
  backgroundColor: componentColors.background.main,
  color: componentColors.text.primary, // White text
}}>
```

**Components that use dark theme:**

- `Sidebar` component
- Navigation components
- Dark-themed modals and overlays

## 🚫 **No Blue Colors Policy**

Both color systems are designed to **eliminate blue colors** from our design system:

- **Focus rings**: Use purple (`coreColors.focus.ring` or `componentColors.border.focus`)
- **Interactive states**: Use purple/gray combinations
- **No default Tailwind**: Avoid `focus:ring-2` which shows blue

## 🔧 **Color System Features**

### **Light Theme Features**

- **Purple focus rings**: No blue focus rings
- **Gray hover states**: Subtle gray hover effects
- **Dark text on light**: Optimized for readability
- **Button variants**: `default`, `primary`, `action`, `ghost`

### **Dark Theme Features**

- **White text on dark**: High contrast for dark backgrounds
- **Glass morphism**: Backdrop blur effects
- **Purple accents**: Consistent with brand colors
- **Navigation states**: Hover, active, and focus states

## 📁 **File Organization**

```
packages/ux-core/src/components-core/
├── light-theme-colors.ts    # Light theme colors (coreColors)
├── dark-theme-colors.ts     # Dark theme colors (componentColors)
├── buttons/                 # Uses light-theme-colors
├── forms/                   # Uses light-theme-colors
├── form-card/               # Uses light-theme-colors
├── switchers/               # Uses light-theme-colors
└── sidebar/                 # Uses dark-theme-colors
```

## 🎯 **Best Practices**

1. **Import the right colors**: Use `coreColors` for light themes, `componentColors` for dark themes
2. **Use utility functions**: Leverage `coreUtils.getButtonDefault()` and `componentUtils.getComponentShadow()`
3. **No hardcoded colors**: Always use the color system, never hardcode hex values
4. **Consistent focus rings**: Use the provided focus styles to avoid blue rings
5. **Theme consistency**: Don't mix light and dark theme colors in the same component

## 🔄 **Migration Guide**

If you need to update a component's color system:

### **From Dark to Light Theme**

```tsx
// Before (dark theme)
import { componentColors } from '../dark-theme-colors'

// After (light theme)
import { coreColors } from '../light-theme-colors'
```

### **From Light to Dark Theme**

```tsx
// Before (light theme)
import { coreColors } from '../light-theme-colors'

// After (dark theme)
import { componentColors } from '../dark-theme-colors'
```

This organization ensures we have **no blue colors** and **clear separation** between light and dark themed components.
