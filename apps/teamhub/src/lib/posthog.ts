import posthog from 'posthog-js'

// PostHog configuration
export const POSTHOG_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
  apiHost:
    process.env.NEXT_PUBLIC_POSTHOG_HOST ||
    'https://r1.teamxagents.com/posthog',
  // Disable in development by default
  autocapture: process.env.NODE_ENV === 'production',
  capture_pageview: true,
  capture_pageleave: true,
  // Privacy settings
  disable_session_recording: process.env.NODE_ENV === 'development',
  // GDPR compliance
  opt_out_capturing_by_default: false,
}

// Initialize PostHog on the client side
export const initPostHog = () => {
  if (typeof window !== 'undefined' && POSTHOG_CONFIG.apiKey) {
    posthog.init(POSTHOG_CONFIG.apiKey, {
      api_host: POSTHOG_CONFIG.apiHost,
      autocapture: POSTHOG_CONFIG.autocapture,
      capture_pageview: POSTHOG_CONFIG.capture_pageview,
      capture_pageleave: POSTHOG_CONFIG.capture_pageleave,
      disable_session_recording: POSTHOG_CONFIG.disable_session_recording,
      opt_out_capturing_by_default: POSTHOG_CONFIG.opt_out_capturing_by_default,
    })
  }
  return posthog
}

// Get PostHog instance
export const getPostHog = () => {
  if (typeof window !== 'undefined') {
    return posthog
  }
  return null
}

// Utility functions for tracking
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  const posthog = getPostHog()
  if (posthog) {
    posthog.capture(event, properties)
  }
}

export const identifyUser = (
  userId: string,
  properties?: Record<string, any>
) => {
  const posthog = getPostHog()
  if (posthog) {
    posthog.identify(userId, properties)
  }
}

export const setUserProperties = (properties: Record<string, any>) => {
  const posthog = getPostHog()
  if (posthog) {
    posthog.people.set(properties)
  }
}

export const resetUser = () => {
  const posthog = getPostHog()
  if (posthog) {
    posthog.reset()
  }
}

// Error tracking functions
export const captureException = (
  error: Error,
  context?: Record<string, any>
) => {
  const posthog = getPostHog()
  if (posthog) {
    posthog.capture('exception', {
      error: error.message,
      stack: error.stack,
      ...context,
    })
  }
}

export const captureError = (
  message: string,
  context?: Record<string, any>
) => {
  const posthog = getPostHog()
  if (posthog) {
    posthog.capture('error', {
      message,
      ...context,
    })
  }
}
