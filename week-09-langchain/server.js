import "dotenv/config";
import express from "express";
import cors from "cors";

import { analyzeSentiment } from "./chains.js";

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Week 9 LangChain API is running",
  });
});

app.post("/api/analyze-with-chain", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({
        error: "text is required",
      });
    }

    const result = await analyzeSentiment(text.trim());

    res.json({
      input: text,
      result,
      powered_by: "LangChain",
    });
  } catch (error) {
    console.error("LangChain endpoint error:", error.message);

    res.status(500).json({
      error: "Failed to analyze text with LangChain",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Week 9 LangChain server is running on http://localhost:${PORT}`);
});