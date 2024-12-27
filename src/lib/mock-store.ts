import { Design } from "@/types/design";

// Mock in-memory store
const designs: Design[] = [];

export async function createDesign(
  repoUrl: string,
  framework: string
): Promise<Design> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const newDesign: Design = {
    id: Math.random().toString(36).substring(7),
    repoUrl,
    chatName: `Chat for ${repoUrl.split("/").pop()}`,
    framework,
    createdAt: new Date(),
  };

  designs.push(newDesign);
  return newDesign;
}

export async function getDesigns(): Promise<Design[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [...designs];
}

export async function getDesignById(id: string): Promise<Design | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return designs.find((design) => design.id === id) ?? null;
}
