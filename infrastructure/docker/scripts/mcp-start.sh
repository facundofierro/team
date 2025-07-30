#!/bin/bash
set -e

# MCP Start Script
# Starts an installed MCP server

MCP_NAME="$1"
PORT="${2:-8080}"

if [ -z "$MCP_NAME" ]; then
    echo "Usage: mcp-start <name> [port]"
    exit 1
fi

MCP_DIR="$MCP_SERVERS_DIR/$MCP_NAME"
LOG_FILE="$MCP_LOGS_DIR/$MCP_NAME.log"
PID_FILE="$MCP_DATA_DIR/$MCP_NAME.pid"

if [ ! -d "$MCP_DIR" ]; then
    echo "Error: MCP '$MCP_NAME' is not installed"
    exit 1
fi

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        echo "MCP '$MCP_NAME' is already running (PID: $PID)"
        exit 0
    else
        echo "Removing stale PID file"
        rm -f "$PID_FILE"
    fi
fi

echo "Starting MCP: $MCP_NAME on port $PORT"

# Set port environment variable
export MCP_PORT="$PORT"

# Start the MCP server in background
cd "$MCP_DIR"
nohup bash run.sh > "$LOG_FILE" 2>&1 &
MCP_PID=$!

# Save PID
echo $MCP_PID > "$PID_FILE"

# Wait a moment and check if it's still running
sleep 2
if kill -0 $MCP_PID 2>/dev/null; then
    echo "MCP '$MCP_NAME' started successfully (PID: $MCP_PID)"
    echo "Logs: $LOG_FILE"
else
    echo "Failed to start MCP '$MCP_NAME'"
    echo "Check logs: $LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
fi
