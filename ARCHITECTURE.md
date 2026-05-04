# AI Knowledge Base Assistant — Architecture

## Project Goal

AI Knowledge Base Assistant is a full-stack AI application that helps users search, summarize, and understand documents using AI.

The project combines:

- React frontend
- Node.js backend
- PostgreSQL
- pgvector
- Redis
- OpenAI API
- RAG
- AI Agents with Tool Calling
- Hybrid Search
- Feedback Loop
- Cost Tracking
- Reliability features

## High-Level Architecture

User
→ React Frontend
→ Node.js APIs
→ PostgreSQL + pgvector
→ Redis Cache
→ OpenAI API

## Main Components

### 1. React Frontend

The frontend is located in:

```text
ai-frontend/
```

It includes screens for:

- AI Analyzer
- Chat With History
- All Summaries
- RAG Search

The frontend communicates with local backend APIs using Vite environment variables.

### 2. AI Backend APIs

The project includes several Node.js API modules:

- Week 2: basic AI analysis endpoint
- Week 3–4: PostgreSQL document summarization
- Week 6: chat with history
- Week 7: summaries list and search
- Week 10: RAG search
- Week 11: AI Agent with tools
- Week 13: Advanced RAG feedback endpoint

### 3. PostgreSQL

PostgreSQL stores structured project data:

- documents
- summaries
- chat sessions
- chat messages
- RAG documents
- RAG embeddings
- feedback

### 4. pgvector

pgvector is used for vector search.

It stores embeddings in:

```text
rag_embeddings
```

The embedding column uses:

```text
vector(1536)
```

The RAG flow uses embeddings generated with:

```text
text-embedding-3-small
```

### 5. Redis

Redis is used as a cache layer for embeddings.

Purpose:

- avoid repeated embedding generation for the same text
- reduce API calls
- reduce latency
- reduce cost

Cache duration:

```text
24 hours
```

### 6. RAG Flow

RAG search flow:

```text
User question
→ Generate embedding
→ Search similar documents with pgvector
→ Build context
→ Send question + context to OpenAI
→ Return answer + sources
```

### 7. Advanced RAG Flow

Advanced RAG improves search quality using:

- vector search
- PostgreSQL full text search
- metadata filtering
- re-ranking
- topK result selection
- chunking
- feedback collection

### 8. AI Agent Flow

Agent flow:

```text
User message
→ OpenAI model
→ model decides whether to call a tool
→ Node.js runs the selected tool
→ tool result is returned to the model
→ model returns final answer
```

Current tools:

- get_document_count
- search_documents
- summarize_documents

### 9. Reliability and Cost Controls

The system includes:

- retry logic with p-retry
- rate limiting with express-rate-limit
- cost tracking by tokens and model
- `/api/stats`
- Redis embedding cache

## Data Flow

### RAG Search

```text
Frontend
→ POST /api/rag-search
→ generateEmbedding()
→ Redis cache check
→ pgvector search
→ OpenAI answer generation
→ response with answer, sources, tokens
```

### Agent Request

```text
Frontend or API client
→ POST /api/agent
→ runAgent()
→ OpenAI tool decision
→ execute tool
→ OpenAI final answer
→ response with answer, tools used, tokens, estimated cost
```

### Feedback

```text
User marks result as relevant/not relevant
→ POST /api/feedback
→ PostgreSQL rag_feedback table
→ feedback is saved for future quality analysis
```

## Main Technologies

- JavaScript
- Node.js
- Express
- React
- Vite
- PostgreSQL
- pgvector
- Redis
- Docker
- OpenAI API
- LangChain
- GitHub Actions

## Local Services

### PostgreSQL with pgvector

Docker container:

```text
pgvector-db
```

Connection:

```text
postgresql://postgres:postgres@localhost:5433/rag_db
```

### Redis

Docker container:

```text
redis-cache
```

Connection:

```text
redis://localhost:6379
```

## Current Deployment Status

The project currently runs locally.

Deployment preparation exists in:

- DEPLOYMENT.md
- AWS_DEPLOYMENT_CHECKLIST.md
- GitHub Actions CI workflow

Full production deployment is planned after the portfolio project is finalized.