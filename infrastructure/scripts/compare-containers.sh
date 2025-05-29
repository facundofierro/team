#!/bin/bash

set -e

echo "=== Next.js Container Size Comparison ==="
echo "Building all variants to compare sizes..."

# Build all variants
echo "🔧 Building original container..."
docker build -f apps/teamhub/Dockerfile -t teamhub:original . --quiet

echo "🚀 Building optimized container..."
docker build -f apps/teamhub/Dockerfile.optimized -t teamhub:optimized . --quiet

echo "⚡ Building ultra-minimal container..."
docker build -f apps/teamhub/Dockerfile.distroless -t teamhub:distroless . --quiet

echo ""
echo "📊 Size Comparison Results:"
echo "========================================="

# Get sizes and format them nicely
ORIGINAL_SIZE=$(docker images teamhub:original --format "{{.Size}}")
OPTIMIZED_SIZE=$(docker images teamhub:optimized --format "{{.Size}}")
DISTROLESS_SIZE=$(docker images teamhub:distroless --format "{{.Size}}")

printf "%-20s %-10s %s\n" "VARIANT" "SIZE" "DESCRIPTION"
printf "%-20s %-10s %s\n" "--------------------" "----------" "-----------------------------------"
printf "%-20s %-10s %s\n" "Original" "$ORIGINAL_SIZE" "Standard Alpine + full node_modules"
printf "%-20s %-10s %s\n" "Optimized" "$OPTIMIZED_SIZE" "Alpine + standalone output"
printf "%-20s %-10s %s\n" "Ultra-minimal" "$DISTROLESS_SIZE" "Distroless + standalone output"

echo ""
echo "🎯 Recommendations:"
echo "  • Use 'optimized' for production (good balance of size & debugging)"
echo "  • Use 'distroless' for maximum security & minimal size"
echo "  • Use 'original' only for development/debugging"

echo ""
echo "✅ All containers built successfully!"
echo "💡 Run with: docker run -p 3000:3000 teamhub:[variant]"
