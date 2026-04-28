import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  temperature: 0,
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Answer clearly and briefly.",
  ],
  [
    "user",
    "Analyze the sentiment of this text and explain why: {text}",
  ],
]);

const chain = prompt.pipe(model);

async function main() {
  try {
    const response = await chain.invoke({
      text: "This product is very useful and saves me a lot of time.",
    });

    console.log("LangChain response:");
    console.log(response.content);
  } catch (error) {
    console.error("Error:");
    console.error(error.message);
  }
}

main();