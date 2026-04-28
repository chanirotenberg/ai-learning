import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  temperature: 0,
});

const sentimentPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Analyze text clearly and briefly.",
  ],
  [
    "user",
    "Analyze the sentiment of this text. Return the sentiment and a short explanation:\n\n{text}",
  ],
]);

export const sentimentChain = sentimentPrompt.pipe(model);

export async function analyzeSentiment(text) {
  const response = await sentimentChain.invoke({ text });

  return response.content;
}