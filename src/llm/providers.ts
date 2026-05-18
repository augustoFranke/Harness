export type Provider = "groq" | "openrouter";

export const PROVIDERS: Record<
  Provider,
  { baseUrl: string; apiKeyEnv: string }
> = {
  groq: {
    baseUrl: "https://api.groq.com/openai/v1",
    apiKeyEnv: "GROQ_API_KEY",
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
  },
};
