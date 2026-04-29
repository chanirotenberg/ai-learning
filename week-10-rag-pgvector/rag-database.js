import { pool } from "./db.js";

export async function createDocument(title, content) {
  const result = await pool.query(
    `
    INSERT INTO rag_documents (title, content)
    VALUES ($1, $2)
    RETURNING id, title, content, created_at
    `,
    [title, content]
  );

  return result.rows[0];
}

export async function storeEmbedding(documentId, content, embedding) {
  const embeddingString = `[${embedding.join(",")}]`;

  const result = await pool.query(
    `
    INSERT INTO rag_embeddings (document_id, content, embedding)
    VALUES ($1, $2, $3::vector)
    RETURNING id, document_id, content, created_at
    `,
    [documentId, content, embeddingString]
  );

  return result.rows[0];
}

export async function searchSimilar(embedding, limit = 3) {
  const embeddingString = `[${embedding.join(",")}]`;

  const result = await pool.query(
    `
    SELECT
      rag_embeddings.id,
      rag_embeddings.document_id,
      rag_documents.title,
      rag_embeddings.content,
      rag_embeddings.embedding <-> $1::vector AS distance
    FROM rag_embeddings
    JOIN rag_documents ON rag_embeddings.document_id = rag_documents.id
    ORDER BY rag_embeddings.embedding <-> $1::vector
    LIMIT $2
    `,
    [embeddingString, limit]
  );

  return result.rows;
}