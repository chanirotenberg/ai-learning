import "dotenv/config";
import express from "express";
import cors from "cors";
import { runAgent } from "./agent.js";
import {
  generalLimiter,
  aiLimiter,
} from "../week-12-reliability-costs/rateLimiters.js";
import { getCostTrackingStats } from "../week-12-reliability-costs/costTracker.js";

const app = express();
const PORT = process.env.AGENT_PORT || 3007;
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

app.use(cors());
app.use(express.json());

app.use("/api", generalLimiter);

app.get("/", (req, res) => {
  res.json({
    message: "Week 11 AI Agent server is running",
  });
});

app.get("/api/stats", (req, res) => {
  res.json({
    service: "Week 11 AI Agent",
    model,
    cost_tracking: getCostTrackingStats(),
    endpoints: {
      agent: "POST /api/agent",
      stats: "GET /api/stats",
    },
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
      estimated_cost_usd: result.estimated_cost_usd,
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