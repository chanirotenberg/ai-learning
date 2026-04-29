import "dotenv/config";
import express from "express";
import cors from "cors";

import { answerWithRag } from "./rag-answer.js";

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Week 10 RAG API with pgvector is running",
  });
});

app.post("/api/rag-search", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string" || question.trim() === "") {
      return res.status(400).json({
        error: "question is required",
      });
    }

    const result = await answerWithRag(question.trim());

    res.json(result);
  } catch (error) {
    console.error("RAG search error:", error.message);

    res.status(500).json({
      error: "Failed to answer question with RAG",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Week 10 RAG server is running on http://localhost:${PORT}`);
});