import { getDocument, saveSummary } from "./database.js";
import { pool } from "./db.js";

async function main() {
  try {
    const document = await getDocument(1);

    if (!document) {
      console.log("Document not found");
      return;
    }

    console.log("Document:");
    console.log(document);

    const savedSummary = await saveSummary(
      document.id,
      "This is a test summary saved from Node.js.",
      123
    );

    console.log("Saved summary:");
    console.log(savedSummary);
  } catch (error) {
    console.error("Error:");
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

main();