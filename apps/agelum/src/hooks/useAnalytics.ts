'use client'

import { useCallback } from 'react'
import { usePostHog } from '@posthog/react'
import {
  trackEvent,
  identifyUser,
  setUserProperties,
  resetUser,
  captureException,
  captureError,
} from '@/lib/posthog'

export function useAnalytics() {
  const posthog = usePostHog()

  const track = useCallback(
    (event: string, properties?: Record<string, any>) => {
      if (posthog) {
        posthog.capture(event, properties)
      } else {
        // Fallback to direct tracking if PostHog context not available
        trackEvent(event, properties)
      }
    },
    [posthog]
  )

  const identify = useCallback(
    (userId: string, properties?: Record<string, any>) => {
      if (posthog) {
        posthog.identify(userId, properties)
      } else {
        identifyUser(userId, properties)
      }
    },
    [posthog]
  )

  const setProperties = useCallback(
    (properties: Record<string, any>) => {
      if (posthog) {
        posthog.people.set(properties)
      } else {
        setUserProperties(properties)
      }
    },
    [posthog]
  )

  const reset = useCallback(() => {
    if (posthog) {
      posthog.reset()
    } else {
      resetUser()
    }
  }, [posthog])

  const captureExceptionEvent = useCallback(
    (error: Error, context?: Record<string, any>) => {
      if (posthog) {
        posthog.capture('exception', {
          error: error.message,
          stack: error.stack,
          ...context,
        })
      } else {
        captureException(error, context)
      }
    },
    [posthog]
  )

  const captureErrorEvent = useCallback(
    (message: string, context?: Record<string, any>) => {
      if (posthog) {
        posthog.capture('error', {
          message,
          ...context,
        })
      } else {
        captureError(message, context)
      }
    },
    [posthog]
  )

  // Business-specific tracking functions
  const trackPageView = useCallback(
    (page: string, properties?: Record<string, any>) => {
      track('page_view', { page, ...properties })
    },
    [track]
  )

  const trackUserAction = useCallback(
    (action: string, properties?: Record<string, any>) => {
      track('user_action', { action, ...properties })
    },
    [track]
  )

  const trackFeatureUsage = useCallback(
    (feature: string, properties?: Record<string, any>) => {
      track('feature_usage', { feature, ...properties })
    },
    [track]
  )

  const trackConversion = useCallback(
    (funnel: string, step: string, properties?: Record<string, any>) => {
      track('conversion', { funnel, step, ...properties })
    },
    [track]
  )

  const trackAgentInteraction = useCallback(
    (agentId: string, action: string, properties?: Record<string, any>) => {
      track('agent_interaction', { agentId, action, ...properties })
    },
    [track]
  )

  const trackMemoryOperation = useCallback(
    (operation: string, memoryId: string, properties?: Record<string, any>) => {
      track('memory_operation', { operation, memoryId, ...properties })
    },
    [track]
  )

  const trackToolUsage = useCallback(
    (toolName: string, action: string, properties?: Record<string, any>) => {
      track('tool_usage', { toolName, action, ...properties })
    },
    [track]
  )

  const trackOrganizationAction = useCallback(
    (
      organizationId: string,
      action: string,
      properties?: Record<string, any>
    ) => {
      track('organization_action', { organizationId, action, ...properties })
    },
    [track]
  )

  return {
    // Core PostHog functions
    track,
    identify,
    setProperties,
    reset,
    captureException: captureExceptionEvent,
    captureError: captureErrorEvent,

    // Business-specific tracking
    trackPageView,
    trackUserAction,
    trackFeatureUsage,
    trackConversion,
    trackAgentInteraction,
    trackMemoryOperation,
    trackToolUsage,
    trackOrganizationAction,

    // PostHog instance for advanced usage
    posthog,
  }
}
