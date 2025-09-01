# Test info

- Name: TeamHub UX Core Components >> Layout Components >> PageHeader component - title and actions
- Location: /Users/facundofierro/git/team/packages/ux-core/tests/components.spec.ts:107:9

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByText('Page Header Component Test')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('Page Header Component Test')

    at /Users/facundofierro/git/team/packages/ux-core/tests/components.spec.ts:111:66
```

# Page snapshot

```yaml
- heading "404" [level=1]
- heading "This page could not be found." [level=2]
- alert
```

# Test source

```ts
   11 |       
   12 |       // Check if sidebar is visible
   13 |       await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()
   14 |       
   15 |       // Check if logo is displayed
   16 |       await expect(page.getByText('TeamHub')).toBeVisible()
   17 |       await expect(page.getByText('AI Agent Network')).toBeVisible()
   18 |       
   19 |       // Check if navigation items are present
   20 |       await expect(page.getByText('Dashboard')).toBeVisible()
   21 |       await expect(page.getByText('AI Agents')).toBeVisible()
   22 |       await expect(page.getByText('Tasks')).toBeVisible()
   23 |       
   24 |       // Check if user profile is displayed
   25 |       await expect(page.getByText('John Doe')).toBeVisible()
   26 |       await expect(page.getByText('john@teamhub.com')).toBeVisible()
   27 |     })
   28 |
   29 |     test('Sidebar component - collapse/expand functionality', async ({ page }) => {
   30 |       await page.goto('/components/sidebar')
   31 |       
   32 |       // Initially expanded
   33 |       await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/w-64/)
   34 |       
   35 |       // Click collapse button
   36 |       await page.getByRole('button', { name: /collapse/i }).click()
   37 |       
   38 |       // Should be collapsed
   39 |       await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/w-16/)
   40 |       
   41 |       // Click expand button
   42 |       await page.getByRole('button', { name: /expand/i }).click()
   43 |       
   44 |       // Should be expanded again
   45 |       await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/w-64/)
   46 |     })
   47 |
   48 |     test('Sidebar component - active item selection', async ({ page }) => {
   49 |       await page.goto('/components/sidebar')
   50 |       
   51 |       // Change active item via dropdown
   52 |       await page.selectOption('select', 'agents')
   53 |       
   54 |       // Verify active item is highlighted
   55 |       await expect(page.locator('[data-testid="sidebar-item-agents"]')).toHaveClass(/bg-white\/10/)
   56 |     })
   57 |
   58 |     test('StatusIndicator component - all status types', async ({ page }) => {
   59 |       await page.goto('/components/status-indicator')
   60 |       
   61 |       // Check if all status types are displayed
   62 |       const statuses = ['active', 'inactive', 'running', 'stopped', 'error', 'warning', 'pending', 'idle', 'offline']
   63 |       
   64 |       for (const status of statuses) {
   65 |         await expect(page.getByText(status, { exact: false })).toBeVisible()
   66 |       }
   67 |     })
   68 |
   69 |     test('StatusIndicator component - size variants', async ({ page }) => {
   70 |       await page.goto('/components/status-indicator')
   71 |       
   72 |       // Check if all sizes are displayed
   73 |       const sizes = ['sm', 'md', 'lg']
   74 |       
   75 |       for (const size of sizes) {
   76 |         await expect(page.getByText(size.toUpperCase())).toBeVisible()
   77 |       }
   78 |     })
   79 |
   80 |     test('StatusIndicator component - interactive controls', async ({ page }) => {
   81 |       await page.goto('/components/status-indicator')
   82 |       
   83 |       // Change status
   84 |       await page.selectOption('select', 'error')
   85 |       
   86 |       // Change size
   87 |       await page.selectOption('select:nth-of-type(2)', 'lg')
   88 |       
   89 |       // Toggle label
   90 |       await page.getByLabel('Show Label').uncheck()
   91 |       
   92 |       // Verify changes are reflected
   93 |       await expect(page.getByText('Status: error')).toBeVisible()
   94 |       await expect(page.getByText('Size: lg')).toBeVisible()
   95 |       await expect(page.getByText('Label: Off')).toBeVisible()
   96 |     })
   97 |   })
   98 |
   99 |   test.describe('Layout Components', () => {
  100 |     test('Layout component - basic structure', async ({ page }) => {
  101 |       await page.goto('/components/layout')
  102 |       
  103 |       // Check if layout components are rendered
  104 |       await expect(page.getByText('Layout Component Test')).toBeVisible()
  105 |     })
  106 |
  107 |     test('PageHeader component - title and actions', async ({ page }) => {
  108 |       await page.goto('/components/page-header')
  109 |       
  110 |       // Check if page header is displayed
> 111 |       await expect(page.getByText('Page Header Component Test')).toBeVisible()
      |                                                                  ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  112 |     })
  113 |
  114 |     test('ContentContainer component - responsive behavior', async ({ page }) => {
  115 |       await page.goto('/components/content-container')
  116 |       
  117 |       // Check if content container is displayed
  118 |       await expect(page.getByText('Content Container Component Test')).toBeVisible()
  119 |       
  120 |       // Test responsive behavior
  121 |       await page.setViewportSize({ width: 768, height: 600 })
  122 |       await expect(page.locator('[data-testid="content-container"]')).toBeVisible()
  123 |     })
  124 |   })
  125 |
  126 |   test.describe('Data Display Components', () => {
  127 |     test('AgentCard component - agent information display', async ({ page }) => {
  128 |       await page.goto('/components/agent-card')
  129 |       
  130 |       // Check if agent card is displayed
  131 |       await expect(page.getByText('Agent Card Component Test')).toBeVisible()
  132 |     })
  133 |
  134 |     test('MetricCard component - metric values and trends', async ({ page }) => {
  135 |       await page.goto('/components/metric-card')
  136 |       
  137 |       // Check if metric card is displayed
  138 |       await expect(page.getByText('Metric Card Component Test')).toBeVisible()
  139 |     })
  140 |
  141 |     test('DataTable component - table structure and data', async ({ page }) => {
  142 |       await page.goto('/components/data-table')
  143 |       
  144 |       // Check if data table is displayed
  145 |       await expect(page.getByText('Data Table Component Test')).toBeVisible()
  146 |     })
  147 |
  148 |     test('EmptyState component - empty state messaging', async ({ page }) => {
  149 |       await page.goto('/components/empty-state')
  150 |       
  151 |       // Check if empty state is displayed
  152 |       await expect(page.getByText('Empty State Component Test')).toBeVisible()
  153 |     })
  154 |   })
  155 |
  156 |   test.describe('Form Components', () => {
  157 |     test('EnhancedInput component - input validation and states', async ({ page }) => {
  158 |       await page.goto('/components/enhanced-input')
  159 |       
  160 |       // Check if enhanced input is displayed
  161 |       await expect(page.getByText('Enhanced Input Component Test')).toBeVisible()
  162 |       
  163 |       // Test input interaction
  164 |       const input = page.getByRole('textbox')
  165 |       await input.fill('test value')
  166 |       await expect(input).toHaveValue('test value')
  167 |     })
  168 |
  169 |     test('EnhancedSelect component - dropdown functionality', async ({ page }) => {
  170 |       await page.goto('/components/enhanced-select')
  171 |       
  172 |       // Check if enhanced select is displayed
  173 |       await expect(page.getByText('Enhanced Select Component Test')).toBeVisible()
  174 |       
  175 |       // Test select interaction
  176 |       await page.getByRole('combobox').click()
  177 |       await expect(page.getByRole('listbox')).toBeVisible()
  178 |     })
  179 |
  180 |     test('Toggle component - toggle states', async ({ page }) => {
  181 |       await page.goto('/components/toggle')
  182 |       
  183 |       // Check if toggle is displayed
  184 |       await expect(page.getByText('Toggle Component Test')).toBeVisible()
  185 |       
  186 |       // Test toggle interaction
  187 |       const toggle = page.getByRole('switch')
  188 |       await toggle.click()
  189 |       await expect(toggle).toBeChecked()
  190 |     })
  191 |
  192 |     test('FormActions component - action buttons', async ({ page }) => {
  193 |       await page.goto('/components/form-actions')
  194 |       
  195 |       // Check if form actions are displayed
  196 |       await expect(page.getByText('Form Actions Component Test')).toBeVisible()
  197 |       
  198 |       // Test button interactions
  199 |       await page.getByRole('button', { name: /save/i }).click()
  200 |       await page.getByRole('button', { name: /cancel/i }).click()
  201 |     })
  202 |   })
  203 |
  204 |   test.describe('Accessibility Tests', () => {
  205 |     test('All components should have proper ARIA labels', async ({ page }) => {
  206 |       await page.goto('/')
  207 |       
  208 |       // Check for proper heading structure
  209 |       await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  210 |       
  211 |       // Check for proper navigation landmarks
```