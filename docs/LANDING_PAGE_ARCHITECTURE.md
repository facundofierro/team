# Landing Page Component Architecture Guide

## Quick Reference

### 🎨 Color Systems

| Context      | File                                                         | Export                              | Usage                  |
| ------------ | ------------------------------------------------------------ | ----------------------------------- | ---------------------- |
| Landing Page | `packages/ux-core/src/components-site/colors.ts`             | `siteColors`, `siteUtils`           | Public-facing sites    |
| TeamHub App  | `packages/ux-core/src/components-core/light-theme-colors.ts` | `coreColors`, `coreUtils`           | Internal UI components |
| Dark Theme   | `packages/ux-core/src/components-core/dark-theme-colors.ts`  | `componentColors`, `componentUtils` | Dark-themed components |

### 📁 File Organization

```
apps/landing-page/src/          # Content & Logic Layer
├── content/                    # ✅ Text, copy, messaging
├── handlers/                   # ✅ Event handlers, business logic
├── stores/                     # ✅ State management
└── app/                        # ✅ Next.js app structure

packages/ux-core/src/components-site/  # Presentation Layer
├── navigation/                 # ✅ Header, menu, language switcher
├── hero/                       # ✅ Hero sections and CTAs
├── features/                   # ✅ Feature showcases
├── content/                    # ✅ Content sections
├── ai-widget/                  # ✅ AI chat widgets
├── layout/                     # ✅ Layout components
└── colors.ts                   # ✅ Site-specific colors
```

### ✅ DO's

1. **Use defined color systems**

```typescript
import { siteColors, siteUtils } from '@teamhub/ux-core'
<div className={siteColors.gradients.primary}>
```

2. **Pass content as props**

```typescript
<LandingHero
  title="Transform Your Business"
  subtitle="Deploy intelligent agents"
  ctaText="Get Started Free"
/>
```

3. **Pass handlers as props**

```typescript
<LandingHero
  onCtaClick={navigationHandlers.onCtaClick}
  onScroll={interactionHandlers.onScroll}
/>
```

4. **Keep components pure**

```typescript
interface LandingHeroProps {
  title: string
  subtitle: string
  ctaText: string
  onCtaClick: () => void
  className?: string
}
```

### ❌ DON'Ts

1. **Hardcode colors**

```typescript
// ❌ WRONG
<div className="bg-[#f45584] text-white">
```

2. **Include content in components**

```typescript
// ❌ WRONG
export const LandingHero = () => {
  return <h1>Transform Your Business</h1> {/* NO! */}
}
```

3. **Include business logic in components**

```typescript
// ❌ WRONG
export const LandingHero = ({ onCtaClick }: Props) => {
  const handleClick = () => {
    analytics.track('cta_clicked') // NO! This belongs in handlers
    router.push('/signup') // NO! This belongs in handlers
  }
}
```

4. **Use wrong color systems**

```typescript
// ❌ WRONG: Using site colors in core components
import { siteColors } from '@teamhub/ux-core'
// This should use coreColors instead
```

### 🔄 Import Patterns

```typescript
// ✅ Landing page imports
import {
  LandingHero,
  LandingFeatures,
  LandingHeader,
  siteColors,
  siteUtils,
} from '@teamhub/ux-core'

// ✅ Content imports
import { heroContent } from '../content/hero-content'
import { featuresContent } from '../content/features-content'

// ✅ Handler imports
import { navigationHandlers } from '../handlers/navigation-handlers'
import { formHandlers } from '../handlers/form-handlers'
```

### 🧪 Testing Checklist

**Component Testing:**

- [ ] All colors come from defined color systems
- [ ] No hardcoded text in components
- [ ] No business logic in components
- [ ] All content and handlers passed as props
- [ ] Components work with different content
- [ ] Mobile-first responsive design
- [ ] ARIA labels and keyboard navigation

**Content Testing:**

- [ ] Content files contain only text/copy
- [ ] Handler files contain only business logic
- [ ] Landing page only imports from ux-core
- [ ] All content passed to components as props
- [ ] State management in dedicated store files

### 🎯 Benefits

1. **Maintainability**: Clear separation of concerns
2. **Reusability**: Components can be used with different content
3. **Consistency**: Unified color system and styling
4. **Scalability**: Easy to add new landing pages
5. **Testing**: Components and content can be tested separately
6. **Performance**: Optimized bundle sizes with tree-shaking
7. **Developer Experience**: Clear file organization and import patterns

## Examples

### Complete Component Example

**UX-Core Component:**

```typescript
// packages/ux-core/src/components-site/hero/landing-hero.tsx
import { siteColors, siteUtils } from '../colors'

interface LandingHeroProps {
  title: string
  subtitle: string
  ctaText: string
  onCtaClick: () => void
  backgroundImage?: string
}

export const LandingHero = ({
  title,
  subtitle,
  ctaText,
  onCtaClick,
  backgroundImage,
}: LandingHeroProps) => {
  return (
    <section className={`${siteColors.gradients.primary} min-h-screen`}>
      <h1 className={siteColors.text.white}>{title}</h1>
      <p className={siteColors.text.gray300}>{subtitle}</p>
      <button
        className={siteUtils.getButtonClasses('primary')}
        onClick={onCtaClick}
      >
        {ctaText}
      </button>
    </section>
  )
}
```

**Content File:**

```typescript
// apps/landing-page/src/content/hero-content.ts
export const heroContent = {
  title: 'Transform Your Business with AI Agents',
  subtitle:
    'Deploy intelligent agents that work 24/7 to automate your workflows',
  ctaText: 'Get Started Free',
}
```

**Handler File:**

```typescript
// apps/landing-page/src/handlers/navigation-handlers.ts
export const navigationHandlers = {
  onCtaClick: () => {
    analytics.track('hero_cta_clicked')
    router.push('/signup')
  },
}
```

**Landing Page Usage:**

```typescript
// apps/landing-page/src/app/page.tsx
import { LandingHero } from '@teamhub/ux-core'
import { heroContent } from '../content/hero-content'
import { navigationHandlers } from '../handlers/navigation-handlers'

export default function LandingPage() {
  return (
    <LandingHero
      title={heroContent.title}
      subtitle={heroContent.subtitle}
      ctaText={heroContent.ctaText}
      onCtaClick={navigationHandlers.onCtaClick}
    />
  )
}
```

This architecture ensures clean separation of concerns, maintainability, and reusability across all landing page components.
