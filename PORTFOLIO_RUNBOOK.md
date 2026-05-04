# AI Knowledge Base Assistant — Runbook

## Purpose

This runbook explains how to run the AI Knowledge Base Assistant locally.

The project includes:

- React frontend
- Node.js backend services
- PostgreSQL with pgvector
- Redis cache
- RAG search
- AI Agent with tools
- Advanced RAG feedback endpoint
- Cost tracking and reliability features

## Prerequisites

Required:

- Node.js 20+
- npm
- Docker Desktop
- PostgreSQL client tools
- OpenAI API key

## Environment Variables

Create a `.env` file in the project root.

Required variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ai_learning_db
RAG_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/rag_db
REDIS_URL=redis://localhost:6379
```

Frontend local variables are in:

```text
ai-frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_CHAT_API_BASE_URL=http://localhost:3003
VITE_SUMMARIES_API_BASE_URL=http://localhost:3004
VITE_RAG_API_BASE_URL=http://localhost:3006
```

## Start Infrastructure

### Start pgvector PostgreSQL

If the container already exists:

```powershell
docker start pgvector-db
```

Check that it is running:

```powershell
docker ps
```

Expected container:

```text
pgvector-db
```

### Start Redis

If the container already exists:

```powershell
docker start redis-cache
```

If Redis does not exist yet:

```powershell
docker run --name redis-cache -p 6379:6379 -d redis:7
```

Check containers:

```powershell
docker ps
```

Expected containers:

```text
pgvector-db
redis-cache
```

## Run Backend Services

Open separate PowerShell windows for services you want to test.

### Week 10 — RAG API

```powershell
node .\week-10-rag-pgvector\server.js
```

Runs on:

```text
http://localhost:3006
```

Test:

```powershell
$body = @{
  question = "How can AI help software developers?"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3006/api/rag-search" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Week 11 — AI Agent API

```powershell
node .\week-11-ai-agents\server.js
```

Runs on:

```text
http://localhost:3007
```

Test:

```powershell
$body = @{
  message = "Summarize AI documents from the last 7 days."
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3007/api/agent" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

Stats endpoint:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3007/api/stats" `
  -Method GET |
ConvertTo-Json -Depth 10
```

### Week 13 — Advanced RAG Feedback API

```powershell
node .\week-13-advanced-rag\server.js
```

Runs on:

```text
http://localhost:3008
```

Test feedback:

```powershell
$body = @{
  query = "AI"
  documentId = 1
  isRelevant = $true
  comment = "Relevant result for AI query"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3008/api/feedback" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

Get feedback:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3008/api/feedback" `
  -Method GET
```

## Run Frontend

```powershell
cd ai-frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

Available frontend screens:

- AI Analyzer
- Chat With History
- All Summaries
- RAG Search

## Useful Tests

### Test Hybrid Search

```powershell
node .\week-13-advanced-rag\test-hybrid-search.js
```

### Test Chunking

```powershell
node .\week-13-advanced-rag\test-chunking.js
```

### Test Retry

```powershell
node .\week-12-reliability-costs\test-retry.js
```

### Test Cost Tracking

```powershell
node .\week-12-reliability-costs\test-cost-tracker.js
```

### Test Embedding Cache

```powershell
node .\week-12-reliability-costs\test-embedding-cache.js
```

### Test RAG Embedding Cache

Run twice:

```powershell
node .\week-10-rag-pgvector\test-search.js
node .\week-10-rag-pgvector\test-search.js
```

The second run should show:

```text
Embedding cache hit
```

## Git Safety Checklist

Before commit, verify that these files/folders are not committed:

- `.env`
- `ai-frontend/.env`
- `node_modules`
- `dist`
- `combined.log`
- `error.log`

Run:

```powershell
git status
```

## Current Status

The project currently runs locally.

Full production deployment is planned after the portfolio version is finalized.