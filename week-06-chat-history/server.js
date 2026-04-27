import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

import {
  createSession,
  getMessages,
  addMessage,
  sessionExists,
} from "./chat-database.js";

const app = express();
const PORT = process.env.PORT || 3003;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Week 6 Chat History API is running",
  });
});

app.post("/api/chat/session", async (req, res) => {
  try {
    const { title } = req.body;

    const session = await createSession(title || "New chat");

    res.status(201).json({
      session,
    });
  } catch (error) {
    console.error("Create session error:", error.message);

    res.status(500).json({
      error: "Failed to create chat session",
      details: error.message,
    });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !Number.isInteger(Number(sessionId))) {
      return res.status(400).json({
        error: "sessionId is required and must be a number",
      });
    }

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        error: "message is required",
      });
    }

    const numericSessionId = Number(sessionId);

    const exists = await sessionExists(numericSessionId);

    if (!exists) {
      return res.status(404).json({
        error: "Chat session not found",
      });
    }

    await addMessage(numericSessionId, "user", message.trim());

    const history = await getMessages(numericSessionId);

    const openaiMessages = history.map((item) => ({
      role: item.role,
      content: item.content,
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Answer clearly and briefly.",
        },
        ...openaiMessages,
      ],
    });

    const assistantMessage = response.choices[0].message.content;
    const tokensUsed = response.usage?.total_tokens ?? null;

    const savedAssistantMessage = await addMessage(
      numericSessionId,
      "assistant",
      assistantMessage,
      tokensUsed
    );

    const updatedMessages = await getMessages(numericSessionId);

    res.json({
      sessionId: numericSessionId,
      answer: savedAssistantMessage.content,
      tokens_used: tokensUsed,
      messages: updatedMessages,
    });
  } catch (error) {
    console.error("Chat error:", error.message);

    res.status(500).json({
      error: "Failed to process chat message",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Week 6 chat server is running on http://localhost:${PORT}`);
});