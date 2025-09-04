import { test, expect } from '@playwright/test'

test.describe('Authentication Tests', () => {
  test('should login test user', async ({ page }) => {
    test('test', async ({ page }) => {
      await page.goto('http://localhost:3000/api/auth/signin')
      await page
        .getByRole('button', { name: 'Sign in with Test User (Dev' })
        .click()
      await page.getByText('Kadiel').click()
      await page.getByText('Test').click()
      await page.getByRole('button', { name: 'Agents' }).click()
    })
  })
})
