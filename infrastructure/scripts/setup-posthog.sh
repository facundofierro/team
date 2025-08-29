#!/bin/bash

set -e

echo "=== PostHog Analytics Platform Setup ==="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if PostHog service is running
check_posthog_service() {
    echo -e "${BLUE}🔍 Checking PostHog service status...${NC}"

    if docker service ls --filter name=teamhub_posthog --format "{{.Replicas}}" | grep -q "1/1"; then
        echo -e "${GREEN}✅ PostHog service is running${NC}"
        return 0
    else
        echo -e "${RED}❌ PostHog service is not running${NC}"
        return 1
    fi
}

# Wait for PostHog to be ready
wait_for_posthog() {
    echo -e "${BLUE}⏳ Waiting for PostHog to be ready...${NC}"
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

# Run PostHog setup commands
setup_posthog() {
    echo -e "${BLUE}🔧 Setting up PostHog...${NC}"

    # Get PostHog container ID
    local posthog_container=$(docker ps -q -f name=teamhub_posthog)

    if [ -z "$posthog_container" ]; then
        echo -e "${RED}❌ PostHog container not found${NC}"
        return 1
    fi

    echo -e "${BLUE}📊 PostHog container ID: $posthog_container${NC}"

    # Run database migrations
    echo -e "${BLUE}🗄️  Running database migrations...${NC}"
    docker exec "$posthog_container" python manage.py migrate

    # Setup development environment (no sample data)
    echo -e "${BLUE}⚙️  Setting up development environment...${NC}"
    docker exec "$posthog_container" python manage.py setup_dev --no-data

    echo -e "${GREEN}✅ PostHog setup completed successfully!${NC}"
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo -e "  1. Create a superuser account:"
    echo -e "     docker exec -it $posthog_container python manage.py createsuperuser"
    echo -e "  2. Access PostHog at: https://r1.teamxagents.com/posthog/"
    echo -e "  3. Create your first project and get the API key"
    echo -e "  4. Update your .env.local with the API key"
}

# Main setup function
main() {
    echo -e "${BLUE}🚀 Starting PostHog setup...${NC}"

    # Check if PostHog service is running
    if ! check_posthog_service; then
        echo -e "${RED}❌ PostHog service is not running. Please deploy it first.${NC}"
        exit 1
    fi

    # Wait for PostHog to be ready
    if ! wait_for_posthog; then
        echo -e "${RED}❌ PostHog is not responding. Please check the service logs.${NC}"
        exit 1
    fi

    # Setup PostHog
    if ! setup_posthog; then
        echo -e "${RED}❌ PostHog setup failed. Please check the logs.${NC}"
        exit 1
    fi

    echo -e "${GREEN}🎉 PostHog setup completed successfully!${NC}"
}

# Execute main function
main "$@"
