export interface Message {
  role: "user" | "assistant";
  content: string;
}

/** It's weird to have html, js fields as nullable for a general Bundle type but to keep it fast/simple its ok for now. */
export type Bundle = {
  html: string | null;
  js: string | null;
};

export interface Design {
  id: string;
  repoUrl: string;
  chatName: string;
  framework: string;
  createdAt: Date;
  messages: Message[];
  initialBundle: Bundle;
}
