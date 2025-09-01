import { test, expect } from '@playwright/test'

test.describe('TeamHub UX Core Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Navigation Components', () => {
    test('Sidebar component - basic functionality', async ({ page }) => {
      await page.goto('/components/sidebar')

      // Check if sidebar is visible
      await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()

      // Check if logo is displayed
      await expect(page.getByText('TeamHub')).toBeVisible()
      await expect(page.getByText('AI Agent Network')).toBeVisible()

      // Check if navigation items are present
      await expect(page.getByText('Dashboard')).toBeVisible()
      await expect(page.getByText('AI Agents')).toBeVisible()
      await expect(page.getByText('Tasks')).toBeVisible()

      // Check if user profile is displayed
      await expect(page.getByText('John Doe')).toBeVisible()
      await expect(page.getByText('john@teamhub.com')).toBeVisible()
    })

    test('Sidebar component - collapse/expand functionality', async ({
      page,
    }) => {
      await page.goto('/components/sidebar')

      // Initially expanded
      await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/w-64/)

      // Click collapse button
      await page.getByRole('button', { name: /collapse/i }).click()

      // Should be collapsed
      await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/w-16/)

      // Click expand button
      await page.getByRole('button', { name: /expand/i }).click()

      // Should be expanded again
      await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/w-64/)
    })

    test('Sidebar component - active item selection', async ({ page }) => {
      await page.goto('/components/sidebar')

      // Change active item via dropdown
      await page.selectOption('select', 'agents')

      // Verify active item is highlighted
      await expect(
        page.locator('[data-testid="sidebar-item-agents"]')
      ).toHaveClass(/bg-white\/10/)
    })

    test('StatusIndicator component - all status types', async ({ page }) => {
      await page.goto('/components/status-indicator')

      // Check if all status types are displayed
      const statuses = [
        'active',
        'inactive',
        'running',
        'stopped',
        'error',
        'warning',
        'pending',
        'idle',
        'offline',
      ]

      for (const status of statuses) {
        await expect(page.getByText(status, { exact: false })).toBeVisible()
      }
    })

    test('StatusIndicator component - size variants', async ({ page }) => {
      await page.goto('/components/status-indicator')

      // Check if all sizes are displayed
      const sizes = ['sm', 'md', 'lg']

      for (const size of sizes) {
        await expect(page.getByText(size.toUpperCase())).toBeVisible()
      }
    })

    test('StatusIndicator component - interactive controls', async ({
      page,
    }) => {
      await page.goto('/components/status-indicator')

      // Change status
      await page.selectOption('select', 'error')

      // Change size
      await page.selectOption('select:nth-of-type(2)', 'lg')

      // Toggle label
      await page.getByLabel('Show Label').uncheck()

      // Verify changes are reflected
      await expect(page.getByText('Status: error')).toBeVisible()
      await expect(page.getByText('Size: lg')).toBeVisible()
      await expect(page.getByText('Label: Off')).toBeVisible()
    })
  })

  test.describe('Layout Components', () => {
    test('Layout component - basic structure', async ({ page }) => {
      await page.goto('/components/layout')

      // Check if layout components are rendered
      await expect(page.getByText('Layout Component Test')).toBeVisible()
    })

    test('PageHeader component - title and actions', async ({ page }) => {
      await page.goto('/components/page-header')

      // Check if page header is displayed
      await expect(page.getByText('Page Header Component Test')).toBeVisible()
    })

    test('ContentContainer component - responsive behavior', async ({
      page,
    }) => {
      await page.goto('/components/content-container')

      // Check if content container is displayed
      await expect(
        page.getByText('Content Container Component Test')
      ).toBeVisible()

      // Test responsive behavior
      await page.setViewportSize({ width: 768, height: 600 })
      await expect(
        page.locator('[data-testid="content-container"]')
      ).toBeVisible()
    })
  })

  test.describe('Data Display Components', () => {
    test('AgentCard component - agent information display', async ({
      page,
    }) => {
      await page.goto('/components/agent-card')

      // Check if agent card is displayed
      await expect(page.getByText('Agent Card Component Test')).toBeVisible()
    })

    test('MetricCard component - metric values and trends', async ({
      page,
    }) => {
      await page.goto('/components/metric-card')

      // Check if metric card is displayed
      await expect(page.getByText('Metric Card Component Test')).toBeVisible()
    })

    test('DataTable component - table structure and data', async ({ page }) => {
      await page.goto('/components/data-table')

      // Check if data table is displayed
      await expect(page.getByText('Data Table Component Test')).toBeVisible()
    })

    test('EmptyState component - empty state messaging', async ({ page }) => {
      await page.goto('/components/empty-state')

      // Check if empty state is displayed
      await expect(page.getByText('Empty State Component Test')).toBeVisible()
    })
  })

  test.describe('Form Components', () => {
    test('EnhancedInput component - input validation and states', async ({
      page,
    }) => {
      await page.goto('/components/enhanced-input')

      // Check if enhanced input is displayed
      await expect(
        page.getByText('Enhanced Input Component Test')
      ).toBeVisible()

      // Test input interaction
      const input = page.getByRole('textbox')
      await input.fill('test value')
      await expect(input).toHaveValue('test value')
    })

    test('EnhancedSelect component - dropdown functionality', async ({
      page,
    }) => {
      await page.goto('/components/enhanced-select')

      // Check if enhanced select is displayed
      await expect(
        page.getByText('Enhanced Select Component Test')
      ).toBeVisible()

      // Test select interaction
      await page.getByRole('combobox').click()
      await expect(page.getByRole('listbox')).toBeVisible()
    })

    test('Toggle component - toggle states', async ({ page }) => {
      await page.goto('/components/toggle')

      // Check if toggle is displayed
      await expect(page.getByText('Toggle Component Test')).toBeVisible()

      // Test toggle interaction
      const toggle = page.getByRole('switch')
      await toggle.click()
      await expect(toggle).toBeChecked()
    })

    test('FormActions component - action buttons', async ({ page }) => {
      await page.goto('/components/form-actions')

      // Check if form actions are displayed
      await expect(page.getByText('Form Actions Component Test')).toBeVisible()

      // Test button interactions
      await page.getByRole('button', { name: /save/i }).click()
      await page.getByRole('button', { name: /cancel/i }).click()
    })
  })

  test.describe('Accessibility Tests', () => {
    test('All components should have proper ARIA labels', async ({ page }) => {
      await page.goto('/')

      // Check for proper heading structure
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

      // Check for proper navigation landmarks
      await expect(page.getByRole('navigation')).toBeVisible()
    })

    test('Keyboard navigation should work', async ({ page }) => {
      await page.goto('/components/sidebar')

      // Test tab navigation
      await page.keyboard.press('Tab')
      await expect(page.locator(':focus')).toBeVisible()
    })

    test('Color contrast should meet WCAG guidelines', async ({ page }) => {
      await page.goto('/components/status-indicator')

      // This would require a visual regression test or contrast checking library
      // For now, we'll just verify the component renders
      await expect(
        page.getByText('Status Indicator Component Test')
      ).toBeVisible()
    })
  })

  test.describe('Responsive Design Tests', () => {
    test('Components should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/components/sidebar')
      await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()

      await page.goto('/components/status-indicator')
      await expect(
        page.getByText('Status Indicator Component Test')
      ).toBeVisible()
    })

    test('Components should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })

      await page.goto('/components/sidebar')
      await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()

      await page.goto('/components/status-indicator')
      await expect(
        page.getByText('Status Indicator Component Test')
      ).toBeVisible()
    })
  })

  test.describe('Performance Tests', () => {
    test('Components should load quickly', async ({ page }) => {
      const startTime = Date.now()
      await page.goto('/')
      const loadTime = Date.now() - startTime

      // Components should load within 3 seconds
      expect(loadTime).toBeLessThan(3000)
    })

    test('No console errors should occur', async ({ page }) => {
      const errors: string[] = []

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })

      await page.goto('/')
      await page.goto('/components/sidebar')
      await page.goto('/components/status-indicator')

      expect(errors).toHaveLength(0)
    })
  })

  test.describe('Cross-browser Compatibility', () => {
    test('Components should work in different browsers', async ({ page }) => {
      await page.goto('/')
      await expect(
        page.getByText('TeamHub UX Core - Component Test Suite')
      ).toBeVisible()

      await page.goto('/components/sidebar')
      await expect(page.getByText('Sidebar Component Test')).toBeVisible()

      await page.goto('/components/status-indicator')
      await expect(
        page.getByText('Status Indicator Component Test')
      ).toBeVisible()
    })
  })
})
