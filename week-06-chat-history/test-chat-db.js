import {
  createSession,
  addMessage,
  getMessages,
} from "./chat-database.js";
import { pool } from "./db.js";

async function main() {
  try {
    const session = await createSession("Test chat");

    console.log("Created session:");
    console.log(session);

    await addMessage(session.id, "user", "Hello AI");
    await addMessage(session.id, "assistant", "Hello! How can I help?");

    const messages = await getMessages(session.id);

    console.log("Messages:");
    console.table(messages);
  } catch (error) {
    console.error("Error:");
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

main();