#!/bin/bash

set -e

echo "🧪 Testing Pinggy Systemd Service Setup"
echo "========================================"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_MANAGER="$SCRIPT_DIR/manage-pinggy-service.sh"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"

    echo -e "\n${YELLOW}🔍 Testing: $test_name${NC}"

    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASS: $test_name${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL: $test_name${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Test 1: Check if service management script exists
run_test "Service management script exists" "[ -f '$SERVICE_MANAGER' ]"

# Test 2: Check if service management script is executable
run_test "Service management script is executable" "[ -x '$SERVICE_MANAGER' ]"

# Test 3: Check if systemd service file exists
run_test "Systemd service file exists" "[ -f '$SCRIPT_DIR/../systemd/pinggy.service' ]"

# Test 4: Check if Pinggy CLI can be installed
run_test "Pinggy CLI installation check" "command -v curl >/dev/null 2>&1"

# Test 5: Test service management script help
run_test "Service management script shows help" "'$SERVICE_MANAGER' help >/dev/null 2>&1 || '$SERVICE_MANAGER' invalid-command >/dev/null 2>&1"

# Test 6: Check if we can read the service file
run_test "Can read systemd service file" "cat '$SCRIPT_DIR/../systemd/pinggy.service' >/dev/null"

# Test 7: Validate service file syntax (basic check)
run_test "Service file has required sections" "grep -q '\\[Unit\\]' '$SCRIPT_DIR/../systemd/pinggy.service' && grep -q '\\[Service\\]' '$SCRIPT_DIR/../systemd/pinggy.service' && grep -q '\\[Install\\]' '$SCRIPT_DIR/../systemd/pinggy.service'"

# Test 8: Check if systemctl is available
run_test "Systemctl is available" "command -v systemctl >/dev/null 2>&1"

# Test 9: Check if we have sudo access (needed for service management)
echo -e "\n${YELLOW}🔍 Testing: Sudo access for service management${NC}"
if sudo -n true 2>/dev/null; then
    echo -e "${GREEN}✅ PASS: Sudo access available${NC}"
    ((TESTS_PASSED++))
    SUDO_AVAILABLE=true
else
    echo -e "${YELLOW}⚠️  SKIP: Sudo access not available (will prompt when needed)${NC}"
    SUDO_AVAILABLE=false
fi

# Test 10: Check network connectivity (needed for Pinggy)
run_test "Network connectivity" "ping -c 1 google.com >/dev/null 2>&1"

# Test 11: Check if port 80 is available (or if something is already using it)
echo -e "\n${YELLOW}🔍 Testing: Port 80 availability${NC}"
if netstat -tuln 2>/dev/null | grep -q ':80 '; then
    echo -e "${YELLOW}⚠️  INFO: Port 80 is in use (this is expected if services are running)${NC}"
else
    echo -e "${GREEN}✅ INFO: Port 80 is available${NC}"
fi

# Test 12: Check if we can create temporary files (needed for old cleanup)
run_test "Can create temporary files" "touch /tmp/pinggy-test-$$ && rm -f /tmp/pinggy-test-$$"

# Summary
echo -e "\n${YELLOW}📊 Test Summary${NC}"
echo "==============="
echo -e "Tests passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! The Pinggy systemd service setup looks good.${NC}"
    echo -e "\n${YELLOW}Next steps:${NC}"
    echo "1. Install the service: $SERVICE_MANAGER install"
    echo "2. Start the service: $SERVICE_MANAGER start"
    echo "3. Check status: $SERVICE_MANAGER status"
    echo "4. Test connectivity: $SERVICE_MANAGER test"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please check the issues above.${NC}"
    exit 1
fi
