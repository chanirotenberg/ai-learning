import { withRetry } from "./retryHelper.js";

let attempt = 0;

async function unstableOperation() {
  attempt++;

  console.log(`Running attempt ${attempt}`);

  if (attempt < 3) {
    throw new Error("Temporary failure");
  }

  return "Success after retry";
}

async function main() {
  const result = await withRetry(unstableOperation, {
    retries: 3,
  });

  console.log("Final result:");
  console.log(result);
}

main().catch((error) => {
  console.error("Retry test failed:");
  console.error(error);
  process.exit(1);
});