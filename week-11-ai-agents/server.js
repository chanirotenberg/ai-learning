import "dotenv/config";
import express from "express";
import cors from "cors";
import { runAgent } from "./agent.js";
import {
  generalLimiter,
  aiLimiter,
} from "../week-12-reliability-costs/rateLimiters.js";

const app = express();
const PORT = process.env.AGENT_PORT || 3007;

app.use(cors());
app.use(express.json());

app.use("/api", generalLimiter);

app.get("/", (req, res) => {
  res.json({
    message: "Week 11 AI Agent server is running",
  });
});

app.post("/api/agent", aiLimiter, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "message is required",
      });
    }

    const result = await runAgent(message.trim());

    return res.json({
      message,
      answer: result.answer,
      used_tools: result.used_tools,
      tool_results: result.tool_results || [],
      tokens_used: result.tokens_used,
    });
  } catch (error) {
    console.error("Agent endpoint failed:");
    console.error(error);

    return res.status(500).json({
      error: "Agent failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Week 11 AI Agent server is running on http://localhost:${PORT}`);
});