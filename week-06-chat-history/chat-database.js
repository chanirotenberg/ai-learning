import { pool } from "./db.js";

export async function createSession(title = "New chat") {
  const result = await pool.query(
    `
    INSERT INTO chat_sessions (title)
    VALUES ($1)
    RETURNING id, title, created_at
    `,
    [title]
  );

  return result.rows[0];
}

export async function getMessages(sessionId) {
  const result = await pool.query(
    `
    SELECT id, session_id, role, content, tokens_used, created_at
    FROM chat_messages
    WHERE session_id = $1
    ORDER BY created_at ASC, id ASC
    `,
    [sessionId]
  );

  return result.rows;
}

export async function addMessage(sessionId, role, content, tokensUsed = null) {
  const result = await pool.query(
    `
    INSERT INTO chat_messages (session_id, role, content, tokens_used)
    VALUES ($1, $2, $3, $4)
    RETURNING id, session_id, role, content, tokens_used, created_at
    `,
    [sessionId, role, content, tokensUsed]
  );

  return result.rows[0];
}

export async function sessionExists(sessionId) {
  const result = await pool.query(
    "SELECT id FROM chat_sessions WHERE id = $1",
    [sessionId]
  );

  return result.rows.length > 0;
}