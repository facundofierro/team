-- This script only runs on new database initialization
-- For existing databases, you'll need to manually run: CREATE EXTENSION IF NOT EXISTS vector;

-- Enable pgvector extension if this is a new database
CREATE EXTENSION IF NOT EXISTS vector;
