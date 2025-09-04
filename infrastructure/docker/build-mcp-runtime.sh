#!/bin/bash
set -e

# Build script for Agelum MCP Runtime Docker image

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

IMAGE_NAME="agelum-mcp-runtime"
IMAGE_TAG="${1:-latest}"
FULL_IMAGE_NAME="$IMAGE_NAME:$IMAGE_TAG"

echo "Building Agelum MCP Runtime Docker image..."
echo "Image: $FULL_IMAGE_NAME"
echo "Context: $SCRIPT_DIR"

# Build the Docker image
docker build \
    -t "$FULL_IMAGE_NAME" \
    -f "$SCRIPT_DIR/Dockerfile.mcp-runtime" \
    "$SCRIPT_DIR"

echo ""
echo "✅ Docker image built successfully: $FULL_IMAGE_NAME"
echo ""
echo "To test the image:"
echo "  docker run --rm -it $FULL_IMAGE_NAME /bin/bash"
echo ""
echo "To create an MCP container for an organization:"
echo "  docker run -d --name agelum-mcp-org123 \\"
echo "    --memory=1g --cpus=0.5 \\"
echo "    -v mcp-data-org123:/mcp/data \\"
echo "    -v mcp-logs-org123:/mcp/logs \\"
echo "    $FULL_IMAGE_NAME"
