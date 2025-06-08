#!/bin/bash

echo "🔧 Installing pgvector extension on existing database..."

# Get the PostgreSQL container ID
POSTGRES_CONTAINER=$(docker ps --filter "name=teamhub_postgres" --format "{{.ID}}")

if [ -z "$POSTGRES_CONTAINER" ]; then
    echo "❌ PostgreSQL container not found. Make sure the stack is running."
    exit 1
fi

echo "✅ Found PostgreSQL container: $POSTGRES_CONTAINER"

# Install pgvector extension on the teamhub database
echo "🚀 Installing pgvector extension..."
docker exec "$POSTGRES_CONTAINER" psql -U teamhub -d teamhub -c "CREATE EXTENSION IF NOT EXISTS vector;"

if [ $? -eq 0 ]; then
    echo "✅ pgvector extension installed successfully!"

    # Verify installation
    echo "🔍 Verifying installation..."
    docker exec "$POSTGRES_CONTAINER" psql -U teamhub -d teamhub -c "SELECT extversion FROM pg_extension WHERE extname = 'vector';"

    if [ $? -eq 0 ]; then
        echo "✅ pgvector extension verified!"
    else
        echo "⚠️  pgvector extension installed but verification failed"
    fi
else
    echo "❌ Failed to install pgvector extension"
    exit 1
fi
