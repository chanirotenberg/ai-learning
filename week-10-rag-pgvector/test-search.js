import { generateEmbedding } from "./embeddings.js";
import { searchSimilar } from "./rag-database.js";
import { pool } from "./db.js";

async function main() {
  try {
    const question = "How can AI help programmers save time?";

    console.log("Question:");
    console.log(question);

    console.log("Generating question embedding...");
    const questionEmbedding = await generateEmbedding(question);

    console.log("Searching similar documents...");
    const results = await searchSimilar(questionEmbedding, 3);

    console.log("Search results:");
    console.table(
      results.map((item) => ({
        id: item.id,
        document_id: item.document_id,
        title: item.title,
        distance: item.distance,
      }))
    );
  } catch (error) {
    console.error("Error:");
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

main();