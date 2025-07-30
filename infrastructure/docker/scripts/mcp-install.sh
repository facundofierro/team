#!/bin/bash
set -e

# MCP Installation Script
# Installs MCP servers from GitHub repositories or npm packages

MCP_NAME="$1"
MCP_SOURCE="$2"
CONFIG_JSON="$3"

if [ -z "$MCP_NAME" ] || [ -z "$MCP_SOURCE" ]; then
    echo "Usage: mcp-install <name> <source> [config_json]"
    echo "Examples:"
    echo "  mcp-install filesystem 'npx @modelcontextprotocol/server-filesystem'"
    echo "  mcp-install custom-mcp 'https://github.com/user/mcp-server'"
    exit 1
fi

MCP_DIR="$MCP_SERVERS_DIR/$MCP_NAME"
LOG_FILE="$MCP_LOGS_DIR/$MCP_NAME-install.log"

echo "Installing MCP: $MCP_NAME from $MCP_SOURCE" | tee "$LOG_FILE"

# Create MCP directory
mkdir -p "$MCP_DIR"
cd "$MCP_DIR"

# Determine installation method
if [[ "$MCP_SOURCE" == *"github.com"* ]]; then
    echo "Installing from GitHub repository..." | tee -a "$LOG_FILE"

    # Clone repository
    git clone "$MCP_SOURCE" . 2>&1 | tee -a "$LOG_FILE"

    # Install dependencies
    if [ -f "package.json" ]; then
        echo "Installing npm dependencies..." | tee -a "$LOG_FILE"
        npm install --production 2>&1 | tee -a "$LOG_FILE"
    elif [ -f "requirements.txt" ]; then
        echo "Installing Python dependencies..." | tee -a "$LOG_FILE"
        pip3 install -r requirements.txt 2>&1 | tee -a "$LOG_FILE"
    fi

elif [[ "$MCP_SOURCE" == "npx"* ]]; then
    echo "Installing npm package..." | tee -a "$LOG_FILE"

    # Create simple package.json for npm package
    cat > package.json << EOF
{
  "name": "$MCP_NAME",
  "version": "1.0.0",
  "private": true
}
EOF

    # Extract package name from npx command
    PACKAGE_NAME=$(echo "$MCP_SOURCE" | sed 's/npx //')
    npm install "$PACKAGE_NAME" 2>&1 | tee -a "$LOG_FILE"

else
    echo "Installing from npm..." | tee -a "$LOG_FILE"

    # Create package.json and install
    cat > package.json << EOF
{
  "name": "$MCP_NAME",
  "version": "1.0.0",
  "private": true
}
EOF

    npm install "$MCP_SOURCE" 2>&1 | tee -a "$LOG_FILE"
fi

# Save configuration if provided
if [ -n "$CONFIG_JSON" ]; then
    echo "Saving configuration..." | tee -a "$LOG_FILE"
    echo "$CONFIG_JSON" > "$MCP_DIR/config.json"
fi

# Create run script
cat > "$MCP_DIR/run.sh" << EOF
#!/bin/bash
cd "$MCP_DIR"
export MCP_NAME="$MCP_NAME"
export MCP_CONFIG_FILE="$MCP_DIR/config.json"

# Load configuration as environment variables
if [ -f "config.json" ]; then
    export \$(cat config.json | jq -r 'to_entries[] | "\(.key)=\(.value)"' 2>/dev/null || true)
fi

# Run the MCP server
if [[ "$MCP_SOURCE" == "npx"* ]]; then
    $MCP_SOURCE
elif [ -f "index.js" ]; then
    node index.js
elif [ -f "main.py" ]; then
    python3 main.py
elif [ -f "server.js" ]; then
    node server.js
else
    echo "No executable found for MCP: $MCP_NAME"
    exit 1
fi
EOF

chmod +x "$MCP_DIR/run.sh"

echo "MCP $MCP_NAME installed successfully!" | tee -a "$LOG_FILE"
echo "Configuration saved to: $MCP_DIR/config.json" | tee -a "$LOG_FILE"
echo "Run script created: $MCP_DIR/run.sh" | tee -a "$LOG_FILE"
