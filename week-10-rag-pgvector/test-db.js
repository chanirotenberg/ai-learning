import { pool } from "./db.js";

async function main() {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("RAG DB tables:");
    console.table(result.rows);
  } catch (error) {
    console.error("Database error:");
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

main();