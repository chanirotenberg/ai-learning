import { answerWithRag } from "./rag-answer.js";
import { pool } from "./db.js";

async function main() {
  try {
    const question = "How can AI help software developers?";

    const result = await answerWithRag(question);

    console.log("RAG result:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:");
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

main();