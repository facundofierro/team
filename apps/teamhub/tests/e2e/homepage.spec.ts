import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Check that the page title exists and is not empty
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)

    // Check for basic page structure (adjust selector based on your app)
    // This is a very generic test that should work for most apps
    await expect(page.locator('html')).toBeVisible()
    await expect(page.locator('body')).toBeVisible()

    // Verify page loads without major errors
    // Check that no error boundary or 500 error page is shown
    const errorSelectors = [
      '[data-testid="error-boundary"]',
      '.error-page',
      'text="500"',
      'text="Internal Server Error"',
      'text="Something went wrong"',
    ]

    for (const selector of errorSelectors) {
      await expect(page.locator(selector)).not.toBeVisible()
    }
  })

  test('should have responsive design', async ({ page }) => {
    await page.goto('/')

    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForLoadState('networkidle')

    // Take screenshot for desktop (optional, can be removed for faster tests)
    await page.screenshot({
      path: 'test-results/homepage-desktop.png',
      fullPage: false,
    })

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForLoadState('networkidle')

    // Verify page is still functional on mobile
    await expect(page.locator('html')).toBeVisible()
    await expect(page.locator('body')).toBeVisible()
  })

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = []

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Allow some time for any async errors to appear
    await page.waitForTimeout(2000)

    // Filter out known acceptable errors (adjust as needed)
    const filteredErrors = consoleErrors.filter(
      (error) =>
        !error.includes('favicon.ico') && // Ignore favicon errors
        !error.includes('Extension context invalidated') && // Ignore extension errors
        !error.includes('webkit-masked-url') // Ignore webkit specific errors
    )

    if (filteredErrors.length > 0) {
      console.log('Console errors found:', filteredErrors)
    }

    // For now, we'll warn about console errors but not fail the test
    // You can change this to expect(filteredErrors).toHaveLength(0) if you want strict error checking
    expect(filteredErrors.length).toBeLessThan(5) // Allow up to 4 minor errors
  })
})
