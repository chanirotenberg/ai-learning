import { generateEmbedding } from "./embeddings.js";
import { createDocument, storeEmbedding } from "./rag-database.js";
import { pool } from "./db.js";

async function main() {
  try {
    const documents = [
      {
        title: "AI for Developers",
        content:
          "Artificial intelligence helps software developers build smarter applications, automate repetitive tasks, analyze text, and generate useful responses.",
      },
      {
        title: "PostgreSQL Database",
        content:
          "PostgreSQL is a powerful relational database used to store structured data, run SQL queries, and manage application records.",
      },
      {
        title: "React Frontend",
        content:
          "React is a frontend JavaScript library used to build interactive user interfaces with components, state, and reusable UI logic.",
      },
    ];

    for (const item of documents) {
      console.log(`Creating document: ${item.title}`);

      const document = await createDocument(item.title, item.content);

      console.log("Generating embedding...");

      const embedding = await generateEmbedding(item.content);

      console.log(`Embedding length: ${embedding.length}`);

      const savedEmbedding = await storeEmbedding(
        document.id,
        item.content,
        embedding
      );

      console.log("Saved embedding:");
      console.log(savedEmbedding);
      console.log("---");
    }

    console.log("RAG seed completed successfully.");
  } catch (error) {
    console.error("Error:");
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

main();