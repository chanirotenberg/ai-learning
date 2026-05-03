import { hybridSearch } from "./hybrid-search.js";

async function main() {
  const result = await hybridSearch("AI", 2, {
    userId: "demo-user",
  });

  console.log("Query:");
  console.log(result.query);

  console.log("\nFilters:");
  console.log(result.filters);

  console.log("\nTopK:");
  console.log(result.topK);

  console.log("\nCombined re-ranked results:");
  console.table(result.combined_results);
}

main().catch((error) => {
  console.error("Hybrid search test failed:");
  console.error(error);
  process.exit(1);
});