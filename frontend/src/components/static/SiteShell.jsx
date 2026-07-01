"use client";

import AppSidebar from "@/components/static/AppSidebar";
import AppNavBar from "@/components/static/AppNavBar";
import PublicNavBar from "@/components/static/PublicNavBar";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

function AuthenticatedMain({ children }) {
  const { open, isMobile } = useSidebar();

  return (
    <SidebarInset
      className={cn(
        "transition-[margin] duration-200",
        !isMobile && (open ? "md:ml-[var(--sidebar-width)]" : "md:ml-[var(--sidebar-width-icon)]"),
      )}
    >
      <AppNavBar />
      <div className="flex flex-1 flex-col">
        <div className="flex-1">{children}</div>
      </div>
    </SidebarInset>
  );
}

function PublicMain({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function SiteShell({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PublicMain>{children}</PublicMain>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <AuthenticatedMain>{children}</AuthenticatedMain>
    </SidebarProvider>
  );
}
