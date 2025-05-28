#!/bin/bash

echo "=== Testing HTTPS Registry Configuration ==="

# Test local HTTPS registry access
echo "1. Testing local HTTPS registry access..."
if curl -f -k --connect-timeout 10 --max-time 30 -u docker:k8mX9pL2nQ7vR4wE https://127.0.0.1:443/v2/ >/dev/null 2>&1; then
    echo "✅ Local HTTPS registry is accessible"
else
    echo "❌ Local HTTPS registry is not accessible"
    echo "Make sure nginx is running with SSL certificates"
fi

# Test external HTTPS registry access through Pinggy tunnel
echo "2. Testing external HTTPS registry access through Pinggy tunnel..."
if curl -f --connect-timeout 10 --max-time 30 -u docker:k8mX9pL2nQ7vR4wE https://r1.teamxagents.com/v2/ >/dev/null 2>&1; then
    echo "✅ External HTTPS registry is accessible through Pinggy tunnel"
else
    echo "❌ External HTTPS registry is not accessible"
    echo "Check if Pinggy tunnel is running and forwarding to port 443"
fi

# Test Docker login
echo "3. Testing Docker login to external registry..."
if echo "k8mX9pL2nQ7vR4wE" | docker login https://r1.teamxagents.com -u docker --password-stdin >/dev/null 2>&1; then
    echo "✅ Docker login successful"
else
    echo "❌ Docker login failed"
fi

# Test small image push
echo "4. Testing small image push..."
docker pull hello-world:latest >/dev/null 2>&1
TIMESTAMP=$(date +%s)
docker tag hello-world:latest r1.teamxagents.com/test-https:$TIMESTAMP

if timeout 120 docker push r1.teamxagents.com/test-https:$TIMESTAMP >/dev/null 2>&1; then
    echo "✅ Small image push successful - HTTPS configuration is working!"
    # Clean up
    docker rmi r1.teamxagents.com/test-https:$TIMESTAMP >/dev/null 2>&1 || true
else
    echo "❌ Small image push failed"
    echo "This may indicate nginx buffering or timeout issues"
    # Clean up
    docker rmi r1.teamxagents.com/test-https:$TIMESTAMP >/dev/null 2>&1 || true
fi

echo "=== Test completed ==="
