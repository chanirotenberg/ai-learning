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

SELECT id, title, metadata
FROM rag_documents
ORDER BY id;