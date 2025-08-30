#!/bin/bash

set -e

echo "=== Enhanced Application Deployment ==="

# Default values for selective redeployment
export FORCE_REDEPLOY_NGINX="${FORCE_REDEPLOY_NGINX:-false}"
export FORCE_REDEPLOY_TEAMHUB="${FORCE_REDEPLOY_TEAMHUB:-false}"
export FORCE_REDEPLOY_REMOTION="${FORCE_REDEPLOY_REMOTION:-false}"
export FORCE_REDEPLOY_INFRASTRUCTURE="${FORCE_REDEPLOY_INFRASTRUCTURE:-false}"
export FORCE_REDEPLOY_NEXTCLOUD="${FORCE_REDEPLOY_NEXTCLOUD:-false}"
export FORCE_REDEPLOY_POSTHOG="${FORCE_REDEPLOY_POSTHOG:-false}"
export FORCE_REDEPLOY_ALL="${FORCE_REDEPLOY_ALL:-false}"

# Backwards compatibility with old FORCE_REDEPLOY
if [ "$FORCE_REDEPLOY" = "true" ]; then
    export FORCE_REDEPLOY_ALL="true"
fi

# If FORCE_REDEPLOY_ALL is true, set all individual flags
if [ "$FORCE_REDEPLOY_ALL" = "true" ]; then
    export FORCE_REDEPLOY_NGINX="true"
    export FORCE_REDEPLOY_TEAMHUB="true"
    export FORCE_REDEPLOY_REMOTION="true"
    export FORCE_REDEPLOY_INFRASTRUCTURE="true"
    export FORCE_REDEPLOY_NEXTCLOUD="true"
    export FORCE_REDEPLOY_POSTHOG="true"
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_deployment_options() {
    echo -e "${BLUE}📋 Deployment Options:${NC}"
    echo -e "  🌐 Nginx:          ${FORCE_REDEPLOY_NGINX}"
    echo -e "  🎯 TeamHub:        ${FORCE_REDEPLOY_TEAMHUB}"
    echo -e "  🎬 Remotion:       ${FORCE_REDEPLOY_REMOTION}"
    echo -e "  🔧 PostgreSQL/Redis: ${FORCE_REDEPLOY_INFRASTRUCTURE}"
    echo -e "  ☁️ Nextcloud:      ${FORCE_REDEPLOY_NEXTCLOUD}"
    echo -e "  📊 PostHog:        ${FORCE_REDEPLOY_POSTHOG}"
    echo -e "  🔄 All Services:   ${FORCE_REDEPLOY_ALL}"
    echo ""
}

# Check disk space and warn if space is low
check_disk_space() {
    local DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    local DISK_AVAILABLE=$(df / | awk 'NR==2 {print $4}' | sed 's/%//')
    
    echo -e "${BLUE}💾 Checking disk space...${NC}"
    echo -e "  📊 Root partition: ${DISK_USAGE}% used (${DISK_AVAILABLE}% available)"
    
    if [ $DISK_USAGE -gt 85 ]; then
        echo -e "${YELLOW}⚠️  WARNING: Disk usage is ${DISK_USAGE}% - cleanup recommended!${NC}"
        echo -e "${YELLOW}💡 Consider running: docker system prune -a -f${NC}"
    elif [ $DISK_USAGE -gt 70 ]; then
        echo -e "${YELLOW}⚠️  Disk usage is ${DISK_USAGE}% - monitor space${NC}"
    else
        echo -e "${GREEN}✅ Disk space is healthy (${DISK_USAGE}%)${NC}"
    fi
}

# Check data volumes and warn about persistence
    echo -e "${BLUE}🛡️  Checking data volume safety...${NC}"

    # Check PostgreSQL data
    if docker volume ls --filter name=teamhub_postgres_data --format "{{.Name}}" | grep -q teamhub_postgres_data; then
        local POSTGRES_SIZE=$(docker system df -v | grep teamhub_postgres_data | awk '{print $3}' || echo "Unknown")
        echo -e "${GREEN}✅ PostgreSQL data volume exists (${POSTGRES_SIZE})${NC}"
    else
        echo -e "${YELLOW}⚠️  PostgreSQL data volume not found - will be created${NC}"
    fi

    # Check Redis data
    if docker volume ls --filter name=teamhub_redis_data --format "{{.Name}}" | grep -q teamhub_redis_data; then
        local REDIS_SIZE=$(docker system df -v | grep teamhub_redis_data | awk '{print $3}' || echo "Unknown")
        echo -e "${GREEN}✅ Redis data volume exists (${REDIS_SIZE})${NC}"
    else
        echo -e "${YELLOW}⚠️  Redis data volume not found - will be created${NC}"
    fi

    # Check Nextcloud data
    if docker volume ls --filter name=teamhub_nextcloud_data --format "{{.Name}}" | grep -q teamhub_nextcloud_data; then
        local NEXTCLOUD_SIZE=$(docker system df -v | grep teamhub_nextcloud_data | awk '{print $3}' || echo "Unknown")
        echo -e "${GREEN}✅ Nextcloud data volume exists (${NEXTCLOUD_SIZE})${NC}"
    else
        echo -e "${YELLOW}⚠️  Nextcloud data volume not found - will be created${NC}"
    fi

    # Check Nextcloud DB data
    if docker volume ls --filter name=teamhub_nextcloud_db_data --format "{{.Name}}" | grep -q teamhub_nextcloud_db_data; then
        local NEXTCLOUD_DB_SIZE=$(docker system df -v | grep teamhub_nextcloud_db_data | awk '{print $3}' || echo "Unknown")
        echo -e "${GREEN}✅ Nextcloud DB data volume exists (${NEXTCLOUD_DB_SIZE})${NC}"
    else
        echo -e "${YELLOW}⚠️  Nextcloud DB data volume not found - will be created${NC}"
    fi

    # Check PostHog data
    if docker volume ls --filter name=teamhub_posthog_data --format "{{.Name}}" | grep -q teamhub_posthog_data; then
        local POSTHOG_SIZE=$(docker system df -v | grep teamhub_posthog_data | awk '{print $3}' || echo "Unknown")
        echo -e "${GREEN}✅ PostHog data volume exists (${POSTHOG_SIZE})${NC}"
    else
        echo -e "${YELLOW}⚠️  PostHog data volume not found - will be created${NC}"
    fi

    # Check PostHog DB data
    if docker volume ls --filter name=teamhub_posthog_db_data --format "{{.Name}}" | grep -q teamhub_posthog_db_data; then
        local POSTHOG_DB_SIZE=$(docker system df -v | grep teamhub_posthog_db_data | awk '{print $3}' || echo "Unknown")
        echo -e "${GREEN}✅ PostHog DB data volume exists (${POSTHOG_DB_SIZE})${NC}"
    else
        echo -e "${YELLOW}⚠️  PostHog DB data volume not found - will be created${NC}"
    fi

    # Check PostHog Redis data
    if docker volume ls --filter name=teamhub_posthog_redis_data --format "{{.Name}}" | grep -q teamhub_posthog_redis_data; then
        local POSTHOG_REDIS_SIZE=$(docker system df -v | grep teamhub_posthog_redis_data | awk '{print $3}' || echo "Unknown")
        echo -e "${GREEN}✅ PostHog Redis data volume exists (${POSTHOG_REDIS_SIZE})${NC}"
    else
        echo -e "${YELLOW}⚠️  PostHog Redis data volume not found - will be created${NC}"
    fi

    # Check ClickHouse data
    if docker volume ls --filter name=teamhub_clickhouse_data --format "{{.Name}}" | grep -q teamhub_clickhouse_data; then
        local CLICKHOUSE_SIZE=$(docker system df -v | grep teamhub_clickhouse_data | awk '{print $3}' || echo "Unknown")
        echo -e "${GREEN}✅ ClickHouse data volume exists (${CLICKHOUSE_SIZE})${NC}"
    else
        echo -e "${YELLOW}⚠️  ClickHouse data volume not found - will be created${NC}"
    fi

    # Check ClickHouse logs
    if docker volume ls --filter name=teamhub_clickhouse_logs --format "{{.Name}}" | grep -q teamhub_clickhouse_logs; then
        local CLICKHOUSE_LOGS_SIZE=$(docker system df -v | grep teamhub_clickhouse_logs | awk '{print $3}' || echo "Unknown")
        echo -e "${GREEN}✅ ClickHouse logs volume exists (${CLICKHOUSE_LOGS_SIZE})${NC}"
    else
        echo -e "${YELLOW}⚠️  ClickHouse logs volume not found - will be created${NC}"
    fi

    echo -e "${GREEN}💾 Data volumes are preserved during service redeployment${NC}"
    echo ""
}

# Check service status
check_service_status() {
    local SERVICE_NAME="$1"
    local DISPLAY_NAME="$2"

    if docker service ls --filter name="$SERVICE_NAME" --format "{{.Name}}" | grep -q "$SERVICE_NAME"; then
        if docker service ls --filter name="$SERVICE_NAME" --format "{{.Replicas}}" | grep -q "1/1"; then
            echo -e "${GREEN}✅ $DISPLAY_NAME is running${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  $DISPLAY_NAME exists but not ready${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ $DISPLAY_NAME not found${NC}"
        return 1
    fi
}

# Enhanced infrastructure check
check_infrastructure_status() {
    echo -e "${BLUE}🔍 Checking infrastructure status...${NC}"

    local POSTGRES_OK=false
    local REDIS_OK=false

    if check_service_status "teamhub_postgres" "PostgreSQL"; then
        POSTGRES_OK=true
    fi

    if check_service_status "teamhub_redis" "Redis"; then
        REDIS_OK=true
    fi

    if [ "$POSTGRES_OK" = true ] && [ "$REDIS_OK" = true ]; then
        echo -e "${GREEN}✅ Infrastructure is healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ Infrastructure needs setup${NC}"
        return 1
    fi
}

# Manage nginx configuration with versioning
manage_nginx_config() {
    echo -e "${BLUE}🔧 Managing nginx configuration...${NC}"

    # Generate timestamp-based version for the config
    local CONFIG_VERSION=$(date +%Y%m%d_%H%M%S)
    local CONFIG_NAME="teamhub_nginx_config_${CONFIG_VERSION}"

    # Check if config file exists
    if [ ! -f "infrastructure/configs/nginx.conf" ]; then
        echo -e "${RED}❌ nginx.conf not found at infrastructure/configs/nginx.conf${NC}"
        exit 1
    fi

    # Remove old configs if forcing nginx redeploy
    if [ "$FORCE_REDEPLOY_NGINX" = "true" ]; then
        echo -e "${BLUE}🗑️  Removing old nginx configs due to force redeploy...${NC}"
        local OLD_CONFIGS=$(docker config ls --filter name=teamhub_nginx_config --format "{{.Name}}" || echo "")
        if [ -n "$OLD_CONFIGS" ]; then
            echo "$OLD_CONFIGS" | while read -r config; do
                if [ -n "$config" ]; then
                    echo "Removing config: $config"
                    docker config rm "$config" || true
                fi
            done
        fi
    fi

    # Create new config with versioned name
    echo -e "${BLUE}📝 Creating nginx config: $CONFIG_NAME${NC}"
    if ! docker config create "$CONFIG_NAME" infrastructure/configs/nginx.conf; then
        echo -e "${RED}❌ Failed to create nginx config${NC}"
        exit 1
    fi

    # Export the config name for use in docker-stack.yml
    export NGINX_CONFIG_NAME="$CONFIG_NAME"
    echo -e "${GREEN}✅ Created nginx config: $CONFIG_NAME${NC}"

    # Clean up old nginx configs (keep last 3)
    echo -e "${BLUE}🧹 Cleaning up old nginx configs...${NC}"
    local OLD_CONFIGS=$(docker config ls --filter name=teamhub_nginx_config_ --format "{{.Name}}" | sort -r | tail -n +4)
    if [ -n "$OLD_CONFIGS" ]; then
        echo "$OLD_CONFIGS" | while read -r config; do
            # Check if config is in use before removing
            if ! docker service ls --format "{{.Name}}" | xargs -I {} docker service inspect {} --format "{{.Spec.TaskTemplate.ContainerSpec.Configs}}" 2>/dev/null | grep -q "$config"; then
                echo -e "${BLUE}🗑️  Removing old config: $config${NC}"
                docker config rm "$config" || true
            else
                echo -e "${YELLOW}⚠️  Config $config is still in use, skipping removal${NC}"
            fi
        done
    fi
}

# Setup infrastructure with selective redeployment
setup_infrastructure() {
    echo -e "${BLUE}🔧 Checking infrastructure services...${NC}"

    # Check if we should skip infrastructure setup
    if [ "$FORCE_REDEPLOY_INFRASTRUCTURE" != "true" ] && check_infrastructure_status; then
        echo -e "${GREEN}✅ Infrastructure already healthy, skipping setup${NC}"
        return 0
    fi

    if [ "$FORCE_REDEPLOY_INFRASTRUCTURE" = "true" ]; then
        echo -e "${YELLOW}🔄 Force redeploying infrastructure services...${NC}"
    fi

    echo -e "${BLUE}📝 Infrastructure will be deployed with the full stack${NC}"
    echo -e "${GREEN}✅ Infrastructure deployment will happen in main stack deployment${NC}"
}

# Check individual service status
check_individual_service_status() {
    echo -e "${BLUE}🔍 Checking individual service status...${NC}"

    local TEAMHUB_OK=false
    local NGINX_OK=false
    local REMOTION_OK=false
    local NEXTCLOUD_OK=false
    local POSTHOG_OK=false

    if check_service_status "teamhub_teamhub" "TeamHub"; then
        TEAMHUB_OK=true
    fi

    if check_service_status "teamhub_nginx" "Nginx"; then
        NGINX_OK=true
    fi

    if check_service_status "teamhub_remotion" "Remotion"; then
        REMOTION_OK=true
    fi

    if check_service_status "teamhub_nextcloud" "Nextcloud"; then
        NEXTCLOUD_OK=true
    fi

    if check_service_status "teamhub_posthog" "PostHog"; then
        POSTHOG_OK=true
    fi

    # Return status based on force redeploy flags
    local NEEDS_DEPLOYMENT=false

    if [ "$FORCE_REDEPLOY_TEAMHUB" = "true" ] || [ "$TEAMHUB_OK" = false ]; then
        NEEDS_DEPLOYMENT=true
    fi

    if [ "$FORCE_REDEPLOY_NGINX" = "true" ] || [ "$NGINX_OK" = false ]; then
        NEEDS_DEPLOYMENT=true
    fi

    if [ "$FORCE_REDEPLOY_REMOTION" = "true" ] || [ "$REMOTION_OK" = false ]; then
        NEEDS_DEPLOYMENT=true
    fi

    if [ "$FORCE_REDEPLOY_NEXTCLOUD" = "true" ] || [ "$NEXTCLOUD_OK" = false ]; then
        NEEDS_DEPLOYMENT=true
    fi

    if [ "$FORCE_REDEPLOY_POSTHOG" = "true" ] || [ "$POSTHOG_OK" = false ]; then
        NEEDS_DEPLOYMENT=true
    fi

    if [ "$NEEDS_DEPLOYMENT" = true ]; then
        echo -e "${YELLOW}⚠️  Services need deployment based on status/force flags${NC}"
        return 1
    else
        echo -e "${GREEN}✅ All services are running and no force redeploy requested${NC}"
        return 0
    fi
}

# Deploy full application stack with selective updates
deploy_full_stack() {
    local IMAGE_TAG="$1"

    echo -e "${BLUE}🚀 Deploying application stack with selective updates...${NC}"

    # Use GitHub Container Registry image
    if [ -n "$CONTAINER_REGISTRY" ] && [ -n "$IMAGE_TAG" ]; then
        local CONTAINER_IMAGE="$CONTAINER_REGISTRY/teamhub:$IMAGE_TAG"
        echo "Using Container Registry image: $CONTAINER_IMAGE"

        # Create a temporary docker-stack.yml and update the image
        cp infrastructure/docker/docker-stack.yml ./docker-stack-temp.yml
        sed -i "s|localhost:5000/teamhub:.*|$CONTAINER_IMAGE|" ./docker-stack-temp.yml

        # Update remotion image if REMOTION_IMAGE is provided
        if [ -n "$REMOTION_IMAGE" ]; then
            echo "Using Remotion image: $REMOTION_IMAGE"
            sed -i "s|\${REMOTION_IMAGE:-.*}|$REMOTION_IMAGE|" ./docker-stack-temp.yml
        fi
    else
        echo -e "${RED}❌ Container registry or image tag not provided${NC}"
        exit 1
    fi

    # Manage nginx configuration
    manage_nginx_config

    # Deploy the full stack
    export NEXTCLOUD_ADMIN_PASSWORD="${NEXTCLOUD_ADMIN_PASSWORD}"
    export NEXTCLOUD_DB_PASSWORD="${NEXTCLOUD_DB_PASSWORD}"
    export PG_PASSWORD="${PG_PASSWORD}"
    export REMOTION_IMAGE="${REMOTION_IMAGE}"
    export POSTGRES_PGVECTOR_IMAGE="${POSTGRES_PGVECTOR_IMAGE:-${CONTAINER_REGISTRY}/postgres-pgvector:${IMAGE_TAG}}"
    export POSTHOG_DB_PASSWORD="${POSTHOG_DB_PASSWORD:-posthog123}"
    export POSTHOG_SECRET_KEY="${POSTHOG_SECRET_KEY:-your-secret-key-here}"
    export POSTHOG_CLICKHOUSE_PASSWORD="${POSTHOG_CLICKHOUSE_PASSWORD:-clickhouse123}"

    echo -e "${BLUE}🚀 Deploying application stack...${NC}"
    docker stack deploy -c ./docker-stack-temp.yml teamhub

    # Clean up temporary file
    rm -f ./docker-stack-temp.yml

    echo "⏳ Waiting for services to be ready..."
    sleep 60
}

# Wait for services with selective monitoring
wait_for_services() {
    echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"

    # Check infrastructure services first (if being deployed)
    if [ "$FORCE_REDEPLOY_INFRASTRUCTURE" = "true" ] || ! check_service_status "teamhub_postgres" "PostgreSQL" >/dev/null 2>&1; then
        echo -e "${BLUE}⏳ Waiting for PostgreSQL service...${NC}"
        for i in {1..30}; do
            if docker service ls --filter name=teamhub_postgres --format "{{.Replicas}}" | grep -q "1/1"; then
                echo -e "${GREEN}✅ PostgreSQL service is ready${NC}"
                break
            fi
            if [ $i -eq 30 ]; then
                echo -e "${RED}❌ PostgreSQL service failed to start after 30 attempts${NC}"
                docker service logs teamhub_postgres --tail 20 || true
            else
                echo "Waiting for PostgreSQL service... (attempt $i/30)"
                sleep 15
            fi
        done
    fi

    if [ "$FORCE_REDEPLOY_INFRASTRUCTURE" = "true" ] || ! check_service_status "teamhub_redis" "Redis" >/dev/null 2>&1; then
        echo -e "${BLUE}⏳ Waiting for Redis service...${NC}"
        for i in {1..15}; do
            if docker service ls --filter name=teamhub_redis --format "{{.Replicas}}" | grep -q "1/1"; then
                echo -e "${GREEN}✅ Redis service is ready${NC}"
                break
            fi
            if [ $i -eq 15 ]; then
                echo -e "${RED}❌ Redis service failed to start after 15 attempts${NC}"
                docker service logs teamhub_redis --tail 20 || true
            else
                echo "Waiting for Redis service... (attempt $i/15)"
                sleep 10
            fi
        done
    fi

    # Check teamhub service first (if being deployed)
    if [ "$FORCE_REDEPLOY_TEAMHUB" = "true" ] || ! check_service_status "teamhub_teamhub" "TeamHub" >/dev/null 2>&1; then
        echo -e "${BLUE}⏳ Waiting for TeamHub service...${NC}"
        for i in {1..15}; do
            if docker service ls --filter name=teamhub_teamhub --format "{{.Replicas}}" | grep -q "1/1"; then
                echo -e "${GREEN}✅ TeamHub service is ready${NC}"
                break
            fi
            if [ $i -eq 15 ]; then
                echo -e "${RED}❌ TeamHub service failed to start after 15 attempts${NC}"
                docker service logs teamhub_teamhub --tail 20 || true
            else
                echo "Waiting for TeamHub service... (attempt $i/15)"
                sleep 10
            fi
        done
    fi

    # Check remotion service (if being deployed)
    if [ "$FORCE_REDEPLOY_REMOTION" = "true" ] || ! check_service_status "teamhub_remotion" "Remotion" >/dev/null 2>&1; then
        echo -e "${BLUE}⏳ Waiting for Remotion service...${NC}"
        for i in {1..15}; do
            if docker service ls --filter name=teamhub_remotion --format "{{.Replicas}}" | grep -q "1/1"; then
                echo -e "${GREEN}✅ Remotion service is ready${NC}"
                break
            fi
            if [ $i -eq 15 ]; then
                echo -e "${RED}❌ Remotion service failed to start after 15 attempts${NC}"
                docker service logs teamhub_remotion --tail 20 || true
            else
                echo "Waiting for Remotion service... (attempt $i/15)"
                sleep 10
            fi
        done
    fi

    # Check nginx service last (if being deployed)
    if [ "$FORCE_REDEPLOY_NGINX" = "true" ] || ! check_service_status "teamhub_nginx" "Nginx" >/dev/null 2>&1; then
        echo -e "${BLUE}⏳ Waiting for Nginx service...${NC}"
        for i in {1..15}; do
            if docker service ls --filter name=teamhub_nginx --format "{{.Replicas}}" | grep -q "1/1"; then
                echo -e "${GREEN}✅ Nginx service is ready${NC}"
                break
            fi
            if [ $i -eq 15 ]; then
                echo -e "${RED}❌ Nginx service failed to start after 15 attempts${NC}"
                docker service logs teamhub_nginx --tail 20 || true
            else
                echo "Waiting for Nginx service... (attempt $i/15)"
                sleep 10
            fi
        done
    fi

    # Check nextcloud service (if being deployed)
    if [ "$FORCE_REDEPLOY_NEXTCLOUD" = "true" ] || ! check_service_status "teamhub_nextcloud" "Nextcloud" >/dev/null 2>&1; then
        echo -e "${BLUE}⏳ Waiting for Nextcloud service...${NC}"
        for i in {1..15}; do
            if docker service ls --filter name=teamhub_nextcloud --format "{{.Replicas}}" | grep -q "1/1"; then
                echo -e "${GREEN}✅ Nextcloud service is ready${NC}"
                break
            fi
            if [ $i -eq 15 ]; then
                echo -e "${RED}❌ Nextcloud service failed to start after 15 attempts${NC}"
                docker service logs teamhub_nextcloud --tail 20 || true
            else
                echo "Waiting for Nextcloud service... (attempt $i/15)"
                sleep 10
            fi
        done
    fi

    # Check PostHog service (if being deployed)
    if [ "$FORCE_REDEPLOY_POSTHOG" = "true" ] || ! check_service_status "teamhub_posthog" "PostHog" >/dev/null 2>&1; then
        echo -e "${BLUE}⏳ Waiting for PostHog service...${NC}"
        for i in {1..15}; do
            if docker service ls --filter name=teamhub_posthog --format "{{.Replicas}}" | grep -q "1/1"; then
                echo -e "${GREEN}✅ PostHog service is ready${NC}"
                break
            fi
            if [ $i -eq 15 ]; then
                echo -e "${RED}❌ PostHog service failed to start after 15 attempts${NC}"
                docker service logs teamhub_posthog --tail 20 || true
            else
                echo "Waiting for PostHog service... (attempt $i/15)"
                sleep 10
            fi
        done
    fi
}

# Test application endpoints
test_application() {
    echo -e "${BLUE}🧪 Testing application endpoints...${NC}"

    # Test teamhub endpoint
    if docker service ls --filter name=teamhub_teamhub --format "{{.Name}}" | grep -q teamhub_teamhub; then
        if curl -f --connect-timeout 5 --max-time 10 http://127.0.0.1:80/ >/dev/null 2>&1; then
            echo -e "${GREEN}✅ TeamHub application is accessible${NC}"
        else
            echo -e "${YELLOW}⚠️  TeamHub application may still be starting up${NC}"
        fi
    fi

    # Test nginx service
    if curl -f --connect-timeout 5 --max-time 10 http://127.0.0.1:80/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Nginx service is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Nginx service may still be starting up${NC}"
    fi

    # Test remotion endpoint
    if curl -f --connect-timeout 5 --max-time 10 http://127.0.0.1:80/remotion/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Remotion service is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Remotion service may still be starting up${NC}"
    fi

    # Test nextcloud endpoint
    if curl -f --connect-timeout 5 --max-time 10 http://127.0.0.1:80/nextcloud/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Nextcloud service is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Nextcloud service may still be starting up${NC}"
    fi

    # Test PostHog endpoint
    if curl -f --connect-timeout 5 --max-time 10 http://127.0.0.1:80/posthog/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PostHog service is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  PostHog service may still be starting up${NC}"
    fi
}

# Enhanced cleanup function with disk space monitoring
cleanup() {
    echo -e "${BLUE}🧹 Enhanced cleanup and disk space management...${NC}"
    
    # Check disk space before cleanup
    local DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    echo -e "${BLUE}💾 Disk usage before cleanup: ${DISK_USAGE}%${NC}"
    
    # Clean up old containers
    echo -e "${BLUE}🗑️  Cleaning up old containers...${NC}"
    docker container prune -f
    
    # Clean up old images (only unused ones - safe!)
    echo -e "${BLUE}🖼️  Cleaning up unused Docker images...${NC}"
    docker image prune -a -f
    
    # Clean up unused networks
    echo -e "${BLUE}🌐 Cleaning up unused networks...${NC}"
    docker network prune -f
    
    # Clean up build cache
    echo -e "${BLUE}🏗️  Cleaning up build cache...${NC}"
    docker builder prune -f
    
    # Check disk space after cleanup
    local DISK_USAGE_AFTER=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    local SPACE_FREED=$((DISK_USAGE - DISK_USAGE_AFTER))
    
    echo -e "${GREEN}✅ Cleanup completed!${NC}"
    echo -e "${BLUE}💾 Disk usage after cleanup: ${DISK_USAGE_AFTER}%${NC}"
    
    if [ $SPACE_FREED -gt 0 ]; then
        echo -e "${GREEN}🎉 Freed up approximately ${SPACE_FREED}% disk space!${NC}"
    fi
    
    # Warning if still high usage
    if [ $DISK_USAGE_AFTER -gt 85 ]; then
        echo -e "${YELLOW}⚠️  Warning: Disk usage still high (${DISK_USAGE_AFTER}%)${NC}"
        echo -e "${YELLOW}💡 Consider manual cleanup or expanding disk space${NC}"
    fi
}

# Show enhanced deployment summary
show_deployment_summary() {
    local IMAGE_TAG="$1"

    echo ""
    echo -e "${BLUE}📊 ===== Enhanced Deployment Summary =====${NC}"
    echo ""
    echo -e "${GREEN}🚀 Successfully deployed application stack!${NC}"
    echo ""

    # Show deployment scope
    echo -e "${BLUE}🎯 Deployment Scope:${NC}"
    [ "$FORCE_REDEPLOY_NGINX" = "true" ] && echo -e "  🌐 Nginx: ✅ Redeployed"
    [ "$FORCE_REDEPLOY_TEAMHUB" = "true" ] && echo -e "  🎯 TeamHub: ✅ Redeployed"
    [ "$FORCE_REDEPLOY_REMOTION" = "true" ] && echo -e "  🎬 Remotion: ✅ Redeployed"
    [ "$FORCE_REDEPLOY_INFRASTRUCTURE" = "true" ] && echo -e "  🔧 Infrastructure: ✅ Redeployed"
    [ "$FORCE_REDEPLOY_NEXTCLOUD" = "true" ] && echo -e "  ☁️  Nextcloud: ✅ Redeployed"
    [ "$FORCE_REDEPLOY_POSTHOG" = "true" ] && echo -e "  📊 PostHog: ✅ Redeployed"

    # Show running services
    echo ""
    echo -e "${BLUE}🔍 Running Services:${NC}"
    docker service ls --filter name=teamhub_ --format "table {{.Name}}\t{{.Replicas}}\t{{.Image}}" | grep -E "(NAME|teamhub_)"

    echo ""
    echo -e "${BLUE}💾 Data Volume Status:${NC}"
    docker volume ls --filter name=teamhub_ --format "table {{.Name}}\t{{.Size}}" | grep -E "(NAME|teamhub_)" || echo "  No volumes found"

    echo ""
    echo -e "${BLUE}🎯 Quick Actions:${NC}"
    echo "  • View logs: docker service logs teamhub_<service>"
    echo "  • Scale service: docker service scale teamhub_<service>=N"
    echo "  • Redeploy single service: FORCE_REDEPLOY_<SERVICE>=true"
    echo ""
    echo -e "${GREEN}🌐 Application URL: http://your-server-ip${NC}"
    echo "============================================"
}

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

# Main deployment function
main() {
    local IMAGE_TAG="$1"

    if [ -z "$IMAGE_TAG" ]; then
        echo -e "${RED}❌ Image tag is required${NC}"
        echo "Usage: $0 <image_tag>"
        exit 1
    fi

    if [ -z "$CONTAINER_REGISTRY" ]; then
        echo -e "${RED}❌ CONTAINER_REGISTRY environment variable is required${NC}"
        exit 1
    fi

    echo -e "${BLUE}🚀 Starting enhanced deployment with Container Registry image: $CONTAINER_REGISTRY/teamhub:$IMAGE_TAG${NC}"

    # Show deployment configuration
    show_deployment_options

    # Check data safety
    check_data_safety

    # Stage 1: Setup infrastructure first (if needed)
    echo -e "${BLUE}=== STAGE 1: Infrastructure Setup ===${NC}"
    setup_infrastructure

    # Stage 2: Deploy the full stack (with selective updates)
    echo -e "${BLUE}=== STAGE 2: Application Deployment ===${NC}"

    # If infrastructure redeploy was requested, force full stack deployment
    local NEEDS_DEPLOYMENT=false
    if [ "$FORCE_REDEPLOY_INFRASTRUCTURE" = "true" ]; then
        echo -e "${BLUE}🔄 Infrastructure redeploy requested, deploying full stack...${NC}"
        NEEDS_DEPLOYMENT=true
    elif ! check_individual_service_status; then
        NEEDS_DEPLOYMENT=true
    fi

    if [ "$NEEDS_DEPLOYMENT" = true ]; then
        deploy_full_stack "$IMAGE_TAG"
        wait_for_services
        test_application

        # Auto-install pgvector extension after deployment
        if [ "$FORCE_REDEPLOY_INFRASTRUCTURE" = "true" ]; then
            echo -e "${BLUE}🔧 Setting up pgvector extension after infrastructure deployment...${NC}"
            sleep 10  # Give PostgreSQL time to fully start
            if [ -f "infrastructure/scripts/install-pgvector.sh" ]; then
                chmod +x infrastructure/scripts/install-pgvector.sh
                if ./infrastructure/scripts/install-pgvector.sh; then
                    echo -e "${GREEN}✅ pgvector extension setup completed${NC}"
                else
                    echo -e "${YELLOW}⚠️  pgvector extension setup had issues, but continuing deployment${NC}"
                fi
            fi
        fi
    else
        echo -e "${GREEN}✅ All services running and no force redeploy requested${NC}"
        echo -e "${BLUE}💡 Use FORCE_REDEPLOY_<SERVICE>=true to force individual service redeployment${NC}"
    fi

    # Cleanup
    cleanup

    # Show deployment summary
    show_deployment_summary "$IMAGE_TAG"

    echo -e "${GREEN}✅ Enhanced deployment completed successfully${NC}"
    echo -e "${GREEN}🌐 Application should be accessible at http://your-server-ip${NC}"
}

# Execute main function with all arguments
main "$@"
