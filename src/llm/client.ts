import OpenAI from "openai";
import { PROVIDERS } from "./providers";
import type { Provider } from "./providers";
import type { Message } from "../types";

export async function* streamCompletion(
  model: string,
  context: Context,
): AsyncIterable<LLMStreamEvent> {
  const parsedModelName = model.split(":");
  const providerName = parsedModelName[0] as Provider;
  const provider = PROVIDERS[providerName];
  const modelName = parsedModelName[1];

  if (!modelName) {
    yield {
      type: "error",
      error: new Error("Model name missing — use format provider:model"),
    };
    return;
  }

  const apiKey = process.env[provider.apiKeyEnv];
  const client = new OpenAI({ baseURL: provider.baseUrl, apiKey });

  if (!provider) {
    yield {
      type: "error",
      error: new Error(`Unknown provider: ${providerName}`),
    };
    return;
  }

  const stream = await client.chat.completions.create({
    model: modelName,
    stream: true,
    messages: [],
    tools: [],
  });
}

export function convertMessages(messages: Message[]): unknown[] {
  return messages.map((message) => {
    switch (message.role) {
    }
  });
}
