# Hermes - AI-Powered Data Explorer

Hermes is a full-stack application that lets you query your PostgreSQL database using natural language. Think of it as "Perplexity for your data" - ask questions like "What's our revenue this quarter?" and get answers with beautiful visualizations.

![Hermes Screenshot](docs/screenshot.png)

## Features

- 🗣️ **Natural Language Queries** - Ask questions in plain English
- 📊 **Smart Visualizations** - Automatically chooses charts, tables, or text based on the data
- 🔍 **AI-Powered SQL Generation** - Uses OpenAI GPT-4 to convert questions to SQL
- 📈 **Interactive Charts** - Bar, line, area, and pie charts using Recharts
- 🛡️ **Secure** - Read-only queries only, no data modification
- 🐳 **Docker Ready** - Easy deployment with Docker Compose

## Architecture

- **Frontend**: Next.js 15 with React, TypeScript, Tailwind CSS, Recharts
- **Backend**: Clojure with Ring, Reitit, next.jdbc
- **Database**: PostgreSQL 16
- **AI**: OpenAI GPT-4o for text-to-SQL

## Quick Start

### Prerequisites

- Docker and Docker Compose
- OpenAI API key
- (For local dev) Node.js 20+, Clojure CLI tools

### 1. Clone and Configure

```bash
# Copy environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-key-here
```

### 2. Start with Docker (Recommended)

**Development Mode** (just the database):

```bash
# Start PostgreSQL with seed data
docker compose -f docker-compose.dev.yml up -d

# Wait for database to be ready
docker compose -f docker-compose.dev.yml logs -f postgres
```

Then run the backend and frontend locally (see Development section below).

**Production Mode** (everything in Docker):

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Development

### Running Locally

1. **Start the database**:
```bash
docker compose -f docker-compose.dev.yml up -d
```

2. **Start the Clojure backend**:
```bash
cd backend

# Set environment variables
export OPENAI_API_KEY=sk-your-key-here
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=hermes
export DB_USER=hermes
export DB_PASSWORD=hermes

# Run the backend
clojure -M:run
```

3. **Start the Next.js frontend**:
```bash
cd frontend

# Create local env file
cp .env.local.example .env.local

# Install dependencies and run
npm install
npm run dev
```

### Project Structure

```
Hermes/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # React components
│   │   └── lib/             # API client & utilities
│   └── Dockerfile
├── backend/                  # Clojure backend
│   ├── src/hermes/
│   │   ├── core.clj         # Main entry point
│   │   ├── api.clj          # HTTP API handlers
│   │   ├── db.clj           # Database operations
│   │   └── ai.clj           # OpenAI integration
│   ├── deps.edn             # Clojure dependencies
│   └── Dockerfile
├── db/                       # Database files
│   ├── init.sql             # Schema creation
│   └── seed.sql             # Demo data
├── docker-compose.yml        # Production compose
├── docker-compose.dev.yml    # Development compose
└── README.md
```

## Demo Data

The seed data includes a realistic business scenario with:

- **7 Departments**: Sales, Engineering, Marketing, Support, etc.
- **31 Employees**: With roles, salaries, and performance scores
- **30 Products**: Software licenses, cloud services, support plans
- **100 Customers**: Across enterprise, mid-market, and SMB segments
- **1,000+ Orders**: Spanning all of 2024 with realistic distribution
- **Support Tickets**: Throughout the year
- **Marketing Campaigns**: Various channels and metrics
- **Expenses**: Monthly recurring and one-time costs

### Example Queries

Try asking:

- "What's our total revenue for 2024?"
- "Show me monthly revenue trends"
- "Who are our top 5 sales representatives by revenue?"
- "Which products have the highest profit margins?"
- "How many support tickets are still open?"
- "What's the average order value by customer segment?"
- "Show me the marketing campaign ROI"
- "Which department has the highest expenses?"
- "Who are our enterprise customers?"
- "What's the customer satisfaction score trend?"

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/schema` | Get database schema |
| GET | `/api/tables` | List all tables |
| POST | `/api/query` | Execute natural language query |

### Query Request

```json
POST /api/query
{
  "question": "What's our total revenue?"
}
```

### Query Response

```json
{
  "success": true,
  "question": "What's our total revenue?",
  "sql": "SELECT SUM(total) as total_revenue FROM orders WHERE status = 'delivered'",
  "explanation": "Summing all delivered order totals",
  "visualization": "number",
  "data": [{"total_revenue": 2847392.50}],
  "row_count": 1,
  "answer": "Your total revenue from delivered orders is $2,847,392.50.",
  "insights": ["Revenue is up 15% from last quarter"],
  "follow_up_questions": ["How does this compare to last year?"]
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key (required) | - |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `hermes` |
| `DB_USER` | Database user | `hermes` |
| `DB_PASSWORD` | Database password | `hermes` |
| `PORT` | Backend server port | `3001` |
| `NEXT_PUBLIC_API_URL` | Backend URL for frontend | `http://localhost:3001` |

## Security Considerations

- The AI is instructed to only generate SELECT queries
- SQL is validated to ensure it starts with SELECT
- Consider using a read-only database user in production
- API keys should be kept secure and rotated regularly

## Troubleshooting

### Backend won't connect to database

Check that PostgreSQL is running and the seed data was loaded:

```bash
docker compose -f docker-compose.dev.yml ps
docker compose -f docker-compose.dev.yml logs postgres
```

### "OPENAI_API_KEY not set" error

Make sure you've exported the environment variable:

```bash
export OPENAI_API_KEY=sk-your-key-here
```

### Charts not displaying

Check the browser console for errors. Ensure the data returned has numeric values for the Y-axis.

## License

MIT

