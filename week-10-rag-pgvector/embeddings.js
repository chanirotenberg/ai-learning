import "dotenv/config";
import OpenAI from "openai";
import {
  getCachedEmbedding,
  saveEmbeddingToCache,
} from "../week-12-reliability-costs/embeddingCache.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text) {
  const cachedEmbedding = await getCachedEmbedding(text);

  if (cachedEmbedding) {
    console.log("Embedding cache hit");
    return cachedEmbedding;
  }

  console.log("Embedding cache miss");

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  const embedding = response.data[0].embedding;

  await saveEmbeddingToCache(text, embedding);

  return embedding;
}