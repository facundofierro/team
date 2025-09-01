# Test info

- Name: TeamHub UX Core Components >> Performance Tests >> No console errors should occur
- Location: /Users/facundofierro/git/team/packages/ux-core/tests/components.spec.ts:264:9

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 2
Received array:  ["Failed to load resource: the server responded with a status of 404 (Not Found)", "Failed to load resource: the server responded with a status of 404 (Not Found)"]
    at /Users/facundofierro/git/team/packages/ux-core/tests/components.spec.ts:277:22
```

# Page snapshot

```yaml
- heading "404" [level=1]
- heading "This page could not be found." [level=2]
- alert
```

# Test source

```ts
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
> 277 |       expect(errors).toHaveLength(0)
      |                      ^ Error: expect(received).toHaveLength(expected)
  278 |     })
  279 |   })
  280 |
  281 |   test.describe('Cross-browser Compatibility', () => {
  282 |     test('Components should work in different browsers', async ({ page }) => {
  283 |       await page.goto('/')
  284 |       await expect(page.getByText('TeamHub UX Core - Component Test Suite')).toBeVisible()
  285 |       
  286 |       await page.goto('/components/sidebar')
  287 |       await expect(page.getByText('Sidebar Component Test')).toBeVisible()
  288 |       
  289 |       await page.goto('/components/status-indicator')
  290 |       await expect(page.getByText('Status Indicator Component Test')).toBeVisible()
  291 |     })
  292 |   })
  293 | })
  294 |
```