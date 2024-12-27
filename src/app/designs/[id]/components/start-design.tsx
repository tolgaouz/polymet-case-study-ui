'use client';

import { createDesign } from "@/lib/mock-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RepositoryPathSelector } from "./repo-path-selector";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StartDesign() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const repoUrl = formData.get('repoUrl') as string;
      const framework = formData.get('framework') as string;

      if (!repoUrl || !framework) {
        throw new Error('Missing required fields');
      }

      const design = await createDesign(repoUrl, framework);
      
      // Force a revalidation of the root layout which includes the sidebar
      router.refresh();
      
      // Navigate to the new design page
      router.push(`/designs/${design.id}`);
    } catch (error) {
      console.error('Failed to create design:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="container mx-auto p-4">
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
          <div className="space-y-2">
            <Label>Select Path</Label>
            <RepositoryPathSelector name="framework" required />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Design"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
