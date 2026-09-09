# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A week-by-week AI learning curriculum built with Node.js (ESM). Each `week-NN-*` folder is a self-contained project that builds on prior weeks. The progression is:

| Week | Topic |
|------|-------|
| 01 | OpenAI API basics |
| 02 | Express API wrapper around OpenAI |
| 03 | PostgreSQL + AI summarization |
| 04 | Production patterns (config, logging, validation, error handling) |
| 06 | Persistent chat history |
| 07 | Summaries list |
| 09 | LangChain chains and prompts |
| 10 | RAG with pgvector (embeddings, vector search) |
| 11 | AI agents with tool calling |
| 12 | Reliability & cost tracking (retry, Redis embedding cache, cost per token) |
| 13 | Advanced RAG (chunking, hybrid search, metadata filters, feedback) |
| 15 | Anthropic / Claude API |

## Commands

```sh
# Run all tests
npm test

# Run a single test file
node --test tests/chunking.test.js

# Run a standalone week script directly
node week-01-openai-api/test.js

# Start a week's Express server (each server has its own PORT env var)
node week-04-production-quality/server.js
```

## Environment

Create a `.env` file at the repo root. Required keys vary by week:

```
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OPENAI_MODEL=gpt-4.1-mini       # default used by several weeks
DATABASE_URL=                    # PostgreSQL connection string (weeks 3+)
REDIS_URL=                       # Redis URL (week 12)
```

Each week's server reads its own port variable (e.g. `ADVANCED_RAG_PORT=3008`); if unset it falls back to a hardcoded default.

## Architecture patterns

**Module system**: All files use ES modules (`import`/`export`). The root `package.json` has `"type": "module"`.

**Database layer**: Each week that uses Postgres has a `db.js` (raw `pg` pool) and a `*-database.js` (query functions). Later weeks import earlier weeks' `db.js` directly (e.g. week-13 imports from `../week-10-rag-pgvector/db.js`).

**RAG pipeline** (weeks 10–13):
- `embeddings.js` — calls OpenAI `text-embedding-3-small` to get 1536-dim vectors
- `rag-database.js` — stores vectors in `rag_embeddings` via pgvector; cosine/L2 search via `<->` operator
- `rag-answer.js` — retrieves top-k similar chunks, feeds them as context to chat completion
- Week 13 adds hybrid search (vector + PostgreSQL full-text `ts_rank`) combined at 70/30 weight

**Reliability layer** (week 12, reused in week 11):
- `retryHelper.js` — wraps calls with `p-retry`
- `embeddingCache.js` — caches embedding vectors in Redis by SHA-256 hash of input text (24h TTL)
- `costTracker.js` — calculates USD cost from token counts using per-model pricing table

**AI agents** (week 11): Two-turn loop — first completion may return `tool_calls`, which are dispatched to `toolImplementations.js`, then a second completion uses the tool results to produce the final answer.

**Production patterns** (week 4, sets the standard): `config.js` centralises env vars, `logger.js` uses Winston, `validation.js` uses Joi, `errors.js` exports typed error constructors, central Express error-handler middleware.

## Tests

Tests live in `tests/` and use Node's built-in `node:test` + `node:assert/strict`. The integration test (`hybrid-search.integration.test.js`) requires a running Postgres instance with seeded data.

# Workflow לפיתוח פיצ'רים

כשמקבלים משימת פיתוח (SDD או תיאור פיצ'ר), פעל/י בסדר הבא, ואל תדלג/י על שלב:

1. **Research** — הפעל/י את סוכן ה-researcher על הקוד הרלוונטי
2. **Design** — הפעל/י את ה-architect לבדוק את הכיוון המוצע
3. **Development** — הפעל/י את ה-developer לממש (רק לאחר אישור התכנון)
4. **Reviews** — הפעל/י את שלושת ה-reviewers (logic, security-perf, readability) **במקביל**
5. **Fixes** — אם reviewer כלשהו סימן חסימה, החזר/י ל-developer לתיקון, וחזור/י לשלב 4
6. **QA** — רק אחרי שכל הביקורות עברו, הפעל/י qa להרצת lint+tests בפועל
7. **Commit** — רק אם QA אישר Green Build, בצע/י commit ממוקד עם הודעה ברורה

אל תדלג/י על שלב גם אם הוא נראה מיותר. אל תיצור/י commit לפני Green Build.
כל Story = commit נפרד. אל תערבב/י כמה שינויים ל-commit אחד.
8. **Release** — אחרי commit מקומי מוצלח, הפעל/י את סוכן ה-release-manager. הוא יציג סיכום מלא של מה שהולך להידחף (commits, branch, קבצים) ויחכה לאישור מפורש שלך בטקסט לפני שהוא מריץ git push. **לעולם אל תדחוף/י ישירות בלי לעבור דרך השלב הזה.**
