import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:3000'
  const email = process.env.E2E_USER_EMAIL
  const password = process.env.E2E_USER_PASSWORD

  if (!email || !password) {
    console.warn(
      'E2E_USER_EMAIL and E2E_USER_PASSWORD must be set for authentication tests'
    )
    // Skip authentication if credentials are not provided
    return
  }

  await page.goto(`${baseUrl}/auth/signin`)

  // Fill login form (adjust selectors based on your actual login form)
  await page.fill('input[name="email"], input[type="email"]', email)
  await page.fill('input[name="password"], input[type="password"]', password)

  // Submit the form
  await page.click('button[type="submit"]')

  // Wait for redirect to authenticated area
  await page.waitForURL(/.*dashboard.*|.*home.*|.*profile.*/)

  // Verify we're logged in by checking for user-specific elements
  await expect(
    page.locator(
      '[data-testid="user-menu"], [data-testid="user-avatar"], .user-avatar'
    )
  ).toBeVisible()

  // Save authentication state
  await page.context().storageState({ path: authFile })
})
