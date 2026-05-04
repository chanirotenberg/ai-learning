CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS rag_documents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS rag_embeddings (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES rag_documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS rag_embeddings_embedding_ivfflat_idx
ON rag_embeddings
USING ivfflat (embedding vector_l2_ops)
WITH (lists = 100);

CREATE TABLE IF NOT EXISTS rag_feedback (
  id SERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  document_id INTEGER REFERENCES rag_documents(id) ON DELETE CASCADE,
  is_relevant BOOLEAN NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE rag_documents
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

UPDATE rag_documents
SET metadata = '{"user_id": "demo-user", "category": "ai"}'::jsonb
WHERE title = 'AI for Developers';

UPDATE rag_documents
SET metadata = '{"user_id": "demo-user", "category": "database"}'::jsonb
WHERE title = 'PostgreSQL Database';

UPDATE rag_documents
SET metadata = '{"user_id": "demo-user", "category": "frontend"}'::jsonb
WHERE title = 'React Frontend';

ANALYZE rag_embeddings;