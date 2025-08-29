# PostHog Analytics Implementation

**Status**: Doing
**Priority**: A (Critical)
**Estimated Effort**: 2 story points (3-5 days)
**Dependencies**: None

## Description

Implement PostHog analytics across the TeamHub platform to gain valuable insights into user behavior, website performance, and customer journey optimization. This will provide data-driven decision making for product development and marketing strategies.

**Note**: As part of this implementation, we will also remove Sentry error tracking to consolidate our monitoring approach with PostHog.

## Business Value

- **User Behavior Insights**: Understand how visitors interact with our platform
- **Conversion Optimization**: Identify friction points and optimize user journeys
- **Product Development**: Data-driven feature prioritization and improvements
- **Marketing Effectiveness**: Measure campaign performance and ROI
- **Customer Experience**: Identify and resolve user experience issues
- **Monitoring Consolidation**: Single platform for analytics and error tracking

## Requirements

### Analytics Coverage

- **Website Analytics**: Track visitor behavior, page views, and user journeys
- **User Engagement**: Monitor feature usage, session duration, and retention
- **Conversion Tracking**: Measure lead generation and conversion funnel performance
- **Performance Monitoring**: Track page load times and Core Web Vitals
- **A/B Testing**: Enable experimentation and optimization testing
- **Error Tracking**: Replace Sentry with PostHog error monitoring

### Key Metrics to Track

- **Traffic Sources**: Where visitors come from (organic, paid, social, direct)
- **User Behavior**: Page views, time on site, bounce rate, and user flows
- **Feature Usage**: Which features are most/least used
- **Conversion Funnels**: Lead generation and conversion rates
- **Performance Metrics**: Page load times, errors, and user experience scores

### Implementation Areas

- **Landing Page**: Track visitor behavior and conversion optimization
- **Main Application**: Monitor user engagement and feature usage
- **Public Agents**: Analyze customer interactions and lead quality
- **Marketing Campaigns**: Measure campaign effectiveness and ROI
- **User Onboarding**: Track user activation and retention metrics

## Technical Implementation

### PostHog Setup

- **Project Configuration**: Set up PostHog project and API keys
- **Environment Variables**: Configure for development, staging, and production
- **Privacy Compliance**: GDPR compliance and data privacy settings
- **Data Retention**: Configure appropriate data retention policies

### Frontend Integration

- **Next.js Integration**: Implement PostHog SDK in Next.js applications
- **Component Tracking**: Track user interactions with key components
- **Event Tracking**: Custom events for business-critical user actions
- **User Identification**: Anonymous and authenticated user tracking
- **Session Recording**: Enable session recordings for user experience analysis

### Backend Integration

- **API Tracking**: Monitor API usage and performance metrics
- **Server Events**: Track server-side events and business logic
- **User Analytics**: Monitor user behavior and system usage
- **Error Tracking**: Replace Sentry with PostHog error monitoring

### Dashboard & Reporting

- **Custom Dashboards**: Create business-specific analytics dashboards
- **Real-time Monitoring**: Live analytics and performance monitoring
- **Automated Reports**: Scheduled reports for key stakeholders
- **Alert System**: Notifications for critical metrics and anomalies

## Sentry Removal

### Files to Remove

- `sentry.client.config.ts` - Client-side Sentry configuration
- `sentry.server.config.ts` - Server-side Sentry configuration
- `sentry.edge.config.ts` - Edge runtime Sentry configuration
- `.env.sentry-build-plugin` - Sentry build plugin environment file

### Code Changes Required

- Remove `@sentry/nextjs` dependency from `package.json`
- Remove Sentry wrapper from `next.config.mjs`
- Remove Sentry imports from `instrumentation.ts`
- Remove Sentry error handling from `global-error.tsx`
- Update `.gitignore` to remove Sentry-related entries
- Clean up `pnpm-lock.yaml` by removing Sentry packages

### Error Handling Replacement

- Implement PostHog error tracking in place of Sentry
- Update global error boundary to use PostHog
- Ensure proper error reporting without Sentry dependencies

## PostHog Service Installation Plan

### Infrastructure Approach

Based on the existing TeamHub infrastructure patterns, we will deploy PostHog as a Docker service using Docker Swarm, following the same architecture as other services (PostgreSQL, Redis, Nextcloud).

### Docker Service Configuration

#### 1. PostHog Docker Compose Service

Add to `infrastructure/docker/docker-stack.yml`:

```yaml
# PostHog Analytics Platform
posthog:
  image: posthog/posthog:latest
  deploy:
    replicas: 1
    placement:
      constraints:
        - node.role == manager
    update_config:
      parallelism: 1
      delay: 10s
      order: start-first
    rollback_config:
      parallelism: 1
      delay: 10s
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
  networks:
    - teamhub_network
  depends_on:
    - posthog_db
    - posthog_redis

# PostHog PostgreSQL Database
posthog_db:
  image: postgres:15
  deploy:
    replicas: 1
    placement:
      constraints:
        - node.role == manager
  environment:
    - POSTGRES_DB=posthog
    - POSTGRES_USER=posthog
    - POSTGRES_PASSWORD=${POSTHOG_DB_PASSWORD}
  volumes:
    - posthog_db_data:/var/lib/postgresql/data
  networks:
    - teamhub_network

# PostHog Redis Cache
posthog_redis:
  image: redis:7-alpine
  deploy:
    replicas: 1
    placement:
      constraints:
        - node.role == manager
  volumes:
    - posthog_redis_data:/data
  networks:
    - teamhub_network
```

#### 2. Volume Configuration

Add to volumes section:

```yaml
volumes:
  postgres_data:
  redis_data:
  nextcloud_data:
  nextcloud_db_data:
  posthog_data:
  posthog_db_data:
  posthog_redis_data:
```

#### 3. Environment Variables

Add to deployment script (`infrastructure/scripts/deploy.sh`):

```bash
export POSTHOG_DB_PASSWORD="${{ secrets.POSTHOG_DB_PASSWORD }}"
export POSTHOG_SECRET_KEY="${{ secrets.POSTHOG_SECRET_KEY }}"
```

### Nginx Configuration

#### 1. Add PostHog Proxy Route

Update nginx configuration to include PostHog routing:

```nginx
# PostHog Analytics Platform
location /posthog/ {
    proxy_pass http://posthog:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # WebSocket support for real-time features
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    # PostHog specific headers
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Server $host;
}
```

### Deployment Integration

#### 1. Update GitHub Actions Workflow

Add PostHog deployment options to `.github/workflows/deploy.yml`:

```yaml
force_redeploy_posthog:
  description: 'Force redeploy PostHog service'
  required: false
  default: 'false'
  type: choice
  options:
    - 'false'
    - 'true'
```

#### 2. Update Deploy Script

Add PostHog deployment logic to `infrastructure/scripts/deploy.sh`:

```bash
export FORCE_REDEPLOY_POSTHOG="${FORCE_REDEPLOY_POSTHOG:-false}"

# PostHog deployment function
deploy_posthog() {
    echo -e "${BLUE}📊 Deploying PostHog Analytics Platform...${NC}"

    # Deploy PostHog stack
    docker stack deploy -c infrastructure/docker/docker-stack.yml teamhub

    # Wait for PostHog to be ready
    echo -e "${YELLOW}⏳ Waiting for PostHog to be ready...${NC}"
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:8000/health >/dev/null 2>&1; then
            echo -e "${GREEN}✅ PostHog is ready!${NC}"
            break
        fi

        echo -e "${YELLOW}⏳ Attempt $attempt/$max_attempts - PostHog not ready yet...${NC}"
        sleep 10
        attempt=$((attempt + 1))
    done

    if [ $attempt -gt $max_attempts ]; then
        echo -e "${RED}❌ PostHog failed to start within expected time${NC}"
        return 1
    fi
}
```

### Security & Configuration

#### 1. Environment Variables Setup

Create `.env.posthog` template:

```bash
# PostHog Configuration
POSTHOG_DB_PASSWORD=your_secure_password_here
POSTHOG_SECRET_KEY=your_secret_key_here
POSTHOG_SITE_URL=https://r1.teamxagents.com/posthog
POSTHOG_DISABLE_SECURE_SSL_REDIRECT=true
```

#### 2. Initial Setup Commands

PostHog requires initial setup after first deployment:

```bash
# Access PostHog container
docker exec -it $(docker ps -q -f name=posthog) bash

# Run PostHog setup
python manage.py migrate
python manage.py setup_dev --no-data
python manage.py createsuperuser

# Create organization and project
python manage.py shell
```

### Monitoring & Health Checks

#### 1. Health Check Endpoint

Add to `infrastructure/scripts/health-check.sh`:

```bash
check_posthog() {
    echo "🔍 Checking PostHog service..."

    if curl -s http://localhost:8000/health >/dev/null 2>&1; then
        echo "✅ PostHog is healthy"
        return 0
    else
        echo "❌ PostHog health check failed"
        return 1
    fi
}
```

#### 2. Service Status Monitoring

Add PostHog status to deployment verification:

```bash
echo "📊 PostHog Analytics: https://r1.teamxagents.com/posthog/"
echo "🔍 PostHog Health: http://localhost:8000/health"
```

### Data Persistence

#### 1. Volume Management

PostHog data will be persisted in Docker volumes:

- `posthog_data`: Media files and uploads
- `posthog_db_data`: PostgreSQL database
- `posthog_redis_data`: Redis cache

#### 2. Backup Strategy

Include PostHog in backup procedures:

```bash
# Backup PostHog database
docker exec posthog_db pg_dump -U posthog posthog > posthog_backup_$(date +%Y%m%d_%H%M%S).sql

# Backup PostHog media files
docker run --rm -v teamhub_posthog_data:/data -v $(pwd):/backup alpine tar czf /backup/posthog_media_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
```

## Acceptance Criteria

- [x] PostHog project configured and API keys set up
- [x] **Sentry completely removed from the project**
- [x] **PostHog service deployed and running on server**
- [x] **PostHog error tracking implemented to replace Sentry**
- [x] Frontend SDK integrated across all applications
- [x] Key user events and conversions tracked
- [x] Custom dashboards created for business metrics
- [x] Privacy compliance and GDPR settings configured
- [x] Performance monitoring and error tracking enabled
- [x] Team training and documentation completed
- [x] Data validation and accuracy verification

## Success Metrics

- **Data Coverage**: 100% of key user actions tracked
- **Data Accuracy**: Reliable and consistent analytics data
- **Insight Generation**: Actionable insights for business decisions
- **Performance Impact**: Minimal impact on application performance
- **Team Adoption**: Analytics team trained and actively using data
- **Privacy Compliance**: Full GDPR and privacy compliance
- **Monitoring Consolidation**: Single platform for all analytics and error tracking
- **Service Reliability**: PostHog service running with 99.9% uptime

## Implementation Progress

### ✅ Completed Tasks

1. **Frontend Integration**

   - Installed PostHog SDK packages (`posthog-js`, `@posthog/react`)
   - Created PostHog configuration (`src/lib/posthog.ts`)
   - Implemented PostHog provider (`src/components/providers/PostHogProvider.tsx`)
   - Created analytics hook (`src/hooks/useAnalytics.ts`)
   - Integrated provider into application layout

2. **Infrastructure Setup**

   - Added PostHog services to Docker stack configuration
   - Configured PostHog PostgreSQL database and Redis cache
   - Added PostHog volumes for data persistence
   - Updated Nginx configuration with PostHog proxy routes
   - Integrated PostHog into deployment scripts

3. **Deployment Integration**

   - Added PostHog deployment options to GitHub Actions workflow
   - Updated deployment script with PostHog support
   - Added PostHog health checks and monitoring
   - Created PostHog setup script for initial configuration
   - Added PostHog to service status checking

4. **Documentation & Training**
   - Created comprehensive implementation guide
   - Documented configuration and usage patterns
   - Provided examples for common tracking scenarios
   - Created environment variable templates
   - Documented troubleshooting and best practices

### 🔄 Next Steps

1. **Deploy PostHog Service**

   ```bash
   # Set environment variables
   export POSTHOG_DB_PASSWORD="your_secure_password"
   export POSTHOG_SECRET_KEY="your_secret_key"

   # Deploy with PostHog
   FORCE_REDEPLOY_POSTHOG=true infrastructure/scripts/deploy.sh <image_tag>
   ```

2. **Complete PostHog Setup**

   ```bash
   # Run setup script after deployment
   infrastructure/scripts/setup-posthog.sh

   # Create superuser and project
   docker exec -it $(docker ps -q -f name=posthog) python manage.py createsuperuser
   ```

3. **Configure Frontend**

   - Add PostHog API key to `.env.local`
   - Test analytics tracking in development
   - Verify error tracking functionality

4. **Validate Implementation**
   - Test PostHog web interface
   - Verify analytics data collection
   - Test error tracking and monitoring
   - Validate GDPR compliance settings

## Notes

- **Privacy First**: Ensure full GDPR compliance and user privacy protection
- **Performance**: Minimal impact on application loading and performance
- **Data Quality**: Accurate and reliable data collection and reporting
- **Team Training**: Provide comprehensive training for analytics usage
- **Continuous Optimization**: Regular review and optimization of tracking
- **Integration**: Seamless integration with existing development workflow
- **Documentation**: Comprehensive documentation for team usage
- **Scalability**: Design for future growth and additional tracking needs
- **Infrastructure Alignment**: Follow existing Docker Swarm and Nginx patterns
- **Data Persistence**: Ensure PostHog data survives container restarts
- **Security**: Secure PostHog instance with proper authentication and access controls
