"use client";
import { useDesignStore } from "@/stores/design.store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export default function DesignPage() {
  const designs = useDesignStore((state) => state.designs);

  return (
    <div className="grid grid-cols-2 w-full h-full">
      {/* Left side - Chat Section */}
      <div className="border-r border-border h-full p-4">
        <Card className="h-full grid grid-rows-[1fr,auto]">
          <div className="overflow-auto p-4">
            {/* Chat messages will go here */}
          </div>
          <div className="border-t p-4">{/* Chat input will go here */}</div>
        </Card>
      </div>

      {/* Right side - Preview & Code */}
      <div className="h-full p-4">
        <Tabs
          defaultValue="preview"
          className="h-full grid grid-rows-[auto,1fr]"
        >
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4 h-full">
            <Card className="h-full">
              {/* Preview iframe or component will go here */}
            </Card>
          </TabsContent>

          <TabsContent value="code" className="mt-4 h-full">
            <ScrollArea className="h-full">
              <Card className="p-4">{/* Code preview will go here */}</Card>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
