import crypto from "crypto";
import { redisClient, connectRedis } from "./redisClient.js";

const EMBEDDING_CACHE_TTL_SECONDS = 24 * 60 * 60;

function createEmbeddingCacheKey(text) {
  const hash = crypto.createHash("sha256").update(text).digest("hex");
  return `embedding:${hash}`;
}

export async function getCachedEmbedding(text) {
  await connectRedis();

  const key = createEmbeddingCacheKey(text);
  const cachedValue = await redisClient.get(key);

  if (!cachedValue) {
    return null;
  }

  return JSON.parse(cachedValue);
}

export async function saveEmbeddingToCache(text, embedding) {
  await connectRedis();

  const key = createEmbeddingCacheKey(text);

  await redisClient.set(key, JSON.stringify(embedding), {
    EX: EMBEDDING_CACHE_TTL_SECONDS,
  });
}

export async function getEmbeddingCacheKey(text) {
  return createEmbeddingCacheKey(text);
}