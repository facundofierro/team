# TeamHub Design System

This document outlines the design system principles, tokens, and guidelines for the TeamHub UX Core package.

## Design Principles

### 1. Accessibility First

- All components must meet WCAG 2.1 AA standards
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios

### 2. Consistency

- Unified visual language across all components
- Consistent spacing, typography, and color usage
- Predictable interaction patterns

### 3. Performance

- Lightweight component implementations
- Optimized rendering and animations
- Minimal bundle impact

### 4. Flexibility

- Easy customization and theming
- Component composition patterns
- Extensible design tokens

## Color System

### Primary Colors

Based on the actual TeamHub design system, our color palette features a sophisticated purple-based scheme:

- **Primary Purple** (`#8A548C`): Main brand color for primary actions and key elements
- **Secondary Purple** (`#3B2146`): Dark purple for secondary content and headers
- **Accent Purple** (`#A091DA`): Light purple for accents and highlights
- **Hot Pink** (`#F45584`): Vibrant highlight color for attention-grabbing elements

### Semantic Colors

- **Success** (`#E6D24D`): Golden yellow for positive actions and success states
- **Warning** (`#847F42`): Olive green for caution and warning states
- **Error**: Standard red variants for errors and destructive actions
- **Info**: Blue variants for informational content

### Neutral Colors

- **Muted** (`#9B8FA7`): Purple-gray for muted text and secondary content
- **Background** (`#F4F3F5`): Light purple-gray for page backgrounds
- **Border**: Consistent border colors for component boundaries

### Color Usage Guidelines

```css
/* Primary Actions */
.btn-primary {
  @apply bg-teamhub-primary text-white;
}

/* Secondary Content */
.card-header {
  @apply bg-teamhub-secondary text-white;
}

/* Accent Elements */
.highlight {
  @apply bg-teamhub-accent text-white;
}

/* Success States */
.status-success {
  @apply bg-teamhub-success text-black;
}

/* Warning States */
.status-warning {
  @apply bg-teamhub-warning text-white;
}

/* Muted Content */
.text-muted {
  @apply text-teamhub-muted;
}

/* Backgrounds */
.page-bg {
  @apply bg-teamhub-background;
}
```

### Dark Mode Support

- CSS custom properties for theme switching
- Consistent contrast ratios in both themes
- Smooth transitions between themes
- Dark mode variants for all TeamHub colors

## Typography

### Font Stack

- **Primary**: System fonts for optimal performance
- **Monospace**: For code and technical content
- **Fallbacks**: Comprehensive fallback chains

### Scale

- Consistent size scale (4px base unit)
- Responsive typography
- Proper line heights for readability

## Spacing

### Base Unit

- **4px** as the fundamental spacing unit
- Consistent spacing scale
- Responsive spacing adjustments

### Scale

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

## Component Guidelines

### Structure

- Semantic HTML structure
- Proper ARIA attributes
- Logical tab order

### States

- Default, hover, focus, active, disabled
- Consistent state styling
- Clear visual feedback

### Responsiveness

- Mobile-first approach
- Breakpoint consistency
- Touch-friendly interactions

## Animation & Motion

### Principles

- Purposeful motion
- Consistent timing functions
- Reduced motion support

### Guidelines

- 150ms for micro-interactions
- 300ms for page transitions
- Ease-out timing functions

## Implementation

### CSS Variables

```css
:root {
  /* TeamHub Design System Colors */
  --teamhub-primary: 280 25% 44%; /* #8A548C */
  --teamhub-secondary: 280 38% 20%; /* #3B2146 */
  --teamhub-accent: 280 30% 71%; /* #A091DA */
  --teamhub-highlight: 340 89% 65%; /* #F45584 */
  --teamhub-success: 55 70% 60%; /* #E6D24D */
  --teamhub-warning: 60 25% 45%; /* #847F42 */
  --teamhub-muted: 280 15% 61%; /* #9B8FA7 */
  --teamhub-background: 280 20% 96%; /* #F4F3F5 */

  /* Spacing and Layout */
  --spacing-unit: 4px;
  --border-radius: 6px;
}
```

### Tailwind Integration

- Custom design tokens via CSS variables
- Consistent utility classes
- Component-specific variants
- Full TeamHub color palette support

### Component Showcase

A comprehensive component showcase is available at `examples/component-showcase.tsx` that demonstrates:

- All available components with TeamHub styling
- Color palette visualization
- Interactive examples
- Responsive design patterns
- Accessibility features

## Quality Assurance

### Testing

- Visual regression testing
- Accessibility testing
- Cross-browser compatibility
- Performance benchmarking

### Documentation

- Component usage examples
- Accessibility guidelines
- Customization options
- Best practices

## Contributing

When adding new components or modifying existing ones:

1. Follow established patterns
2. Use TeamHub design system colors
3. Ensure accessibility compliance
4. Add comprehensive documentation
5. Include usage examples
6. Test across different scenarios
7. Update the component showcase

## Resources

- [Component Library Catalog](./libraries.md)
- [Component Showcase](../examples/component-showcase.tsx)
- [Accessibility Checklist](./accessibility.md)
- [Performance Guidelines](./performance.md)
- [TeamHub Brand Guidelines](../brand-guidelines.md)
