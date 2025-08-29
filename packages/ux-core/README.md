# @teamhub/ux-core

UX Core package for TeamHub - Component library and design system utilities.

## Overview

This package provides a centralized collection of UI components, design system utilities, and UX patterns for the TeamHub platform. It serves as a bridge between various component libraries and our application needs, featuring a sophisticated purple-based design system.

## Design System

TeamHub uses a carefully crafted color palette featuring:

- **Primary Purple** (`#8A548C`) - Main brand color
- **Secondary Purple** (`#3B2146`) - Dark purple for headers
- **Accent Purple** (`#A091DA`) - Light purple for accents
- **Hot Pink** (`#F45584`) - Vibrant highlight color
- **Success** (`#E6D24D`) - Golden yellow for positive states
- **Warning** (`#847F42`) - Olive green for caution states

## Documentation

For detailed information about available components and libraries, see:

- [Component Libraries](./specs/libraries.md) - Comprehensive list of available components from various libraries
- [Design System](./specs/design-system.md) - Complete design system guidelines and color palette
- [Integration Guide](./INTEGRATION.md) - How to integrate and use the package
- [Component Showcase](./examples/component-showcase.tsx) - Interactive showcase of all components

## Structure

```
ux-core/
├── src/                    # Source code and component implementations
│   ├── components/         # External library components (shadcn, aceternity, etc.)
│   ├── core-components/    # TeamHub custom design system components
│   ├── utils/              # Utility functions
│   ├── types/              # Type definitions
│   └── styles/             # Global styles and CSS variables
├── specs/                  # Documentation and specifications
│   ├── libraries.md        # Component library catalog
│   └── design-system.md    # Design system guidelines
├── examples/               # Usage examples and demos
│   └── component-showcase.tsx  # Interactive component showcase
├── examples.ts             # Examples export file
├── INTEGRATION.md          # Integration guide
└── README.md               # This file
```

## Usage

### Core Components

```typescript
// Import core components
import { Button, Card, Badge } from '@teamhub/ux-core'

// Or import specific components
import { Button } from '@teamhub/ux-core/components/shadcn/button'
import { Card } from '@teamhub/ux-core/components/shadcn/card'
```

### Examples and Demos

```typescript
// Import examples separately
import { ComponentShowcase, SimpleDemo } from '@teamhub/ux-core/examples'

// Use in your app
<ComponentShowcase />  // Full component library
<SimpleDemo />         // Quick overview
```

### TeamHub Core Components (Styled)

```typescript
// Import TeamHub design system components
import { TeamHubButton } from '@teamhub/ux-core/core-components/teamhub-button'
import { TeamHubCard } from '@teamhub/ux-core/core-components/teamhub-card'
```

## Quick Start

### 1. Install the Package

```bash
pnpm add @teamhub/ux-core
```

### 2. Import CSS Variables

```css
/* In your app's global CSS */
@import '@teamhub/ux-core/src/styles/globals.css';
```

### 3. Use Components

```tsx
import { Button, Card } from '@teamhub/ux-core'

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

## Development

```bash
# Install dependencies
pnpm install

# Build package
pnpm build

# Development mode with watch
pnpm dev

# Lint code
pnpm lint
```

## Contributing

When adding new components or libraries:

### External Components

1. Update the component catalog in `specs/libraries.md`
2. Install components using their official CLI (e.g., `npx shadcn@latest add component-name`)
3. Components will be placed in `src/components/[library-name]/`
4. Apply TeamHub design system colors where appropriate

### TeamHub Core Components

1. Create custom components in `src/core-components/`
2. Use external components as building blocks
3. Apply TeamHub design system styling
4. Update `src/core-components/index.ts` to export new components
5. Add examples to the component showcase

### General Guidelines

1. Follow the established folder structure
2. Use TeamHub design system colors consistently
3. Update this README with any new sections or information
4. Ensure all components have proper TypeScript types
5. Test components across different scenarios
6. Update the component showcase with new components

## License

MIT
