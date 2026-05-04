import test from "node:test";
import assert from "node:assert/strict";
import { hybridSearch } from "../week-13-advanced-rag/hybrid-search.js";

test("hybridSearch returns filtered AI document from database", async () => {
  const result = await hybridSearch("AI", 2, {
    userId: "demo-user",
    category: "ai",
  });

  assert.equal(result.query, "AI");
  assert.equal(result.filters.userId, "demo-user");
  assert.equal(result.filters.category, "ai");

  assert.equal(Array.isArray(result.combined_results), true);
  assert.equal(result.combined_results.length >= 1, true);

  const firstResult = result.combined_results[0];

  assert.equal(firstResult.title, "AI for Developers");
  assert.equal(firstResult.metadata.user_id, "demo-user");
  assert.equal(firstResult.metadata.category, "ai");
  assert.equal(typeof firstResult.combined_score, "number");
});