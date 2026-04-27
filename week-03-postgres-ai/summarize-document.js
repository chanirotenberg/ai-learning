import "dotenv/config";
import OpenAI from "openai";
import { getDocument, saveSummary } from "./database.js";
import { pool } from "./db.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizeDocument(documentId) {
  const document = await getDocument(documentId);

  if (!document) {
    throw new Error(`Document with id ${documentId} was not found`);
  }

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `Summarize this document in one short paragraph:

Title: ${document.title}

Content:
${document.content}`,
  });

  const summaryText = response.output_text;
  const tokensUsed = response.usage?.total_tokens ?? null;

  const savedSummary = await saveSummary(document.id, summaryText, tokensUsed);

  return {
    document_id: document.id,
    title: document.title,
    summary: savedSummary.summary,
    tokens_used: savedSummary.tokens_used,
    summary_id: savedSummary.id,
  };
}

async function main() {
  try {
    const result = await summarizeDocument(1);

    console.log("AI summary saved successfully:");
    console.log(result);
  } catch (error) {
    console.error("Error:");
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

main();