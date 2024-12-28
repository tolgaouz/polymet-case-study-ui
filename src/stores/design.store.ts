import { create } from "zustand";
import { generateBundle } from "@/lib/bundler.service";
import { Design } from "@/types";

interface DesignState {
  designs: Design[];
  createDesign: (repoUrl: string, path: string) => Promise<Design>;
  updateDesign: (id: string, updates: Partial<Design>) => void;
  getDesigns: () => Design[];
  getDesignById: (id: string) => Design | undefined;
}

export const useDesignStore = create<DesignState>()((set, get) => ({
  designs: [],

  createDesign: async (repoUrl: string, path: string) => {
    const newDesign: Design = {
      id: Math.random().toString(36).substring(7),
      repoUrl,
      framework: path,
      chatName: `Chat for ${repoUrl.split("/").pop()}`,
      createdAt: new Date(),
      messages: [],
      initialBundle: {
        html: null,
        js: null,
      },
    };

    // Call the bundle api
    const bundle = await generateBundle(repoUrl, path);

    set((state) => ({
      designs: [...state.designs, { ...newDesign, initialBundle: bundle }],
    }));

    return newDesign;
  },

  updateDesign: (id: string, updates: Partial<Design>) => {
    set((state) => ({
      designs: state.designs.map((design) =>
        design.id === id ? { ...design, ...updates } : design
      ),
    }));
  },

  getDesigns: () => {
    return get().designs;
  },

  getDesignById: (id: string) => {
    return get().designs.find((design) => design.id === id);
  },
}));
