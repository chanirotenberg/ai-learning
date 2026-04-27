import { pool } from "./db.js";

async function main() {
  try {
    const result = await pool.query("SELECT id, title FROM documents;");

    console.log("Documents:");
    console.table(result.rows);
  } catch (error) {
    console.error("Database error:");
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

main();