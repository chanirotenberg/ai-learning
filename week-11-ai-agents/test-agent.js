import { runAgent } from "./agent.js";

async function main() {
  const result = await runAgent("Summarize AI documents from the last 7 days.");

  console.log("Agent answer:");
  console.log(result.answer);

  console.log("\nUsed tools:");
  console.log(result.used_tools);

  console.log("\nTool results:");
  console.log(JSON.stringify(result.tool_results, null, 2));

  console.log("\nTokens used:");
  console.log(result.tokens_used);
}

main().catch((error) => {
  console.error("Agent test failed:");
  console.error(error);
  process.exit(1);
});