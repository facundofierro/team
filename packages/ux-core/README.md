# @agelum/ux-core

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
│   ├── components/         # External library components
│   │   ├── shadcn/        # shadcn/ui components
│   │   ├── tailark/       # Tailark UI components
│   │   ├── origin/        # Origin UI components
│   │   ├── motion/        # Motion/Animation components
│   │   ├── ai-sdk/        # AI SDK components
│   │   └── aceternity/    # Aceternity UI components
│   ├── components-core/    # TeamHub custom design system components
│   │   ├── teamhub-button.tsx
│   │   ├── teamhub-card.tsx
│   │   ├── teamhub-dialog.tsx
│   │   ├── teamhub-form.tsx
│   │   ├── teamhub-input.tsx
│   │   └── index.ts
│   ├── components-site/    # Site-specific components
│   │   ├── hero-section.tsx
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   ├── types/              # Type definitions
│   ├── styles/             # Global styles and CSS variables
│   └── index.ts            # Main export file
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

### Component Categories

The package provides three main categories of components:

#### 1. External Library Components

```typescript
// Import from external libraries (shadcn, tailark, origin, etc.)
import { Button, Card, Badge } from '@agelum/ux-core'

// Or import specific components from specific libraries
import { Button } from '@agelum/ux-core/components/shadcn/button'
import { Card } from '@agelum/ux-core/components/shadcn/card'
```

#### 2. TeamHub Core Components (Styled)

```typescript
// Import TeamHub design system components
import { TeamHubButton, TeamHubCard, TeamHubDialog } from '@agelum/ux-core'

// Or import directly from core components
import { TeamHubButton } from '@agelum/ux-core/components-core/teamhub-button'
```

#### 3. Site-Specific Components

```typescript
// Import site-specific components
import { HeroSection } from '@agelum/ux-core/components-site/hero-section'
```

### Examples and Demos

```typescript
// Import examples separately
import { ComponentShowcase, SimpleDemo } from '@agelum/ux-core/examples'

// Use in your app
<ComponentShowcase />  // Full component library
<SimpleDemo />         // Quick overview
```

## Quick Start

### 1. Install the Package

```bash
pnpm add @agelum/ux-core
```

### 2. Import CSS Variables

```css
/* In your app's global CSS */
@import '@agelum/ux-core/src/styles/globals.css';
```

### 3. Use Components

```tsx
import { Button, Card } from '@agelum/ux-core'

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

### External Components (`src/components/`)

1. Update the component catalog in `specs/libraries.md`
2. Install components using their official CLI (e.g., `npx shadcn@latest add component-name`)
3. Components will be placed in `src/components/[library-name]/`
4. Apply TeamHub design system colors where appropriate
5. Update the main `src/index.ts` to export new components

### TeamHub Core Components (`src/components-core/`)

1. Create custom components in `src/components-core/`
2. Use external components as building blocks
3. Apply TeamHub design system styling
4. Update `src/components-core/index.ts` to export new components
5. Add examples to the component showcase

### Site-Specific Components (`src/components-site/`)

1. Create site-specific components in `src/components-site/`
2. These are components tailored for specific use cases or pages
3. Update `src/components-site/index.ts` to export new components
4. Consider if the component should be moved to core if it's reusable

### General Guidelines

1. Follow the established folder structure with three component directories
2. Use TeamHub design system colors consistently
3. Update this README with any new sections or information
4. Ensure all components have proper TypeScript types
5. Test components across different scenarios
6. Update the component showcase with new components
7. Keep components organized by their purpose and reusability

## License

MIT
