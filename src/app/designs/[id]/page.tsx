"use client";
import { useDesignStore } from "@/stores/design.store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "../../../components/chat-input";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { BundlePreview } from "./components/bundle-preview";

export default function DesignPage() {
  const params = useParams();
  const designs = useDesignStore((state) => state.designs);
  const currentDesign = designs.find((d) => d.id === params.id);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (content: string) => {
    useDesignStore.getState().sendMessage(params.id as string, content);
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [currentDesign?.messages]);

  if (!currentDesign) {
    return <div>Design not found</div>;
  }

  return (
    <div className="grid grid-cols-2 w-full h-full">
      {/* Left side - Chat Section */}

      <Card className="h-full flex flex-col">
        <div
          ref={scrollAreaRef}
          className="grow max-h-[calc(100vh-170px)] overflow-y-auto p-4 space-y-4"
        >
          {currentDesign.messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              role={message.role}
            />
          ))}
        </div>
        <div className="border-t p-4">
          <ChatInput
            disabled={currentDesign.isLLMResponding}
            onSend={handleSendMessage}
          />
        </div>
      </Card>

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
              <BundlePreview bundle={currentDesign.bundle} />
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
