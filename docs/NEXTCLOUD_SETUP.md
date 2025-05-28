# Nextcloud Integration

## Overview

Nextcloud has been integrated into the TeamHub Docker stack and is accessible via the nginx reverse proxy at `/nextcloud`.

## Access

- **URL**: `https://r1.teamxagents.com/nextcloud`
- **Admin User**: `admin`
- **Admin Password**: Set via `NEXTCLOUD_ADMIN_PASSWORD` secret

## Architecture

```
Internet → Pinggy Tunnel → nginx → Nextcloud Container
                                 → Registry Container
                                 → TeamHub Container
```

## Services

1. **nextcloud**: Main Nextcloud application
2. **nextcloud_db**: PostgreSQL database for Nextcloud

## Configuration

- **Database**: PostgreSQL (separate container)
- **Trusted Domains**: `r1.teamxagents.com`, `localhost`
- **Protocol Override**: HTTPS
- **Web Root**: `/nextcloud` (subpath configuration)

## Environment Variables

Set these as GitHub Secrets:

- `NEXTCLOUD_ADMIN_PASSWORD`: Admin password for Nextcloud
- `NEXTCLOUD_DB_PASSWORD`: Database password for Nextcloud

## Features

- ✅ File upload/download
- ✅ WebDAV support
- ✅ Large file uploads (up to 10GB)
- ✅ Proper HTTPS handling
- ✅ Subpath routing (`/nextcloud`)

## Volumes

- `nextcloud_data`: Nextcloud application data
- `nextcloud_db_data`: PostgreSQL database data

## First Time Setup

1. Navigate to `https://r1.teamxagents.com/nextcloud`
2. Login with admin credentials
3. Complete the setup wizard
4. Configure additional users and settings as needed

## Troubleshooting

- Check service status: `docker service ls`
- View logs: `docker service logs teamhub_nextcloud`
- Database logs: `docker service logs teamhub_nextcloud_db`
