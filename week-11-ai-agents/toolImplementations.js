import "dotenv/config";
import OpenAI from "openai";
import { pool } from "../week-10-rag-pgvector/db.js";
import { withRetry } from "../week-12-reliability-costs/retryHelper.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function summarizeDocuments({ query, days = 30 }) {
  const safeDays = Number.isFinite(Number(days)) && Number(days) > 0 ? Number(days) : 30;

  const result = await pool.query(
    `
    SELECT
      id,
      title,
      content,
      created_at
    FROM rag_documents
    WHERE
      (title ILIKE $1 OR content ILIKE $1)
      AND created_at >= NOW() - ($2::int * INTERVAL '1 day')
    ORDER BY created_at DESC
    LIMIT 5
    `,
    [`%${query}%`, safeDays]
  );

  const documents = result.rows;

  if (documents.length === 0) {
    return {
      query,
      days: safeDays,
      summary: "No matching documents found in the selected time range.",
      documents: [],
      tokens_used: 0,
    };
  }

  const context = documents
    .map((document) => `Title: ${document.title}\nContent: ${document.content}`)
    .join("\n\n---\n\n");

  const response = await withRetry(() =>
    openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You summarize documents clearly and briefly. Base your summary only on the provided documents.",
        },
        {
          role: "user",
          content: `Summarize these documents from the last ${safeDays} days:\n\n${context}`,
        },
      ],
    })
  );

  return {
    query,
    days: safeDays,
    summary: response.choices[0].message.content,
    documents,
    tokens_used: response.usage?.total_tokens || 0,
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

  if (toolName === "summarize_documents") {
    return summarizeDocuments(args);
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