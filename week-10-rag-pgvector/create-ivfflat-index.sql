CREATE INDEX IF NOT EXISTS rag_embeddings_embedding_ivfflat_idx
ON rag_embeddings
USING ivfflat (embedding vector_l2_ops)
WITH (lists = 100);

ANALYZE rag_embeddings;