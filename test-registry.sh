#!/bin/bash

# Test script for Docker Registry setup
# Tests both local and external access

set -e

echo "🧪 Testing Docker Registry Setup"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Registry credentials
REGISTRY_USER="admin"
REGISTRY_PASS="k8mX9pL2nQ7vR4wE"
LOCAL_REGISTRY="localhost:5000"
EXTERNAL_REGISTRY="ukjhwjyazp.a.pinggy.link:5000"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "  Local Registry: $LOCAL_REGISTRY"
echo "  External Registry: $EXTERNAL_REGISTRY"
echo "  Username: $REGISTRY_USER"
echo ""

# Test 1: Local Registry Access
echo -e "${YELLOW}🔍 Test 1: Local Registry Access${NC}"
if curl -f -u "$REGISTRY_USER:$REGISTRY_PASS" "http://$LOCAL_REGISTRY/v2/" >/dev/null 2>&1; then
    echo -e "  ${GREEN}✅ Local registry is accessible${NC}"

    # Test catalog endpoint
    if curl -f -u "$REGISTRY_USER:$REGISTRY_PASS" "http://$LOCAL_REGISTRY/v2/_catalog" >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Local registry catalog endpoint works${NC}"
        echo "     Repositories:"
        curl -s -u "$REGISTRY_USER:$REGISTRY_PASS" "http://$LOCAL_REGISTRY/v2/_catalog" | jq -r '.repositories[]?' 2>/dev/null || echo "     (No repositories yet)"
    else
        echo -e "  ${RED}❌ Local registry catalog endpoint failed${NC}"
    fi
else
    echo -e "  ${RED}❌ Local registry is not accessible${NC}"
    echo "     Make sure the registry is running: docker service ls | grep registry"
fi

echo ""

# Test 2: External Registry Access
echo -e "${YELLOW}🌐 Test 2: External Registry Access${NC}"
if curl -f -u "$REGISTRY_USER:$REGISTRY_PASS" "https://$EXTERNAL_REGISTRY/v2/" >/dev/null 2>&1; then
    echo -e "  ${GREEN}✅ External registry is accessible${NC}"

    # Test catalog endpoint
    if curl -f -u "$REGISTRY_USER:$REGISTRY_PASS" "https://$EXTERNAL_REGISTRY/v2/_catalog" >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ External registry catalog endpoint works${NC}"
        echo "     Repositories:"
        curl -s -u "$REGISTRY_USER:$REGISTRY_PASS" "https://$EXTERNAL_REGISTRY/v2/_catalog" | jq -r '.repositories[]?' 2>/dev/null || echo "     (No repositories yet)"
    else
        echo -e "  ${RED}❌ External registry catalog endpoint failed${NC}"
    fi
else
    echo -e "  ${RED}❌ External registry is not accessible${NC}"
    echo "     Check if Pinggy tunnel is running: docker ps | grep pinggy-registry-tunnel"
fi

echo ""

# Test 3: Pinggy Tunnel Status
echo -e "${YELLOW}🚇 Test 3: Pinggy Tunnel Status${NC}"
if docker ps --filter "name=pinggy-tunnel" --filter "status=running" | grep -q pinggy-tunnel; then
    echo -e "  ${GREEN}✅ Main app tunnel is running${NC}"
else
    echo -e "  ${RED}❌ Main app tunnel is not running${NC}"
fi

if docker ps --filter "name=pinggy-registry-tunnel" --filter "status=running" | grep -q pinggy-registry-tunnel; then
    echo -e "  ${GREEN}✅ Registry tunnel is running${NC}"
else
    echo -e "  ${RED}❌ Registry tunnel is not running${NC}"
fi

echo ""

# Test 4: Docker Login Test
echo -e "${YELLOW}🔐 Test 4: Docker Login Test${NC}"

# Test local login
echo "Testing local registry login..."
if echo "$REGISTRY_PASS" | docker login "$LOCAL_REGISTRY" -u "$REGISTRY_USER" --password-stdin >/dev/null 2>&1; then
    echo -e "  ${GREEN}✅ Local registry login successful${NC}"
else
    echo -e "  ${RED}❌ Local registry login failed${NC}"
fi

# Test external login (only if accessible)
if curl -f -u "$REGISTRY_USER:$REGISTRY_PASS" "https://$EXTERNAL_REGISTRY/v2/" >/dev/null 2>&1; then
    echo "Testing external registry login..."
    if echo "$REGISTRY_PASS" | docker login "https://$EXTERNAL_REGISTRY" -u "$REGISTRY_USER" --password-stdin >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ External registry login successful${NC}"
    else
        echo -e "  ${RED}❌ External registry login failed${NC}"
    fi
else
    echo -e "  ${YELLOW}⏭️  Skipping external login test (registry not accessible)${NC}"
fi

echo ""

# Test 5: Quick Push/Pull Test
echo -e "${YELLOW}🚀 Test 5: Quick Push/Pull Test${NC}"
echo "Pulling hello-world image..."
if docker pull hello-world >/dev/null 2>&1; then
    echo -e "  ${GREEN}✅ hello-world image pulled${NC}"

    # Tag and push to local registry
    docker tag hello-world "$LOCAL_REGISTRY/hello-world:test" >/dev/null 2>&1
    if docker push "$LOCAL_REGISTRY/hello-world:test" >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Successfully pushed test image to local registry${NC}"

        # Clean up
        docker rmi "$LOCAL_REGISTRY/hello-world:test" >/dev/null 2>&1 || true

        # Try to pull it back
        if docker pull "$LOCAL_REGISTRY/hello-world:test" >/dev/null 2>&1; then
            echo -e "  ${GREEN}✅ Successfully pulled test image from local registry${NC}"
            docker rmi "$LOCAL_REGISTRY/hello-world:test" >/dev/null 2>&1 || true
        else
            echo -e "  ${RED}❌ Failed to pull test image from local registry${NC}"
        fi
    else
        echo -e "  ${RED}❌ Failed to push test image to local registry${NC}"
    fi
else
    echo -e "  ${RED}❌ Failed to pull hello-world image${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Registry test completed!${NC}"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "  1. If tests passed: Push a commit to trigger the workflow"
echo "  2. If tests failed: Check the troubleshooting section in PINGGY_MULTI_PORT_SETUP.md"
echo "  3. Monitor workflow: https://github.com/your-repo/actions"
