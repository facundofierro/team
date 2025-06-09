#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 PostgreSQL pgvector Migration Script${NC}"
echo "This script will:"
echo "  1. Stop the PostgreSQL service"
echo "  2. Remove the existing PostgreSQL data volume"
echo "  3. Redeploy PostgreSQL with pgvector support"
echo ""

# Confirm with user in production
read -p "⚠️  This will delete all existing PostgreSQL data. Are you sure? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Migration cancelled."
    exit 1
fi

echo -e "${BLUE}🛑 Stopping PostgreSQL service...${NC}"
docker service rm teamhub_postgres || echo "PostgreSQL service not found"

echo -e "${BLUE}⏳ Waiting for service to be fully stopped...${NC}"
sleep 10

echo -e "${BLUE}🗑️  Removing PostgreSQL data volume...${NC}"
docker volume rm teamhub_postgres_data || echo "PostgreSQL data volume not found"

echo -e "${BLUE}🚀 Redeploying PostgreSQL with pgvector support...${NC}"

# Create temporary PostgreSQL stack with pgvector
cat > /tmp/docker-stack-postgres-pgvector.yml << EOF
version: '3.8'
services:
  postgres:
    image: \${POSTGRES_PGVECTOR_IMAGE:-ghcr.io/facundofierro/postgres-pgvector:latest}
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
    environment:
      - POSTGRES_DB=teamhub
      - POSTGRES_USER=teamhub
      - POSTGRES_PASSWORD=\${PG_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - teamhub_network

volumes:
  postgres_data:

networks:
  teamhub_network:
    driver: overlay
    external: true
EOF

# Deploy PostgreSQL with pgvector
echo -e "${BLUE}📦 Deploying PostgreSQL with pgvector...${NC}"
docker stack deploy -c /tmp/docker-stack-postgres-pgvector.yml teamhub

# Clean up temporary file
rm -f /tmp/docker-stack-postgres-pgvector.yml

echo -e "${BLUE}⏳ Waiting for PostgreSQL to be ready...${NC}"
for i in {1..12}; do
    if docker service ls --filter name=teamhub_postgres --format "{{.Replicas}}" | grep -q "1/1"; then
        echo -e "${GREEN}✅ PostgreSQL with pgvector is ready${NC}"
        break
    fi
    if [ $i -eq 12 ]; then
        echo -e "${RED}❌ PostgreSQL failed to start after 12 attempts${NC}"
        docker service logs teamhub_postgres --tail 20 || true
        exit 1
    fi
    echo "Waiting for PostgreSQL... (attempt $i/12)"
    sleep 10
done

# Verify pgvector extension is available
echo -e "${BLUE}🔍 Verifying pgvector extension...${NC}"
sleep 5

# Get the container ID
CONTAINER_ID=$(docker ps --filter "name=teamhub_postgres" --format "{{.ID}}" | head -1)

if [ -n "$CONTAINER_ID" ]; then
    echo -e "${BLUE}📊 Testing pgvector extension...${NC}"
    if docker exec "$CONTAINER_ID" psql -U teamhub -d teamhub -c "CREATE EXTENSION IF NOT EXISTS vector;" 2>/dev/null; then
        echo -e "${GREEN}✅ pgvector extension is available and enabled${NC}"
        docker exec "$CONTAINER_ID" psql -U teamhub -d teamhub -c "SELECT * FROM pg_extension WHERE extname = 'vector';"
    else
        echo -e "${RED}❌ Failed to enable pgvector extension${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Could not find PostgreSQL container to test extension${NC}"
fi

echo -e "${GREEN}🎉 PostgreSQL migration to pgvector completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "  1. Restart your TeamHub application if needed"
echo "  2. Run your database migrations"
echo "  3. Test vector operations in your application"
echo ""
echo -e "${BLUE}🔍 To check PostgreSQL service status:${NC}"
echo "  docker service ls --filter name=teamhub_postgres"
echo ""
echo -e "${BLUE}🔍 To view PostgreSQL logs:${NC}"
echo "  docker service logs teamhub_postgres"
