import "dotenv/config";
import express from "express";
import cors from "cors";
import { saveFeedback, getFeedback } from "./feedback-database.js";

const app = express();
const PORT = process.env.ADVANCED_RAG_PORT || 3008;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Week 13 Advanced RAG server is running",
  });
});

app.post("/api/feedback", async (req, res) => {
  try {
    const { query, documentId, isRelevant, comment } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "query is required",
      });
    }

    if (!Number.isInteger(documentId)) {
      return res.status(400).json({
        error: "documentId must be an integer",
      });
    }

    if (typeof isRelevant !== "boolean") {
      return res.status(400).json({
        error: "isRelevant must be boolean",
      });
    }

    const feedback = await saveFeedback({
      query,
      documentId,
      isRelevant,
      comment,
    });

    return res.status(201).json({
      message: "Feedback saved",
      feedback,
    });
  } catch (error) {
    console.error("Save feedback failed:");
    console.error(error);

    return res.status(500).json({
      error: "Failed to save feedback",
    });
  }
});

app.get("/api/feedback", async (req, res) => {
  try {
    const feedback = await getFeedback();

    return res.json({
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    console.error("Get feedback failed:");
    console.error(error);

    return res.status(500).json({
      error: "Failed to get feedback",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Week 13 Advanced RAG server is running on http://localhost:${PORT}`);
});