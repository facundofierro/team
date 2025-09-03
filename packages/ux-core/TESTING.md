# TeamHub UX Core - Playwright Test Suite

This directory contains a comprehensive Playwright test suite for all components in the `@agelum/ux-core` package.

## Overview

The test suite includes:

- **Component Test Pages**: Interactive pages for testing each component with various states and configurations
- **Playwright Tests**: Automated tests covering functionality, accessibility, responsiveness, and cross-browser compatibility
- **Test Server**: A Next.js application that serves the component test pages

## Test Coverage

### Navigation Components

- ✅ Sidebar - Collapse/expand, active item selection, user profile
- ✅ Navigation Menu - Menu structure and interactions
- ✅ User Profile - Profile display and actions
- ✅ Search - Search functionality and results

### Layout Components

- ✅ Layout - Page structure and responsive behavior
- ✅ Page Header - Title, actions, and breadcrumbs
- ✅ Content Container - Responsive content areas

### Data Display Components

- ✅ Status Indicator - All status types, sizes, and states
- ✅ Agent Card - Agent information, metrics, and actions
- ✅ Metric Card - Metric values and trends
- ✅ Data Table - Table structure and data display
- ✅ List Item - List item display and interactions
- ✅ Empty State - Empty state messaging and actions

### Form Components

- ✅ Form Section - Form organization and layout
- ✅ Enhanced Input - Input validation, types, and states
- ✅ Enhanced Select - Dropdown functionality and options
- ✅ Toggle - Toggle states and interactions
- ✅ Schedule Item - Schedule display and editing
- ✅ Tool Item - Tool information and actions
- ✅ Form Actions - Action buttons and form submission

## Getting Started

### Prerequisites

1. Install dependencies:

```bash
pnpm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

### Running Tests

#### Start the Test Server

```bash
pnpm dev:test
```

This starts the test server on `http://localhost:3001`

#### Run All Tests

```bash
pnpm test
```

#### Run Tests with UI

```bash
pnpm test:ui
```

#### Run Tests in Headed Mode

```bash
pnpm test:headed
```

#### Run Tests in Debug Mode

```bash
pnpm test:debug
```

## Test Structure

### Component Test Pages

Each component has a dedicated test page at `/components/{component-name}` that includes:

- **Interactive Controls**: Dropdowns, toggles, and inputs to test different component states
- **Current Selection**: Live preview of the component with current settings
- **All Variants**: Display of all component variants and configurations
- **Component Features**: List of features and capabilities
- **Test Scenarios**: Manual testing instructions

### Playwright Test Files

- `tests/components.spec.ts` - Main test file covering all components
- Tests are organized by component category
- Each test includes accessibility, responsiveness, and functionality checks

## Test Categories

### 1. Functionality Tests

- Component rendering and display
- Interactive elements (buttons, inputs, dropdowns)
- State changes and updates
- Event handling and callbacks

### 2. Accessibility Tests

- ARIA labels and landmarks
- Keyboard navigation
- Screen reader compatibility
- Color contrast compliance

### 3. Responsive Design Tests

- Mobile viewport behavior
- Tablet viewport behavior
- Desktop viewport behavior
- Component scaling and layout

### 4. Cross-browser Tests

- Chrome/Chromium compatibility
- Firefox compatibility (when enabled)
- Safari/WebKit compatibility (when enabled)
- Mobile browser compatibility

### 5. Performance Tests

- Component load times
- Memory usage
- Console error checking
- Bundle size impact

## Adding New Components

### 1. Create Component Test Page

Create a new page at `test-server/src/app/components/{component-name}/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { YourComponent } from '@agelum/ux-core'

export default function YourComponentTestPage() {
  const [value, setValue] = useState('')

  return (
    <div className="min-h-screen bg-bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-bg-foreground mb-6">
          Your Component Test
        </h1>

        {/* Interactive Controls */}
        <div className="bg-bg-card border border-bg-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-bg-foreground mb-4">
            Interactive Controls
          </h2>
          {/* Add controls here */}
        </div>

        {/* Component Display */}
        <div className="bg-bg-card border border-bg-border rounded-lg p-6">
          <YourComponent value={value} onChange={setValue} />
        </div>
      </div>
    </div>
  )
}
```

### 2. Add Test Cases

Add test cases to `tests/components.spec.ts`:

```typescript
test.describe('Your Component', () => {
  test('should render correctly', async ({ page }) => {
    await page.goto('/components/your-component')
    await expect(page.getByText('Your Component Test')).toBeVisible()
  })

  test('should handle interactions', async ({ page }) => {
    await page.goto('/components/your-component')
    // Add interaction tests
  })
})
```

### 3. Update Navigation

Add the component to the navigation in `test-server/src/app/page.tsx`:

```tsx
const componentCategories = [
  {
    name: 'Your Category',
    components: [
      // ... existing components
      { name: 'Your Component', path: '/components/your-component' },
    ],
  },
]
```

## Best Practices

### Component Testing

- Test all component variants and states
- Include interactive controls for manual testing
- Provide clear test scenarios and instructions
- Use consistent naming and structure

### Playwright Tests

- Use descriptive test names
- Test both positive and negative scenarios
- Include accessibility checks
- Test responsive behavior
- Verify cross-browser compatibility

### Test Data

- Use realistic sample data
- Include edge cases and error states
- Provide meaningful test values
- Document data structure and purpose

## Troubleshooting

### Common Issues

1. **Test Server Not Starting**

   - Check if port 3001 is available
   - Verify all dependencies are installed
   - Check for TypeScript compilation errors

2. **Component Not Rendering**

   - Verify component is exported from `@agelum/ux-core`
   - Check for missing dependencies
   - Review component props and types

3. **Tests Failing**
   - Check test server is running
   - Verify component test page exists
   - Review test selectors and expectations

### Debug Mode

Use debug mode to step through tests:

```bash
pnpm test:debug
```

This opens Playwright Inspector for interactive debugging.

## Continuous Integration

The test suite is configured to run in CI environments:

- Uses headless browsers
- Generates HTML and JSON reports
- Fails on console errors
- Includes retry logic for flaky tests

## Reports

Test results are available in:

- `test-results/` - Playwright test results
- `playwright-report/` - HTML test report
- Console output - Real-time test progress

## Contributing

When adding new components or updating existing ones:

1. Update component test pages
2. Add comprehensive test cases
3. Verify accessibility compliance
4. Test responsive behavior
5. Update documentation

## Support

For issues with the test suite:

1. Check the troubleshooting section
2. Review component documentation
3. Check Playwright documentation
4. Create an issue with detailed information
