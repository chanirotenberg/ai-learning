import test from "node:test";
import assert from "node:assert/strict";
import { chunkDocument } from "../week-13-advanced-rag/chunking.js";

test("chunkDocument splits long text into chunks", () => {
  const text = "a".repeat(500);

  const chunks = chunkDocument(text, {
    chunkSize: 200,
    overlap: 50,
  });

  assert.equal(chunks.length > 1, true);
  assert.equal(chunks[0].start, 0);
  assert.equal(chunks[0].end, 200);
});

test("chunkDocument returns empty array for empty text", () => {
  const chunks = chunkDocument("");

  assert.deepEqual(chunks, []);
});

test("chunkDocument rejects invalid overlap", () => {
  assert.throws(() => {
    chunkDocument("hello world", {
      chunkSize: 100,
      overlap: 100,
    });
  }, /overlap/);
});