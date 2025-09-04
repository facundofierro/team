#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Volume Migration Script: teamhub_ → agelum_${NC}"
echo "================================================"

# Function to migrate a volume
migrate_volume() {
    local OLD_VOLUME="$1"
    local NEW_VOLUME="$2"
    local DESCRIPTION="$3"

    echo -e "${BLUE}📦 Migrating $DESCRIPTION...${NC}"
    echo "  From: $OLD_VOLUME"
    echo "  To:   $NEW_VOLUME"

    # Check if old volume exists
    if ! docker volume ls --filter name="$OLD_VOLUME" --format "{{.Name}}" | grep -q "$OLD_VOLUME"; then
        echo -e "${YELLOW}⚠️  Old volume $OLD_VOLUME not found, skipping...${NC}"
        return 0
    fi

    # Check if new volume already exists
    if docker volume ls --filter name="$NEW_VOLUME" --format "{{.Name}}" | grep -q "$NEW_VOLUME"; then
        echo -e "${YELLOW}⚠️  New volume $NEW_VOLUME already exists, skipping...${NC}"
        return 0
    fi

    # Create new volume
    echo -e "${BLUE}  Creating new volume: $NEW_VOLUME${NC}"
    docker volume create "$NEW_VOLUME"

    # Copy data from old to new volume
    echo -e "${BLUE}  Copying data from $OLD_VOLUME to $NEW_VOLUME...${NC}"
    docker run --rm \
        -v "$OLD_VOLUME":/source:ro \
        -v "$NEW_VOLUME":/dest \
        alpine:latest \
        sh -c "cp -a /source/. /dest/"

    # Verify migration
    local OLD_SIZE=$(docker run --rm -v "$OLD_VOLUME":/data alpine:latest du -sh /data | cut -f1)
    local NEW_SIZE=$(docker run --rm -v "$NEW_VOLUME":/data alpine:latest du -sh /data | cut -f1)

    echo -e "${GREEN}✅ Migration completed successfully${NC}"
    echo -e "  Old size: $OLD_SIZE"
    echo -e "  New size: $NEW_SIZE"
    echo ""
}

# Function to backup old volume before migration
backup_volume() {
    local VOLUME_NAME="$1"
    local BACKUP_NAME="${VOLUME_NAME}_backup_$(date +%Y%m%d_%H%M%S)"

    echo -e "${BLUE}💾 Creating backup of $VOLUME_NAME as $BACKUP_NAME...${NC}"

    if docker volume ls --filter name="$VOLUME_NAME" --format "{{.Name}}" | grep -q "$VOLUME_NAME"; then
        docker run --rm \
            -v "$VOLUME_NAME":/source:ro \
            -v "$BACKUP_NAME":/dest \
            alpine:latest \
            sh -c "cp -a /source/. /dest/"
        echo -e "${GREEN}✅ Backup created: $BACKUP_NAME${NC}"
    else
        echo -e "${YELLOW}⚠️  Volume $VOLUME_NAME not found, skipping backup${NC}"
    fi
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}⚠️  This script should be run with sudo for proper volume access${NC}"
    echo -e "${YELLOW}💡 Consider running: sudo $0${NC}"
fi

echo -e "${BLUE}🔍 Checking existing volumes...${NC}"
echo ""

# List existing teamhub volumes
echo -e "${BLUE}📋 Found teamhub volumes:${NC}"
docker volume ls --filter name=teamhub_ --format "table {{.Name}}\t{{.Size}}" || echo "  No teamhub volumes found"

echo ""
echo -e "${BLUE}📋 Found agelum volumes:${NC}"
docker volume ls --filter name=agelum_ --format "table {{.Name}}\t{{.Size}}" || echo "  No agelum volumes found"

echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: This script will create new agelum_ volumes and copy data from teamhub_ volumes${NC}"
echo -e "${YELLOW}⚠️  The original teamhub_ volumes will be preserved as backups${NC}"
echo ""

# Ask for confirmation
read -p "Do you want to proceed with the migration? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Migration cancelled by user${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🚀 Starting volume migration...${NC}"
echo ""

# Create backups first
echo -e "${BLUE}💾 Creating backups of existing volumes...${NC}"
backup_volume "teamhub_postgres_data"
backup_volume "teamhub_redis_data"
backup_volume "teamhub_nextcloud_data"
backup_volume "teamhub_nextcloud_db_data"
backup_volume "teamhub_clickhouse_data"
backup_volume "teamhub_clickhouse_logs"
backup_volume "teamhub_posthog_data"
backup_volume "teamhub_posthog_db_data"
backup_volume "teamhub_posthog_redis_data"
backup_volume "teamhub_zookeeper_data"
backup_volume "teamhub_zookeeper_logs"

echo ""

# Migrate core infrastructure volumes
echo -e "${BLUE}🔧 Migrating core infrastructure volumes...${NC}"
migrate_volume "teamhub_postgres_data" "agelum_postgres_data" "PostgreSQL data"
migrate_volume "teamhub_redis_data" "agelum_redis_data" "Redis data"

# Migrate Nextcloud volumes
echo -e "${BLUE}☁️  Migrating Nextcloud volumes...${NC}"
migrate_volume "teamhub_nextcloud_data" "agelum_nextcloud_data" "Nextcloud data"
migrate_volume "teamhub_nextcloud_db_data" "agelum_nextcloud_db_data" "Nextcloud database data"

# Migrate ClickHouse volumes (if needed)
echo -e "${BLUE}🗄️  Migrating ClickHouse volumes...${NC}"
migrate_volume "teamhub_clickhouse_data" "agelum_clickhouse_data" "ClickHouse data"
migrate_volume "teamhub_clickhouse_logs" "agelum_clickhouse_logs" "ClickHouse logs"

# Migrate PostHog volumes (if needed)
echo -e "${BLUE}📊 Migrating PostHog volumes...${NC}"
migrate_volume "teamhub_posthog_data" "agelum_posthog_data" "PostHog data"
migrate_volume "teamhub_posthog_db_data" "agelum_posthog_db_data" "PostHog database data"
migrate_volume "teamhub_posthog_redis_data" "agelum_posthog_redis_data" "PostHog Redis data"

# Migrate Zookeeper volumes (if needed)
echo -e "${BLUE}🐘 Migrating Zookeeper volumes...${NC}"
migrate_volume "teamhub_zookeeper_data" "agelum_zookeeper_data" "Zookeeper data"
migrate_volume "teamhub_zookeeper_logs" "agelum_zookeeper_logs" "Zookeeper logs"

echo ""
echo -e "${GREEN}🎉 Volume migration completed successfully!${NC}"
echo ""

# Show final status
echo -e "${BLUE}📊 Final volume status:${NC}"
echo ""
echo -e "${BLUE}📋 Agelum volumes (new):${NC}"
docker volume ls --filter name=agelum_ --format "table {{.Name}}\t{{.Size}}" || echo "  No agelum volumes found"

echo ""
echo -e "${BLUE}📋 Teamhub volumes (original, preserved):${NC}"
docker volume ls --filter name=teamhub_ --format "table {{.Name}}\t{{.Size}}" || echo "  No teamhub volumes found"

echo ""
echo -e "${BLUE}📋 Backup volumes:${NC}"
docker volume ls --filter name=_backup_ --format "table {{.Name}}\t{{.Size}}" || echo "  No backup volumes found"

echo ""
echo -e "${GREEN}✅ Migration Summary:${NC}"
echo -e "  • Original teamhub_ volumes have been preserved"
echo -e "  • New agelum_ volumes have been created with copied data"
echo -e "  • Backup volumes have been created for safety"
echo -e "  • You can now run the deploy script with the new volume names"
echo ""
echo -e "${BLUE}💡 Next steps:${NC}"
echo -e "  1. Run the deploy script: ./infrastructure/scripts/deploy.sh <image_tag>"
echo -e "  2. Verify that services start correctly with the new volumes"
echo -e "  3. Once confirmed working, you can remove old teamhub_ volumes if desired"
echo -e "  4. Remove backup volumes once you're confident everything works"
echo ""
echo -e "${YELLOW}⚠️  Remember: Keep the original teamhub_ volumes until you're sure everything works!${NC}"
