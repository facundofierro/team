# Test info

- Name: TeamHub UX Core Components >> Form Components >> Toggle component - toggle states
- Location: /Users/facundofierro/git/team/packages/ux-core/tests/components.spec.ts:180:9

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByText('Toggle Component Test')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('Toggle Component Test')

    at /Users/facundofierro/git/team/packages/ux-core/tests/components.spec.ts:184:61
```

# Page snapshot

```yaml
- heading "404" [level=1]
- heading "This page could not be found." [level=2]
- alert
```

# Test source

```ts
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
  111 |       await expect(page.getByText('Page Header Component Test')).toBeVisible()
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
> 184 |       await expect(page.getByText('Toggle Component Test')).toBeVisible()
      |                                                             ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
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
  212 |       await expect(page.getByRole('navigation')).toBeVisible()
  213 |     })
  214 |
  215 |     test('Keyboard navigation should work', async ({ page }) => {
  216 |       await page.goto('/components/sidebar')
  217 |       
  218 |       // Test tab navigation
  219 |       await page.keyboard.press('Tab')
  220 |       await expect(page.locator(':focus')).toBeVisible()
  221 |     })
  222 |
  223 |     test('Color contrast should meet WCAG guidelines', async ({ page }) => {
  224 |       await page.goto('/components/status-indicator')
  225 |       
  226 |       // This would require a visual regression test or contrast checking library
  227 |       // For now, we'll just verify the component renders
  228 |       await expect(page.getByText('Status Indicator Component Test')).toBeVisible()
  229 |     })
  230 |   })
  231 |
  232 |   test.describe('Responsive Design Tests', () => {
  233 |     test('Components should be responsive on mobile', async ({ page }) => {
  234 |       await page.setViewportSize({ width: 375, height: 667 })
  235 |       
  236 |       await page.goto('/components/sidebar')
  237 |       await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()
  238 |       
  239 |       await page.goto('/components/status-indicator')
  240 |       await expect(page.getByText('Status Indicator Component Test')).toBeVisible()
  241 |     })
  242 |
  243 |     test('Components should be responsive on tablet', async ({ page }) => {
  244 |       await page.setViewportSize({ width: 768, height: 1024 })
  245 |       
  246 |       await page.goto('/components/sidebar')
  247 |       await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()
  248 |       
  249 |       await page.goto('/components/status-indicator')
  250 |       await expect(page.getByText('Status Indicator Component Test')).toBeVisible()
  251 |     })
  252 |   })
  253 |
  254 |   test.describe('Performance Tests', () => {
  255 |     test('Components should load quickly', async ({ page }) => {
  256 |       const startTime = Date.now()
  257 |       await page.goto('/')
  258 |       const loadTime = Date.now() - startTime
  259 |       
  260 |       // Components should load within 3 seconds
  261 |       expect(loadTime).toBeLessThan(3000)
  262 |     })
  263 |
  264 |     test('No console errors should occur', async ({ page }) => {
  265 |       const errors: string[] = []
  266 |       
  267 |       page.on('console', (msg) => {
  268 |         if (msg.type() === 'error') {
  269 |           errors.push(msg.text())
  270 |         }
  271 |       })
  272 |       
  273 |       await page.goto('/')
  274 |       await page.goto('/components/sidebar')
  275 |       await page.goto('/components/status-indicator')
  276 |       
  277 |       expect(errors).toHaveLength(0)
  278 |     })
  279 |   })
  280 |
  281 |   test.describe('Cross-browser Compatibility', () => {
  282 |     test('Components should work in different browsers', async ({ page }) => {
  283 |       await page.goto('/')
  284 |       await expect(page.getByText('TeamHub UX Core - Component Test Suite')).toBeVisible()
```