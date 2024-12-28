/**
 * Might as well just called the bundler service directly here if it had auth layer,
 * thus i'm calling the internal bundler api here so that it can call the external bundler service.
 */

import { GenerateBundleParams } from "@/app/api/designs/bundle/route";
import { Bundle } from "@/types";

export const generateBundle = async (params: GenerateBundleParams) => {
  const response = await fetch("/api/designs/bundle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return response.json() as Promise<Bundle>;
};

export const parseLLMResponseForBundle = (response: string) => {
  // Extract view artifact content
  const viewMatch = response.match(
    /<view-artifact>([\s\S]*?)<\/view-artifact>/
  );
  const viewContent = viewMatch ? viewMatch[1].trim() : null;

  // Extract all imports
  const importRegex = /<import>([\s\S]*?)<\/import>/g;
  const imports: string[] = [];
  let importMatch;

  while ((importMatch = importRegex.exec(response)) !== null) {
    imports.push(importMatch[1].trim());
  }

  return {
    viewContent,
    imports,
  };
};
