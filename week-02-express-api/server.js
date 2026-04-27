import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Express API is running",
  });
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({
        error: "text is required",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `Analyze this text in one short paragraph:\n\n${text}`,
    });

    res.json({
      input: text,
      result: response.output_text,
      tokens_used: response.usage?.total_tokens ?? null,
    });
  } catch (error) {
    console.error("OpenAI API error:", error.message);

    res.status(500).json({
      error: "Failed to analyze text",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});