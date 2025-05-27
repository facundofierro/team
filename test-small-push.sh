#!/bin/bash

echo "Testing Docker registry connectivity with small image..."

# Pull a small test image (alpine is ~5MB)
echo "Pulling alpine test image..."
docker pull alpine:latest

# Tag for your registry
echo "Tagging for private registry..."
docker tag alpine:latest r1.teamxagents.com/test-alpine:latest

# Try to push the small image
echo "Attempting to push small test image..."
if docker push r1.teamxagents.com/test-alpine:latest; then
    echo "✅ Small image push successful - tunnel is working!"
    echo "The issue is likely with large layer sizes in your main image"
else
    echo "❌ Small image push failed - tunnel connectivity issue"
    echo "Check your tunnel connection and DNS resolution"
fi

# Clean up
docker rmi r1.teamxagents.com/test-alpine:latest 2>/dev/null || true
