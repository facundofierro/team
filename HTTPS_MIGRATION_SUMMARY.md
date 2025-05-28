# Pinggy HTTPS Port Forwarding Migration

## Overview

Changed Pinggy tunnel configuration to forward HTTPS traffic directly to nginx port 443 instead of HTTP traffic to port 80. This should resolve Docker registry push retry issues by eliminating HTTP/HTTPS redirect loops.

## Key Changes Made

### 1. Pinggy Systemd Service Configuration

**File**: `infrastructure/systemd/pinggy.service`

- **Changed**: `ExecStart` command from `localhost:80` to `localhost:443`
- **Effect**: Pinggy now forwards HTTPS traffic directly to nginx port 443

### 2. Nginx Infrastructure Configuration

**File**: `infrastructure/configs/nginx-infra.conf`

- **Simplified**: Removed HTTP server block, only HTTPS server on port 443
- **Added**: Proper SSL configuration with certificates
- **Optimized**: Docker registry proxy settings for large uploads
- **Removed**: HTTP redirect loops that were causing issues

### 3. TLS Setup Script

**File**: `infrastructure/scripts/setup-pinggy-tls.sh`

- **Updated**: Port forwarding from `localhost:80` to `localhost:443`
- **Updated**: Comments to reflect HTTPS direct forwarding

### 4. Deployment Scripts

**Files**:

- `infrastructure/scripts/deploy-infrastructure.sh`
- `infrastructure/scripts/deploy-application.sh`

**Changes**:

- Updated registry connectivity checks to use HTTPS (port 443)
- Removed HTTP fallback checks
- Added port 443 availability checks
- Updated curl commands to use `-k` flag for self-signed certificates

### 5. Documentation

**File**: `infrastructure/systemd/README.md`

- Updated manual testing commands to use port 443
- Updated troubleshooting examples

## Traffic Flow (New)

```
External Request → https://r1.teamxagents.com
                ↓
            Pinggy Tunnel (HTTPS)
                ↓
        localhost:443 (nginx HTTPS server)
                ↓
            Docker Registry (port 5000)
```

## Benefits

1. **Eliminates redirect loops**: No more HTTP→HTTPS redirects
2. **End-to-end HTTPS**: Proper SSL/TLS handling throughout
3. **Better Docker compatibility**: Reduces registry push retries
4. **Simplified configuration**: Single HTTPS path instead of HTTP+HTTPS

## Testing

Created `test-https-registry.sh` script to verify:

1. Local HTTPS registry access
2. External HTTPS registry access through tunnel
3. Docker login functionality
4. Small image push test

## Deployment Steps

1. **Update systemd service**: Changes will take effect on next service restart
2. **Deploy new nginx config**: Infrastructure deployment will use new HTTPS-only config
3. **Restart Pinggy service**: Will establish new tunnel forwarding to port 443
4. **Test connectivity**: Use test script to verify everything works

## Rollback Plan

If issues occur, can revert by:

1. Changing `pinggy.service` back to `localhost:80`
2. Reverting nginx config to include HTTP server block
3. Restarting services

## Expected Improvements

- Reduced Docker push retry behavior
- Faster image uploads
- More reliable registry operations
- Cleaner logs without redirect errors
