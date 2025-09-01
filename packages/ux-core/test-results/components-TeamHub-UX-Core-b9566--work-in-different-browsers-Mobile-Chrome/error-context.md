# Test info

- Name: TeamHub UX Core Components >> Cross-browser Compatibility >> Components should work in different browsers
- Location: /Users/facundofierro/git/team/packages/ux-core/tests/components.spec.ts:282:9

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByText('TeamHub UX Core - Component Test Suite')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('TeamHub UX Core - Component Test Suite')

    at /Users/facundofierro/git/team/packages/ux-core/tests/components.spec.ts:284:78
```

# Page snapshot

```yaml
- banner:
  - text: T TeamHub
  - button "Get Started"
  - button "🇺🇸 English":
    - text: 🇺🇸 English
    - img
- img
- text: AI Business Consultant Online • Ready to help
- button:
  - img
- text: Hi! I'm your AI business transformation consultant. I can help you understand how TeamHub can revolutionize your operations and deliver guaranteed ROI. What would you like to explore first?
- button "Analyze My Business"
- button "Show Me Examples"
- button "Calculate My Savings"
- button "How It Works"
- text: Powered by TeamHub AI
- heading "AI Is No Longer Optional For Success" [level=1]
- paragraph: The competitive landscape has shifted. Smart businesses are leveraging AI to cut costs by 25%, deliver projects 40% faster, and scale without limits. The question isn't whether to adopt AI —it's how quickly you can implement it.
- heading "The Opportunity Window Is Narrowing" [level=3]
- paragraph: Industry leaders have already gained significant advantages through AI implementation. The gap between AI-enabled and traditional businesses grows wider each month, making early adoption crucial for maintaining competitive position.
- button "Get Free AI Analysis Now"
- heading "AI Implementation Is No Longer Optional" [level=2]
- heading "The Competitive Reality" [level=3]
- paragraph: Industry leaders are gaining 15-30% operational advantages with AI
- list:
  - listitem: Industry leaders are gaining 15-30% operational advantages with AI
  - listitem: Market demands are shifting toward AI-enabled organizations
  - listitem: Top talent increasingly chooses AI-forward companies
- heading "The AI Advantage" [level=3]
- paragraph: Transform your business with intelligent automation
- list:
  - listitem: 40% reduction in project delivery time
  - listitem: 25% cost savings through intelligent automation
  - listitem: Real-time insights for better decision making
- heading "The TeamHub Guarantee" [level=2]
- paragraph: We don't just implement AI - we transform your entire operation into an intelligent, self-optimizing system that delivers measurable ROI from day one.
- text: 🚀
- heading "90-Day Implementation" [level=3]
- paragraph: From zero to fully operational AI agents
- text: 💰
- heading "Guaranteed ROI" [level=3]
- paragraph: Minimum 3x return on investment or money back
- text: 🛡️
- heading "Zero Risk Start" [level=3]
- paragraph: Free analysis and proof of concept
- heading "Platform Capabilities" [level=2]
- text: 🤖
- heading "AI Agent Management" [level=3]
- paragraph: Create, configure, and orchestrate AI agents at scale with intuitive tools and workflows.
- text: 🏢
- heading "Multi-Tenant Architecture" [level=3]
- paragraph: Secure, isolated environments for each organization with enterprise-grade security.
- text: 👥
- heading "Real-time Collaboration" [level=3]
- paragraph: Teams can work together seamlessly with shared workspaces and real-time updates.
- text: 📊
- heading "Advanced Analytics" [level=3]
- paragraph: Comprehensive insights into agent performance, usage patterns, and ROI metrics.
- text: 🔗
- heading "Integration Hub" [level=3]
- paragraph: Connect with existing tools and systems through our extensive API ecosystem.
- text: 🔒
- heading "Enterprise Security" [level=3]
- paragraph: SOC 2 compliance, role-based access control, and audit logging for enterprise use.
- heading "Proven Results Across Industries" [level=2]
- text: 40% Faster Project Delivery 25% Cost Reduction 90% Process Automation 3x ROI in First Year
- blockquote: "\"TeamHub transformed our AI operations from reactive to predictive. We're now managing 50+ AI agents with 40% faster project delivery and 25% lower costs. The platform handles everything from agent deployment to performance monitoring.\""
- text: Sarah Chen, CTO TechCorp Industries
- heading "How TeamHub Works" [level=2]
- paragraph: Get started with AI agents in three simple steps
- text: "1"
- heading "Connect & Configure" [level=3]
- paragraph: Connect your data sources and configure your AI agents with our intuitive interface.
- text: "2"
- heading "Deploy & Monitor" [level=3]
- paragraph: Deploy agents across your organization and monitor their performance in real-time.
- text: "3"
- heading "Scale & Optimize" [level=3]
- paragraph: Scale your AI operations and continuously optimize performance based on insights.
- heading "Ready to Transform Your Business?" [level=2]
- paragraph: Join the AI revolution and start seeing results in 90 days or less
- heading "Get Free Analysis" [level=3]
- paragraph: Our AI experts will analyze your business and provide a customized implementation plan.
- button "Start Free Analysis"
- heading "Schedule Demo" [level=3]
- paragraph: See TeamHub in action with a personalized demo of our platform capabilities.
- button "Book Demo"
- alert
```

# Test source

```ts
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
  277 |       expect(errors).toHaveLength(0)
  278 |     })
  279 |   })
  280 |
  281 |   test.describe('Cross-browser Compatibility', () => {
  282 |     test('Components should work in different browsers', async ({ page }) => {
  283 |       await page.goto('/')
> 284 |       await expect(page.getByText('TeamHub UX Core - Component Test Suite')).toBeVisible()
      |                                                                              ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
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