import { Bundle } from "@/types";
import { currentUser } from "@clerk/nextjs/server";

export interface GenerateBundleParams {
  repoUrl: string;
  componentPath: string;
  entryFileContent?: string;
}

const bundleCode = async ({
  repoUrl,
  componentPath,
  entryFileContent,
}: GenerateBundleParams) => {
  const response = await fetch(process.env.BUNDLER_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ repoUrl, componentPath, entryFileContent }),
  });
  return response.json() as Promise<Bundle>;
};

export const POST = async (req: Request) => {
  const user = await currentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { repoUrl, componentPath, entryFileContent } = await req.json();
  const bundle = await bundleCode({
    repoUrl,
    componentPath,
    entryFileContent,
  });
  return Response.json(bundle);
};
