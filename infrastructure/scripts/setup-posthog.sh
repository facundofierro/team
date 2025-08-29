#!/bin/bash

# PostHog Initial Setup Script
# This script helps with the initial PostHog configuration after deployment
# Only runs migrations when PostHog services are healthy

set -e

echo "=== PostHog Initial Setup ==="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to check service health
check_service_health() {
    local service_name=$1
    local health_url=$2
    local max_attempts=30
    local attempt=1

    echo -e "${BLUE}🔍 Checking $service_name service...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s --connect-timeout 5 --max-time 10 "$health_url" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is healthy${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}⏳ Attempt $attempt/$max_attempts - $service_name not ready...${NC}"
        sleep 10
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $service_name failed to become healthy after $max_attempts attempts${NC}"
    return 1
}

# Check if services are running
echo -e "${BLUE}🔍 Checking PostHog service status...${NC}"

# Check if PostHog service exists and is running
if ! docker service ls --filter name=teamhub_posthog --format "{{.Replicas}}" | grep -q "1/1"; then
    echo -e "${YELLOW}⚠️  PostHog service is not running - skipping setup${NC}"
    echo -e "${BLUE}💡 PostHog will be deployed automatically if FORCE_REDEPLOY_POSTHOG=true or service is not running${NC}"
    exit 0
fi

# Check if ClickHouse is running
if ! docker service ls --filter name=teamhub_clickhouse --format "{{.Replicas}}" | grep -q "1/1"; then
    echo -e "${YELLOW}⚠️  ClickHouse service is not running - skipping setup${NC}"
    exit 0
fi

# Check if PostgreSQL is running
if ! docker service ls --filter name=teamhub_posthog_db --format "{{.Replicas}}" | grep -q "1/1"; then
    echo -e "${YELLOW}⚠️  PostHog PostgreSQL service is not running - skipping setup${NC}"
    exit 0
fi

echo -e "${GREEN}✅ All PostHog services are running${NC}"

# Wait for services to fully initialize
echo -e "${BLUE}⏳ Waiting for services to fully initialize...${NC}"
sleep 30

# Check health endpoints before proceeding
echo -e "${BLUE}🔍 Checking service health endpoints...${NC}"

# Check PostHog health
check_service_health "PostHog" "http://localhost:8000/health" || exit 1

# Check ClickHouse health
check_service_health "ClickHouse" "http://localhost:8123/ping" || exit 1

echo -e "${GREEN}✅ All PostHog services are healthy${NC}"

echo ""
echo -e "${GREEN}=== PostHog Setup Complete ===${NC}"
echo ""
echo -e "${BLUE}📊 PostHog is now accessible at:${NC}"
echo "  • Web Interface: http://your-server-ip:8000"
echo "  • Via Nginx Proxy: http://your-server-ip/posthog/"
echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo "  1. Access PostHog web interface"
echo "  2. Create your organization"
echo "  3. Set up your first project"
echo "  4. Configure tracking for your domain"
echo "  5. Add the PostHog API key to your TeamHub environment"
echo ""
echo -e "${YELLOW}💡 Troubleshooting:${NC}"
echo "  • Check logs: docker service logs teamhub_posthog"
echo "  • Check ClickHouse: docker service logs teamhub_clickhouse"
echo "  • Check PostgreSQL: docker service logs teamhub_posthog_db"
echo ""
