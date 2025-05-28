#!/bin/bash

set -e

echo "=== Cleaning Up Old Deployment Resources ==="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Remove old services that no longer exist in our stack
echo "🧹 Removing deprecated services..."

# Remove registry service if it exists
if docker service ls --filter name=teamhub_registry --format "{{.Name}}" | grep -q teamhub_registry; then
    echo "Removing deprecated registry service..."
    docker service rm teamhub_registry
    echo -e "${GREEN}✅ Registry service removed${NC}"
else
    echo -e "${YELLOW}⚠️  Registry service not found (already removed)${NC}"
fi

# Remove old configs that are no longer needed
echo "🧹 Removing deprecated configurations..."

# Remove registry config if it exists
if docker config ls --filter name=teamhub_registry_config --format "{{.Name}}" | grep -q teamhub_registry_config; then
    echo "Removing deprecated registry config..."
    docker config rm teamhub_registry_config
    echo -e "${GREEN}✅ Registry config removed${NC}"
else
    echo -e "${YELLOW}⚠️  Registry config not found (already removed)${NC}"
fi

# Remove any old nginx configs that might be conflicting
if docker config ls --filter name=teamhub_nginx_config --format "{{.Name}}" | grep -q teamhub_nginx_config; then
    echo "Removing old nginx config..."
    docker config rm teamhub_nginx_config
    echo -e "${GREEN}✅ Old nginx config removed${NC}"
else
    echo -e "${YELLOW}⚠️  Old nginx config not found (already removed)${NC}"
fi

# Remove old volumes that are no longer needed
echo "🧹 Removing deprecated volumes..."

# Remove registry volumes if they exist
if docker volume ls --filter name=teamhub_registry_data --format "{{.Name}}" | grep -q teamhub_registry_data; then
    echo "Removing deprecated registry_data volume..."
    docker volume rm teamhub_registry_data
    echo -e "${GREEN}✅ Registry data volume removed${NC}"
else
    echo -e "${YELLOW}⚠️  Registry data volume not found (already removed)${NC}"
fi

if docker volume ls --filter name=teamhub_registry_auth --format "{{.Name}}" | grep -q teamhub_registry_auth; then
    echo "Removing deprecated registry_auth volume..."
    docker volume rm teamhub_registry_auth
    echo -e "${GREEN}✅ Registry auth volume removed${NC}"
else
    echo -e "${YELLOW}⚠️  Registry auth volume not found (already removed)${NC}"
fi

# Clean up any orphaned containers
echo "🧹 Cleaning up orphaned containers..."
docker container prune -f

# Clean up any orphaned networks (except the ones we're using)
echo "🧹 Cleaning up orphaned networks..."
docker network prune -f

echo -e "${GREEN}✅ Cleanup completed successfully${NC}"
echo "💡 You can now run the deployment script to deploy with the updated configuration"
