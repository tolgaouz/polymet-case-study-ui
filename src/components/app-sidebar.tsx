import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const designs = [
  {
    name: "Vercel AI Chatbot Design",
    url: "/designs/vercel-ai-chatbot-github-repo",
  },
];

export async function AppSidebar() {
  const user = await currentUser();
  return (
    <Sidebar>
      <SidebarHeader className="p-4 px-6 flex w-full justify-center">
        <Image src="/polymet.svg" alt="Polymet" width={120} height={100} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Designs</SidebarGroupLabel>
          <SidebarGroupAction title="Start Design">
            <Plus /> <span className="sr-only">Start Design</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {designs.map((project) => (
                <SidebarMenuItem key={project.name}>
                  <SidebarMenuButton asChild>
                    <Link href={project.url}>
                      <span>{project.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 hover:bg-neutral-100">
        <div className="flex items-center divide-x">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
                userButtonTrigger: "mx-2",
              },
            }}
          />
          <div className="flex px-4 flex-col gap-2 h-full text-sm font-sans">
            <h3 className="font-semibold">{user?.fullName}</h3>
            <p className="text-xs text-gray-500">
              {user?.primaryEmailAddress?.emailAddress ?? user?.firstName}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
