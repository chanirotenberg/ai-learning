import { pool } from "./db.js";

export async function getSummaries({ page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `
    SELECT
      summaries.id,
      summaries.document_id,
      documents.title,
      summaries.summary,
      summaries.tokens_used,
      summaries.created_at
    FROM summaries
    JOIN documents ON summaries.document_id = documents.id
    ORDER BY summaries.created_at DESC
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  return result.rows;
}

export async function searchSummaries({ query, page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;
  const searchValue = `%${query}%`;

  const result = await pool.query(
    `
    SELECT
      summaries.id,
      summaries.document_id,
      documents.title,
      summaries.summary,
      summaries.tokens_used,
      summaries.created_at
    FROM summaries
    JOIN documents ON summaries.document_id = documents.id
    WHERE documents.title ILIKE $1
       OR documents.content ILIKE $1
       OR summaries.summary ILIKE $1
    ORDER BY summaries.created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [searchValue, limit, offset]
  );

  return result.rows;
}