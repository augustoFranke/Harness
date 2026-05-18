type TextContent = {
  type: "text";
  text: string;
};
type ThinkingContent = {
  type: "thinking";
  thinking: string;
};
type ToolCallContent = {
  type: "toolCall";
  id: string;
  name: string;
  arguments: Record<string, unknown>;
};
type ImageContent = {
  type: "image";
  data: string;
  mimeType: string;
};
type Usage = {
  input: number;
  output: number;
  totalTokens: number;
};
type StopReason = "stop" | "length" | "toolUse" | "error";
type UserMessage = {
  role: "user";
  content: string | (TextContent | ImageContent)[];
};
type AssistantMessage = {
  role: "assistant";
  content: (TextContent | ThinkingContent | ToolCallContent)[];
  usage: Usage;
  stopReason: StopReason;
};
type ToolResultMessage = {
  role: "toolResult";
  toolCallId: string;
  toolName: string;
  content: string;
  isError: boolean;
};
type Message = UserMessage | AssistantMessage | ToolResultMessage;
type CompactionSummary = {
  role: "comapactionSummary";
  summary: string;
};
type AgentMessage = Message | CompactionSummary;
type ToolDefinition = {
  name: string;
  description: string;
  parameters: unknown;
};
type Context = {
  systemPrompt: string;
  messages: Message[];
  tools: ToolDefinition[];
};
type AgentEvent =
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
type LLMStreamEvent =
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
type LLMClient = {
  stream: (context: Context) => AsyncIterable<LLMStreamEvent>;
};
type ToolResult = {
  content: string;
  isError: boolean;
};

interface Tool {
  name: string;
  description: string;
  parameters: unknown;
  execute: (
    args: Record<string, unknown>,
    onUpdate?: (partial: string) => void,
    signal?: AbortSignal,
  ) => Promise<ToolResult>;
}
