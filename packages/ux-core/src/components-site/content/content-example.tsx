import React from 'react'
import {
  Statistics,
  CompactStatistics,
  Testimonials,
  FeaturedTestimonial,
  ContactForm,
  SimpleContactForm,
} from './index'

export function ContentExample() {
  const statistics = [
    {
      id: 'faster-delivery',
      value: '40%',
      label: 'Faster Project Delivery',
      description: 'Complete projects in record time with AI-powered workflows',
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: 'teamhub-hot-pink' as const,
      trend: 'up' as const,
      trendValue: '+12% this month',
    },
    {
      id: 'cost-reduction',
      value: '25%',
      label: 'Cost Reduction',
      description: 'Significant savings through AI automation and optimization',
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
      color: 'teamhub-success' as const,
      trend: 'up' as const,
      trendValue: '+8% this month',
    },
    {
      id: 'automation',
      value: '90%',
      label: 'Process Automation',
      description: 'Automate repetitive tasks and focus on strategic work',
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      color: 'teamhub-accent' as const,
      trend: 'up' as const,
      trendValue: '+15% this month',
    },
    {
      id: 'roi',
      value: '3x',
      label: 'ROI in First Year',
      description: 'Proven return on investment within the first 12 months',
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: 'teamhub-success' as const,
      trend: 'up' as const,
      trendValue: '+22% this month',
    },
  ]

  const testimonials = [
    {
      id: 'sarah-chen',
      quote:
        "Agelum transformed our construction business from reactive to predictive. We're now completing projects 40% faster with 25% lower costs. The AI agents handle everything from procurement to workforce planning.",
      author: 'Sarah Chen',
      position: 'CEO',
      company: 'MetalCorp Industries',
      rating: 5,
      date: 'December 2024',
      featured: true,
    },
    {
      id: 'michael-rodriguez',
      quote:
        'The AI-powered analytics have given us insights we never had before. We can now predict market trends and optimize our supply chain in real-time.',
      author: 'Michael Rodriguez',
      position: 'Operations Director',
      company: 'Global Logistics Co.',
      rating: 5,
      date: 'November 2024',
    },
    {
      id: 'emily-watson',
      quote:
        'Implementing Agelum was seamless. The ROI was immediate, and the support team was incredibly helpful throughout the entire process.',
      author: 'Emily Watson',
      position: 'CTO',
      company: 'TechStart Solutions',
      rating: 5,
      date: 'October 2024',
    },
  ]

  const contactFields = [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text' as const,
      placeholder: 'Enter your full name',
      required: true,
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email' as const,
      placeholder: 'your.email@example.com',
      required: true,
    },
    {
      id: 'company',
      label: 'Company',
      type: 'text' as const,
      placeholder: 'Your company name',
      required: false,
    },
    {
      id: 'industry',
      label: 'Industry',
      type: 'select' as const,
      placeholder: 'Select your industry',
      required: true,
      options: [
        { value: 'construction', label: 'Construction' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'logistics', label: 'Logistics & Transport' },
        { value: 'retail', label: 'Retail & E-commerce' },
        { value: 'technology', label: 'Technology' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      id: 'project-size',
      label: 'Project Size',
      type: 'radio' as const,
      required: true,
      options: [
        { value: 'small', label: 'Small (1-50 employees)' },
        { value: 'medium', label: 'Medium (51-200 employees)' },
        { value: 'large', label: 'Large (200+ employees)' },
      ],
    },
    {
      id: 'message',
      label: 'Project Details',
      type: 'textarea' as const,
      placeholder: 'Tell us about your project, challenges, and goals...',
      required: true,
      validation: {
        minLength: 20,
        message: 'Please provide more details about your project',
      },
    },
    {
      id: 'newsletter',
      label: 'Subscribe to our newsletter',
      type: 'checkbox' as const,
      required: false,
    },
  ]

  const handleContactSubmit = async (data: Record<string, any>) => {
    console.log('Contact form submitted:', data)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert("Thank you for your message! We'll get back to you soon.")
  }

  const handleSimpleContactSubmit = async (data: {
    name: string
    email: string
    message: string
  }) => {
    console.log('Simple contact form submitted:', data)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert("Thank you for your message! We'll get back to you soon.")
  }

  return (
    <div className="min-h-screen bg-teamhub-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Statistics Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-teamhub-secondary mb-4">
              Proven Results Across Industries
            </h2>
            <p className="text-lg text-teamhub-muted max-w-3xl mx-auto">
              Real data from companies that have transformed their operations
              with Agelum
            </p>
          </div>

          <Statistics
            statistics={statistics}
            layout="grid"
            cols={4}
            gap="lg"
            size="lg"
            showIcons
            showTrends
          />
        </div>

        {/* Compact Statistics */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-teamhub-secondary mb-4">
              Quick Stats
            </h3>
          </div>

          <CompactStatistics
            statistics={statistics.slice(0, 2)}
            layout="horizontal"
            showIcons
          />
        </div>

        {/* Featured Testimonial */}
        <div className="mb-20">
          <FeaturedTestimonial
            testimonial={testimonials[0]}
            size="lg"
            showRating
            showDate
          />
        </div>

        {/* Testimonials Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-teamhub-secondary mb-4">
              What Our Clients Say
            </h3>
          </div>

          <Testimonials
            testimonials={testimonials}
            layout="grid"
            cols={3}
            gap="lg"
            size="md"
            showRating
            showDate
          />
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-teamhub-secondary mb-4">
              Client Success Stories
            </h3>
          </div>

          <Testimonials
            testimonials={testimonials}
            layout="carousel"
            size="md"
            showRating
            showDate
          />
        </div>

        {/* Advanced Contact Form */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-teamhub-secondary mb-4">
              Get Your Custom AI Analysis
            </h3>
            <p className="text-lg text-teamhub-muted max-w-2xl mx-auto">
              Tell us about your business and we\'ll create a personalized AI
              transformation plan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <ContactForm
              fields={contactFields}
              title="Custom AI Analysis Request"
              subtitle="Fill out the form below and our AI consultants will create a personalized transformation plan for your business."
              submitText="Get My AI Analysis"
              onSubmit={handleContactSubmit}
              layout="grid"
              cols={2}
              size="md"
            />
          </div>
        </div>

        {/* Simple Contact Form */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-teamhub-secondary mb-4">
              Have Questions?
            </h3>
          </div>

          <div className="max-w-2xl mx-auto">
            <SimpleContactForm
              title="Get in Touch"
              subtitle="We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible."
              onSubmit={handleSimpleContactSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
