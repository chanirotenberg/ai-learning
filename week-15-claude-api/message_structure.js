import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function inspectMessageStructure() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Missing ANTHROPIC_API_KEY in .env");
  }

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 100,
    messages: [
      {
        role: "user",
        content: "Hello Claude. Reply in one short sentence.",
      },
    ],
  });

  console.log("=== Full Response Structure ===");
  console.dir(response, { depth: null });

  console.log("\n=== Important Fields ===");
  console.log("ID:", response.id);
  console.log("Type:", response.type);
  console.log("Role:", response.role);
  console.log("Model:", response.model);
  console.log("Stop reason:", response.stop_reason);
  console.log("Content is array:", Array.isArray(response.content));
  console.log("First content block type:", response.content[0]?.type);
  console.log("Text:", response.content[0]?.text);
  console.log("Usage:", response.usage);
}

inspectMessageStructure().catch((error) => {
  console.error("Claude message structure test failed:");
  console.error(error.message);
  process.exit(1);
});