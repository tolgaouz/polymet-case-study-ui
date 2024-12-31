export const maxDuration = 60;
import { Bundle } from "@/types";
import { currentUser } from "@clerk/nextjs/server";

export interface GenerateBundleParams {
  repoUrl: string;
  entryFileContent?: string;
  imports?: string[];
}

const bundleCode = async (params: GenerateBundleParams) => {
  const response = await fetch(process.env.BUNDLER_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return response.json() as Promise<Bundle>;
};

export const POST = async (req: Request) => {
  const user = await currentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { repoUrl, entryFileContent, imports } = await req.json();
  const bundle = await bundleCode({
    repoUrl,
    entryFileContent,
    imports,
  });
  return Response.json(bundle);
};
