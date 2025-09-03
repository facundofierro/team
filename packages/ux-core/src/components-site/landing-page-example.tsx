import React from 'react'
import {
  HeroSection,
  Headline,
  SubHeadline,
  CTAButtons,
  GradientButton,
  FeatureGrid,
  ValuePropositionCard,
  IndustryTabSelector,
  Statistics,
  Testimonials,
  ContactForm,
  AIChatSidebarLayout,
  ChatWidget,
  ScrollTriggeredAnimation,
  StaggeredAnimation,
  ResponsiveContainer,
  Section,
  OutlineButton,
} from './index'

// Sample industry data for the tab selector
const industryData = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    description:
      'Streamline patient care and administrative processes with AI-powered automation.',
    features: [
      'Patient scheduling',
      'Medical record management',
      'Billing automation',
    ],
    metrics: {
      efficiency: '85%',
      costSavings: '$2.3M',
      timeReduction: '60%',
    },
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
      </svg>
    ),
    description:
      'Optimize financial operations and compliance with intelligent automation.',
    features: ['Risk assessment', 'Fraud detection', 'Regulatory compliance'],
    metrics: {
      efficiency: '92%',
      costSavings: '$4.1M',
      timeReduction: '75%',
    },
  },
  {
    id: 'retail',
    name: 'Retail',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
    description:
      'Enhance customer experience and optimize inventory management.',
    features: [
      'Customer service',
      'Inventory optimization',
      'Demand forecasting',
    ],
    metrics: {
      efficiency: '78%',
      costSavings: '$1.8M',
      timeReduction: '45%',
    },
  },
]

// Sample statistics data
const statsData = [
  { label: 'Organizations', value: '500+', description: 'Trust TeamHub' },
  {
    label: 'AI Agents',
    value: '10,000+',
    description: 'Successfully Deployed',
  },
  {
    label: 'Cost Savings',
    value: '$50M+',
    description: 'Generated for Clients',
  },
  {
    label: 'Efficiency Gain',
    value: '85%',
    description: 'Average Improvement',
  },
]

// Sample testimonials data
const testimonialsData = [
  {
    name: 'Sarah Johnson',
    role: 'CTO, HealthTech Solutions',
    company: 'Healthcare',
    content:
      "TeamHub transformed our patient care workflow. We've reduced administrative overhead by 60% while improving patient satisfaction.",
    avatar: 'SJ',
  },
  {
    name: 'Michael Chen',
    role: 'VP of Operations, FinFlow',
    company: 'Finance',
    content:
      "The AI agents have revolutionized our compliance processes. We're saving millions annually while maintaining perfect audit scores.",
    avatar: 'MC',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Digital, RetailMax',
    company: 'Retail',
    content:
      'Customer service quality improved dramatically with AI agents. Response times dropped from hours to minutes.',
    avatar: 'ER',
  },
]

export function LandingPageExample() {
  const handleGetStarted = () => {
    console.log('Get Started clicked')
  }

  const handleLearnMore = () => {
    console.log('Learn More clicked')
  }

  const handleContact = (data: any) => {
    console.log('Contact form submitted:', data)
  }

  return (
    <AIChatSidebarLayout
      chatPanel={
        <ChatWidget
          title="AI Business Consultant"
          subtitle="Ask me about TeamHub solutions"
          inputPlaceholder="How can AI automation help my business?"
        />
      }
    >
      {/* Hero Section */}
      <HeroSection background="gradient" fullHeight padding="2xl">
        <ScrollTriggeredAnimation animation="fadeIn" delay={200}>
          <Headline size="2xl" emphasis="highlight" emphasisColor="pink">
            Transform Your Business with AI Automation
          </Headline>
        </ScrollTriggeredAnimation>

        <ScrollTriggeredAnimation animation="fadeIn" delay={400}>
          <SubHeadline size="lg" maxWidth="xl">
            Deploy intelligent AI agents that streamline operations, reduce
            costs, and drive growth across your organization.
          </SubHeadline>
        </ScrollTriggeredAnimation>

        <ScrollTriggeredAnimation animation="slideUp" delay={600}>
          <CTAButtons
            buttons={[
              {
                text: 'Start Free Trial',
                onClick: handleGetStarted,
                variant: 'primary',
                size: 'xl',
              },
              {
                text: 'Watch Demo',
                onClick: handleLearnMore,
                variant: 'outline',
                size: 'xl',
              },
            ]}
            layout="horizontal"
            align="center"
            spacing="lg"
          />
        </ScrollTriggeredAnimation>
      </HeroSection>

      {/* Industry Solutions Section */}
      <Section className="py-20 bg-white">
        <ResponsiveContainer maxWidth="2xl" padding="lg">
          <ScrollTriggeredAnimation animation="fadeIn">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-teamhub-secondary mb-4">
                Industry-Specific Solutions
              </h2>
              <p className="text-xl text-teamhub-muted max-w-3xl mx-auto">
                Tailored AI automation for your industry. See how leading
                organizations are transforming their operations.
              </p>
            </div>
          </ScrollTriggeredAnimation>

          <IndustryTabSelector
            tabs={industryData.map((industry) => ({
              id: industry.id,
              name: industry.name,
              icon: industry.icon,
              description: industry.description,
              content: (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ValuePropositionCard
                    title="Efficiency Gain"
                    description="Streamline operations and eliminate bottlenecks"
                    metric={{
                      value: industry.metrics.efficiency,
                      label: 'Average improvement',
                    }}
                    icon={
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    }
                    variant="gradient"
                  />

                  <ValuePropositionCard
                    title="Cost Savings"
                    description="Reduce operational costs significantly"
                    metric={{
                      value: industry.metrics.costSavings,
                      label: 'Annual reduction',
                    }}
                    icon={
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    }
                    variant="gradient"
                  />

                  <ValuePropositionCard
                    title="Time Reduction"
                    description="Accelerate processes and decision making"
                    metric={{
                      value: industry.metrics.timeReduction,
                      label: 'Faster execution',
                    }}
                    icon={
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    }
                    variant="gradient"
                  />
                </div>
              ),
            }))}
            variant="pills"
            size="lg"
            showDescription={true}
            animated={true}
          />
        </ResponsiveContainer>
      </Section>

      {/* Statistics Section */}
      <Section className="py-20 bg-gradient-to-br from-teamhub-highlight/5 to-teamhub-accent/5">
        <ResponsiveContainer maxWidth="2xl" padding="lg">
          <StaggeredAnimation animation="slideUp" staggerDelay={150}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-teamhub-secondary mb-4">
                Proven Results
              </h2>
              <p className="text-xl text-teamhub-muted">
                Join hundreds of organizations already transforming their
                operations
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statsData.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-teamhub-highlight mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-teamhub-secondary mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-teamhub-muted">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </StaggeredAnimation>
        </ResponsiveContainer>
      </Section>

      {/* Testimonials Section */}
      <Section className="py-20 bg-white">
        <ResponsiveContainer maxWidth="2xl" padding="lg">
          <ScrollTriggeredAnimation animation="fadeIn">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-teamhub-secondary mb-4">
                What Our Clients Say
              </h2>
              <p className="text-xl text-teamhub-muted">
                Real stories from real organizations
              </p>
            </div>
          </ScrollTriggeredAnimation>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <ScrollTriggeredAnimation
                key={index}
                animation="slideUp"
                delay={index * 200}
              >
                <div className="bg-gradient-to-br from-teamhub-background to-white border border-teamhub-border/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teamhub-highlight to-teamhub-accent rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-teamhub-secondary">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-teamhub-muted">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-teamhub-muted leading-relaxed mb-4">
                    "{testimonial.content}"
                  </p>
                  <div className="text-sm text-teamhub-accent font-medium">
                    {testimonial.company} Industry
                  </div>
                </div>
              </ScrollTriggeredAnimation>
            ))}
          </div>
        </ResponsiveContainer>
      </Section>

      {/* CTA Section */}
      <Section className="py-20 bg-gradient-to-br from-teamhub-secondary to-teamhub-primary">
        <ResponsiveContainer maxWidth="xl" padding="lg">
          <div className="text-center">
            <ScrollTriggeredAnimation animation="fadeIn">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join the AI revolution and see immediate results. Start your
                free trial today.
              </p>
            </ScrollTriggeredAnimation>

            <ScrollTriggeredAnimation animation="slideUp" delay={200}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GradientButton
                  size="xl"
                  onClick={handleGetStarted}
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  }
                  iconPosition="right"
                >
                  Start Free Trial
                </GradientButton>

                <OutlineButton
                  size="xl"
                  onClick={handleLearnMore}
                  className="text-white border-white hover:bg-white hover:text-teamhub-secondary"
                >
                  Schedule Demo
                </OutlineButton>
              </div>
            </ScrollTriggeredAnimation>
          </div>
        </ResponsiveContainer>
      </Section>

      {/* Contact Form Section */}
      <Section className="py-20 bg-white">
        <ResponsiveContainer maxWidth="lg" padding="lg">
          <ScrollTriggeredAnimation animation="fadeIn">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-teamhub-secondary mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-teamhub-muted">
                Let's discuss how AI automation can transform your organization
              </p>
            </div>
          </ScrollTriggeredAnimation>

          <ContactForm
            fields={[
              {
                id: 'name',
                label: 'Name',
                type: 'text',
                required: true,
                placeholder: 'Your full name',
              },
              {
                id: 'email',
                label: 'Email',
                type: 'email',
                required: true,
                placeholder: 'your.email@company.com',
              },
              {
                id: 'message',
                label: 'Message',
                type: 'textarea',
                required: true,
                placeholder: 'Tell us about your automation needs',
              },
            ]}
            onSubmit={handleContact}
          />
        </ResponsiveContainer>
      </Section>
    </AIChatSidebarLayout>
  )
}
