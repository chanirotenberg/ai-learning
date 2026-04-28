import { analyzeSentiment } from "./chains.js";

async function main() {
  try {
    const result = await analyzeSentiment(
      "This tool is simple, useful, and helps me work faster."
    );

    console.log("Sentiment result:");
    console.log(result);
  } catch (error) {
    console.error("Error:");
    console.error(error.message);
  }
}

main();