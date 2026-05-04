# AI Knowledge Base Assistant — Portfolio Presentation

## 30-Second Summary

AI Knowledge Base Assistant is a full-stack AI project that lets users search, summarize, and understand documents using RAG, AI agents, PostgreSQL, pgvector, Redis, and OpenAI.

The project demonstrates practical AI engineering, not only prompt usage.

## What the Project Shows

- Full-stack development with React and Node.js
- Real OpenAI API integration
- PostgreSQL data storage
- pgvector semantic search
- RAG answer generation with sources
- AI Agent with tool calling
- Redis embedding cache
- Rate limiting and retry logic
- Cost tracking by tokens
- Hybrid search with full text search
- Metadata filtering
- Re-ranking
- Chunking
- Feedback loop

## Main Demo Flow

1. Open the React frontend.
2. Show the RAG Search screen.
3. Ask a question about the documents.
4. Show answer + sources.
5. Show the Agent API with a tool-based question.
6. Show `/api/stats` with cost tracking.
7. Show feedback endpoint saving relevance feedback.
8. Show the architecture document.

## Best Demo Questions

### RAG Search

```text
How can AI help software developers?
```
### Agent Tool Calling

```text
How many RAG documents do I have?
```

```text
Search for documents about AI.
```

```text
Summarize AI documents from the last 7 days.
```

### Advanced RAG

```text
Hybrid search for AI with metadata filtering and re-ranking.
```

## Technical Highlights

### RAG

The system generates embeddings with `text-embedding-3-small`, stores them in PostgreSQL using pgvector, retrieves relevant sources, and sends context to OpenAI.

### Agent

The Agent can choose tools automatically:

- `get_document_count`
- `search_documents`
- `summarize_documents`

### Reliability

The system includes:

- retry for temporary API failures
- rate limiting for AI endpoints
- Redis cache for embeddings
- cost tracking by model and token usage

### Advanced Search

The system combines:

- vector search
- PostgreSQL full text search
- metadata filters
- combined score re-ranking
- topK selection

## How to Explain the Value

This project shows the ability to build AI features inside a real application:

- not only calling ChatGPT
- not only frontend UI
- not only backend API
- but a complete AI workflow with data, search, agents, reliability, cost awareness, and documentation

## Current Status

The project runs locally and is documented with:

- `README.md`
- `ARCHITECTURE.md`
- `PORTFOLIO_RUNBOOK.md`
- `DEPLOYMENT.md`
- `AWS_DEPLOYMENT_CHECKLIST.md`

Production deployment is planned after final portfolio cleanup.