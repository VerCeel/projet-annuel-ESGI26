"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingCart,
  StickyNote,
  Tag,
  Users,
} from "lucide-react";

import CanariaLogo from "@/components/static/CanariaLogo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const mainLinks = [
  { href: "/notes", label: "Notes", icon: StickyNote },
];

const managementLinks = [
  { href: "/categories", label: "Categories", icon: Tag },
  { href: "/products", label: "Products", icon: Package },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
];

function isLinkActive(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItems({ links, pathname, collapsed, onNavigate }) {
  return links.map(({ href, label, icon: Icon }) => {
    const active = isLinkActive(pathname, href);

    return (
      <SidebarMenuItem key={href}>
        <Link
          href={href}
          onClick={onNavigate}
          data-active={active}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            active && "bg-sidebar-accent text-sidebar-accent-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          <Icon className="size-4 shrink-0" />
          <span className={cn("truncate", collapsed && "sr-only")}>{label}</span>
        </Link>
      </SidebarMenuItem>
    );
  });
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { open, setOpen, isMobile, setOpenMobile } = useSidebar();

  const collapsed = !open && !isMobile;

  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" onClick={handleNavigate} className="px-1">
          <CanariaLogo showName={!collapsed} />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <NavItems
              links={mainLinks}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={handleNavigate}
            />
          </SidebarMenu>
        </SidebarGroup>

        <Separator className="my-2 bg-sidebar-border" />

        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>Management</SidebarGroupLabel>
          <SidebarMenu>
            <NavItems
              links={managementLinks}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={handleNavigate}
            />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <>
                <PanelLeftClose className="size-4" />
                <span className={cn(collapsed && "sr-only")}>Collapse</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="size-4" />
                <span className="sr-only">Expand</span>
              </>
            )}
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
