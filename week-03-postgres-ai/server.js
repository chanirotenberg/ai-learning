import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import { getDocument, saveSummary } from "./database.js";

const app = express();
const PORT = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Week 3 PostgreSQL AI API is running",
  });
});

app.post("/api/documents/:id/summarize", async (req, res) => {
  try {
    const documentId = Number(req.params.id);

    if (!Number.isInteger(documentId) || documentId <= 0) {
      return res.status(400).json({
        error: "Invalid document id",
      });
    }

    const document = await getDocument(documentId);

    if (!document) {
      return res.status(404).json({
        error: "Document not found",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `Summarize this document in one short paragraph:

Title: ${document.title}

Content:
${document.content}`,
    });

    const summaryText = response.output_text;
    const tokensUsed = response.usage?.total_tokens ?? null;

    const savedSummary = await saveSummary(
      document.id,
      summaryText,
      tokensUsed
    );

    res.json({
      document_id: document.id,
      title: document.title,
      summary: savedSummary.summary,
      tokens_used: savedSummary.tokens_used,
      summary_id: savedSummary.id,
    });
  } catch (error) {
    console.error("Summarize error:", error.message);

    res.status(500).json({
      error: "Failed to summarize document",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Week 3 server is running on http://localhost:${PORT}`);
});