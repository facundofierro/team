#!/bin/bash

set -e

echo "=== Health Check for TeamHub Application Stack ==="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if a Docker service is running and healthy
check_service() {
    local service_name="$1"
    local display_name="$2"

    if docker service ls --filter name="$service_name" --format "{{.Name}}" | grep -q "$service_name"; then
        local replicas=$(docker service ls --filter name="$service_name" --format "{{.Replicas}}")
        if echo "$replicas" | grep -q "1/1"; then
            echo -e "${GREEN}✅ $display_name is running ($replicas)${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  $display_name exists but not ready ($replicas)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ $display_name not found${NC}"
        return 1
    fi
}

# Check HTTP endpoint
check_endpoint() {
    local url="$1"
    local name="$2"

    if curl -f --connect-timeout 5 --max-time 10 "$url" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $name endpoint is accessible${NC}"
        return 0
    else
        echo -e "${RED}❌ $name endpoint is not accessible${NC}"
        return 1
    fi
}

# Infrastructure services
echo "=== Infrastructure Services ==="
check_service "teamhub_postgres" "PostgreSQL Database"
POSTGRES_STATUS=$?

check_service "teamhub_redis" "Redis Cache"
REDIS_STATUS=$?

# Application services
echo ""
echo "=== Application Services ==="
check_service "teamhub_teamhub" "TeamHub Application"
TEAMHUB_STATUS=$?

check_service "teamhub_nginx" "Nginx Reverse Proxy"
NGINX_STATUS=$?

check_service "teamhub_registry" "Docker Registry"
REGISTRY_STATUS=$?

check_service "teamhub_nextcloud" "Nextcloud"
NEXTCLOUD_STATUS=$?

check_service "teamhub_nextcloud_db" "Nextcloud Database"
NEXTCLOUD_DB_STATUS=$?

# Endpoint checks
echo ""
echo "=== Endpoint Health Checks ==="
check_endpoint "http://localhost:80" "Main Application"
MAIN_APP_STATUS=$?

check_endpoint "http://localhost:80/nextcloud/" "Nextcloud"
NEXTCLOUD_ENDPOINT_STATUS=$?

# Overall status
echo ""
echo "=== Overall Status ==="

TOTAL_SERVICES=7
HEALTHY_SERVICES=0

[ $POSTGRES_STATUS -eq 0 ] && ((HEALTHY_SERVICES++))
[ $REDIS_STATUS -eq 0 ] && ((HEALTHY_SERVICES++))
[ $TEAMHUB_STATUS -eq 0 ] && ((HEALTHY_SERVICES++))
[ $NGINX_STATUS -eq 0 ] && ((HEALTHY_SERVICES++))
[ $REGISTRY_STATUS -eq 0 ] && ((HEALTHY_SERVICES++))
[ $NEXTCLOUD_STATUS -eq 0 ] && ((HEALTHY_SERVICES++))
[ $NEXTCLOUD_DB_STATUS -eq 0 ] && ((HEALTHY_SERVICES++))

echo "Services: $HEALTHY_SERVICES/$TOTAL_SERVICES healthy"

if [ $HEALTHY_SERVICES -eq $TOTAL_SERVICES ]; then
    echo -e "${GREEN}🎉 All services are healthy!${NC}"
    exit 0
elif [ $HEALTHY_SERVICES -gt $((TOTAL_SERVICES / 2)) ]; then
    echo -e "${YELLOW}⚠️  Most services are healthy, but some issues detected${NC}"
    exit 1
else
    echo -e "${RED}❌ Critical issues detected with multiple services${NC}"
    exit 2
fi
