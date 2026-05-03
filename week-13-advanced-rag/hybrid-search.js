import { generateEmbedding } from "../week-10-rag-pgvector/embeddings.js";
import { searchSimilar } from "../week-10-rag-pgvector/rag-database.js";
import { pool } from "../week-10-rag-pgvector/db.js";

export async function textSearch(query, limit = 5) {
  const result = await pool.query(
    `
    SELECT
      d.id AS document_id,
      d.title,
      d.content,
      d.created_at,
      ts_rank(
        to_tsvector('english', d.title || ' ' || d.content),
        plainto_tsquery('english', $1)
      ) AS text_score
    FROM rag_documents d
    WHERE
      to_tsvector('english', d.title || ' ' || d.content)
      @@ plainto_tsquery('english', $1)
    ORDER BY text_score DESC
    LIMIT $2
    `,
    [query, limit]
  );

  return result.rows;
}

function combineResults(vectorResults, textResults) {
  const resultsMap = new Map();

  for (const result of vectorResults) {
    resultsMap.set(result.document_id, {
      document_id: result.document_id,
      title: result.title,
      content: result.content,
      created_at: result.created_at || null,
      vector_distance: result.distance,
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
    } else {
      resultsMap.set(result.document_id, {
        document_id: result.document_id,
        title: result.title,
        content: result.content,
        created_at: result.created_at,
        vector_distance: null,
        text_score: Number(result.text_score),
        found_by_vector: false,
        found_by_text: true,
      });
    }
  }

  return Array.from(resultsMap.values());
}

export async function hybridSearch(query, limit = 5) {
  const embedding = await generateEmbedding(query);

  const vectorResults = await searchSimilar(embedding, limit);
  const textResults = await textSearch(query, limit);
  const combinedResults = combineResults(vectorResults, textResults);

  return {
    query,
    vector_results: vectorResults,
    text_results: textResults,
    combined_results: combinedResults,
  };
}