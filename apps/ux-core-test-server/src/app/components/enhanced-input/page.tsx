'use client'

import { useState } from 'react'
import { EnhancedInput } from '@teamhub/ux-core'

export default function EnhancedInputTestPage() {
  const [textValue, setTextValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [numberValue, setNumberValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')

  return (
    <div className="min-h-screen bg-bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-bg-foreground mb-6">
          Enhanced Input Component Test
        </h1>

        <div className="space-y-8">
          {/* Text Input */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Text Input
            </h2>
            <div className="space-y-4">
              <EnhancedInput
                label="Name"
                placeholder="Enter your name"
                value={textValue}
                onChange={setTextValue}
                required
              />
              <div className="text-sm text-bg-muted-foreground">
                Current value: {textValue || '(empty)'}
              </div>
            </div>
          </div>

          {/* Email Input */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Email Input
            </h2>
            <div className="space-y-4">
              <EnhancedInput
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={emailValue}
                onChange={setEmailValue}
                required
                error={
                  emailValue && !emailValue.includes('@')
                    ? 'Please enter a valid email'
                    : undefined
                }
              />
              <div className="text-sm text-bg-muted-foreground">
                Current value: {emailValue || '(empty)'}
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Password Input
            </h2>
            <div className="space-y-4">
              <EnhancedInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={passwordValue}
                onChange={setPasswordValue}
                required
              />
              <div className="text-sm text-bg-muted-foreground">
                Current value: {passwordValue ? '••••••••' : '(empty)'}
              </div>
            </div>
          </div>

          {/* Number Input */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Number Input
            </h2>
            <div className="space-y-4">
              <EnhancedInput
                label="Age"
                type="number"
                placeholder="Enter your age"
                value={numberValue}
                onChange={setNumberValue}
              />
              <div className="text-sm text-bg-muted-foreground">
                Current value: {numberValue || '(empty)'}
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Textarea
            </h2>
            <div className="space-y-4">
              <EnhancedInput
                label="Description"
                placeholder="Enter a description"
                value={textareaValue}
                onChange={setTextareaValue}
              />
              <div className="text-sm text-bg-muted-foreground">
                Current value: {textareaValue || '(empty)'}
              </div>
            </div>
          </div>

          {/* Disabled State */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Disabled State
            </h2>
            <EnhancedInput
              label="Disabled Input"
              placeholder="This input is disabled"
              value="Disabled value"
              disabled
            />
          </div>

          {/* With Icon */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              With Icon
            </h2>
            <EnhancedInput
              label="Search"
              placeholder="Search for something..."
              value=""
              onChange={() => {}}
            />
          </div>

          {/* Component Features */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Component Features
            </h2>
            <ul className="space-y-2 text-bg-muted-foreground">
              <li>
                • Multiple input types: text, email, password, number, textarea
              </li>
              <li>• Built-in validation with error messages</li>
              <li>• Helper text for additional guidance</li>
              <li>• Required field indicators</li>
              <li>• Disabled state support</li>
              <li>• Icon support for enhanced UX</li>
              <li>• Consistent TeamHub design system styling</li>
              <li>• Responsive design that works on all screen sizes</li>
              <li>• TypeScript support with strict typing</li>
            </ul>
          </div>

          {/* Test Scenarios */}
          <div className="bg-bg-card border border-bg-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-bg-foreground mb-4">
              Test Scenarios
            </h2>
            <div className="space-y-2 text-sm text-bg-muted-foreground">
              <div>
                • Type in different input fields and verify value updates
              </div>
              <div>• Test email validation with invalid formats</div>
              <div>• Verify password field masks input properly</div>
              <div>• Test number input with min/max constraints</div>
              <div>• Check textarea resizing and multi-line input</div>
              <div>• Verify disabled state prevents interaction</div>
              <div>• Test focus states and keyboard navigation</div>
              <div>• Check accessibility with screen readers</div>
              <div>• Verify responsive behavior on mobile devices</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
