import "dotenv/config";
import express from "express";
import cors from "cors";

import { getSummaries, searchSummaries } from "./summaries-database.js";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Week 7 Summaries API is running",
  });
});

app.get("/api/summaries", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const summaries = await getSummaries({ page, limit });

    res.json({
      page,
      limit,
      count: summaries.length,
      summaries,
    });
  } catch (error) {
    console.error("Get summaries error:", error.message);

    res.status(500).json({
      error: "Failed to get summaries",
      details: error.message,
    });
  }
});

app.get("/api/summaries/search", async (req, res) => {
  try {
    const query = req.query.q;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        error: "Search query is required",
      });
    }

    const summaries = await searchSummaries({
      query: query.trim(),
      page,
      limit,
    });

    res.json({
      query,
      page,
      limit,
      count: summaries.length,
      summaries,
    });
  } catch (error) {
    console.error("Search summaries error:", error.message);

    res.status(500).json({
      error: "Failed to search summaries",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Week 7 summaries server is running on http://localhost:${PORT}`);
});