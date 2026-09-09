import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function basicCall() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Missing ANTHROPIC_API_KEY in .env");
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "Explain in simple terms what makes Claude different from other AI models.",
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");

  console.log("=== Claude Response ===");
  console.log(textBlock?.text ?? "No text response");

  console.log("\n=== Token Usage ===");
  console.log(`Input tokens: ${message.usage.input_tokens}`);
  console.log(`Output tokens: ${message.usage.output_tokens}`);
}

basicCall().catch((error) => {
  console.error("Claude API test failed:");
  console.error(error.message);
  process.exit(1);
});