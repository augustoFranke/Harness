export type TextContent = {
  type: "text";
  text: string;
};
export type ThinkingContent = {
  type: "thinking";
  thinking: string;
};
export type ToolCallContent = {
  type: "toolCall";
  id: string;
  name: string;
  arguments: Record<string, unknown>;
};
export type ImageContent = {
  type: "image";
  data: string;
  mimeType: string;
};
export type Usage = {
  input: number;
  output: number;
  totalTokens: number;
};
export type StopReason = "stop" | "length" | "toolUse" | "error";
export type UserMessage = {
  role: "user";
  content: string | (TextContent | ImageContent)[];
};
export type AssistantMessage = {
  role: "assistant";
  content: (TextContent | ThinkingContent | ToolCallContent)[];
  usage: Usage;
  stopReason: StopReason;
};
export type ToolResultMessage = {
  role: "toolResult";
  toolCallId: string;
  toolName: string;
  content: string;
  isError: boolean;
};
export type Message = UserMessage | AssistantMessage | ToolResultMessage;
export type CompactionSummary = {
  role: "comapactionSummary";
  summary: string;
};
export type AgentMessage = Message | CompactionSummary;
export type ToolDefinition = {
  name: string;
  description: string;
  parameters: unknown;
};
export type Context = {
  systemPrompt: string;
  messages: Message[];
  tools: ToolDefinition[];
};
export type AgentEvent =
  | { type: "agent_start" }
  | { type: "agent_end"; messages: AgentMessage[] }
  | { type: "text_delta"; delta: string }
  | { type: "text_done"; text: string }
  | { type: "turn_start" }
  | { type: "turn_end" }
  | {
      type: "toolcall_start";
      id: string;
      name: string;
    }
  | {
      type: "toolcall_done";
      id: string;
      name: string;
      arguments: Record<string, unknown>;
    }
  | { type: "tool_execution_start"; toolCallId: string; toolName: string }
  | { type: "tool_execution_update"; toolCallId: string; output: string }
  | {
      type: "tool_execution_end";
      toolCallId: string;
      toolName: string;
      result: string;
      isError: boolean;
    }
  | { type: "error"; message: string };
export type LLMStreamEvent =
  | { type: "text_delta"; delta: string }
  | { type: "thinking_delta"; delta: string }
  | { type: "toolcall_start"; index: number; id: string; name: string }
  | { type: "toolcall_delta"; index: number; argumentsDelta: string }
  | {
      type: "toolcall_done";
      index: number;
      id: string;
      name: string;
      arguments: Record<string, unknown>;
    }
  | { type: "done"; message: AssistantMessage }
  | { type: "error"; error: Error };
export type LLMClient = {
  stream: (context: Context) => AsyncIterable<LLMStreamEvent>;
};
export type ToolResult = {
  content: string;
  isError: boolean;
};

export interface Tool {
  name: string;
  description: string;
  parameters: unknown;
  execute: (
    args: Record<string, unknown>,
    onUpdate?: (partial: string) => void,
    signal?: AbortSignal,
  ) => Promise<ToolResult>;
}
