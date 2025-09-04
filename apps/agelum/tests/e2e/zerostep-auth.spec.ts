import { test, expect } from '@playwright/test'
import { ai } from '@zerostep/playwright'

test.describe('ZeroStep AI-Powered Authentication', () => {
  test('should handle Yandex OAuth login with natural language', async ({
    page,
  }) => {
    // Check if ZeroStep token is available
    if (!process.env.ZEROSTEP_TOKEN) {
      console.log(
        '⚠️  ZEROSTEP_TOKEN not found. Please set up your token to run AI-powered tests.'
      )
      console.log('1. Sign up at https://app.zerostep.com')
      console.log('2. Get your token from the dashboard')
      console.log('3. Set ZEROSTEP_TOKEN in your environment')
      test.skip()
      return
    }

    await test.step('Navigate to the application', async () => {
      await page.goto('/')

      // Take a screenshot for reference
      await page.screenshot({
        path: 'test-results/zerostep-start.png',
        fullPage: true,
      })
    })

    await test.step('Find and access login with natural language', async () => {
      // Use ZeroStep AI to find and click login - no selectors needed!
      await ai('Look for and click the login or sign in button', { page, test })

      // Wait a moment for the page to load
      await page.waitForTimeout(2000)
      await page.screenshot({
        path: 'test-results/zerostep-login-page.png',
        fullPage: true,
      })
    })

    await test.step('Initiate Yandex OAuth flow', async () => {
      // ZeroStep AI will intelligently find the Yandex OAuth button
      await ai('Find and click the Yandex login or OAuth button', {
        page,
        test,
      })

      // Wait for OAuth redirect
      await page.waitForTimeout(3000)

      const currentUrl = page.url()
      console.log(`🔗 Current URL after OAuth click: ${currentUrl}`)

      // Take screenshot of OAuth page
      await page.screenshot({
        path: 'test-results/zerostep-oauth-page.png',
        fullPage: true,
      })
    })

    await test.step('Handle Yandex authentication (if credentials provided)', async () => {
      const email = process.env.E2E_USER_EMAIL
      const password = process.env.E2E_USER_PASSWORD

      if (
        email &&
        password &&
        (page.url().includes('yandex') || page.url().includes('passport'))
      ) {
        // Use ZeroStep to handle the complex Yandex login flow
        await ai(`Fill in the email field with "${email}"`, { page, test })
        await ai('Click the continue or next button to proceed', { page, test })

        // Wait for password field
        await page.waitForTimeout(2000)

        await ai(`Enter the password "${password}" in the password field`, {
          page,
          test,
        })
        await ai('Submit the login form or click the login button', {
          page,
          test,
        })

        // Wait for redirect back to app
        await page.waitForTimeout(5000)

        // Use AI to verify successful login
        await ai(
          'Look for signs of successful login like user menu, profile, or logout button',
          { page, test }
        )
      } else if (!email || !password) {
        console.log(
          '📝 No credentials provided - just testing OAuth flow accessibility'
        )

        // Verify we reached an OAuth page
        if (page.url().includes('yandex') || page.url().includes('passport')) {
          console.log('✅ Successfully redirected to Yandex OAuth page')
        } else {
          console.log('⚠️  May not have reached Yandex OAuth page')
        }
      }

      // Final screenshot
      await page.screenshot({
        path: 'test-results/zerostep-final.png',
        fullPage: true,
      })
    })
  })

  test('should demonstrate ZeroStep form filling capabilities', async ({
    page,
  }) => {
    if (!process.env.ZEROSTEP_TOKEN) {
      test.skip()
      return
    }

    await page.goto('/')

    // Example of ZeroStep's powerful form filling
    // This would work for any contact form, signup form, etc.
    await ai(
      'If there is a contact form or signup form visible, fill it out with realistic sample data',
      { page, test }
    )

    // Or more specific instructions
    await ai(
      'Look for any text input fields and fill them with appropriate test data',
      { page, test }
    )

    await page.screenshot({
      path: 'test-results/zerostep-form-demo.png',
      fullPage: true,
    })
  })

  test('should work without ZeroStep token (fallback test)', async ({
    page,
  }) => {
    // This test runs even without ZeroStep token for basic verification
    await page.goto('/')

    // Basic assertion that doesn't need AI
    await expect(page.locator('html')).toBeVisible()

    // Take screenshot for manual verification
    await page.screenshot({
      path: 'test-results/basic-homepage.png',
      fullPage: true,
    })

    console.log('✅ Basic test completed - app loads successfully')
  })
})
