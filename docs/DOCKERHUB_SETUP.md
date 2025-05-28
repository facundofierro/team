# DockerHub Setup Guide

## Overview

We've simplified the deployment to use DockerHub directly instead of a private registry through Pinggy tunnels. This eliminates the connectivity issues you've been experiencing.

## Required GitHub Secrets

You need to configure these secrets in your GitHub repository:

### 1. DockerHub Credentials

- `DOCKERHUB_USERNAME` - Your DockerHub username
- `DOCKERHUB_TOKEN` - Your DockerHub access token (not password)

### 2. Server Credentials (existing)

- `SUDO` - Your server sudo password
- `PG_PASSWORD` - PostgreSQL password
- `NEXTCLOUD_ADMIN_PASSWORD` - Nextcloud admin password
- `NEXTCLOUD_DB_PASSWORD` - Nextcloud database password

## Setting up DockerHub Access Token

1. **Login to DockerHub**: Go to https://hub.docker.com/
2. **Create Access Token**:

   - Click on your username → Account Settings
   - Go to Security → Access Tokens
   - Click "New Access Token"
   - Name: `GitHub Actions`
   - Permissions: `Read, Write, Delete`
   - Copy the generated token

3. **Add to GitHub Secrets**:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add `DOCKERHUB_USERNAME` with your DockerHub username
   - Add `DOCKERHUB_TOKEN` with the access token from step 2

## What Changed

### ✅ Simplified Architecture

- **Before**: GitHub Actions → Private Registry via Pinggy → Self-hosted server
- **After**: GitHub Actions → DockerHub → Self-hosted server

### ✅ Removed Components

- Pinggy tunnel setup
- Private Docker registry
- Nginx TLS configuration for registry
- Complex fallback logic

### ✅ Benefits

- **Reliable**: DockerHub has 99.9% uptime
- **Fast**: No tunnel bottlenecks
- **Simple**: Standard Docker workflow
- **Secure**: DockerHub handles TLS/SSL

## Image Naming Convention

Your images will be pushed to:

```
your-dockerhub-username/teamhub:latest
your-dockerhub-username/teamhub:commit-sha
```

## Deployment Flow

1. **Build**: GitHub Actions builds your Docker image
2. **Push**: Image is pushed to DockerHub
3. **Deploy**: Self-hosted server pulls from DockerHub and deploys

## Testing the Setup

After configuring the secrets, trigger a deployment:

1. Push to `main` branch, or
2. Go to Actions → Deploy to Self-Hosted Server → Run workflow

The deployment should now work reliably without the registry connectivity issues.

## Troubleshooting

### If deployment fails:

1. Check that DockerHub credentials are correct
2. Verify your DockerHub username in the secrets
3. Ensure the access token has write permissions

### To verify DockerHub push:

Check your DockerHub repository at: `https://hub.docker.com/r/your-username/teamhub`

## Cost Considerations

- **DockerHub Free**: 1 private repository, unlimited public repositories
- **DockerHub Pro**: $5/month for unlimited private repositories
- **Alternative**: You can make the repository public if it's open source

This approach is much more reliable than private registries behind tunnels and is the industry standard for most Docker deployments.
