#!/usr/bin/env bash
set -e

# Load environment variables from .env if present
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Default to port 8000 if PORT not set
: ${PORT:=8000}

# Ensure the SQLite DB file exists (SQLite will create it on first write)
DB_PATH=$(echo $DATABASE_URL | sed -E 's|sqlite:///||')
if [ ! -f "$DB_PATH" ]; then
  touch "$DB_PATH"
fi

# Run database migrations
alembic upgrade head

# Optional: seed initial data (ignore errors if already seeded)
python seed.py || true

# Start the FastAPI application
exec uvicorn main:app --host 0.0.0.0 --port $PORT
