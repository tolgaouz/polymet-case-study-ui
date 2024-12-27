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
import { getDesigns } from "@/lib/mock-store";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function AppSidebar() {
  const user = await currentUser();
  const designs = await getDesigns();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 px-6 flex w-full justify-center">
        <Image src="/polymet.svg" alt="Polymet" width={120} height={100} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Designs</SidebarGroupLabel>
          <Link href="/designs/new">
            <SidebarGroupAction title="Start Design">
              <Plus /> <span className="sr-only">Start Design</span>
            </SidebarGroupAction>
          </Link>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {designs.map((design) => (
                <SidebarMenuItem key={design.id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/designs/${design.id}`}>
                      <span>{design.chatName}</span>
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
