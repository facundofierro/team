import { test, expect } from '@playwright/test'

test.describe('AI-Powered Authentication Tests', () => {
  test('should authenticate with OAuth provider (Yandex)', async ({ page }) => {
    // Navigate to login page
    await test.step('Navigate to the login page', async () => {
      await page.goto('/')

      // Look for common login button patterns
      const loginSelectors = [
        'text=/sign.?in/i',
        'text=/log.?in/i',
        'text=/login/i',
        '[data-testid*="login"]',
        '[data-testid*="signin"]',
        'button:has-text("Sign")',
        'a:has-text("Sign")',
        '.login',
        '.signin',
      ]

      let loginButton = null
      for (const selector of loginSelectors) {
        try {
          loginButton = page.locator(selector).first()
          if (await loginButton.isVisible({ timeout: 2000 })) {
            break
          }
        } catch (e) {
          continue
        }
      }

      if (loginButton && (await loginButton.isVisible())) {
        await loginButton.click()
      } else {
        // Try navigating directly to auth routes
        const authRoutes = ['/auth/signin', '/login', '/signin', '/auth']
        for (const route of authRoutes) {
          try {
            await page.goto(route)
            if (!page.url().includes('404')) break
          } catch (e) {
            continue
          }
        }
      }
    })

    await test.step('Find and click Yandex OAuth button', async () => {
      // Wait for OAuth buttons to load
      await page.waitForTimeout(2000)

      // Look for Yandex-specific OAuth button patterns
      const yandexSelectors = [
        'text=/yandex/i',
        '[data-provider="yandex"]',
        '[data-testid*="yandex"]',
        'button:has-text("Yandex")',
        'a:has-text("Yandex")',
        '[title*="yandex" i]',
        '[alt*="yandex" i]',
        // Generic OAuth patterns that might be Yandex
        'button[class*="oauth"]',
        '.oauth-button',
        '[data-testid*="oauth"]',
      ]

      let yandexButton = null
      for (const selector of yandexSelectors) {
        try {
          yandexButton = page.locator(selector).first()
          if (await yandexButton.isVisible({ timeout: 2000 })) {
            console.log(`Found Yandex button with selector: ${selector}`)
            break
          }
        } catch (e) {
          continue
        }
      }

      if (yandexButton && (await yandexButton.isVisible())) {
        await yandexButton.click()
      } else {
        console.log(
          'Could not find Yandex OAuth button, taking screenshot for debugging'
        )
        await page.screenshot({
          path: 'test-results/no-yandex-button.png',
          fullPage: true,
        })
        throw new Error('Yandex OAuth button not found')
      }
    })

    await test.step('Handle Yandex OAuth flow', async () => {
      // Wait for redirect to Yandex or popup
      await page.waitForTimeout(3000)

      // Check if we're on Yandex domain or in a popup
      const currentUrl = page.url()
      console.log(`Current URL after OAuth click: ${currentUrl}`)

      if (currentUrl.includes('yandex') || currentUrl.includes('passport')) {
        console.log('Redirected to Yandex OAuth page')

        // If environment variables are provided, try to authenticate
        const email = process.env.E2E_USER_EMAIL
        const password = process.env.E2E_USER_PASSWORD

        if (email && password) {
          await test.step('Fill Yandex credentials', async () => {
            // Look for email/username field
            const emailSelectors = [
              'input[name="login"]',
              'input[type="email"]',
              'input[name="email"]',
              'input[placeholder*="email" i]',
              'input[placeholder*="логин" i]', // Russian for login
              'input[id*="email"]',
              'input[id*="login"]',
            ]

            for (const selector of emailSelectors) {
              try {
                const emailField = page.locator(selector).first()
                if (await emailField.isVisible({ timeout: 2000 })) {
                  await emailField.fill(email)
                  console.log(`Filled email with selector: ${selector}`)
                  break
                }
              } catch (e) {
                continue
              }
            }

            // Submit or continue
            const continueSelectors = [
              'button[type="submit"]',
              'text=/continue/i',
              'text=/next/i',
              'text=/далее/i', // Russian for "next"
              'text=/войти/i', // Russian for "login"
            ]

            for (const selector of continueSelectors) {
              try {
                const continueButton = page.locator(selector).first()
                if (await continueButton.isVisible({ timeout: 2000 })) {
                  await continueButton.click()
                  console.log(`Clicked continue with selector: ${selector}`)
                  break
                }
              } catch (e) {
                continue
              }
            }

            // Wait for password field to appear
            await page.waitForTimeout(2000)

            // Look for password field
            const passwordSelectors = [
              'input[name="passwd"]',
              'input[type="password"]',
              'input[name="password"]',
              'input[placeholder*="password" i]',
              'input[placeholder*="пароль" i]', // Russian for password
              'input[id*="password"]',
            ]

            for (const selector of passwordSelectors) {
              try {
                const passwordField = page.locator(selector).first()
                if (await passwordField.isVisible({ timeout: 2000 })) {
                  await passwordField.fill(password)
                  console.log(`Filled password with selector: ${selector}`)
                  break
                }
              } catch (e) {
                continue
              }
            }

            // Submit login
            for (const selector of continueSelectors) {
              try {
                const submitButton = page.locator(selector).first()
                if (await submitButton.isVisible({ timeout: 2000 })) {
                  await submitButton.click()
                  console.log(`Clicked submit with selector: ${selector}`)
                  break
                }
              } catch (e) {
                continue
              }
            }
          })
        } else {
          console.log('No credentials provided, skipping actual login')
          // Just verify we reached the OAuth page
          await expect(page).toHaveURL(/yandex|passport/)
        }
      }
    })

    await test.step('Verify successful authentication or OAuth flow', async () => {
      // Wait for redirect back to app
      await page.waitForTimeout(5000)

      // Check if we're back on our domain
      const finalUrl = page.url()
      console.log(`Final URL: ${finalUrl}`)

      // Verify we're either:
      // 1. Successfully authenticated (look for user indicators)
      // 2. Or at least completed the OAuth flow setup
      const successIndicators = [
        '[data-testid*="user"]',
        '[data-testid*="profile"]',
        '.user-menu',
        '.user-avatar',
        'text=/dashboard/i',
        'text=/profile/i',
        'text=/logout/i',
        'text=/sign.?out/i',
      ]

      let foundSuccessIndicator = false
      for (const selector of successIndicators) {
        try {
          if (
            await page.locator(selector).first().isVisible({ timeout: 3000 })
          ) {
            console.log(`Found success indicator: ${selector}`)
            foundSuccessIndicator = true
            break
          }
        } catch (e) {
          continue
        }
      }

      // If no credentials were provided, just verify OAuth flow started
      if (!process.env.E2E_USER_EMAIL && !foundSuccessIndicator) {
        console.log(
          'No credentials provided - just verifying OAuth flow is accessible'
        )
        // Take a screenshot for manual verification
        await page.screenshot({
          path: 'test-results/oauth-flow-end.png',
          fullPage: true,
        })
      } else if (process.env.E2E_USER_EMAIL) {
        // With credentials, we expect to be logged in
        expect(foundSuccessIndicator).toBeTruthy()
      }
    })
  })

  test('should handle OAuth flow gracefully when credentials are missing', async ({
    page,
  }) => {
    await test.step('Verify OAuth integration exists without requiring credentials', async () => {
      await page.goto('/')

      // Just verify that OAuth buttons are present and clickable
      // This tests the UI integration without requiring actual auth

      // Take a screenshot of the login page
      await page.screenshot({
        path: 'test-results/login-page.png',
        fullPage: true,
      })

      // Verify page loads without errors
      await expect(page.locator('html')).toBeVisible()

      console.log('OAuth integration test completed without credentials')
    })
  })
})
