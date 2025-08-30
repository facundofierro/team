import React from 'react'
import { Container, Grid, GridItem, Section, SectionHeader } from './index'

export function LayoutExample() {
  return (
    <div className="min-h-screen bg-teamhub-background">
      {/* Hero Section */}
      <Section padding="2xl" background="gradient">
        <Container size="lg">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Welcome to TeamHub
            </h1>
            <p className="text-xl sm:text-2xl opacity-90 max-w-3xl mx-auto">
              The ultimate AI agent management platform for enterprise teams
            </p>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section padding="xl" background="light">
        <Container size="lg">
          <SectionHeader
            title="Powerful Features"
            subtitle="Everything you need to manage AI agents at scale"
            align="center"
            size="lg"
          />

          <Grid cols={3} gap="lg">
            <GridItem>
              <div className="bg-white p-6 rounded-lg shadow-md border border-teamhub-border">
                <h3 className="text-xl font-semibold text-teamhub-secondary mb-3">
                  AI Agent Management
                </h3>
                <p className="text-teamhub-muted">
                  Create, configure, and monitor AI agents with ease
                </p>
              </div>
            </GridItem>

            <GridItem>
              <div className="bg-white p-6 rounded-lg shadow-md border border-teamhub-border">
                <h3 className="text-xl font-semibold text-teamhub-secondary mb-3">
                  Multi-Tenant Support
                </h3>
                <p className="text-teamhub-muted">
                  Secure, isolated environments for different organizations
                </p>
              </div>
            </GridItem>

            <GridItem>
              <div className="bg-white p-6 rounded-lg shadow-md border border-teamhub-border">
                <h3 className="text-xl font-semibold text-teamhub-secondary mb-3">
                  Real-time Analytics
                </h3>
                <p className="text-teamhub-muted">
                  Monitor performance and track ROI in real-time
                </p>
              </div>
            </GridItem>
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section padding="lg" background="teamhub-primary">
        <Container size="md">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using TeamHub to transform their
              AI operations
            </p>
            <button className="bg-teamhub-hot-pink hover:bg-teamhub-hot-pink/90 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors">
              Start Free Trial
            </button>
          </div>
        </Container>
      </Section>
    </div>
  )
}
