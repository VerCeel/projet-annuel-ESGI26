import Link from "next/link";
import { Code2 } from "lucide-react";

import CanariaLogo from "@/components/static/CanariaLogo";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/notes", label: "Notes" },
  { to: "/categories", label: "Categories" },
  { to: "/products", label: "Products" },
  { to: "/clients", label: "Clients" },
  { to: "/orders", label: "Orders" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm space-y-3">
          <CanariaLogo />
          <p className="text-sm leading-relaxed text-muted-foreground">
            A Laravel-powered platform with a modern Next.js frontend. Create, browse,
            and manage notes, clients, products, and orders.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    className="text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Project</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/VerCeel/projet-laravel-ESGI"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <Code2 className="size-4" />
                  GitHub
                </a>
              </li>
              <li className="text-sm text-muted-foreground">ESGI26 — Projet LARAVEL</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} Canaria. All rights reserved.</p>
          <p>Built by Oussama HIRICH | Ayaz JUBAER | Allan MORLET | Johan PRISO</p>
        </div>
      </div>
    </footer>
  );
}
