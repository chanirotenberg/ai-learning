import "dotenv/config";
import OpenAI from "openai";

import { generateEmbedding } from "./embeddings.js";
import { searchSimilar } from "./rag-database.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function answerWithRag(question) {
  const questionEmbedding = await generateEmbedding(question);

  const similarDocuments = await searchSimilar(questionEmbedding, 3);

  const context = similarDocuments
    .map((doc, index) => {
      return `Source ${index + 1}: ${doc.title}
Content:
${doc.content}`;
    })
    .join("\n\n---\n\n");

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: `You are an AI assistant answering questions using only the provided context.

If the answer is not found in the context, say that the context does not contain enough information.

Context:
${context}

Question:
${question}

Answer clearly and briefly.`,
  });

  return {
    question,
    answer: response.output_text,
    sources: similarDocuments.map((doc) => ({
      document_id: doc.document_id,
      title: doc.title,
      content: doc.content,
      distance: doc.distance,
    })),
    tokens_used: response.usage?.total_tokens ?? null,
  };
}