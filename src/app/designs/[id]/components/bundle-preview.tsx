import { Bundle } from "@/types";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface BundlePreviewProps {
  bundle?: Bundle;
  isLoading?: boolean;
}

export const BundlePreview = ({ bundle, isLoading }: BundlePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current || !bundle?.html || !bundle?.js) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) return;

    // Write the content to the iframe
    iframeDoc.open();
    iframeDoc.write(bundle.html);
    iframeDoc.close();
  }, [bundle?.html, bundle?.js]);

  if (!bundle?.html || !bundle?.js) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        Nothing to preview yet
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        title="Component Preview"
        sandbox="allow-scripts allow-same-origin"
      />

      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};
