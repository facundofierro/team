#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Auto-Installing pgvector Extension${NC}"
echo "This script will automatically detect and install pgvector extension on databases that need it."
echo ""

# Get the PostgreSQL container ID
POSTGRES_CONTAINER=$(docker ps --filter "name=agelum_postgres" --format "{{.ID}}")

if [ -z "$POSTGRES_CONTAINER" ]; then
    echo -e "${RED}❌ PostgreSQL container not found. Make sure the Agelum stack is running.${NC}"
    echo "Run: docker service ls --filter name=agelum_postgres"
    exit 1
fi

echo -e "${GREEN}✅ Found PostgreSQL container: $POSTGRES_CONTAINER${NC}"

# Function to install pgvector on a specific database
install_pgvector_on_db() {
    local dbname=$1
    echo -e "${BLUE}🔍 Checking pgvector extension for database: $dbname${NC}"

    # Check if extension already exists
    if docker exec "$POSTGRES_CONTAINER" psql -U agelum -d "$dbname" -t -c "SELECT 1 FROM pg_extension WHERE extname = 'vector';" 2>/dev/null | grep -q 1; then
        local version=$(docker exec "$POSTGRES_CONTAINER" psql -U agelum -d "$dbname" -t -c "SELECT extversion FROM pg_extension WHERE extname = 'vector';" 2>/dev/null | tr -d ' ')
        echo -e "${GREEN}✅ pgvector extension already installed on $dbname (version: $version)${NC}"
        return 0
    fi

    # Try to install the extension
    echo -e "${YELLOW}🚀 Installing pgvector extension on $dbname...${NC}"
    if docker exec "$POSTGRES_CONTAINER" psql -U agelum -d "$dbname" -c "CREATE EXTENSION IF NOT EXISTS vector;" 2>/dev/null; then
        # Verify installation
        if docker exec "$POSTGRES_CONTAINER" psql -U agelum -d "$dbname" -t -c "SELECT 1 FROM pg_extension WHERE extname = 'vector';" 2>/dev/null | grep -q 1; then
            local version=$(docker exec "$POSTGRES_CONTAINER" psql -U agelum -d "$dbname" -t -c "SELECT extversion FROM pg_extension WHERE extname = 'vector';" 2>/dev/null | tr -d ' ')
            echo -e "${GREEN}✅ pgvector extension successfully installed on $dbname (version: $version)${NC}"
            return 0
        else
            echo -e "${RED}❌ pgvector extension installation appeared to succeed but verification failed for $dbname${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Failed to install pgvector extension on $dbname${NC}"

        # Provide diagnostic information
        echo -e "${YELLOW}🔍 Diagnostic information:${NC}"

        # Check if the extension control file exists
        if docker exec "$POSTGRES_CONTAINER" find /usr/share/postgresql -name "vector.control" 2>/dev/null | grep -q vector.control; then
            echo -e "${GREEN}  ✅ pgvector extension files found in container${NC}"
        else
            echo -e "${RED}  ❌ pgvector extension files not found - container may not have pgvector installed${NC}"
        fi

        # Check database permissions
        local is_superuser=$(docker exec "$POSTGRES_CONTAINER" psql -U agelum -d "$dbname" -t -c "SELECT usesuper FROM pg_user WHERE usename = 'agelum';" 2>/dev/null | tr -d ' ')
        if [ "$is_superuser" = "t" ]; then
            echo -e "${GREEN}  ✅ Database user has superuser privileges${NC}"
        else
            echo -e "${YELLOW}  ⚠️  Database user does not have superuser privileges${NC}"
            echo -e "${YELLOW}     This may prevent extension installation${NC}"
        fi

        return 1
    fi
}

# Function to get list of databases
get_databases() {
    echo -e "${BLUE}🔍 Discovering databases...${NC}"
    local databases=$(docker exec "$POSTGRES_CONTAINER" psql -U agelum -d postgres -t -c "SELECT datname FROM pg_database WHERE datname NOT IN ('postgres', 'template0', 'template1');" 2>/dev/null | tr -d ' ' | grep -v '^$')
    echo "$databases"
}

# Get list of all user databases
databases=$(get_databases)

if [ -z "$databases" ]; then
    echo -e "${YELLOW}⚠️  No user databases found${NC}"
    exit 0
fi

echo -e "${BLUE}📋 Found databases:${NC}"
echo "$databases" | while read db; do
    echo "  - $db"
done
echo ""

# Install pgvector on each database
failed_databases=()
successful_databases=()

while read database; do
    if [ -n "$database" ]; then
        if install_pgvector_on_db "$database"; then
            successful_databases+=("$database")
        else
            failed_databases+=("$database")
        fi
        echo ""
    fi
done <<< "$databases"

# Summary
echo -e "${BLUE}📊 Installation Summary:${NC}"

if [ ${#successful_databases[@]} -gt 0 ]; then
    echo -e "${GREEN}✅ Successfully installed pgvector on:${NC}"
    printf '%s\n' "${successful_databases[@]}" | sed 's/^/  - /'
fi

if [ ${#failed_databases[@]} -gt 0 ]; then
    echo -e "${RED}❌ Failed to install pgvector on:${NC}"
    printf '%s\n' "${failed_databases[@]}" | sed 's/^/  - /'
    echo ""
    echo -e "${YELLOW}💡 Troubleshooting tips:${NC}"
    echo "  1. Ensure the PostgreSQL container has pgvector installed"
    echo "  2. Check that the database user has sufficient privileges"
    echo "  3. Verify the PostgreSQL version is compatible with pgvector"
    echo "  4. Check PostgreSQL logs for detailed error messages:"
    echo "     docker service logs agelum_postgres"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 pgvector extension installation completed!${NC}"
echo ""
echo -e "${BLUE}🔄 Next steps:${NC}"
echo "  1. Restart your TeamHub application to detect the new extensions"
echo "  2. Check application logs to verify vector functionality is working"
echo "  3. Test vector operations in your application"
