import { pool } from "./db.js";

export async function getDocument(id) {
  const result = await pool.query(
    "SELECT id, title, content FROM documents WHERE id = $1",
    [id]
  );

  return result.rows[0] || null;
}

export async function saveSummary(documentId, summary, tokensUsed) {
  const result = await pool.query(
    `
    INSERT INTO summaries (document_id, summary, tokens_used)
    VALUES ($1, $2, $3)
    RETURNING id, document_id, summary, tokens_used, created_at
    `,
    [documentId, summary, tokensUsed]
  );

  return result.rows[0];
}