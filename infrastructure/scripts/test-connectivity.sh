#!/bin/bash

set -e

REGISTRY_DOMAIN="${REGISTRY_DOMAIN:-r1.teamxagents.com}"

echo "=== Testing Connectivity to Registry ==="

# Test DNS resolution
test_dns() {
    echo "Testing DNS resolution for $REGISTRY_DOMAIN..."

    if nslookup $REGISTRY_DOMAIN; then
        echo "✅ DNS resolution successful"
        return 0
    else
        echo "❌ DNS resolution failed"
        return 1
    fi
}

# Test basic connectivity
test_connectivity() {
    echo "Testing basic connectivity to $REGISTRY_DOMAIN..."

    # Test HTTPS first (since Pinggy exposes port 443)
    if curl -I --connect-timeout 10 --max-time 30 https://$REGISTRY_DOMAIN 2>/dev/null; then
        echo "✅ HTTPS connection successful"
        return 0
    else
        echo "⚠️ HTTPS connection failed, trying HTTP as fallback..."
        if curl -I --connect-timeout 10 --max-time 30 http://$REGISTRY_DOMAIN 2>/dev/null; then
            echo "✅ HTTP connection successful (unexpected but working)"
            return 0
        else
            echo "❌ Both HTTPS and HTTP connections failed"
            return 1
        fi
    fi
}

# Test registry endpoint specifically
test_registry_endpoint() {
    echo "Testing registry endpoint /v2/..."

    # Test HTTPS first
    if curl -I --connect-timeout 10 --max-time 30 https://$REGISTRY_DOMAIN/v2/ 2>/dev/null; then
        echo "✅ Registry endpoint accessible via HTTPS"
        return 0
    else
        echo "⚠️ Registry endpoint not accessible via HTTPS, trying HTTP..."
        if curl -I --connect-timeout 10 --max-time 30 http://$REGISTRY_DOMAIN/v2/ 2>/dev/null; then
            echo "✅ Registry endpoint accessible via HTTP (unexpected but working)"
            return 0
        else
            echo "❌ Registry endpoint not accessible"
            return 1
        fi
    fi
}

# Test registry authentication
test_registry_auth() {
    echo "Testing registry authentication..."

    # Test with authentication (HTTPS first)
    if curl -f --connect-timeout 10 --max-time 30 -u docker:k8mX9pL2nQ7vR4wE https://$REGISTRY_DOMAIN/v2/ >/dev/null 2>&1; then
        echo "✅ Registry authentication successful via HTTPS"
        return 0
    else
        echo "⚠️ HTTPS authentication failed, trying HTTP..."
        if curl -f --connect-timeout 10 --max-time 30 -u docker:k8mX9pL2nQ7vR4wE http://$REGISTRY_DOMAIN/v2/ >/dev/null 2>&1; then
            echo "✅ Registry authentication successful via HTTP"
            return 0
        else
            echo "❌ Registry authentication failed on both HTTPS and HTTP"
            return 1
        fi
    fi
}

# Determine the best protocol to use
determine_protocol() {
    echo "Determining best protocol for registry access..."

    # Test HTTPS first
    if curl -f --connect-timeout 5 --max-time 10 -u docker:k8mX9pL2nQ7vR4wE https://$REGISTRY_DOMAIN/v2/ >/dev/null 2>&1; then
        echo "✅ Using HTTPS for registry access"
        echo "REGISTRY_PROTOCOL=https" >> $GITHUB_ENV
        return 0
    else
        # Fallback to HTTP
        if curl -f --connect-timeout 5 --max-time 10 -u docker:k8mX9pL2nQ7vR4wE http://$REGISTRY_DOMAIN/v2/ >/dev/null 2>&1; then
            echo "✅ Using HTTP for registry access"
            echo "REGISTRY_PROTOCOL=http" >> $GITHUB_ENV
            return 0
        else
            echo "❌ Neither HTTPS nor HTTP work for registry access"
            return 1
        fi
    fi
}

# Main testing function
main() {
    local exit_code=0

    # Run all tests
    test_dns || exit_code=1
    test_connectivity || exit_code=1
    test_registry_endpoint || exit_code=1
    test_registry_auth || exit_code=1

    # If all tests pass, determine the best protocol
    if [ $exit_code -eq 0 ]; then
        determine_protocol || exit_code=1
    fi

    if [ $exit_code -eq 0 ]; then
        echo "✅ All connectivity tests passed"
    else
        echo "❌ Some connectivity tests failed"
    fi

    return $exit_code
}

# Execute main function
main "$@"
