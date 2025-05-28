#!/bin/bash

echo "Checking Pinggy tunnel information..."
echo ""

# Check if registry tunnel is running
if docker ps --filter "name=pinggy-registry-tunnel" --filter "status=running" | grep -q pinggy-registry-tunnel; then
    echo "✅ Registry tunnel is running"

    # Get the tunnel logs to find the public URL
    echo ""
    echo "Registry tunnel logs (last 20 lines):"
    docker logs --tail 20 pinggy-registry-tunnel 2>/dev/null | grep -E "(https?://|tcp://)" || echo "No URL found in recent logs"

else
    echo "❌ Registry tunnel is not running"
    echo ""
    echo "To start the registry tunnel manually, run:"
    echo "docker run --net=host --name=pinggy-registry-tunnel -d pinggy/pinggy -p 443 -R0:192.168.88.135:5000 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 FpyP2PGUXy0@pro.pinggy.io"
fi

echo ""
echo "Main app tunnel status:"
if docker ps --filter "name=pinggy-tunnel" --filter "status=running" | grep -q pinggy-tunnel; then
    echo "✅ Main tunnel is running"
    docker logs --tail 10 pinggy-tunnel 2>/dev/null | grep -E "(https?://|tcp://)" || echo "No URL found in recent logs"
else
    echo "❌ Main tunnel is not running"
fi

echo ""
echo "Note: With Pinggy Pro, you should have a static domain."
echo "Check your Pinggy dashboard at https://dashboard.pinggy.io/ for your static domain."
echo ""
echo "Your registry will be accessible at: https://your-static-domain.pinggy.io"
echo "Replace 'your-static-domain' with your actual Pinggy static domain."
