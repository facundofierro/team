'use client'

import React from 'react'
import { Button } from '../src/components/shadcn/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../src/components/shadcn/card'
import { Badge } from '../src/components/shadcn/badge'
import { Input } from '../src/components/shadcn/input'
import { Label } from '../src/components/shadcn/label'

export default function SimpleDemo() {
  return (
    <div className="min-h-screen bg-teamhub-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-teamhub-secondary mb-4">
            Agelum UX Core Demo
          </h1>
          <p className="text-teamhub-muted">
            Simple demonstration of key components with Agelum design system
          </p>
        </div>

        {/* Quick Component Test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-teamhub-border">
            <CardHeader className="bg-teamhub-primary text-white">
              <CardTitle>Primary Card</CardTitle>
              <CardDescription className="text-white/80">
                Main content area
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Button className="w-full bg-teamhub-primary hover:bg-teamhub-primary/90">
                  Primary Action
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-teamhub-accent text-teamhub-accent hover:bg-teamhub-accent hover:text-white"
                >
                  Secondary Action
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-teamhub-border">
            <CardHeader className="bg-teamhub-secondary text-white">
              <CardTitle>Form Elements</CardTitle>
              <CardDescription className="text-white/80">
                Input and form components
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="demo-input"
                    className="text-teamhub-secondary"
                  >
                    Sample Input
                  </Label>
                  <Input
                    id="demo-input"
                    placeholder="Type something..."
                    className="mt-2 border-teamhub-border focus:border-teamhub-primary focus:ring-teamhub-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-teamhub-success text-black">
                    Success
                  </Badge>
                  <Badge className="bg-teamhub-warning text-white">
                    Warning
                  </Badge>
                  <Badge className="bg-teamhub-highlight text-white">New</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Color Palette */}
        <Card className="mt-8 bg-white border-teamhub-border">
          <CardHeader>
            <CardTitle className="text-teamhub-secondary">
              Color Palette
            </CardTitle>
            <CardDescription>Agelum design system colors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-teamhub-primary rounded-lg mx-auto mb-2 shadow-md"></div>
                <p className="text-sm font-medium text-teamhub-secondary">
                  Primary
                </p>
                <p className="text-xs text-teamhub-muted">#8A548C</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teamhub-secondary rounded-lg mx-auto mb-2 shadow-md"></div>
                <p className="text-sm font-medium text-teamhub-secondary">
                  Secondary
                </p>
                <p className="text-xs text-teamhub-muted">#3B2146</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teamhub-accent rounded-lg mx-auto mb-2 shadow-md"></div>
                <p className="text-sm font-medium text-teamhub-secondary">
                  Accent
                </p>
                <p className="text-xs text-teamhub-muted">#A091DA</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teamhub-highlight rounded-lg mx-auto mb-2 shadow-md"></div>
                <p className="text-sm font-medium text-teamhub-secondary">
                  Highlight
                </p>
                <p className="text-xs text-teamhub-muted">#F45584</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
