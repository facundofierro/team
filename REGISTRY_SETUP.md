# Private Docker Registry Setup

This guide will help you set up a private Docker registry on your server instead of using Docker Hub.

## Benefits of Private Registry

- **Faster deployments**: Images are stored locally
- **Better security**: Full control over your images
- **No external dependencies**: No reliance on Docker Hub
- **Cost savings**: No need for Docker Hub paid plans
- **Network efficiency**: Reduced bandwidth usage

## Setup Instructions

### 1. Initial Setup

Run the setup script to create the necessary volumes and authentication:

```bash
chmod +x setup-registry.sh
./setup-registry.sh
```

This will:

- Create Docker volumes for registry data and authentication
- Set up basic authentication (username: `admin`, password: `k8mX9pL2nQ7vR4wE`)
- Prepare the registry for deployment

### 2. Deploy the Stack

Deploy your application stack which now includes the private registry:

```bash
export PG_PASSWORD="your_postgres_password"
docker stack deploy -c docker-stack.yml teamhub
```

### 3. Configure Docker Client

To push/pull from your private registry, you need to log in:

```bash
docker login localhost:5000
# Username: admin
# Password: k8mX9pL2nQ7vR4wE
```

### 4. Test the Registry

Test that the registry is working:

```bash
# Pull a test image
docker pull hello-world

# Tag it for your registry
docker tag hello-world localhost:5000/hello-world

# Push to your registry
docker push localhost:5000/hello-world

# Pull from your registry
docker pull localhost:5000/hello-world
```

## GitHub Actions Configuration

The GitHub Actions workflow has been updated to:

1. **Ensure registry is deployed** on your self-hosted runner
2. **Build the image** on the GitHub runner
3. **Transfer the image** as an artifact to your self-hosted runner
4. **Load and push** the image to your local registry (via Pinggy tunnel)
5. **Deploy** using the local registry image

## Pinggy Configuration for Registry Access

Since GitHub Actions runs on external servers, your private registry needs to be accessible from the internet. The workflow automatically sets up a Pinggy tunnel to expose your registry:

- **Main app tunnel**: `192.168.88.135:3000` → Your Pinggy static domain
- **Registry tunnel**: `192.168.88.135:5000` → Your Pinggy static domain (different port)

### Finding Your Pinggy Static Domain

1. Check your Pinggy dashboard at https://dashboard.pinggy.io/
2. Or run the helper script: `chmod +x check-pinggy-domain.sh && ./check-pinggy-domain.sh`
3. Your registry will be accessible at: `https://your-static-domain.pinggy.io`

### Updating the Workflow for Your Domain

You'll need to update the workflow to use your actual Pinggy static domain instead of `localhost:5000`. Replace `your-static-domain` with your actual domain in the workflow file.

### Required Changes to GitHub Secrets

You can now **remove** these Docker Hub secrets from your GitHub repository:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## Registry Management

### Changing Authentication

To change the registry username/password:

1. Edit the `setup-registry.sh` script
2. Change the username and password in this line:
   ```bash
   docker run --rm --entrypoint htpasswd httpd:2 -Bbn admin k8mX9pL2nQ7vR4wE > /tmp/registry-auth/htpasswd
   ```
3. Re-run the setup script:
   ```bash
   ./setup-registry.sh
   ```
4. Redeploy the stack

### Viewing Registry Contents

To see what images are stored in your registry:

```bash
# List repositories
curl -X GET http://localhost:5000/v2/_catalog

# List tags for a specific repository
curl -X GET http://localhost:5000/v2/teamhub/tags/list
```

### Registry Storage Location

Registry data is stored in the Docker volume `registry_data`. To backup your registry:

```bash
# Create a backup
docker run --rm -v registry_data:/data -v $(pwd):/backup alpine tar czf /backup/registry-backup.tar.gz -C /data .

# Restore from backup
docker run --rm -v registry_data:/data -v $(pwd):/backup alpine tar xzf /backup/registry-backup.tar.gz -C /data
```

### Cleaning Up Old Images

To remove old images and free up space:

```bash
# This will remove unused images from the registry storage
# Note: This is a simplified cleanup - for production, consider using registry garbage collection
docker exec $(docker ps -q -f name=teamhub_registry) registry garbage-collect /etc/docker/registry/config.yml
```

## Security Considerations

1. **HTTPS**: For production, consider setting up HTTPS for your registry
2. **Firewall**: Ensure port 5000 is only accessible from trusted sources
3. **Authentication**: Change the default credentials
4. **Backup**: Regularly backup your registry data

## Troubleshooting

### Registry Not Accessible

If you can't access the registry:

1. Check if the registry service is running:

   ```bash
   docker service ls | grep registry
   ```

2. Check registry logs:
   ```bash
   docker service logs teamhub_registry
   ```

### Authentication Issues

If you're having authentication problems:

1. Verify the htpasswd file exists:

   ```bash
   docker run --rm -v registry_auth:/auth alpine ls -la /auth
   ```

2. Test authentication:
   ```bash
   curl -u admin:k8mX9pL2nQ7vR4wE http://localhost:5000/v2/_catalog
   ```

### GitHub Actions Failing

If the deployment fails:

1. Check that the self-hosted runner can access the registry
2. Verify the image was built and transferred correctly
3. Check the runner logs for specific error messages

## Migration from Docker Hub

Your existing images on Docker Hub will remain there, but new deployments will use the private registry. If you want to migrate existing images:

```bash
# Pull from Docker Hub
docker pull facundofierro/teamhub:latest

# Tag for local registry
docker tag facundofierro/teamhub:latest localhost:5000/teamhub:latest

# Push to local registry
docker push localhost:5000/teamhub:latest
```
