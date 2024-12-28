/** This is client side because i'm just using a zustand store to mock my calls etc.
 * Not using a DB right now to pull data from.
 */

"use client";

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
import { UserButton, useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDesignStore } from "@/stores/design.store";

export function AppSidebar() {
  const { user } = useUser();
  const designs = useDesignStore((state) => state.designs);

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
                      <span>{design.id}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 hover:bg-neutral-100">
        <div className="flex flex-row items-center gap-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
                userButtonTrigger: "mx-2",
              },
            }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.fullName}</span>
            <span className="text-xs text-neutral-500">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
