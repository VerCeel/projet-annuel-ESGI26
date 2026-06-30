import { NavLink, useNavigate } from "react-router-dom";
import { Feather, Home, LogIn, LogOut, Package, Rows3, ShoppingCart, Tag, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const publicLinks = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/posts", label: "Posts", icon: Rows3 },
];

const protectedLinks = [
  { to: "/categories", label: "Categories", icon: Tag },
  { to: "/products", label: "Products", icon: Package },
  { to: "/commands", label: "Commands", icon: ShoppingCart },
];

export default function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const links = isAuthenticated
    ? [...publicLinks, ...protectedLinks]
    : publicLinks;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out");
      navigate("/");
    } catch {
      toast.error("Could not sign out");
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <NavLink
          to="/"
          className="group flex items-center gap-2 text-sm font-semibold md:text-base"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:bg-primary/20">
            <Feather className="size-4" />
          </span>
          Budgie
        </NavLink>

        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition md:gap-2 md:px-4 md:text-sm",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )
              }
            >
              <Icon className="size-3.5 md:size-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sr-only sm:hidden">{label}</span>
            </NavLink>
          ))}

          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 gap-1.5 text-xs md:text-sm"
              onClick={handleLogout}
            >
              <LogOut className="size-3.5 md:size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="ml-1 gap-1.5 text-xs md:text-sm">
                <NavLink to="/login">
                  <LogIn className="size-3.5 md:size-4" />
                  <span className="hidden sm:inline">Sign in</span>
                </NavLink>
              </Button>
              <Button asChild size="sm" className="gap-1.5 text-xs md:text-sm">
                <NavLink to="/register">
                  <UserPlus className="size-3.5 md:size-4" />
                  <span className="hidden sm:inline">Register</span>
                </NavLink>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
