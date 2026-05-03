import { chunkDocument } from "./chunking.js";

const longDocument = `
Artificial intelligence helps developers build smarter applications.
It can automate repetitive tasks, summarize long documents, analyze text,
generate useful responses, and help users search through large knowledge bases.

Retrieval-Augmented Generation, also known as RAG, combines language models
with external data sources. Instead of relying only on the model's internal
knowledge, the system searches relevant documents and sends them as context
to the model.

Chunking is important because long documents are difficult to search directly.
By splitting a long document into smaller overlapping chunks, the system can
retrieve the most relevant parts more accurately.
`;

const chunks = chunkDocument(longDocument, {
  chunkSize: 200,
  overlap: 40,
});

console.log("Total chunks:");
console.log(chunks.length);

console.log("\nChunks:");
console.table(chunks);

console.log("\nFull chunk content:");
for (const chunk of chunks) {
  console.log(`\n--- Chunk ${chunk.chunk_index} ---`);
  console.log(chunk.content);
}