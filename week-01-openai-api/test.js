//AiLearning/week-01-openai-api/test.js
import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = openai.responses.create({
  model: "gpt-5.4-mini",
  input: "Explain AI in one simple sentence.",
  store: true,
});

response.then((result) => console.log(result.output_text));