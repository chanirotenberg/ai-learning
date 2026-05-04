# AI Learning

## AI Knowledge Base Assistant

AI Knowledge Base Assistant is a practical full-stack AI portfolio project.

It demonstrates how to build real AI features using Node.js, React, PostgreSQL, pgvector, Redis, OpenAI API, RAG, AI Agents, Tool Calling, Hybrid Search, Cost Tracking, Rate Limiting, Retry logic, Embedding Cache, and Feedback Loop.

The project includes:

- React frontend for AI interactions
- Express APIs for AI analysis, chat, summaries, RAG, agents, and feedback
- PostgreSQL database for structured data
- pgvector for semantic search
- Redis for embedding cache
- AI Agent with tool calling
- Advanced RAG with hybrid search, metadata filtering, re-ranking, chunking, and feedback
- Documentation, architecture, and runbook for portfolio presentation

Main portfolio docs:

- `ARCHITECTURE.md`
- `PORTFOLIO_RUNBOOK.md`
- `DEPLOYMENT.md`
- `AWS_DEPLOYMENT_CHECKLIST.md`

## Quick Start

Start infrastructure:

```powershell
docker start pgvector-db
docker start redis-cache
```

Run RAG API:

```powershell
node .\week-10-rag-pgvector\server.js
```

Run Agent API:

```powershell
node .\week-11-ai-agents\server.js
```

Run Advanced RAG Feedback API:

```powershell
node .\week-13-advanced-rag\server.js
```

Run frontend:

```powershell
cd ai-frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

Main local endpoints:

```text
POST http://localhost:3006/api/rag-search
POST http://localhost:3007/api/agent
GET  http://localhost:3007/api/stats
POST http://localhost:3008/api/feedback
GET  http://localhost:3008/api/feedback
```
This repository documents my practical AI learning path.

## Week 1 — OpenAI API Hello World

In this week I created a basic Node.js project that connects to the OpenAI API and sends a first request to an AI model.

## What I did

- Created an OpenAI API key
- Stored the key safely in a `.env` file
- Installed the `openai` and `dotenv` packages
- Created a basic test file
- Sent a request to the OpenAI API
- Printed the AI response in the terminal

## How to run

1. Install dependencies:

npm install

2. Create a `.env` file in the project root:

OPENAI_API_KEY=your_api_key_here

3. Run the Week 1 test:

node .\week-01-openai-api\test.js

## Example output

AI is technology that lets computers do tasks that usually need human intelligence, like understanding language, recognizing images, and making decisions.

## Project structure

AiLearning/
├─ week-01-openai-api/
│  └─ test.js
├─ .env
├─ .gitignore
├─ package.json
├─ package-lock.json
└─ README.md

## Security notes

- The `.env` file contains the API key and must not be committed to GitHub.
- The `.gitignore` file should include:

.env
node_modules

## Current status

Week 1 basic API connection is working successfully.

## Completed

- API key created
- Environment variable configured
- Dependencies installed
- Test file created
- OpenAI API request sent successfully
- AI response received in the terminal

## Next steps

- Upload the project to GitHub
- Add a screenshot of the successful run
- Continue to Week 2: building a real Express API endpoint

## Week 2 — Express AI API Endpoint

In this week I built a real Express API endpoint that receives text, sends it to the OpenAI API, and returns a JSON response.

## What I built

- Express server running on port 3000
- GET `/` health endpoint
- POST `/api/analyze` endpoint
- JSON request body support
- Input validation for empty text
- OpenAI API call from the backend
- JSON response with input, result, and tokens_used
- Basic error handling

## How to run Week 2

Start the server:

node .\week-02-express-api\server.js

Send a valid request from PowerShell:

$body = @{
  text = "AI can help developers build products faster."
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/analyze" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

Test validation with empty text:

$body = @{
  text = ""
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/analyze" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

Expected validation response:

{"error":"text is required"}

## Week 2 status

Completed:

- Installed Express
- Created `server.js`
- Built a basic Express server on port 3000
- Added POST `/api/analyze`
- Received JSON in the format `{ text: "..." }`
- Validated that text is not empty
- Sent text to OpenAI
- Returned JSON response
- Returned `tokens_used`
- Tested valid request
- Tested empty text error handling
## Week 3 — PostgreSQL AI Summarization

In this week I connected the AI backend to real data stored in PostgreSQL.

## What I built

- PostgreSQL database named `ai_learning_db`
- `documents` table for storing source documents
- `summaries` table for storing AI-generated summaries
- Node.js PostgreSQL connection using the `pg` package
- `getDocument(id)` function for reading a document from the database
- `saveSummary(documentId, summary, tokensUsed)` function for saving summaries
- Script that reads a document, summarizes it with OpenAI, and saves the result
- Express endpoint: `POST /api/documents/:id/summarize`

## Database tables

Documents table:

documents
- id
- title
- content
- created_at

Summaries table:

summaries
- id
- document_id
- summary
- tokens_used
- created_at

## How to run Week 3

Start the Week 3 server:

node .\week-03-postgres-ai\server.js

Summarize document with id 1:

Invoke-RestMethod `
  -Uri "http://localhost:3001/api/documents/1/summarize" `
  -Method POST

Expected successful response includes:

- document_id
- title
- summary
- tokens_used
- summary_id

Test missing document:

Invoke-RestMethod `
  -Uri "http://localhost:3001/api/documents/999/summarize" `
  -Method POST

Expected error response:

{"error":"Document not found"}

## Week 3 status

Completed:

- PostgreSQL installed and running locally
- Created `ai_learning_db`
- Created `documents` and `summaries` tables
- Inserted sample document
- Connected Node.js to PostgreSQL
- Created `db.js`
- Created `database.js`
- Implemented `getDocument`
- Implemented `saveSummary`
- Summarized a document with OpenAI
- Saved AI summary back to PostgreSQL
- Built Express endpoint for document summarization
- Tested valid document id
- Tested missing document id

## Week 4 — Production Quality Improvements

In this week I improved the AI backend so it is closer to production quality.

## What I built

- Centralized configuration file: `config.js`
- Required environment variable validation
- `.env.example` file for documenting required environment variables
- Centralized Winston logger
- `combined.log` for all logs
- `error.log` for errors only
- `.gitignore` update to prevent log files from being committed
- Joi validation for route parameters
- Centralized error handling middleware
- Cleaner Express server structure
- Better error responses for invalid input and missing documents

## Environment variables

The real `.env` file is not committed to GitHub.

Example variables are documented in `.env.example`:

- `OPENAI_API_KEY`
- `DATABASE_URL`
- `PORT`
- `NODE_ENV`
- `OPENAI_MODEL`

## How to run Week 4

Start the server:

node .\week-04-production-quality\server.js

Summarize document with id 1:

Invoke-RestMethod `
  -Uri "http://localhost:3002/api/documents/1/summarize" `
  -Method POST

Test invalid document id:

Invoke-RestMethod `
  -Uri "http://localhost:3002/api/documents/abc/summarize" `
  -Method POST

Expected validation error:

{"error":"\"id\" must be a number"}

Test missing document:

Invoke-RestMethod `
  -Uri "http://localhost:3002/api/documents/999/summarize" `
  -Method POST

Expected not found error:

{"error":"Document not found"}

## Week 4 status

Completed:

- Installed Joi
- Installed Winston
- Created `config.js`
- Created `logger.js`
- Created `validation.js`
- Created `errors.js`
- Created production-quality `server.js`
- Added centralized error middleware
- Added validation for document id
- Added structured logs
- Added `.env.example`
- Ignored `.env`, `node_modules`, and log files
- Tested successful summarization
- Tested invalid id validation
- Tested missing document handling

## Week 5 — React UI for AI Endpoint

In this week I built a React frontend that connects to the Express AI endpoint.

## What I built

- React app using Vite
- `AISummarizer` component
- Textarea for user input
- Analyze button
- Loading state while calling the backend
- Error message for empty input or server errors
- AI response display
- Tokens used display
- Frontend request to the backend using Axios

## Frontend location

The Week 5 frontend is located in:

ai-frontend/

## Backend used

The frontend calls the Week 2 backend endpoint:

POST http://localhost:3000/api/analyze

## How to run Week 5

Start the backend from the project root:

node .\week-02-express-api\server.js

Start the frontend:

cd ai-frontend
npm run dev

Open:

http://localhost:5173

## Week 5 status

Completed:

- Created Vite React project
- Installed dependencies
- Installed Axios
- Created `AISummarizer.jsx`
- Added textarea input
- Added Analyze button
- Added loading state
- Added error display
- Displayed AI response from the backend
- Displayed tokens used
- Tested successful request
- Tested empty input error
## Week 6 — AI Chat With History

In this week I built a chat feature that saves conversation history in PostgreSQL.

## What I built

- `chat_sessions` table
- `chat_messages` table
- `createSession` function
- `getMessages` function
- `addMessage` function
- `POST /api/chat/session` endpoint
- `POST /api/chat` endpoint
- Backend support for chat history
- Frontend `ChatBot.jsx` component
- Automatic session creation when the component loads
- Display of user and assistant messages
- Message input and Send button
- Loading state while sending
- Empty message validation
- Automatic scroll to the latest message
- Saving user and assistant messages in PostgreSQL
- Returning tokens used for assistant responses

## Database tables

chat_sessions:
- id
- title
- created_at

chat_messages:
- id
- session_id
- role
- content
- tokens_used
- created_at

## Backend endpoints

Create chat session:

POST http://localhost:3003/api/chat/session

Send chat message:

POST http://localhost:3003/api/chat

Example request body:

{
  "sessionId": 6,
  "message": "Explain why saving chat history in a database is useful."
}

## Frontend

The chat UI is located in:

ai-frontend/src/components/ChatBot.jsx

The frontend includes navigation between:

- AI Analyzer
- Chat With History

## How to run Week 6

Start the Week 6 backend:

node .\week-06-chat-history\server.js

Start the frontend:

cd ai-frontend
npm run dev

Open:

http://localhost:5173

## Week 6 status

Completed:

- Created `chat_sessions` and `chat_messages` tables
- Implemented `createSession`
- Implemented `getMessages`
- Implemented `addMessage`
- Added `POST /api/chat/session`
- Added `POST /api/chat`
- Saved user messages in PostgreSQL
- Saved assistant messages in PostgreSQL
- Sent chat history to OpenAI
- Built `ChatBot.jsx`
- Created session on component load
- Displayed user and assistant messages
- Added Send button
- Added loading state
- Added empty message validation
- Added auto-scroll to latest message
- Verified messages are saved in PostgreSQL

## Week 7 — Summaries List and Search

In this week I built a summaries management screen that displays AI summaries saved in PostgreSQL.

## What I built

- `GET /api/summaries` endpoint
- Basic pagination with `page` and `limit`
- Sorting summaries by `created_at DESC`
- `GET /api/summaries/search?q=...` endpoint
- Search by document title, document content, or summary text
- React `SummariesList.jsx` component
- Search input
- Summary cards
- Loading state
- Empty state when no results are found
- Navigation between AI Analyzer, Chat With History, and All Summaries
- Responsive layout for smaller screens

## Backend endpoints

Get all summaries:

GET http://localhost:3004/api/summaries

Search summaries:

GET http://localhost:3004/api/summaries/search?q=AI

## Frontend

The summaries UI is located in:

ai-frontend/src/components/SummariesList.jsx

The app navigation now includes:

- AI Analyzer
- Chat With History
- All Summaries

## How to run Week 7

Start the Week 7 backend:

node .\week-07-summaries-list\server.js

Start the frontend:

cd ai-frontend
npm run dev

Open:

http://localhost:5173

## Week 7 status

Completed:

- Added `GET /api/summaries`
- Added basic pagination
- Added sorting by `created_at`
- Added `GET /api/summaries/search`
- Added search by title, content, and summary
- Created `SummariesList.jsx`
- Displayed summaries as cards
- Added search input
- Added loading state
- Added empty state
- Added navigation to All Summaries
- Tested summaries list
- Tested search
- Tested empty state
- Tested responsive layout

## Week 8 — Deployment Preparation and CI

In this week I prepared the project for future production deployment.

## What I built

- Verified that the React frontend builds successfully for production
- Created `DEPLOYMENT.md`
- Created `AWS_DEPLOYMENT_CHECKLIST.md`
- Documented the future AWS architecture
- Prepared frontend environment variables
- Replaced hardcoded frontend API URLs with Vite environment variables
- Added GitHub Actions CI workflow
- Verified that frontend build passes in GitHub Actions

## Frontend production build

Build command:

npm run build

Build output:

ai-frontend/dist

The `dist` folder is generated locally and is not committed to GitHub.

## Frontend environment variables

The frontend now uses Vite environment variables:

- `VITE_API_BASE_URL`
- `VITE_CHAT_API_BASE_URL`
- `VITE_SUMMARIES_API_BASE_URL`

Local example:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_CHAT_API_BASE_URL=http://localhost:3003
VITE_SUMMARIES_API_BASE_URL=http://localhost:3004

```

## Future AWS architecture

The planned deployment architecture is:

React Frontend
→ S3 + CloudFront
→ Node.js Backend on EC2
→ RDS PostgreSQL
→ CloudWatch Logs
→ GitHub Actions CI/CD

## CI

A GitHub Actions workflow was added:

.github/workflows/ci.yml

The CI workflow runs on:

- push to `main`
- pull request to `main`

It performs:

- checkout
- Node.js 20 setup
- `npm ci`
- frontend production build

## Deployment documentation

Deployment planning files:

- `DEPLOYMENT.md`
- `AWS_DEPLOYMENT_CHECKLIST.md`

## Week 8 status

Completed:

- Built React frontend with `npm run build`
- Verified production build works
- Added deployment plan
- Added AWS deployment checklist
- Added frontend env variables
- Removed hardcoded localhost URLs from frontend components
- Added GitHub Actions CI workflow
- Verified CI is green on GitHub
- Pushed all Week 8 work to GitHub

## Week 9 — LangChain Basics

In this week I learned how to use LangChain with OpenAI in Node.js.

## What I built

- Installed `langchain`
- Installed `@langchain/core`
- Installed `@langchain/openai`
- Created a basic LangChain test file
- Used `ChatOpenAI`
- Used `ChatPromptTemplate`
- Built a sentiment analysis chain
- Created reusable `chains.js`
- Added `analyzeSentiment(text)`
- Created an Express endpoint powered by LangChain
- Tested success and validation error scenarios

## LangChain flow

Prompt Template
→ ChatOpenAI model
→ Chain
→ invoke()
→ AI response

## Backend endpoint

Analyze text using LangChain:

POST http://localhost:3005/api/analyze-with-chain

Example request body:

{
  "text": "This feature is clean, fast, and very helpful."
}

Successful response includes:

- input
- result
- powered_by: LangChain

## Raw OpenAI API vs LangChain

Raw OpenAI API is useful for simple direct calls.

LangChain is useful when the flow becomes more structured, for example:

- reusable prompt templates
- multiple steps
- memory
- RAG
- tools
- agents

## How to run Week 9

Start the LangChain server:

node .\week-09-langchain\server.js

Test the endpoint from PowerShell:

$body = @{
  text = "This feature is clean, fast, and very helpful."
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3005/api/analyze-with-chain" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

## Week 9 status

Completed:

- Installed LangChain packages
- Created `test-langchain.js`
- Created `chains.js`
- Created `test-chain.js`
- Created `server.js`
- Built a sentiment analysis chain
- Connected the chain to Express
- Added `/api/analyze-with-chain`
- Tested a successful request
- Tested empty text validation
- Compared raw OpenAI API with LangChain

## Week 10 — Vector DB and Basic RAG with pgvector

In this week I built a real RAG flow using PostgreSQL with pgvector.

## What I built

- Installed Docker Desktop
- Ran PostgreSQL with pgvector in Docker
- Created a separate RAG database named `rag_db`
- Enabled the `vector` extension
- Created `rag_documents` table
- Created `rag_embeddings` table with `embedding vector(1536)`
- Connected Node.js to the Docker PostgreSQL database using `RAG_DATABASE_URL`
- Generated embeddings with OpenAI `text-embedding-3-small`
- Stored embeddings in pgvector
- Built semantic search with pgvector distance search
- Built a basic RAG answer flow
- Added `POST /api/rag-search`

## RAG architecture

User question
→ OpenAI embedding
→ pgvector similarity search
→ relevant sources
→ context
→ OpenAI answer
→ answer + sources

## Docker PostgreSQL pgvector

Docker container:

pgvector-db

Database connection:

postgresql://postgres:postgres@localhost:5433/rag_db

## Database tables

rag_documents:

- id
- title
- content
- created_at

rag_embeddings:

- id
- document_id
- content
- embedding vector(1536)
- created_at

## Main files

- `week-10-rag-pgvector/db.js`
- `week-10-rag-pgvector/embeddings.js`
- `week-10-rag-pgvector/rag-database.js`
- `week-10-rag-pgvector/seed-rag.js`
- `week-10-rag-pgvector/test-search.js`
- `week-10-rag-pgvector/rag-answer.js`
- `week-10-rag-pgvector/test-rag.js`
- `week-10-rag-pgvector/server.js`

## Frontend integration

I also connected the Week 10 RAG backend to the React frontend.

What was added:

- New React component: `ai-frontend/src/components/RagSearch.jsx`
- New navigation tab: `RAG Search`
- Frontend request to the RAG backend using Axios
- Question textarea
- Ask RAG button
- Loading state
- Error handling
- AI answer display
- Sources display
- Token usage display

The frontend calls this backend endpoint:

POST http://localhost:3006/api/rag-search

Frontend environment variable:

```env
VITE_RAG_API_BASE_URL=http://localhost:3006
```

The app navigation now includes:

- AI Analyzer
- Chat With History
- All Summaries
- RAG Search

## Endpoint

RAG search endpoint:

POST http://localhost:3006/api/rag-search

Example request:

{
  "question": "How can AI help software developers?"
}

Successful response includes:

- question
- answer
- sources
- tokens_used

## How to run Week 10

Start Docker container if needed:

docker start pgvector-db

Start the RAG API:

node .\week-10-rag-pgvector\server.js

Test from PowerShell:

$body = @{
  question = "How can AI help software developers?"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3006/api/rag-search" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

## Week 10 status

Completed:

- Installed and configured Docker Desktop
- Ran PostgreSQL with pgvector
- Enabled `CREATE EXTENSION vector`
- Created RAG tables
- Verified `vector` extension exists
- Generated embeddings with `text-embedding-3-small`
- Verified embedding dimension is 1536
- Stored embeddings as real pgvector vectors
- Implemented `generateEmbedding`
- Implemented `storeEmbedding`
- Implemented `searchSimilar`
- Built RAG context from similar documents
- Sent question and context to OpenAI
- Returned answer and sources
- Added `/api/rag-search`
- Tested valid RAG question
- Tested empty question validation

## Week 11 — AI Agents with Tool Calling

In this week I built a basic AI agent that can choose and run tools.

## What I built

- Created a new folder: `week-11-ai-agents`
- Defined tool schemas in `tools.js`
- Implemented tool functions in `toolImplementations.js`
- Built an agent loop in `agent.js`
- Added a test script: `test-agent.js`
- Added an Express server: `server.js`
- Added HTTP endpoint: `POST /api/agent`

## Tools

The agent currently supports three tools:

- `get_document_count`
- `search_documents`
- `summarize_documents`

## Agent flow

User message
→ OpenAI model
→ model decides whether to call a tool
→ Node.js runs the selected tool
→ tool result is returned to the model
→ model returns final answer

## Backend endpoint

Agent endpoint:

POST http://localhost:3007/api/agent

Example request:

```json
{
  "message": "How many RAG documents do I have?"
}
```

Example supported questions:

```text
How many RAG documents do I have?
Search for documents about AI.
Summarize documents about AI.
```

Successful response includes:

- `message`
- `answer`
- `used_tools`
- `tool_results`
- `tokens_used`

## How to run Week 11

Start the Agent server:

```powershell
node .\week-11-ai-agents\server.js
```

Test from PowerShell:

```powershell
$body = @{
  message = "Summarize documents about AI."
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3007/api/agent" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

## Week 11 status

Completed:

- Created basic AI agent
- Added tool schema definitions
- Added `get_document_count`
- Added `search_documents`
- Added `summarize_documents`
- Connected tools to the existing RAG database
- Built an agent loop
- Tested tool calling from script
- Added Express endpoint
- Tested tool calling through HTTP
- Verified validation for empty message

## Week 12 — Reliability and Costs

In this week I improved the AI system with retry logic, rate limiting, cost tracking, and Redis caching.

## What I built

- Retry helper using `p-retry`
- Rate limiting using `express-rate-limit`
- Cost tracking by model and token usage
- `/api/stats` endpoint
- Redis cache for embeddings
- Embedding cache with 24-hour TTL
- Cache integration inside `generateEmbedding`

## Retry

Created:

- `week-12-reliability-costs/retryHelper.js`
- `week-12-reliability-costs/test-retry.js`

The retry helper:

- retries failed operations up to 3 times
- logs failed attempts
- helps protect AI calls from temporary network/API failures

## Rate Limiting

Created:

- `week-12-reliability-costs/rateLimiters.js`

Added:

- general limiter for `/api`
- stricter limiter for `POST /api/agent`

The API returns HTTP `429` when too many AI requests are sent.

## Cost Tracking

Created:

- `week-12-reliability-costs/costTracker.js`
- `week-12-reliability-costs/test-cost-tracker.js`

The agent now returns:

- `tokens_used`
- `estimated_cost_usd`

Stats endpoint:

```http
GET /api/stats
```

## Redis Embedding Cache

Redis runs in Docker:

```powershell
docker run --name redis-cache -p 6379:6379 -d redis:7
```

Created:

- `week-12-reliability-costs/redisClient.js`
- `week-12-reliability-costs/embeddingCache.js`
- `week-12-reliability-costs/test-embedding-cache.js`

The embedding cache:

- stores embeddings by text
- uses Redis
- uses a 24-hour TTL
- prevents repeated OpenAI embedding calls for the same text

## How to run Week 12 checks

Test retry:

```powershell
node .\week-12-reliability-costs\test-retry.js
```

Test cost tracking:

```powershell
node .\week-12-reliability-costs\test-cost-tracker.js
```

Test embedding cache:

```powershell
node .\week-12-reliability-costs\test-embedding-cache.js
```

Test RAG embedding cache:

```powershell
node .\week-10-rag-pgvector\test-search.js
node .\week-10-rag-pgvector\test-search.js
```

The second run should show:

```text
Embedding cache hit
```

## Week 12 status

Completed:

- Installed `p-retry`
- Created `retryHelper.js`
- Configured up to 3 retries
- Added failed attempt logging
- Installed `express-rate-limit`
- Added general API rate limit
- Added stricter AI endpoint rate limit
- Verified HTTP 429 response
- Created `costTracker.js`
- Calculated cost by tokens and model
- Returned estimated cost after AI calls
- Added `GET /api/stats`
- Installed Redis
- Installed Node Redis client
- Created Redis client
- Stored embeddings by text
- Configured 24-hour cache TTL
- Verified cache hit
- Verified repeated embedding calls use cache

## Week 13 — Advanced RAG and Quality Improvements

In this week I improved the RAG system with hybrid search, metadata filtering, re-ranking, chunking, and feedback collection.

## What I built

- Hybrid search combining vector search and PostgreSQL full text search
- Metadata filtering by `user_id` and `category`
- Re-ranking with combined scores
- TopK result filtering
- Document chunking with overlap
- Feedback loop for marking search results as relevant or not relevant

## Hybrid Search

Created:

- `week-13-advanced-rag/hybrid-search.js`
- `week-13-advanced-rag/test-hybrid-search.js`

The hybrid search combines:

- pgvector similarity search
- PostgreSQL full text search using `to_tsvector`, `plainto_tsquery`, and `ts_rank`
- merged results without duplicates

## Metadata Filtering

Created:

- `week-13-advanced-rag/add-metadata-column.sql`

Added metadata to `rag_documents`:

```json
{
  "user_id": "demo-user",
  "category": "ai"
}
```

The search supports filtering by:

- `user_id`
- `category`

## Re-ranking

Hybrid results are re-ranked using a combined score:

- vector score
- text score
- weighted final score

The search returns only the topK results.

## Chunking

Created:

- `week-13-advanced-rag/chunking.js`
- `week-13-advanced-rag/test-chunking.js`

The chunking logic supports:

- configurable `chunkSize`
- configurable `overlap`
- splitting long documents into smaller chunks

## Feedback Loop

Created:

- `week-13-advanced-rag/create-feedback-table.sql`
- `week-13-advanced-rag/feedback-database.js`
- `week-13-advanced-rag/server.js`

Added endpoints:

```http
POST /api/feedback
GET /api/feedback
```

Example feedback request:

```json
{
  "query": "AI",
  "documentId": 1,
  "isRelevant": true,
  "comment": "Relevant result for AI query"
}
```

## How to run Week 13 checks

Test hybrid search:

```powershell
node .\week-13-advanced-rag\test-hybrid-search.js
```

Test chunking:

```powershell
node .\week-13-advanced-rag\test-chunking.js
```

Run the Week 13 server:

```powershell
node .\week-13-advanced-rag\server.js
```

Test feedback endpoint:

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

## Week 13 status

Completed:

- Combined vector search with text search
- Used PostgreSQL full text search
- Merged results without duplicates
- Added `metadata JSONB`
- Supported filtering by `user_id`
- Supported filtering by `category`
- Verified filters do not break search
- Calculated combined score
- Re-ranked results
- Returned only topK
- Created `chunkDocument`
- Added configurable `chunkSize`
- Added overlap
- Tested long documents
- Created feedback table
- Added `/api/feedback`
- Saved relevance feedback