#!/bin/bash
set -e

# MCP Stop Script
# Stops a running MCP server

MCP_NAME="$1"

if [ -z "$MCP_NAME" ]; then
    echo "Usage: mcp-stop <name>"
    exit 1
fi

PID_FILE="$MCP_DATA_DIR/$MCP_NAME.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "MCP '$MCP_NAME' is not running (no PID file found)"
    exit 0
fi

PID=$(cat "$PID_FILE")

if ! kill -0 "$PID" 2>/dev/null; then
    echo "MCP '$MCP_NAME' is not running (stale PID file)"
    rm -f "$PID_FILE"
    exit 0
fi

echo "Stopping MCP: $MCP_NAME (PID: $PID)"

# Try graceful shutdown first
kill -TERM "$PID"

# Wait up to 10 seconds for graceful shutdown
for i in {1..10}; do
    if ! kill -0 "$PID" 2>/dev/null; then
        echo "MCP '$MCP_NAME' stopped gracefully"
        rm -f "$PID_FILE"
        exit 0
    fi
    sleep 1
done

# Force kill if still running
echo "Force killing MCP '$MCP_NAME'"
kill -KILL "$PID" 2>/dev/null || true

# Wait a moment and verify it's dead
sleep 1
if kill -0 "$PID" 2>/dev/null; then
    echo "Failed to kill MCP '$MCP_NAME'"
    exit 1
else
    echo "MCP '$MCP_NAME' force killed"
    rm -f "$PID_FILE"
fi
