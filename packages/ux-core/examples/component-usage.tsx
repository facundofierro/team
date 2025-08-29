import React from 'react'

// External shadcn/ui components (raw)
import { Button } from '../src/components/shadcn/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../src/components/shadcn/card'

// TeamHub Core components (with design system styling)
import { TeamHubButton } from '../src/core-components/teamhub-button'
import {
  TeamHubCard,
  TeamHubCardContent,
  TeamHubCardHeader,
  TeamHubCardTitle,
} from '../src/core-components/teamhub-card'

export function ComponentUsageExamples() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Component Usage Examples</h1>

      {/* External shadcn/ui Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          External shadcn/ui Components (Raw)
        </h2>
        <p className="text-muted-foreground">
          These are the base components from shadcn/ui without TeamHub styling.
        </p>

        <div className="flex gap-4 flex-wrap">
          <Button variant="default">Default Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </div>

        <Card className="w-80">
          <CardHeader>
            <CardTitle>Raw shadcn Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card uses the default shadcn/ui styling.</p>
          </CardContent>
        </Card>
      </section>

      {/* TeamHub Core Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          TeamHub Core Components (Styled)
        </h2>
        <p className="text-muted-foreground">
          These are custom components built with TeamHub design system styling.
        </p>

        <div className="flex gap-4 flex-wrap">
          <TeamHubButton variant="default">TeamHub Button</TeamHubButton>
          <TeamHubButton variant="outline">TeamHub Outline</TeamHubButton>
          <TeamHubButton variant="secondary">TeamHub Secondary</TeamHubButton>
        </div>

        <TeamHubCard className="w-80">
          <TeamHubCardHeader>
            <TeamHubCardTitle>TeamHub Styled Card</TeamHubCardTitle>
          </TeamHubCardHeader>
          <TeamHubCardContent>
            <p>
              This card uses TeamHub design system styling with custom colors
              and shadows.
            </p>
          </TeamHubCardContent>
        </TeamHubCard>
      </section>

      {/* Usage Guidelines */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage Guidelines</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">External Components</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use for rapid prototyping</li>
              <li>• When you need the base functionality</li>
              <li>• For components not yet in TeamHub core</li>
              <li>
                • Import from: <code>@/components/shadcn/</code>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">TeamHub Core Components</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use for production applications</li>
              <li>• When you need consistent TeamHub styling</li>
              <li>• For components that match your design system</li>
              <li>
                • Import from: <code>@/components/core/</code>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
