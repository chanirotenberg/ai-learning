CREATE TABLE IF NOT EXISTS rag_feedback (
  id SERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  document_id INTEGER REFERENCES rag_documents(id) ON DELETE CASCADE,
  is_relevant BOOLEAN NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'rag_feedback';