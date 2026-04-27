import "dotenv/config";

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const config = {
  port: Number(process.env.PORT) || 3002,
  nodeEnv: process.env.NODE_ENV || "development",
  openaiApiKey: requireEnv("OPENAI_API_KEY"),
  databaseUrl: requireEnv("DATABASE_URL"),
  openaiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini",
};