"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDesignStore } from "@/stores/design.store";
import { Spinner } from "@/components/ui/spinner";

export default function StartDesign() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const createDesign = useDesignStore((state) => state.createDesign);

  async function onCreateDesign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const repoUrl = formData.get("repoUrl") as string;

      if (!repoUrl) {
        throw new Error("Missing required fields");
      }

      const design = await createDesign(repoUrl);

      // Navigate to the new design page
      router.push(`/designs/${design.id}`);
    } catch (error) {
      console.error("Failed to create design:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onCreateDesign} className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Create New Design
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repo-url">GitHub Repo URL</Label>
            <Input
              id="repo-url"
              name="repoUrl"
              placeholder="https://github.com/username/repo"
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && <Spinner />}
            {isLoading ? "Creating..." : "Create Design"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
