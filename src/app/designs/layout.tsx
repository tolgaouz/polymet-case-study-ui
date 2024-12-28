import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DesignsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex grow flex-col gap-8 p-4 row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <AppBreadcrumb />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DesignsLayout;
