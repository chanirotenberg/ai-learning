import { pool } from "../week-10-rag-pgvector/db.js";

export async function saveFeedback({ query, documentId, isRelevant, comment = null }) {
  const result = await pool.query(
    `
    INSERT INTO rag_feedback (query, document_id, is_relevant, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING id, query, document_id, is_relevant, comment, created_at
    `,
    [query, documentId, isRelevant, comment]
  );

  return result.rows[0];
}

export async function getFeedback() {
  const result = await pool.query(
    `
    SELECT
      f.id,
      f.query,
      f.document_id,
      d.title,
      f.is_relevant,
      f.comment,
      f.created_at
    FROM rag_feedback f
    LEFT JOIN rag_documents d ON d.id = f.document_id
    ORDER BY f.created_at DESC
    `
  );

  return result.rows;
}