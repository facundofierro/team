import React from 'react'
import { Button } from '../src/components/shadcn/button'

export function ButtonExamples() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Button Component Examples</h1>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Variants</h2>
        <div className="flex gap-2 flex-wrap">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Sizes</h2>
        <div className="flex gap-2 items-center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">🚀</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">States</h2>
        <div className="flex gap-2 flex-wrap">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button className="opacity-50">Loading...</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">With Icons</h2>
        <div className="flex gap-2">
          <Button>
            <span className="mr-2">→</span>
            Next
          </Button>
          <Button variant="outline">
            <span className="mr-2">←</span>
            Previous
          </Button>
        </div>
      </div>
    </div>
  )
}
