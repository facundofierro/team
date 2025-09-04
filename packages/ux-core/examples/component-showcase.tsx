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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../src/components/shadcn/select'
import { Separator } from '../src/components/shadcn/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../src/components/shadcn/dialog'

export default function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-teamhub-background p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-teamhub-secondary mb-4">
            Agelum UX Core Components
          </h1>
          <p className="text-lg text-teamhub-muted max-w-2xl mx-auto">
            A comprehensive showcase of all available components with Agelum
            design system colors. This demonstrates the visual consistency and
            component library available for development.
          </p>
        </div>

        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-teamhub-secondary mb-6">
            Design System Colors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <ColorSwatch name="Primary" color="teamhub-primary" hex="#8A548C" />
            <ColorSwatch
              name="Secondary"
              color="teamhub-secondary"
              hex="#3B2146"
            />
            <ColorSwatch name="Accent" color="teamhub-accent" hex="#A091DA" />
            <ColorSwatch
              name="Highlight"
              color="teamhub-highlight"
              hex="#F45584"
            />
            <ColorSwatch name="Success" color="teamhub-success" hex="#E6D24D" />
            <ColorSwatch name="Warning" color="teamhub-warning" hex="#847F42" />
            <ColorSwatch name="Muted" color="teamhub-muted" hex="#9B8FA7" />
            <ColorSwatch
              name="Background"
              color="teamhub-background"
              hex="#F4F3F5"
            />
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-teamhub-secondary mb-6">
            Buttons
          </h2>
          <Card className="bg-white border-teamhub-border">
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>
                All available button styles and states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="default"
                  className="bg-teamhub-primary hover:bg-teamhub-primary/90"
                >
                  Primary Button
                </Button>
                <Button
                  variant="secondary"
                  className="bg-teamhub-secondary hover:bg-teamhub-secondary/90"
                >
                  Secondary Button
                </Button>
                <Button
                  variant="outline"
                  className="border-teamhub-accent text-teamhub-accent hover:bg-teamhub-accent hover:text-white"
                >
                  Outline Button
                </Button>
                <Button
                  variant="ghost"
                  className="text-teamhub-highlight hover:bg-teamhub-highlight hover:text-white"
                >
                  Ghost Button
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Destructive Button
                </Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="sm"
                  className="bg-teamhub-success text-black hover:bg-teamhub-success/90"
                >
                  Small Button
                </Button>
                <Button
                  size="default"
                  className="bg-teamhub-warning text-white hover:bg-teamhub-warning/90"
                >
                  Default Button
                </Button>
                <Button
                  size="lg"
                  className="bg-teamhub-highlight hover:bg-teamhub-highlight/90"
                >
                  Large Button
                </Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button
                  disabled
                  className="bg-teamhub-muted text-teamhub-muted-foreground"
                >
                  Disabled Button
                </Button>
                <Button className="bg-teamhub-accent hover:bg-teamhub-accent/90">
                  <span className="mr-2">🚀</span>
                  With Icon
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-teamhub-secondary mb-6">
            Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white border-teamhub-border hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-teamhub-primary to-teamhub-accent text-white">
                <CardTitle>Primary Card</CardTitle>
                <CardDescription className="text-white/80">
                  Beautiful gradient header with primary colors
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-teamhub-muted">
                  This card demonstrates the primary color scheme with a
                  gradient header and proper content spacing.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-teamhub-border hover:shadow-lg transition-shadow">
              <CardHeader className="bg-teamhub-secondary text-white">
                <CardTitle>Secondary Card</CardTitle>
                <CardDescription className="text-white/80">
                  Dark purple theme for secondary content
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-teamhub-muted">
                  Secondary cards use the darker purple theme for important but
                  non-primary content sections.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-teamhub-border hover:shadow-lg transition-shadow">
              <CardHeader className="bg-teamhub-highlight text-white">
                <CardTitle>Highlight Card</CardTitle>
                <CardDescription className="text-white/80">
                  Hot pink theme for attention-grabbing content
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-teamhub-muted">
                  Highlight cards use the vibrant pink color for content that
                  needs to stand out and draw attention.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Form Elements */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-teamhub-secondary mb-6">
            Form Elements
          </h2>
          <Card className="bg-white border-teamhub-border">
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>
                Input fields, labels, and form controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-teamhub-secondary font-medium"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    className="border-teamhub-border focus:border-teamhub-primary focus:ring-teamhub-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-teamhub-secondary font-medium"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="border-teamhub-border focus:border-teamhub-primary focus:ring-teamhub-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-teamhub-secondary font-medium"
                >
                  Role
                </Label>
                <Select>
                  <SelectTrigger className="border-teamhub-border focus:border-teamhub-primary focus:ring-teamhub-primary">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-teamhub-secondary font-medium"
                >
                  Message
                </Label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Enter your message here..."
                  className="w-full px-3 py-2 border border-teamhub-border rounded-md focus:border-teamhub-primary focus:ring-teamhub-primary focus:outline-none resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges and Status */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-teamhub-secondary mb-6">
            Badges & Status
          </h2>
          <Card className="bg-white border-teamhub-border">
            <CardHeader>
              <CardTitle>Status Indicators</CardTitle>
              <CardDescription>
                Badges and status indicators for different states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-teamhub-success text-black hover:bg-teamhub-success/90">
                  Active
                </Badge>
                <Badge className="bg-teamhub-warning text-white hover:bg-teamhub-warning/90">
                  Pending
                </Badge>
                <Badge className="bg-teamhub-muted text-white hover:bg-teamhub-muted/90">
                  Inactive
                </Badge>
                <Badge className="bg-teamhub-highlight text-white hover:bg-teamhub-highlight/90">
                  New
                </Badge>
                <Badge
                  variant="outline"
                  className="border-teamhub-primary text-teamhub-primary"
                >
                  Custom
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-teamhub-success"></div>
                  <span className="text-teamhub-secondary">
                    Online - System is running normally
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-teamhub-warning"></div>
                  <span className="text-teamhub-secondary">
                    Warning - Some issues detected
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-teamhub-secondary">
                    Error - System requires attention
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Interactive Elements */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-teamhub-secondary mb-6">
            Interactive Elements
          </h2>
          <Card className="bg-white border-teamhub-border">
            <CardHeader>
              <CardTitle>Dialogs & Modals</CardTitle>
              <CardDescription>
                Interactive dialog components and modals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-teamhub-primary hover:bg-teamhub-primary/90">
                      Open Dialog
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-teamhub-border">
                    <DialogHeader>
                      <DialogTitle className="text-teamhub-secondary">
                        Sample Dialog
                      </DialogTitle>
                      <DialogDescription className="text-teamhub-muted">
                        This is a sample dialog that demonstrates the modal
                        functionality with Agelum design system colors.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-teamhub-secondary">
                        Dialog content goes here. You can include forms, lists,
                        or any other content that needs to be displayed in a
                        modal context.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  className="bg-teamhub-highlight hover:bg-teamhub-highlight/90"
                  onClick={() => alert('Button clicked!')}
                >
                  Show Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Layout Components */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-teamhub-secondary mb-6">
            Layout & Spacing
          </h2>
          <Card className="bg-white border-teamhub-border">
            <CardHeader>
              <CardTitle>Spacing & Dividers</CardTitle>
              <CardDescription>
                Layout utilities and spacing examples
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-teamhub-secondary">
                  Content with consistent spacing
                </p>
                <Separator className="bg-teamhub-border" />
                <p className="text-teamhub-muted">Separated content section</p>
                <Separator className="bg-teamhub-border" />
                <p className="text-teamhub-secondary">
                  Another content section
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-teamhub-background rounded-md border border-teamhub-border">
                  <p className="text-teamhub-secondary text-sm">Grid Item 1</p>
                </div>
                <div className="p-4 bg-teamhub-background rounded-md border border-teamhub-border">
                  <p className="text-teamhub-secondary text-sm">Grid Item 2</p>
                </div>
                <div className="p-4 bg-teamhub-background rounded-md border border-teamhub-border">
                  <p className="text-teamhub-secondary text-sm">Grid Item 3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-teamhub-border">
          <p className="text-teamhub-muted">
            Agelum UX Core Component Library • Built with shadcn/ui and Tailwind
            CSS
          </p>
        </footer>
      </div>
    </div>
  )
}

function ColorSwatch({
  name,
  color,
  hex,
}: {
  name: string
  color: string
  hex: string
}) {
  return (
    <div className="text-center">
      <div
        className={`w-20 h-20 rounded-lg mx-auto mb-2 shadow-md border border-teamhub-border`}
        style={{ backgroundColor: hex }}
      ></div>
      <p className="font-medium text-teamhub-secondary text-sm">{name}</p>
      <p className="text-teamhub-muted text-xs font-mono">{hex}</p>
    </div>
  )
}
