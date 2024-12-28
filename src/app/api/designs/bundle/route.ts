import { Bundle } from "@/types";
import { currentUser } from "@clerk/nextjs/server";

const bundleCode = async (repoUrl: string, componentPath: string) => {
  const response = await fetch(process.env.BUNDLER_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ repoUrl, componentPath }),
  });
  return response.json() as Promise<Bundle>;
};

export const POST = async (req: Request) => {
  const user = await currentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { repoUrl, componentPath } = await req.json();
  const bundle = await bundleCode(repoUrl, componentPath);
  return Response.json(bundle);
};
