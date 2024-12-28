import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
}

export function ChatMessage({ content, role }: ChatMessageProps) {
  const isAssistant = role === "assistant";
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-lg max-w-[80%] break-words",
        isAssistant
          ? "bg-muted ml-2 mr-auto rounded-bl-sm"
          : "bg-background border ml-auto mr-2 rounded-br-sm"
      )}
    >
      {isAssistant ? (
        <ReactMarkdown
          className="prose prose-sm dark:prose-invert max-w-none"
          components={{
            pre: ({ ...props }) => (
              <pre
                className="overflow-auto p-2 bg-muted-foreground/10 rounded-md"
                {...props}
              />
            ),
            code: ({ ...props }) => (
              <code
                className="bg-muted-foreground/10 rounded-sm px-1 py-0.5"
                {...props}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      ) : (
        content
      )}
    </div>
  );
}
