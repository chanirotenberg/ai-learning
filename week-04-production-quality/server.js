import express from "express";
import OpenAI from "openai";

import { config } from "./config.js";
import { logger } from "./logger.js";
import { getDocument, saveSummary } from "./database.js";
import { documentIdSchema, validateParams } from "./validation.js";
import { notFound } from "./errors.js";

const app = express();

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Week 4 Production Quality API is running",
    environment: config.nodeEnv,
  });
});

app.post("/api/documents/:id/summarize", async (req, res, next) => {
  try {
    const { id } = validateParams(documentIdSchema, req.params);

    logger.info("Starting document summarization", {
      documentId: id,
    });

    const document = await getDocument(id);

    if (!document) {
      throw notFound("Document not found");
    }

    const response = await openai.responses.create({
      model: config.openaiModel,
      input: `Summarize this document in one short paragraph:

Title: ${document.title}

Content:
${document.content}`,
    });

    const summaryText = response.output_text;
    const tokensUsed = response.usage?.total_tokens ?? null;

    const savedSummary = await saveSummary(document.id, summaryText, tokensUsed);

    logger.info("Document summarized successfully", {
      documentId: document.id,
      summaryId: savedSummary.id,
      tokensUsed,
    });

    res.json({
      document_id: document.id,
      title: document.title,
      summary: savedSummary.summary,
      tokens_used: savedSummary.tokens_used,
      summary_id: savedSummary.id,
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  logger.error("Request failed", {
    statusCode,
    message: error.message,
    stack: error.stack,
  });

  res.status(statusCode).json({
    error: error.message || "Internal server error",
  });
});

app.listen(config.port, () => {
  logger.info("Server started", {
    port: config.port,
    environment: config.nodeEnv,
  });

  console.log(`Week 4 server is running on http://localhost:${config.port}`);
});