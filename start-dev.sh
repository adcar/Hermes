#!/bin/bash

# Hermes Development Startup Script
# This script starts all services for local development

set -e

echo "🔮 Starting Hermes Development Environment..."
echo ""

# Check for required environment variables
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  Warning: OPENAI_API_KEY is not set!"
    echo "   Export it with: export OPENAI_API_KEY=sk-your-key-here"
    echo ""
fi

# Start PostgreSQL
echo "📦 Starting PostgreSQL..."
docker compose -f docker-compose.dev.yml up -d

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 3

# Check if postgres is healthy
until docker compose -f docker-compose.dev.yml exec -T postgres pg_isready -U hermes -d hermes > /dev/null 2>&1; do
    echo "   Waiting for database..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"
echo ""

echo "🚀 To start the backend, run:"
echo "   cd backend && clojure -M:run"
echo ""
echo "🚀 To start the frontend, run:"
echo "   cd frontend && npm run dev"
echo ""
echo "📊 Access the app at: http://localhost:3000"
echo "🔧 Backend API at: http://localhost:3001"

