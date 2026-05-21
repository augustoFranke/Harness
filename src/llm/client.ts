import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { LLMStreamEvent, ToolCallContent } from "../types";
import { PROVIDERS } from "./providers";
import type { Provider } from "./providers";
import type { Message } from "../types";
import type { Context } from "../types";
import type { TextContent } from "../types";

export async function* streamCompletion(
  model: string,
  context: Context,
): AsyncIterable<LLMStreamEvent> {
  const parsedModelName = model.split(":");
  const providerName = parsedModelName[0] as Provider;
  const provider = PROVIDERS[providerName];
  const modelName = parsedModelName[1];

  if (!provider) {
    yield {
      type: "error",
      error: new Error(`Unknown provider: ${providerName}`),
    };
    return;
  }
  if (!modelName) {
    yield {
      type: "error",
      error: new Error("Model name missing — use format provider:model"),
    };
    return;
  }

  const apiKey = process.env[provider.apiKeyEnv];
  const client = new OpenAI({ baseURL: provider.baseUrl, apiKey });

  const stream = await client.chat.completions.create({
    model: modelName,
    stream: true,
    messages: convertMessages(context.messages) as ChatCompletionMessageParam[],
    tools: [],
  });
}

export function convertMessages(messages: Message[]): unknown[] {
  return messages.map((message) => {
    switch (message.role) {
      case "user":
        return { role: "user", content: message.content };
      case "assistant":
        const textContent = message.content
          .filter((block) => block.type === "text")
          .map((block) => (block as TextContent).text)
          .join("");
        const toolCall = message.content
          .filter((block) => block.type === "toolCall")
          .map((block) => {
            const b = block as ToolCallContent;
            return {
              id: b.id,
              type: "function",
              function: {
                name: b.name,
                arguments: JSON.stringify(b.arguments),
              },
            };
          });
        return {
          role: "assistant",
          content: textContent,
          tool_calls: toolCall,
        };
      case "toolResult":
        return {
          role: "tool",
          content: message.content,
          tool_call_id: message.toolCallId,
        };
    }
  });
}
