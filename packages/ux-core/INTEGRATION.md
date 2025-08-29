# TeamHub UX Core Integration Guide

This guide explains how to integrate and use the TeamHub UX Core package in your applications.

## Quick Start

### 1. Install the Package

```bash
# In your application directory
pnpm add @teamhub/ux-core
```

### 2. Import CSS Variables

Import the TeamHub design system CSS variables in your main CSS file:

```css
/* In your app's global CSS */
@import '@teamhub/ux-core/src/styles/globals.css';
```

### 3. Use Components

```tsx
import { Button, Card, Badge } from '@teamhub/ux-core'

export default function MyPage() {
  return (
    <div className="bg-teamhub-background p-8">
      <Card className="bg-white border-teamhub-border">
        <CardHeader className="bg-teamhub-primary text-white">
          <CardTitle>Welcome to TeamHub</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="bg-teamhub-primary hover:bg-teamhub-primary/90">
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Available Components

### Form Components

- `Button` - Various button styles and variants
- `Input` - Text input fields
- `Label` - Form labels
- `Select` - Dropdown select components
- `Form` - Form validation and handling

### Display Components

- `Card` - Content containers with headers
- `Badge` - Status indicators and tags
- `Separator` - Visual dividers

### Interactive Components

- `Dialog` - Modal dialogs and overlays

## Design System Colors

### Primary Colors

```tsx
// Main brand colors
className = 'bg-teamhub-primary' // #8A548C
className = 'bg-teamhub-secondary' // #3B2146
className = 'bg-teamhub-accent' // #A091DA
className = 'bg-teamhub-highlight' // #F45584
```

### Semantic Colors

```tsx
// Status and feedback colors
className = 'bg-teamhub-success' // #E6D24D (Golden yellow)
className = 'bg-teamhub-warning' // #847F42 (Olive green)
className = 'bg-teamhub-muted' // #9B8FA7 (Purple-gray)
```

### Background Colors

```tsx
// Layout and background colors
className = 'bg-teamhub-background' // #F4F3F5 (Light purple-gray)
className = 'bg-white' // Pure white for cards
```

## Component Showcase

### Full Component Library

Use the comprehensive component showcase to see all available components:

```tsx
import { ComponentShowcase } from '@teamhub/ux-core/examples'

export default function DevPage() {
  return <ComponentShowcase />
}
```

### Simple Demo

For a quick overview of key components:

```tsx
import { SimpleDemo } from '@teamhub/ux-core/examples'

export default function QuickDemo() {
  return <SimpleDemo />
}
```

## Customization

### Override Colors

You can override TeamHub colors in your Tailwind config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        teamhub: {
          primary: 'hsl(var(--teamhub-primary))',
          // Add your custom colors here
        },
      },
    },
  },
}
```

### Custom CSS Variables

Override CSS variables in your app:

```css
:root {
  --teamhub-primary: 280 25% 44%; /* Your custom primary color */
}
```

## Best Practices

### 1. Consistent Color Usage

- Use `teamhub-primary` for main actions and key elements
- Use `teamhub-secondary` for headers and important content
- Use `teamhub-accent` for highlights and secondary actions
- Use `teamhub-highlight` for attention-grabbing elements

### 2. Component Composition

- Build complex components by composing simple ones
- Use consistent spacing with Tailwind's spacing scale
- Maintain consistent border radius and shadows

### 3. Accessibility

- Always provide proper ARIA labels
- Ensure sufficient color contrast
- Support keyboard navigation

### 4. Responsive Design

- Use mobile-first approach
- Test components at different breakpoints
- Ensure touch-friendly interactions

## Troubleshooting

### Common Issues

1. **Colors not working**: Make sure you've imported the CSS variables
2. **Components not found**: Check that the package is properly installed
3. **Styling conflicts**: Ensure Tailwind CSS is properly configured

### Getting Help

- Check the [Component Showcase](./examples/component-showcase.tsx) for examples
- Review the [Design System Documentation](./specs/design-system.md)
- Check the [Component Library Catalog](./specs/libraries.md)

## Examples

### Navigation Bar

```tsx
import { Button, Badge } from '@teamhub/ux-core'

export function NavBar() {
  return (
    <nav className="bg-teamhub-secondary text-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">TeamHub</h1>
        <div className="flex items-center gap-4">
          <Badge className="bg-teamhub-success text-black">Active</Badge>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-teamhub-secondary"
          >
            Profile
          </Button>
        </div>
      </div>
    </nav>
  )
}
```

### Dashboard Card

```tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@teamhub/ux-core'

export function DashboardCard({ title, value, status, trend }) {
  return (
    <Card className="bg-white border-teamhub-border hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-teamhub-secondary text-lg">
            {title}
          </CardTitle>
          <Badge
            className={`${
              status === 'up'
                ? 'bg-teamhub-success text-black'
                : 'bg-teamhub-warning text-white'
            }`}
          >
            {trend}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-teamhub-primary">{value}</p>
      </CardContent>
    </Card>
  )
}
```

## Migration from Other Libraries

### From shadcn/ui

If you're already using shadcn/ui components:

1. Replace imports with `@teamhub/ux-core` components
2. Update color classes to use TeamHub design system
3. Test components to ensure proper styling

### From Custom Components

If you have custom components:

1. Identify components that can be replaced
2. Update styling to use TeamHub colors
3. Ensure consistent behavior and API

## Contributing

To add new components or improve existing ones:

1. Follow the established patterns
2. Use TeamHub design system colors
3. Add examples to the component showcase
4. Update documentation
5. Test across different scenarios

For more information, see the [Contributing Guide](./README.md#contributing).
