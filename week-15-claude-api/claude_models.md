# Claude Models — Week 15 Notes

## Goal

Document the Claude models used in AiLearning and understand when to use each one.

## Main models

### Claude Sonnet 4.6

Use case:
- Main balanced model
- Good for development, reasoning, code, summaries, and agent tasks
- Best default choice for this project

Why we use it:
- Strong quality
- Good reasoning
- Suitable for replacing or comparing with OpenAI endpoints

### Claude Haiku 4.5

Use case:
- Faster and cheaper model
- Good for simple classification, short summaries, routing, and lightweight tasks

When to use:
- High-volume requests
- Simple tasks
- Cost-sensitive flows

### Claude Opus 4.7

Use case:
- Strongest model
- Heavy reasoning
- Complex planning
- Difficult code or architecture tasks

When to use:
- Only when quality matters more than cost
- Not the default for learning tests

## SDK difference: Anthropic vs OpenAI

### Package

Anthropic:

```js
import Anthropic from "@anthropic-ai/sdk";
```

OpenAI:

```js
import OpenAI from "openai";
```

### Client

Anthropic:

```js
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

OpenAI:

```js
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

### API call

Anthropic:

```js
client.messages.create(...)
```

OpenAI:

```js
client.chat.completions.create(...)
```

### Response content

Anthropic returns content as an array:

```js
message.content[0].text
```

OpenAI usually returns:

```js
completion.choices[0].message.content
```

### Stop reason

Anthropic response includes:

```js
message.stop_reason
```

Common values:
- `end_turn`
- `max_tokens`
- `tool_use`

This is useful for understanding why Claude stopped generating.

## Token usage from first successful run

Input tokens: 21  
Output tokens: 338

## Decision for AiLearning

Default model for Week 15:

```text
claude-sonnet-4-6
```

Reason:
- Balanced
- Strong enough for real comparison
- Suitable for backend and frontend integration
- Better default for learning than the most expensive model

## Notes

Do not hardcode API keys in code.

Use:

```env
ANTHROPIC_API_KEY=your_key_here
```

The real `.env` file must stay local and must not be pushed to GitHub.