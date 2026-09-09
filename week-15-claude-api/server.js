import "dotenv/config";
import express from "express";
import { getHealthStatus } from "./health.js";

const app = express();
const PORT = process.env.CLAUDE_API_PORT || 3009;

app.get("/health", (req, res) => {
  res.json(getHealthStatus());
});

app.listen(PORT, () => {
  console.log(`Week 15 Claude API server is running on http://localhost:${PORT}`);
});
