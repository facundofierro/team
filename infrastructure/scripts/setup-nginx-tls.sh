#!/bin/bash

set -e

echo "=== Setting up Nginx with TLS for Docker Registry ==="

# Get the server's local IP
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "Detected server IP: $SERVER_IP"

# Create certificates directory
CERT_DIR="/opt/nginx-certs"

# Helper function to run sudo commands with password if available
run_sudo() {
    if [ -n "$SUDO_PASSWORD" ]; then
        echo "$SUDO_PASSWORD" | sudo -S "$@"
    else
        sudo "$@"
    fi
}

run_sudo mkdir -p "$CERT_DIR"

# Generate self-signed certificate for local use
echo "Generating self-signed certificate..."
run_sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$CERT_DIR/registry.key" \
    -out "$CERT_DIR/registry.crt" \
    -subj "/C=US/ST=Local/L=Local/O=TeamXAgents/OU=Registry/CN=$SERVER_IP" \
    -addext "subjectAltName=IP:$SERVER_IP,IP:127.0.0.1,DNS:localhost,DNS:r1.teamxagents.com"

# Set proper permissions
run_sudo chmod 644 "$CERT_DIR/registry.crt"
run_sudo chmod 600 "$CERT_DIR/registry.key"

echo "✅ Certificate generated"

# Create enhanced nginx configuration with TLS
cat > /tmp/nginx-tls.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream teamhub {
        server teamhub:3000;
    }

    upstream registry {
        server registry:5000;
    }

    upstream remotion {
        server host.docker.internal:6000;
    }

    upstream nextcloud {
        server nextcloud:80;
    }

    # HTTP server (redirect to HTTPS for registry)
    server {
        listen 80;
        listen [::]:80;
        server_name _;

        # Redirect registry requests to HTTPS
        location /v2/ {
            return 301 https://$host$request_uri;
        }

        # Main application (can stay HTTP for internal use)
        location / {
            proxy_pass http://teamhub;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Remotion service
        location /remotion/ {
            proxy_pass http://remotion/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Nextcloud service
        location ^~ /nextcloud/ {
            rewrite ^/nextcloud/(.*) /$1 break;
            proxy_pass http://nextcloud;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Server $host;
            proxy_set_header X-Forwarded-Port $server_port;
            client_max_body_size 10G;
            proxy_buffering off;
            proxy_request_buffering off;
            proxy_set_header Destination $http_destination;
            proxy_redirect / /nextcloud/;
        }

        location ^~ /nextcloud {
            return 301 /nextcloud/;
        }
    }

    # HTTPS server for registry
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name _;

        # SSL configuration
        ssl_certificate /etc/nginx/certs/registry.crt;
        ssl_certificate_key /etc/nginx/certs/registry.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Docker registry (HTTPS only)
        location /v2/ {
            proxy_pass http://registry;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header Proxy "";
            proxy_buffering off;
            client_max_body_size 100M;
            proxy_request_buffering off;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_connect_timeout 300s;
            proxy_send_timeout 300s;
            proxy_read_timeout 300s;
            chunked_transfer_encoding on;
        }

        # Redirect other requests to HTTP
        location / {
            return 301 http://$host$request_uri;
        }
    }
}
EOF

echo "✅ Enhanced nginx configuration created"

# Copy the nginx configuration to the configs directory
echo "Installing nginx TLS configuration..."
cp /tmp/nginx-tls.conf infrastructure/configs/nginx-tls.conf

# Update the docker-compose to use TLS configuration and mount certificates
echo "Updating docker-compose configuration..."

# Create a backup of the current docker-compose
cp infrastructure/docker-compose.yml infrastructure/docker-compose.yml.backup.$(date +%Y%m%d_%H%M%S)

# Update the nginx service in docker-compose.yml to use TLS config and mount certificates
sed -i.bak \
    -e 's|./configs/nginx.conf:/etc/nginx/nginx.conf:ro|./configs/nginx-tls.conf:/etc/nginx/nginx.conf:ro|' \
    -e '/- "80:80"/a\      - "443:443"' \
    -e '/nginx.conf:ro/a\      - '"$CERT_DIR"':/etc/nginx/certs:ro' \
    infrastructure/docker-compose.yml

echo "✅ Docker compose configuration updated"
echo "Certificate files created in: $CERT_DIR"
echo "Enhanced nginx config installed: infrastructure/configs/nginx-tls.conf"

# Restart nginx container to apply TLS configuration
echo "Restarting nginx container with TLS configuration..."
cd infrastructure
docker-compose up -d nginx

echo "✅ Nginx restarted with TLS support"
echo ""
echo "The registry is now available at:"
echo "  - HTTPS: https://$SERVER_IP/v2/"
echo "  - HTTPS: https://r1.teamxagents.com/v2/ (via Pinggy tunnel)"
echo ""
echo "Testing HTTPS registry access..."
sleep 5

# Test HTTPS access
if curl -f --connect-timeout 10 --max-time 30 -k -u docker:k8mX9pL2nQ7vR4wE https://$SERVER_IP/v2/ >/dev/null 2>&1; then
    echo "✅ Registry accessible via HTTPS locally"
else
    echo "⚠️ Registry not accessible via HTTPS locally - check nginx logs"
fi

if curl -f --connect-timeout 10 --max-time 30 -k -u docker:k8mX9pL2nQ7vR4wE https://r1.teamxagents.com/v2/ >/dev/null 2>&1; then
    echo "✅ Registry accessible via HTTPS through Pinggy tunnel"
else
    echo "⚠️ Registry not accessible via HTTPS through tunnel - may need time to propagate"
fi
