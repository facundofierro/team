#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Migration Test Script${NC}"
echo "=========================="

# Function to test volume migration
test_volume_migration() {
    local OLD_VOLUME="$1"
    local NEW_VOLUME="$2"
    local DESCRIPTION="$3"

    echo -e "${BLUE}Testing $DESCRIPTION migration...${NC}"

    # Check if old volume exists
    if ! docker volume ls --filter name="$OLD_VOLUME" --format "{{.Name}}" | grep -q "$OLD_VOLUME"; then
        echo -e "${YELLOW}⚠️  Old volume $OLD_VOLUME not found, skipping test${NC}"
        return 0
    fi

    # Check if new volume exists
    if ! docker volume ls --filter name="$NEW_VOLUME" --format "{{.Name}}" | grep -q "$NEW_VOLUME"; then
        echo -e "${YELLOW}⚠️  New volume $NEW_VOLUME not found, migration may not have run${NC}"
        return 1
    fi

    # Compare sizes
    local OLD_SIZE=$(docker run --rm -v "$OLD_VOLUME":/data alpine:latest du -sh /data | cut -f1)
    local NEW_SIZE=$(docker run --rm -v "$NEW_VOLUME":/data alpine:latest du -sh /data | cut -f1)

    echo -e "  Old volume size: $OLD_SIZE"
    echo -e "  New volume size: $NEW_SIZE"

    if [ "$OLD_SIZE" = "$NEW_SIZE" ]; then
        echo -e "${GREEN}✅ Size match - migration appears successful${NC}"
    else
        echo -e "${YELLOW}⚠️  Size mismatch - may indicate incomplete migration${NC}"
    fi

    # Test file count
    local OLD_FILES=$(docker run --rm -v "$OLD_VOLUME":/data alpine:latest find /data -type f | wc -l)
    local NEW_FILES=$(docker run --rm -v "$NEW_VOLUME":/data alpine:latest find /data -type f | wc -l)

    echo -e "  Old volume files: $OLD_FILES"
    echo -e "  New volume files: $NEW_FILES"

    if [ "$OLD_FILES" = "$NEW_FILES" ]; then
        echo -e "${GREEN}✅ File count match - migration appears successful${NC}"
    else
        echo -e "${YELLOW}⚠️  File count mismatch - may indicate incomplete migration${NC}"
    fi

    echo ""
}

echo -e "${BLUE}🔍 Checking volume migration status...${NC}"
echo ""

# Test core volumes
test_volume_migration "teamhub_postgres_data" "agelum_postgres_data" "PostgreSQL data"
test_volume_migration "teamhub_redis_data" "agelum_redis_data" "Redis data"
test_volume_migration "teamhub_nextcloud_data" "agelum_nextcloud_data" "Nextcloud data"
test_volume_migration "teamhub_nextcloud_db_data" "agelum_nextcloud_db_data" "Nextcloud database data"

# Test optional volumes
test_volume_migration "teamhub_clickhouse_data" "agelum_clickhouse_data" "ClickHouse data"
test_volume_migration "teamhub_posthog_data" "agelum_posthog_data" "PostHog data"

echo -e "${BLUE}📊 Migration Test Summary:${NC}"
echo "=========================="

# Count volumes
local TEAMHUB_COUNT=$(docker volume ls --filter name=teamhub_ --format "{{.Name}}" | wc -l)
local AGELUM_COUNT=$(docker volume ls --filter name=agelum_ --format "{{.Name}}" | wc -l)
local BACKUP_COUNT=$(docker volume ls --filter name=_backup_ --format "{{.Name}}" | wc -l)

echo -e "Teamhub volumes: $TEAMHUB_COUNT"
echo -e "Agelum volumes: $AGELUM_COUNT"
echo -e "Backup volumes: $BACKUP_COUNT"

if [ $AGELUM_COUNT -gt 0 ]; then
    echo -e "${GREEN}✅ Migration appears to have run successfully${NC}"
    echo -e "${GREEN}✅ You can now proceed with deployment${NC}"
else
    echo -e "${YELLOW}⚠️  No agelum volumes found - migration may not have run${NC}"
    echo -e "${YELLOW}💡 Run: sudo ./infrastructure/scripts/migrate-volumes.sh${NC}"
fi

echo ""
echo -e "${BLUE}💡 Next steps:${NC}"
echo -e "  1. If migration looks good, run the deploy script"
echo -e "  2. Monitor the deployment for any issues"
echo -e "  3. Once confirmed working, you can clean up old volumes"
