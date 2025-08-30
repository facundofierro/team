import React from 'react'
import { HeroSection, Headline, SubHeadline, CTAButtons } from './index'

export function HeroExample() {
  const ctaButtons = [
    {
      text: 'Get Free AI Analysis Now',
      onClick: () => console.log('Get Free AI Analysis clicked'),
      variant: 'primary' as const,
      size: 'lg' as const,
    },
    {
      text: 'Watch Demo',
      onClick: () => console.log('Watch Demo clicked'),
      variant: 'outline' as const,
      size: 'lg' as const,
    },
  ]

  return (
    <div className="min-h-screen bg-teamhub-background">
      {/* Main Hero Section */}
      <HeroSection
        background="dark"
        fullHeight
        padding="2xl"
        overlay
        overlayColor="rgba(59, 33, 70, 0.8)"
      >
        <div className="space-y-8">
          {/* Main Headline */}
          <Headline
            size="xl"
            color="white"
            emphasis="highlight"
            emphasisColor="teamhub-hot-pink"
            maxWidth="xl"
          >
            AI Is No Longer Optional For Success
          </Headline>

          {/* Sub Headline */}
          <SubHeadline size="lg" color="white" maxWidth="xl">
            The competitive landscape has shifted. Smart businesses are
            leveraging AI to cut costs by 25%, deliver projects 40% faster, and
            scale without limits. The question isn't whether to adopt AI — it's
            how quickly you can implement it.
          </SubHeadline>

          {/* CTA Buttons */}
          <div className="pt-8">
            <CTAButtons
              buttons={ctaButtons}
              layout="stacked"
              align="center"
              spacing="lg"
            />
          </div>
        </div>
      </HeroSection>

      {/* Information Card Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-teamhub-secondary to-teamhub-secondary/80 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Opportunity Window Is Narrowing
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Industry leaders have already gained significant advantages
              through AI implementation. The gap between AI-enabled and
              traditional businesses grows wider each month, making early
              adoption crucial for maintaining competitive position.
            </p>
            <CTAButtons
              buttons={[
                {
                  text: 'Get Free AI Analysis Now',
                  onClick: () => console.log('Card CTA clicked'),
                  variant: 'primary',
                  size: 'lg',
                },
              ]}
              align="center"
            />
          </div>
        </div>
      </div>

      {/* Alternative Hero Styles */}
      <HeroSection
        background="gradient"
        padding="xl"
        overlay
        overlayColor="rgba(138, 84, 140, 0.1)"
      >
        <div className="space-y-6">
          <Headline
            size="lg"
            color="white"
            emphasis="highlight"
            emphasisColor="teamhub-accent"
            maxWidth="lg"
          >
            Transform Your Business with AI
          </Headline>
          <SubHeadline size="md" color="white" maxWidth="lg">
            Join the AI revolution and stay ahead of the competition
          </SubHeadline>
          <div className="pt-6">
            <CTAButtons
              buttons={[
                {
                  text: 'Start Free Trial',
                  onClick: () => console.log('Start Free Trial clicked'),
                  variant: 'secondary',
                  size: 'md',
                },
              ]}
              align="center"
            />
          </div>
        </div>
      </HeroSection>

      {/* Minimal Hero */}
      <HeroSection background="none" padding="lg" centered={false}>
        <div className="max-w-4xl">
          <Headline
            size="md"
            color="teamhub-secondary"
            emphasis="none"
            align="left"
            maxWidth="lg"
          >
            Simple and Effective
          </Headline>
          <SubHeadline
            size="sm"
            color="teamhub-muted"
            align="left"
            maxWidth="lg"
          >
            Sometimes less is more. Clean, focused messaging that gets straight
            to the point.
          </SubHeadline>
          <div className="pt-6">
            <CTAButtons
              buttons={[
                {
                  text: 'Learn More',
                  onClick: () => console.log('Learn More clicked'),
                  variant: 'ghost',
                  size: 'md',
                },
              ]}
              align="left"
            />
          </div>
        </div>
      </HeroSection>
    </div>
  )
}
