# Modular Nginx Configuration

This directory contains modular nginx configuration files that allow different services to be deployed independently while sharing the same nginx reverse proxy.

## Directory Structure

```
nginx-modules/
├── upstreams/          # Upstream server definitions
│   └── remotion.conf   # Remotion service upstream
└── locations/          # Location block definitions
    └── remotion.conf   # Remotion service routes
```

## How It Works

1. **Main Configuration**: The main `nginx.conf` includes all files from these directories
2. **Upstream Definitions**: Each service defines its upstream servers in `upstreams/`
3. **Location Blocks**: Each service defines its routing rules in `locations/`

## Adding a New Service

To add a new service (e.g., "myservice"):

1. **Create upstream configuration** (`upstreams/myservice.conf`):

```nginx
upstream myservice {
    server myservice:3002;
}
```

2. **Create location configuration** (`locations/myservice.conf`):

```nginx
location /myservice/ {
    proxy_pass http://myservice/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

3. **Update Docker stack** to include the new configs:

```yaml
configs:
  myservice_upstream_config:
    file: ./infrastructure/configs/nginx-modules/upstreams/myservice.conf
  myservice_location_config:
    file: ./infrastructure/configs/nginx-modules/locations/myservice.conf
```

4. **Mount the configs** in the nginx service:

```yaml
nginx:
  configs:
    - source: myservice_upstream_config
      target: /etc/nginx/conf.d/upstreams/myservice.conf
    - source: myservice_location_config
      target: /etc/nginx/conf.d/locations/myservice.conf
```

## Deployment Strategy

### Option 1: Centralized (Current)

- All configuration files are managed in this infrastructure repo
- Other services just need to connect to the `teamhub_network`
- Update this repo when adding new services

### Option 2: Distributed (Future)

- Each service repo contains its own nginx config files
- Use Docker configs or volumes to inject configurations
- More complex but fully decoupled

## Network Requirements

Services deployed from other projects must:

1. Connect to the `teamhub_network` Docker network
2. Use the service name defined in the upstream configuration
3. Listen on the port specified in the upstream configuration

## Example: Deploying Remotion Service

From the remotion project, create a docker-compose.yml:

```yaml
version: '3.8'
services:
  remotion:
    image: ghcr.io/facundofierro/kadiel-learning/remotion-render:latest
    networks:
      - teamhub_network

networks:
  teamhub_network:
    external: true
```

The nginx configuration will automatically route `/remotion/` requests to this service.
