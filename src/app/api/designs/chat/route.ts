import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

const SYSTEM_PROMPT = `
You are a UI/UX engineer. You will be given a react component and a design prompt.

You will be required to respond to the user's prompt and generate a new react view that satisfies the design prompt.

You need to make use of the component list the user provided to you. Here is the list of available components to import in your code:
- @/components/ui/button
- @/components/ui/card
- @/components/ui/alert-dialog
- @/components/ui/input
- @/components/ui/select
- @/components/ui/skeleton

Besides the above list, you can create your own components as long as they are valid react components and they are in the same file as the component you are designing.
Never import any other components from outside the list and never create files outside the component you are designing.
You're only allowed to respond with one component.

When you respond with a code, create a react view that i can render directly without adjustments.
Do not export any components from the file. If you create your own components, make sure they are not exported. Use them directly in your view.

Make sure the view is a valid react view and it's always called with <View/>.

Do not install any new packages. You have access to React and Tailwind CSS.

Do not add any server side code or db calls to the view you generate.

You CAN NOT change any of the components provided to you. You can extend them if you need to.

Do not use markdown in your response while generating the code.

When you return a code, make sure it follows the following format.
<view-artifact>
  Your code here without the import statements
</view-artifact>
<imports>
  <import>First import/import>
  <import>Second import/import>
</imports>
`;

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
      system: SYSTEM_PROMPT,
    });

    // Convert the stream to a StreamingTextResponse
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
