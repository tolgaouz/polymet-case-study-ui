import { create } from "zustand";
import { Bundle, Message } from "@/types";
import {
  generateBundle,
  parseLLMResponseForBundle,
} from "@/lib/bundler.service";

interface Design {
  id: string;
  messages: Message[];
  isLLMResponding: boolean;
  repoUrl: string;
  bundle: Bundle;
  isBundleLoading: boolean;
}

interface DesignStore {
  createDesign: (repoUrl: string) => Promise<Design>;
  generateBundleForDesign: (
    id: string,
    entryFileContent: string
  ) => Promise<Design | undefined>;
  designs: Design[];
  sendMessage: (id: string, content: string) => Promise<void>;
}

export const useDesignStore = create<DesignStore>((set, get) => ({
  designs: [],
  generateBundleForDesign: async (id: string, entryFileContent: string) => {
    const design = get().designs.find((design) => design.id === id);
    if (!design) return;
    const bundle = await generateBundle({
      repoUrl: design.repoUrl,
      entryFileContent,
    });
    design.bundle = bundle;
    design.isBundleLoading = false;
    return design;
  },
  createDesign: async (repoUrl: string) => {
    const design: Design = {
      id: crypto.randomUUID(),
      messages: [],
      isLLMResponding: false,
      repoUrl,
      bundle: {
        html: null,
        js: null,
      },
      isBundleLoading: true,
    };
    // Call the bundle api
    const bundle = await generateBundle({
      repoUrl,
    });
    design.bundle = bundle;
    design.isBundleLoading = false;

    if (!bundle.html || !bundle.js)
      throw new Error("Failed to generate bundle");
    set((state) => ({
      designs: [...state.designs, design],
    }));
    return design;
  },
  sendMessage: async (id: string, content: string) => {
    // First add the user message
    set((state) => ({
      designs: state.designs.map((design) =>
        design.id === id
          ? {
              ...design,
              messages: [...design.messages, { role: "user", content }],
              isLLMResponding: true,
            }
          : design
      ),
    }));

    // Add initial assistant message
    set((state) => ({
      designs: state.designs.map((design) =>
        design.id === id
          ? {
              ...design,
              messages: [
                ...design.messages,
                { role: "assistant", content: "" },
              ],
            }
          : design
      ),
    }));

    try {
      let fullResponse = "";
      const response = await fetch("/api/designs/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: get()
            .designs.find((design) => design.id === id)
            ?.messages.filter((m) => m.content),
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;

        // Update the last assistant message with the new chunk
        set((state) => ({
          designs: state.designs.map((design) =>
            design.id === id
              ? {
                  ...design,
                  messages: design.messages.map((msg, index) =>
                    index === design.messages.length - 1
                      ? { ...msg, content: msg.content + chunk }
                      : msg
                  ),
                }
              : design
          ),
        }));
      }
      // After full response is received, check if it contains
      const { viewContent, imports } = parseLLMResponseForBundle(fullResponse);

      const design = get().designs.find((design) => design.id === id);
      if (!design || !viewContent) return;
      // Set isBundleLoading to true
      set((state) => ({
        designs: state.designs.map((design) =>
          design.id === id
            ? {
                ...design,
                isBundleLoading: true,
              }
            : design
        ),
      }));
      // Generate bundle
      const bundle = await generateBundle({
        repoUrl: design.repoUrl,
        entryFileContent: viewContent,
        imports,
      });
      set((state) => ({
        designs: state.designs.map((design) =>
          design.id === id
            ? {
                ...design,
                bundle,
                isBundleLoading: false,
              }
            : design
        ),
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      // Set isLLMResponding to false when done
      set((state) => ({
        designs: state.designs.map((design) =>
          design.id === id
            ? {
                ...design,
                isLLMResponding: false,
              }
            : design
        ),
      }));
    }
  },
}));
