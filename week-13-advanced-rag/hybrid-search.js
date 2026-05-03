import { generateEmbedding } from "../week-10-rag-pgvector/embeddings.js";
import { pool } from "../week-10-rag-pgvector/db.js";

export async function textSearch(query, limit = 5, filters = {}) {
  const { userId, category } = filters;

  const result = await pool.query(
    `
    SELECT
      d.id AS document_id,
      d.title,
      d.content,
      d.created_at,
      d.metadata,
      ts_rank(
        to_tsvector('english', d.title || ' ' || d.content),
        plainto_tsquery('english', $1)
      ) AS text_score
    FROM rag_documents d
    WHERE
      to_tsvector('english', d.title || ' ' || d.content)
      @@ plainto_tsquery('english', $1)
      AND ($3::text IS NULL OR d.metadata->>'user_id' = $3)
      AND ($4::text IS NULL OR d.metadata->>'category' = $4)
    ORDER BY text_score DESC
    LIMIT $2
    `,
    [query, limit, userId || null, category || null]
  );

  return result.rows;
}

export async function vectorSearchWithMetadata(query, limit = 5, filters = {}) {
  const { userId, category } = filters;
  const embedding = await generateEmbedding(query);

  const result = await pool.query(
    `
    SELECT
      e.id,
      e.document_id,
      d.title,
      e.content,
      d.created_at,
      d.metadata,
      e.embedding <-> $1::vector AS distance
    FROM rag_embeddings e
    JOIN rag_documents d ON d.id = e.document_id
    WHERE
      ($3::text IS NULL OR d.metadata->>'user_id' = $3)
      AND ($4::text IS NULL OR d.metadata->>'category' = $4)
    ORDER BY distance ASC
    LIMIT $2
    `,
    [`[${embedding.join(",")}]`, limit, userId || null, category || null]
  );

  return result.rows;
}

function calculateCombinedScore(result) {
  const vectorScore =
    result.vector_distance === null || result.vector_distance === undefined
      ? 0
      : 1 / (1 + Number(result.vector_distance));

  const textScore = result.text_score ? Number(result.text_score) : 0;

  const vectorWeight = 0.7;
  const textWeight = 0.3;

  return Number((vectorScore * vectorWeight + textScore * textWeight).toFixed(6));
}

function combineResults(vectorResults, textResults) {
  const resultsMap = new Map();

  for (const result of vectorResults) {
    resultsMap.set(result.document_id, {
      document_id: result.document_id,
      title: result.title,
      content: result.content,
      created_at: result.created_at || null,
      metadata: result.metadata || {},
      vector_distance: result.distance,
      text_score: 0,
      found_by_vector: true,
      found_by_text: false,
    });
  }

  for (const result of textResults) {
    const existingResult = resultsMap.get(result.document_id);

    if (existingResult) {
      existingResult.found_by_text = true;
      existingResult.text_score = Number(result.text_score);
      existingResult.created_at = existingResult.created_at || result.created_at;
      existingResult.metadata = existingResult.metadata || result.metadata || {};
    } else {
      resultsMap.set(result.document_id, {
        document_id: result.document_id,
        title: result.title,
        content: result.content,
        created_at: result.created_at,
        metadata: result.metadata || {},
        vector_distance: null,
        text_score: Number(result.text_score),
        found_by_vector: false,
        found_by_text: true,
      });
    }
  }

  return Array.from(resultsMap.values()).map((result) => ({
    ...result,
    combined_score: calculateCombinedScore(result),
  }));
}

export async function hybridSearch(query, limit = 5, filters = {}) {
  const vectorResults = await vectorSearchWithMetadata(query, limit, filters);
  const textResults = await textSearch(query, limit, filters);

  const combinedResults = combineResults(vectorResults, textResults)
    .sort((a, b) => b.combined_score - a.combined_score)
    .slice(0, limit);

  return {
    query,
    filters,
    topK: limit,
    vector_results: vectorResults,
    text_results: textResults,
    combined_results: combinedResults,
  };
}