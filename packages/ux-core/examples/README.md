# UX Core Examples

This directory contains examples and usage patterns for components in the `@teamhub/ux-core` package.

## Available Examples

### Button Component
- **File**: `button-usage.tsx`
- **Description**: Demonstrates all Button component variants, sizes, and states
- **Usage**: Import and use as a reference for implementing buttons in your application

## Running Examples

### Prerequisites
1. Install dependencies: `pnpm install`
2. Ensure Tailwind CSS is configured in your project
3. Import the global CSS: `import '@teamhub/ux-core/src/styles/globals.css'`

### Basic Usage
```tsx
import { Button } from '@teamhub/ux-core';

function MyComponent() {
  return (
    <Button variant="primary" size="lg">
      Click me
    </Button>
  );
}
```

## Component Patterns

### Variants
Most components support multiple variants for different use cases:
- `default`: Primary action styling
- `secondary`: Secondary action styling
- `outline`: Bordered styling
- `ghost`: Minimal styling
- `destructive`: Dangerous action styling

### Sizes
Components typically support multiple sizes:
- `sm`: Small (compact)
- `default`: Standard size
- `lg`: Large
- `icon`: Square for icon-only content

### States
Components handle various states:
- `default`: Normal state
- `hover`: Mouse hover
- `focus`: Keyboard focus
- `disabled`: Disabled state
- `loading`: Loading state

## Customization

### CSS Variables
The package provides CSS custom properties for theming:
```css
:root {
  --color-primary: #0070f3;
  --color-primary-hover: #0051cc;
  --spacing-unit: 4px;
  --border-radius: 6px;
}
```

### Tailwind Classes
Components use Tailwind CSS utility classes that can be customized:
```tsx
<Button className="bg-blue-500 hover:bg-blue-600">
  Custom Button
</Button>
```

## Best Practices

1. **Accessibility**: All components include proper ARIA attributes
2. **Responsive**: Components are mobile-first and responsive
3. **Performance**: Components are optimized for minimal bundle impact
4. **TypeScript**: Full TypeScript support with proper type definitions
5. **Composition**: Use component composition for complex layouts

## Contributing

When adding new examples:
1. Follow the existing naming conventions
2. Include comprehensive usage patterns
3. Document any special considerations
4. Ensure examples are accessible and responsive
5. Test across different screen sizes

## Resources

- [Component Libraries Catalog](../specs/libraries.md)
- [Design System Guidelines](../specs/design-system.md)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
