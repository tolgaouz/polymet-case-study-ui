import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

// Initialize Anthropic client
const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const runtime = "edge";

const model = anthropic("claude-3-5-sonnet-latest");

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Validate messages array
    if (!Array.isArray(messages)) {
      return new Response("Messages must be an array", { status: 400 });
    }

    const result = streamText({
      model,
      messages,
    });

    // Convert the stream to a StreamingTextResponse
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
