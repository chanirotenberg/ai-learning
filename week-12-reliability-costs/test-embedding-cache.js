import {
  getCachedEmbedding,
  saveEmbeddingToCache,
  getEmbeddingCacheKey,
} from "./embeddingCache.js";
import { redisClient } from "./redisClient.js";

const text = "AI helps developers build smarter applications.";
const fakeEmbedding = [0.1, 0.2, 0.3];

async function main() {
  const cacheKey = await getEmbeddingCacheKey(text);

  console.log("Cache key:");
  console.log(cacheKey);

  const beforeSave = await getCachedEmbedding(text);

  console.log("\nBefore save:");
  console.log(beforeSave);

  await saveEmbeddingToCache(text, fakeEmbedding);

  const afterSave = await getCachedEmbedding(text);

  console.log("\nAfter save:");
  console.log(afterSave);

  console.log("\nCache hit:");
  console.log(Array.isArray(afterSave) && afterSave.length === fakeEmbedding.length);

  await redisClient.quit();
}

main().catch(async (error) => {
  console.error("Embedding cache test failed:");
  console.error(error);

  if (redisClient.isOpen) {
    await redisClient.quit();
  }

  process.exit(1);
});