import { calculateCost } from "./costTracker.js";

const result = calculateCost({
  model: "gpt-4o-mini",
  promptTokens: 1000,
  completionTokens: 500,
});

console.log("Cost tracking result:");
console.log(result);