import { pool } from "../week-10-rag-pgvector/db.js";

export async function getDocumentCount() {
  const result = await pool.query("SELECT COUNT(*) FROM rag_documents");

  return {
    count: Number(result.rows[0].count),
  };
}

export async function searchDocuments({ query }) {
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      content,
      created_at
    FROM rag_documents
    WHERE
      title ILIKE $1
      OR content ILIKE $1
    ORDER BY created_at DESC
    LIMIT 5
    `,
    [`%${query}%`]
  );

  return {
    query,
    documents: result.rows,
  };
}

export async function executeToolCall(toolCall) {
  const toolName = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments || "{}");

  if (toolName === "get_document_count") {
    return getDocumentCount();
  }

  if (toolName === "search_documents") {
    return searchDocuments(args);
  }

  throw new Error(`Unknown tool: ${toolName}`);
}

export async function executeToolCalls(toolCalls) {
  const results = [];

  for (const toolCall of toolCalls) {
    const result = await executeToolCall(toolCall);

    results.push({
      tool_call_id: toolCall.id,
      role: "tool",
      name: toolCall.function.name,
      content: JSON.stringify(result),
    });
  }

  return results;
}