#!/bin/bash

# Agelum MCP System Integration Test
# This script tests the complete MCP installation and management flow

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
TEST_ORG_ID="test-org-$(date +%s)"
TEST_MCP_NAME="file-system-mcp"
TEST_MCP_SOURCE="https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem"
AGELUM_API_BASE="http://localhost:3000/api"

echo -e "${BLUE}🧪 Starting Agelum MCP System Integration Test${NC}"
echo -e "${BLUE}📋 Test Organization ID: ${TEST_ORG_ID}${NC}"
echo ""

# Function to log test steps
log_step() {
    echo -e "${YELLOW}🔍 $1${NC}"
}

# Function to log success
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to log error
log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for API to be ready
wait_for_api() {
    log_step "Waiting for Agelum API to be ready..."
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" "$AGELUM_API_BASE/test" | grep -q "200\|404"; then
            log_success "API is ready"
            return 0
        fi
        echo "Attempt $attempt/$max_attempts - API not ready yet..."
        sleep 2
        ((attempt++))
    done

    log_error "API failed to become ready within 60 seconds"
    return 1
}

# Function to test API endpoint
test_api_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=${4:-200}

    log_step "Testing $method $endpoint"

    local response
    local status

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$AGELUM_API_BASE$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
            -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$AGELUM_API_BASE$endpoint")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
            -X DELETE \
            "$AGELUM_API_BASE$endpoint")
    fi

    status=$(echo "$response" | grep -o 'HTTPSTATUS:[0-9]*' | cut -d: -f2)
    body=$(echo "$response" | sed 's/HTTPSTATUS:[0-9]*$//')

    if [ "$status" = "$expected_status" ]; then
        log_success "$method $endpoint returned status $status"
        echo "$body"
        return 0
    else
        log_error "$method $endpoint returned status $status, expected $expected_status"
        echo "Response: $body"
        return 1
    fi
}

# Function to test Docker prerequisites
test_docker_prerequisites() {
    log_step "Testing Docker prerequisites..."

    # Check if Docker is installed
    if ! command_exists docker; then
        log_error "Docker is not installed"
        return 1
    fi
    log_success "Docker is installed"

    # Check if Docker daemon is running
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker daemon is not running"
        return 1
    fi
    log_success "Docker daemon is running"

    # Check available disk space (need at least 2GB)
    local available_space
    available_space=$(df / | awk 'NR==2 {print $4}')
    if [ "$available_space" -lt 2097152 ]; then  # 2GB in KB
        log_error "Insufficient disk space (need at least 2GB)"
        return 1
    fi
    log_success "Sufficient disk space available"

    return 0
}

# Function to test MCP container management
test_container_management() {
    log_step "Testing MCP container management..."

    # Test container creation
    local create_response
    create_response=$(test_api_endpoint "POST" "/organizations/$TEST_ORG_ID/mcp-container" \
        '{"action": "ensure", "config": {"memoryLimit": "512M", "cpuLimit": "0.25"}}')

    if [ $? -ne 0 ]; then
        log_error "Failed to create container"
        return 1
    fi

    # Wait a bit for container to be ready
    sleep 5

    # Test container status
    test_api_endpoint "GET" "/organizations/$TEST_ORG_ID/mcp-container"

    if [ $? -ne 0 ]; then
        log_error "Failed to get container status"
        return 1
    fi

    log_success "Container management test passed"
    return 0
}

# Function to test MCP installation
test_mcp_installation() {
    log_step "Testing MCP installation..."

    # Test MCP installation
    local install_data="{
        \"name\": \"$TEST_MCP_NAME\",
        \"source\": \"$TEST_MCP_SOURCE\",
        \"configuration\": {
            \"allowedPaths\": [\"/tmp\", \"/mcp/data\"]
        }
    }"

    local install_response
    install_response=$(test_api_endpoint "POST" "/organizations/$TEST_ORG_ID/mcps/install" "$install_data")

    if [ $? -ne 0 ]; then
        log_error "Failed to install MCP"
        return 1
    fi

    # Wait for installation to complete
    sleep 10

    # Test MCP status
    test_api_endpoint "GET" "/organizations/$TEST_ORG_ID/mcps"

    if [ $? -ne 0 ]; then
        log_error "Failed to get MCP status"
        return 1
    fi

    log_success "MCP installation test passed"
    return 0
}

# Function to test MCP lifecycle management
test_mcp_lifecycle() {
    log_step "Testing MCP lifecycle management..."

    # Test starting MCP
    local start_data='{"action": "start", "port": 8080}'
    test_api_endpoint "POST" "/organizations/$TEST_ORG_ID/mcps/$TEST_MCP_NAME" "$start_data"

    if [ $? -ne 0 ]; then
        log_error "Failed to start MCP"
        return 1
    fi

    sleep 3

    # Test stopping MCP
    local stop_data='{"action": "stop"}'
    test_api_endpoint "POST" "/organizations/$TEST_ORG_ID/mcps/$TEST_MCP_NAME" "$stop_data"

    if [ $? -ne 0 ]; then
        log_error "Failed to stop MCP"
        return 1
    fi

    log_success "MCP lifecycle management test passed"
    return 0
}

# Function to test resource monitoring
test_resource_monitoring() {
    log_step "Testing resource monitoring..."

    # Test getting resource summary
    test_api_endpoint "GET" "/organizations/$TEST_ORG_ID/mcp-resources"

    if [ $? -ne 0 ]; then
        log_error "Failed to get resource summary"
        return 1
    fi

    # Test starting monitoring
    local monitor_data='{"action": "start-monitoring"}'
    test_api_endpoint "POST" "/organizations/$TEST_ORG_ID/mcp-resources" "$monitor_data"

    if [ $? -ne 0 ]; then
        log_error "Failed to start monitoring"
        return 1
    fi

    log_success "Resource monitoring test passed"
    return 0
}

# Function to test security constraints
test_security_constraints() {
    log_step "Testing security constraints..."

    # Check if container is running with correct security settings
    local container_name="agelum-mcp-$TEST_ORG_ID"

    # Verify container exists
    if ! docker ps -a --filter name="$container_name" --format "{{.Names}}" | grep -q "$container_name"; then
        log_error "Container $container_name not found"
        return 1
    fi

    # Check security settings
    local container_info
    container_info=$(docker inspect "$container_name" 2>/dev/null)

    # Verify non-root user
    if ! echo "$container_info" | grep -q '"User": "1001:1001"'; then
        log_error "Container not running as non-root user"
        return 1
    fi

    # Verify read-only filesystem
    if ! echo "$container_info" | grep -q '"ReadonlyRootfs": true'; then
        log_error "Container filesystem is not read-only"
        return 1
    fi

    # Verify capabilities are dropped
    if ! echo "$container_info" | grep -q '"CapDrop": \["ALL"\]'; then
        log_error "Container capabilities not properly dropped"
        return 1
    fi

    log_success "Security constraints test passed"
    return 0
}

# Function to test MCP discovery
test_mcp_discovery() {
    log_step "Testing MCP discovery..."

    # Test MCP discovery endpoint
    test_api_endpoint "GET" "/tools/mcp-discovery?category=development&limit=5"

    if [ $? -ne 0 ]; then
        log_error "Failed to discover MCPs"
        return 1
    fi

    log_success "MCP discovery test passed"
    return 0
}

# Function to cleanup test resources
cleanup_test_resources() {
    log_step "Cleaning up test resources..."

    # Remove MCP
    test_api_endpoint "DELETE" "/organizations/$TEST_ORG_ID/mcps/$TEST_MCP_NAME" "" 204

    # Remove container
    test_api_endpoint "POST" "/organizations/$TEST_ORG_ID/mcp-container" '{"action": "remove"}' || true

    # Stop monitoring
    test_api_endpoint "POST" "/organizations/$TEST_ORG_ID/mcp-resources" '{"action": "stop-monitoring"}' || true

    log_success "Cleanup completed"
}

# Function to run performance tests
test_performance() {
    log_step "Running performance tests..."

    local start_time
    local end_time
    local duration

    # Test container creation time
    start_time=$(date +%s)
    test_api_endpoint "POST" "/organizations/perf-test-org/mcp-container" '{"action": "ensure"}' >/dev/null
    end_time=$(date +%s)
    duration=$((end_time - start_time))

    if [ $duration -gt 60 ]; then
        log_error "Container creation took too long: ${duration}s (expected < 60s)"
        return 1
    fi

    log_success "Container creation completed in ${duration}s"

    # Cleanup performance test
    test_api_endpoint "POST" "/organizations/perf-test-org/mcp-container" '{"action": "remove"}' >/dev/null || true

    log_success "Performance tests passed"
    return 0
}

# Main test execution
main() {
    echo -e "${BLUE}🚀 Starting comprehensive MCP system tests...${NC}"
    echo ""

    local test_results=()
    local failed_tests=()

    # Prerequisites
    if test_docker_prerequisites; then
        test_results+=("✅ Docker Prerequisites")
    else
        test_results+=("❌ Docker Prerequisites")
        failed_tests+=("Docker Prerequisites")
    fi

    # Wait for API
    if wait_for_api; then
        test_results+=("✅ API Availability")
    else
        test_results+=("❌ API Availability")
        failed_tests+=("API Availability")
        log_error "Cannot continue without API access"
        exit 1
    fi

    # MCP Discovery
    if test_mcp_discovery; then
        test_results+=("✅ MCP Discovery")
    else
        test_results+=("❌ MCP Discovery")
        failed_tests+=("MCP Discovery")
    fi

    # Container Management
    if test_container_management; then
        test_results+=("✅ Container Management")
    else
        test_results+=("❌ Container Management")
        failed_tests+=("Container Management")
    fi

    # MCP Installation
    if test_mcp_installation; then
        test_results+=("✅ MCP Installation")
    else
        test_results+=("❌ MCP Installation")
        failed_tests+=("MCP Installation")
    fi

    # MCP Lifecycle
    if test_mcp_lifecycle; then
        test_results+=("✅ MCP Lifecycle")
    else
        test_results+=("❌ MCP Lifecycle")
        failed_tests+=("MCP Lifecycle")
    fi

    # Resource Monitoring
    if test_resource_monitoring; then
        test_results+=("✅ Resource Monitoring")
    else
        test_results+=("❌ Resource Monitoring")
        failed_tests+=("Resource Monitoring")
    fi

    # Security Constraints
    if test_security_constraints; then
        test_results+=("✅ Security Constraints")
    else
        test_results+=("❌ Security Constraints")
        failed_tests+=("Security Constraints")
    fi

    # Performance Tests
    if test_performance; then
        test_results+=("✅ Performance")
    else
        test_results+=("❌ Performance")
        failed_tests+=("Performance")
    fi

    # Cleanup
    cleanup_test_resources

    # Report results
    echo ""
    echo -e "${BLUE}📊 Test Results Summary${NC}"
    echo "=========================="
    for result in "${test_results[@]}"; do
        echo -e "$result"
    done

    echo ""
    if [ ${#failed_tests[@]} -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed! MCP system is ready for deployment.${NC}"
        exit 0
    else
        echo -e "${RED}❌ ${#failed_tests[@]} test(s) failed:${NC}"
        for failed in "${failed_tests[@]}"; do
            echo -e "${RED}  - $failed${NC}"
        done
        echo ""
        echo -e "${RED}🚨 System is not ready for deployment. Please fix the issues above.${NC}"
        exit 1
    fi
}

# Handle cleanup on script exit
trap cleanup_test_resources EXIT

# Run main function
main "$@"
