/**
 * Might as well just called the bundler service directly here if it had auth layer,
 * thus i'm calling the internal bundler api here so that it can call the external bundler service.
 */

import { Bundle } from "@/types";

export const generateBundle = async (
  repoUrl: string,
  componentPath: string
) => {
  const response = await fetch("/api/designs/bundle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ repoUrl, componentPath }),
  });
  return response.json() as Promise<Bundle>;
};
