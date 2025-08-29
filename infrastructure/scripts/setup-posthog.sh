#!/bin/bash

# PostHog Initial Setup Script
# This script helps with the initial PostHog configuration after deployment

set -e

echo "=== PostHog Initial Setup ==="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for PostHog services to be ready...${NC}"
sleep 30

# Check if ClickHouse is running
echo -e "${BLUE}🔍 Checking ClickHouse service...${NC}"
if ! docker service ls --filter name=teamhub_clickhouse --format "{{.Replicas}}" | grep -q "1/1"; then
    echo -e "${RED}❌ ClickHouse service is not running${NC}"
    exit 1
fi

# Check if PostHog is running
echo -e "${BLUE}🔍 Checking PostHog service...${NC}"
if ! docker service ls --filter name=teamhub_posthog --format "{{.Replicas}}" | grep -q "1/1"; then
    echo -e "${RED}❌ PostHog service is not running${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All PostHog services are running${NC}"

# Wait a bit more for services to fully initialize
echo -e "${BLUE}⏳ Waiting for services to fully initialize...${NC}"
sleep 60

# Check PostHog health endpoint
echo -e "${BLUE}🔍 Checking PostHog health...${NC}"
if curl -s http://localhost:8000/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PostHog is healthy and ready${NC}"
else
    echo -e "${YELLOW}⚠️  PostHog health check failed, but continuing setup...${NC}"
fi

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
