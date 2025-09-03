# Landing Page Refactoring - Component Extraction & UX-Core Integration

**Status**: Doing
**Priority**: A (Critical)
**Estimated Effort**: 8 story points (2-3 weeks)
**Dependencies**: Current landing page implementation, UX-Core package structure

## Description

Refactor the existing landing page to extract all components and styling from `apps/landing-page/src/components` into the `packages/ux-core/src/components-site` package. This will create a clean separation between content/logic (landing-page app) and presentation/styling (ux-core package), following TeamHub's component architecture guidelines.

## Business Value

- **Maintainability**: Centralized component styling and behavior in ux-core
- **Consistency**: Unified design system across all landing page components
- **Reusability**: Components can be reused across different applications
- **Developer Experience**: Clear separation of concerns between content and presentation
- **Design System**: Proper implementation of TeamHub's component architecture

## Reference Design

**Current Landing Page**: http://localhost:3003
**Reference Design**: https://designs.magicpath.ai/v1/lucky-cloud-5966

## Implementation Plan

### Step 1: Extract Components to UX-Core

- [ ] **Extract `landing-header.tsx` → `ux-core/src/components-site/navigation/`**

  - [ ] Move component to `packages/ux-core/src/components-site/navigation/landing-header.tsx`
  - [ ] Keep current styling (will be modified later)
  - [ ] Define props for text content and handlers
  - [ ] Update landing-page to use extracted component

- [ ] **Extract `ai-chat-widget.tsx` → `ux-core/src/components-site/ai-widget/`**

  - [ ] Move component to `packages/ux-core/src/components-site/ai-widget/landing-chat-widget.tsx`
  - [ ] Keep current styling (will be modified later)
  - [ ] Define props for chat behavior and handlers
  - [ ] Update landing-page to use extracted component

- [ ] **Extract `language-switcher.tsx` → `ux-core/src/components-site/navigation/`**

  - [ ] Move component to `packages/ux-core/src/components-site/navigation/language-switcher.tsx`
  - [ ] Keep current styling (will be modified later)
  - [ ] Define props for language options and handlers
  - [ ] Update landing-page to use extracted component

- [ ] **Extract all section components → `ux-core/src/components-site/`**
  - [ ] Move `sections/hero-section.tsx` → `ux-core/src/components-site/hero/landing-hero.tsx`
  - [ ] Move `sections/features-section.tsx` → `ux-core/src/components-site/features/landing-features.tsx`
  - [ ] Move `sections/problem-section.tsx` → `ux-core/src/components-site/content/problem-section.tsx`
  - [ ] Move `sections/solution-section.tsx` → `ux-core/src/components-site/content/solution-section.tsx`
  - [ ] Move `sections/how-it-works-section.tsx` → `ux-core/src/components-site/features/how-it-works.tsx`
  - [ ] Move `sections/social-proof-section.tsx` → `ux-core/src/components-site/content/social-proof.tsx`
  - [ ] Move `sections/contact-section.tsx` → `ux-core/src/components-site/content/contact-section.tsx`
  - [ ] Keep current styling from each component (will be modified later)
  - [ ] Define props for content and handlers for each component
  - [ ] Update landing-page to use all extracted components

### Step 2: Update Landing Page App

- [ ] **Simplify landing-page app**
  - [ ] Remove extracted components from `apps/landing-page/src/components/`
  - [ ] Update imports to use ux-core components
  - [ ] Pass only content (texts) and handlers as props
  - [ ] Keep landing-page focused on content only
  - [ ] Test that all functionality works

## File Structure Changes

### New Files in ux-core

```
packages/ux-core/src/components-site/
├── navigation/
│   ├── landing-header.tsx (extracted from apps/landing-page)
│   └── language-switcher.tsx (extracted from apps/landing-page)
├── ai-widget/
│   └── landing-chat-widget.tsx (extracted from apps/landing-page)
├── hero/
│   └── landing-hero.tsx (extracted from apps/landing-page)
├── features/
│   ├── landing-features.tsx (extracted from apps/landing-page)
│   └── how-it-works.tsx (extracted from apps/landing-page)
├── content/
│   ├── problem-section.tsx (extracted from apps/landing-page)
│   ├── solution-section.tsx (extracted from apps/landing-page)
│   ├── social-proof.tsx (extracted from apps/landing-page)
│   └── contact-section.tsx (extracted from apps/landing-page)
└── colors.ts (updated with missing colors)
```

### Updated Files in landing-page

```
apps/landing-page/src/
├── components/
│   ├── index.ts (updated imports)
│   └── sections/
│       └── index.ts (updated imports)
├── content/
│   ├── hero-content.ts
│   ├── features-content.ts
│   ├── problem-content.ts
│   ├── solution-content.ts
│   ├── social-proof-content.ts
│   └── contact-content.ts
└── handlers/
    ├── navigation-handlers.ts
    ├── form-handlers.ts
    └── interaction-handlers.ts
```

## Acceptance Criteria

- [ ] All components extracted from `apps/landing-page/src/components` to `packages/ux-core/src/components-site`
- [ ] Current styling kept in extracted components (will be modified later)
- [ ] Landing page app only passes content (texts) and handlers to components
- [ ] Component props interfaces defined for content and handlers
- [ ] All functionality works after extraction
- [ ] Clean separation between content (landing-page) and presentation (ux-core)

## Success Metrics

- **Simple Implementation**: Landing page app only handles content and handlers
- **Component Reusability**: Components can be reused across different applications
- **Clean Architecture**: Clear separation between content and presentation
- **Functionality**: All user interactions work correctly

## Tools & Technologies

- **Playwright MCP**: For visual comparison between current and reference designs
- **TypeScript**: For type-safe component interfaces
- **Tailwind CSS**: For styling with colors.ts integration
- **Framer Motion**: For animations and transitions
- **shadcn/ui**: Base components for complex UI elements
- **Context7**: For component research and selection

## Notes

- **Simple Goal**: Extract components, keep styling, pass only content and handlers
- **Content Separation**: Landing-page app = content + handlers, ux-core = components
- **Keep Styling**: Keep current styling during extraction, will be modified later in ux-core
- **Functionality**: Keep all user interactions working after extraction
