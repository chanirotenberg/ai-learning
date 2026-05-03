const MODEL_PRICING_PER_1M_TOKENS = {
  "gpt-4o-mini": {
    input: 0.15,
    output: 0.6,
  },
};

export function calculateCost({
  model = "gpt-4o-mini",
  promptTokens = 0,
  completionTokens = 0,
}) {
  const pricing = MODEL_PRICING_PER_1M_TOKENS[model];

  if (!pricing) {
    return {
      model,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: promptTokens + completionTokens,
      estimated_cost_usd: null,
      note: "Pricing for this model is not configured.",
    };
  }

  const inputCost = (promptTokens / 1_000_000) * pricing.input;
  const outputCost = (completionTokens / 1_000_000) * pricing.output;
  const totalCost = inputCost + outputCost;

  return {
    model,
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    total_tokens: promptTokens + completionTokens,
    estimated_cost_usd: Number(totalCost.toFixed(8)),
  };
}

export function getCostTrackingStats() {
  return {
    cost_tracking_enabled: true,
    pricing_unit: "USD per 1M tokens",
    configured_models: MODEL_PRICING_PER_1M_TOKENS,
  };
}