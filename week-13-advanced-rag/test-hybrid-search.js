import { hybridSearch } from "./hybrid-search.js";

async function main() {
  const result = await hybridSearch("AI");

  console.log("Query:");
  console.log(result.query);

  console.log("\nVector results:");
  console.table(result.vector_results);

  console.log("\nText results:");
  console.table(result.text_results);

  console.log("\nCombined results:");
  console.table(result.combined_results);
}

main().catch((error) => {
  console.error("Hybrid search test failed:");
  console.error(error);
  process.exit(1);
});