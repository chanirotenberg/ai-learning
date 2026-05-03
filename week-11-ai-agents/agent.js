import "dotenv/config";
import OpenAI from "openai";
import { tools } from "./tools.js";
import { executeToolCalls } from "./toolImplementations.js";
import { withRetry } from "../week-12-reliability-costs/retryHelper.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function runAgent(userMessage) {
  const messages = [
    {
      role: "system",
      content:
        "You are an AI agent that can use tools to answer questions about RAG documents stored in the database. Use tools when needed. Give clear and concise answers.",
    },
    {
      role: "user",
      content: userMessage,
    },
  ];

  const firstResponse = await withRetry(() =>
    openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      tools,
      tool_choice: "auto",
    })
  );

  const assistantMessage = firstResponse.choices[0].message;
  messages.push(assistantMessage);

  if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
    return {
      answer: assistantMessage.content,
      used_tools: [],
      tokens_used: firstResponse.usage?.total_tokens || 0,
    };
  }

  const toolResults = await executeToolCalls(assistantMessage.tool_calls);
  messages.push(...toolResults);

  const finalResponse = await withRetry(() =>
    openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
    })
  );

  const finalMessage = finalResponse.choices[0].message;

  return {
    answer: finalMessage.content,
    used_tools: assistantMessage.tool_calls.map((toolCall) => toolCall.function.name),
    tool_results: toolResults.map((toolResult) => ({
      name: toolResult.name,
      content: JSON.parse(toolResult.content),
    })),
    tokens_used:
      (firstResponse.usage?.total_tokens || 0) +
      (finalResponse.usage?.total_tokens || 0),
  };
}