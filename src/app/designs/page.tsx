import { getDesigns } from "@/lib/mock-store";
import Link from "next/link";

export default async function DesignsPage() {
  const designs = await getDesigns();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Designs</h1>
      <div className="grid gap-4">
        {designs.map((design) => (
          <Link
            key={design.id}
            href={`/designs/${design.id}`}
            className="block p-4 border rounded hover:bg-gray-50"
          >
            <div className="font-medium">{design.repoUrl}</div>
            <div className="text-sm text-gray-500">
              <span>Framework: {design.framework}</span>
              <span className="ml-4">Chat: {design.chatName}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
