# PostHog Analytics Implementation Guide

## Overview

This document provides a comprehensive guide for the PostHog analytics implementation in TeamHub. PostHog has been integrated to replace Sentry error tracking and provide comprehensive analytics capabilities across the platform.

## Architecture

### Frontend Integration

- **PostHog SDK**: Integrated via `posthog-js` and `@posthog/react`
- **Provider Pattern**: Wrapped around the application via `PostHogProvider`
- **Analytics Hook**: Custom `useAnalytics` hook for consistent tracking
- **Error Tracking**: Replaces Sentry with PostHog error monitoring

### Backend Services

- **PostHog Core**: Main analytics platform running on port 8000
- **PostgreSQL Database**: Dedicated database for PostHog data
- **Redis Cache**: Dedicated Redis instance for PostHog caching
- **Nginx Proxy**: Routes `/posthog/*` requests to PostHog service

### Infrastructure

- **Docker Swarm**: Deployed as part of the main stack
- **Data Persistence**: Dedicated volumes for PostHog data
- **Health Monitoring**: Integrated with deployment and health check scripts

## Configuration

### Environment Variables

#### Frontend (.env.local)

```bash
# PostHog API Key (get this from your PostHog project settings)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_api_key_here

# PostHog API Host (your PostHog instance URL)
NEXT_PUBLIC_POSTHOG_HOST=https://r1.teamxagents.com/posthog
```

#### Infrastructure (.env)

```bash
# PostHog Database Password
POSTHOG_DB_PASSWORD=your_secure_password_here

# PostHog Secret Key (generate a secure random string)
POSTHOG_SECRET_KEY=your_secret_key_here

# PostHog Site URL
POSTHOG_SITE_URL=https://r1.teamxagents.com/posthog
```

### Docker Configuration

The PostHog services are defined in `infrastructure/docker/docker-stack.yml`:

```yaml
# PostHog Analytics Platform
posthog:
  image: posthog/posthog:latest
  environment:
    - POSTGRES_HOST=posthog_db
    - POSTGRES_DB=posthog
    - POSTGRES_USER=posthog
    - POSTGRES_PASSWORD=${POSTHOG_DB_PASSWORD}
    - REDIS_URL=redis://posthog_redis:6379
    - SECRET_KEY=${POSTHOG_SECRET_KEY}
    - SITE_URL=https://r1.teamxagents.com/posthog
    - DISABLE_SECURE_SSL_REDIRECT=true
    - NODE_ENV=production
  ports:
    - '8000:8000'
  volumes:
    - posthog_data:/app/media
  depends_on:
    - posthog_db
    - posthog_redis
```

## Usage

### Basic Analytics Tracking

```typescript
import { useAnalytics } from '@/hooks/useAnalytics'

function MyComponent() {
  const { track, trackPageView, trackUserAction } = useAnalytics()

  const handleButtonClick = () => {
    // Track custom event
    track('button_clicked', { buttonId: 'submit', page: 'checkout' })

    // Track user action
    trackUserAction('submit_form', { formType: 'checkout' })
  }

  useEffect(() => {
    // Track page view
    trackPageView('checkout_page', { step: 'payment' })
  }, [])

  return <button onClick={handleButtonClick}>Submit</button>
}
```

### Error Tracking

```typescript
import { useAnalytics } from '@/hooks/useAnalytics'

function ErrorBoundary() {
  const { captureException, captureError } = useAnalytics()

  const handleError = (error: Error, errorInfo: any) => {
    // Capture exception with context
    captureException(error, {
      component: 'ErrorBoundary',
      errorInfo,
      userId: currentUser?.id,
    })
  }

  // ... error boundary logic
}
```

### Business-Specific Tracking

```typescript
const {
  trackAgentInteraction,
  trackMemoryOperation,
  trackToolUsage,
  trackConversion,
} = useAnalytics()

// Track agent interactions
trackAgentInteraction('agent-123', 'message_sent', {
  messageLength: 150,
  hasAttachments: false,
})

// Track memory operations
trackMemoryOperation('create', 'memory-456', {
  memoryType: 'conversation',
  size: 'medium',
})

// Track tool usage
trackToolUsage('web_search', 'execute', {
  query: 'AI trends 2024',
  resultsCount: 15,
})

// Track conversions
trackConversion('user_signup', 'completed', {
  source: 'landing_page',
  plan: 'pro',
})
```

## Deployment

### Initial Deployment

1. **Set Environment Variables**:

   ```bash
   export POSTHOG_DB_PASSWORD="your_secure_password"
   export POSTHOG_SECRET_KEY="your_secret_key"
   ```

2. **Deploy the Stack**:

   ```bash
   # Deploy with PostHog
   FORCE_REDEPLOY_POSTHOG=true infrastructure/scripts/deploy.sh <image_tag>

   # Or deploy all services
   FORCE_REDEPLOY_ALL=true infrastructure/scripts/deploy.sh <image_tag>
   ```

3. **Run PostHog Setup**:
   ```bash
   infrastructure/scripts/setup-posthog.sh
   ```

### PostHog Setup Commands

After deployment, run these commands to complete the setup:

```bash
# Access PostHog container
docker exec -it $(docker ps -q -f name=posthog) bash

# Run database migrations
python manage.py migrate

# Setup development environment (no sample data)
python manage.py setup_dev --no-data

# Create superuser account
python manage.py createsuperuser
```

### Verification

Check that PostHog is accessible:

- **Health Check**: `http://localhost:8000/health`
- **Web Interface**: `https://r1.teamxagents.com/posthog/`
- **Service Status**: `docker service ls --filter name=teamhub_posthog`

## Monitoring & Health Checks

### Health Check Endpoint

PostHog provides a health check endpoint at `/health` that returns:

- `200 OK` when healthy
- `503 Service Unavailable` when unhealthy

### Service Monitoring

The deployment script includes PostHog monitoring:

- Service status checking
- Health endpoint verification
- Automatic retry logic
- Service logs inspection

### Data Volume Monitoring

PostHog data is persisted in Docker volumes:

- `posthog_data`: Media files and uploads
- `posthog_db_data`: PostgreSQL database
- `posthog_redis_data`: Redis cache

## Privacy & Compliance

### GDPR Compliance

- **Data Retention**: Configurable data retention policies
- **User Consent**: Built-in consent management
- **Data Export**: User data export capabilities
- **Right to be Forgotten**: Automatic data deletion

### Privacy Settings

- **Session Recording**: Disabled in development
- **Autocapture**: Disabled in development
- **IP Anonymization**: Configurable
- **Data Masking**: Sensitive data protection

## Performance Considerations

### Frontend Impact

- **Bundle Size**: PostHog SDK adds ~50KB gzipped
- **Initialization**: Minimal impact on page load
- **Event Batching**: Automatic event batching for performance
- **Lazy Loading**: SDK loads asynchronously

### Backend Performance

- **Database Optimization**: Dedicated PostHog database
- **Caching**: Redis-based caching layer
- **Async Processing**: Non-blocking event processing
- **Resource Isolation**: Separate from main application

## Troubleshooting

### Common Issues

1. **PostHog Not Loading**:

   - Check `NEXT_PUBLIC_POSTHOG_KEY` environment variable
   - Verify PostHog service is running
   - Check browser console for errors

2. **Events Not Tracking**:

   - Verify PostHog initialization
   - Check network requests to PostHog
   - Verify API key permissions

3. **Service Not Starting**:
   - Check Docker service logs: `docker service logs teamhub_posthog`
   - Verify environment variables
   - Check resource constraints

### Debug Mode

Enable debug mode in development:

```typescript
// In PostHog configuration
loaded: (posthog) => {
  if (process.env.NODE_ENV === 'development') {
    posthog.debug()
  }
}
```

### Logs

View PostHog service logs:

```bash
# Service logs
docker service logs teamhub_posthog

# Container logs
docker logs $(docker ps -q -f name=posthog)
```

## Migration from Sentry

### What Was Removed

- `@sentry/nextjs` dependency
- Sentry configuration files
- Sentry error boundaries
- Sentry build plugin

### What Was Replaced

- **Error Tracking**: PostHog exception capture
- **Performance Monitoring**: PostHog performance insights
- **User Context**: PostHog user identification
- **Session Tracking**: PostHog session recording

### Migration Benefits

- **Unified Platform**: Single platform for analytics and monitoring
- **Better Integration**: Native React integration
- **Enhanced Analytics**: Beyond just error tracking
- **Cost Optimization**: Single service instead of multiple

## Future Enhancements

### Planned Features

- **A/B Testing**: Built-in experimentation platform
- **Feature Flags**: Dynamic feature management
- **Cohort Analysis**: Advanced user segmentation
- **Funnel Analysis**: Conversion optimization
- **Heatmaps**: User behavior visualization

### Integration Opportunities

- **Slack Notifications**: Alert integration
- **Webhook Support**: External system integration
- **API Access**: Programmatic data access
- **Custom Dashboards**: Business-specific analytics
- **Data Export**: Integration with data warehouses

## Support & Resources

### Documentation

- [PostHog Documentation](https://posthog.com/docs)
- [React Integration Guide](https://posthog.com/docs/libraries/react)
- [JavaScript SDK Reference](https://posthog.com/docs/libraries/js)

### Community

- [PostHog Community](https://github.com/PostHog/posthog)
- [Discord Community](https://discord.gg/posthog)
- [GitHub Discussions](https://github.com/PostHog/posthog/discussions)

### TeamHub Integration

- **Analytics Hook**: `src/hooks/useAnalytics.ts`
- **PostHog Provider**: `src/components/providers/PostHogProvider.tsx`
- **Configuration**: `src/lib/posthog.ts`
- **Deployment Scripts**: `infrastructure/scripts/`

## Conclusion

The PostHog implementation provides TeamHub with a comprehensive analytics and monitoring solution that replaces Sentry while adding powerful user behavior insights. The implementation follows TeamHub's established patterns for infrastructure, deployment, and code organization.

Key benefits include:

- **Unified Platform**: Single service for analytics and monitoring
- **Developer Experience**: Easy-to-use hooks and utilities
- **Scalability**: Docker-based infrastructure
- **Privacy**: GDPR-compliant data handling
- **Performance**: Minimal impact on application performance

For questions or issues, refer to the troubleshooting section or contact the development team.
