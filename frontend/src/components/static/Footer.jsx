import { Link } from "react-router-dom";
import { Code2, Feather } from "lucide-react";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/posts", label: "Posts" },
  { to: "/categories", label: "Categories" },
  { to: "/products", label: "Products" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
              <Feather className="size-4" />
            </span>
            <span className="text-lg font-semibold">Budgie</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A Laravel-powered blog platform with a modern React frontend. Create,
            browse, and manage posts with a clean, responsive interface.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Stack</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Laravel 13 API</li>
              <li>React + Vite</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Project</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <Code2 className="size-4" />
                  GitHub
                </a>
              </li>
              <li className="text-sm text-muted-foreground">ESGI26 — Projet annuel</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} Budgie. All rights reserved.</p>
          <p>Built with Laravel & React</p>
        </div>
      </div>
    </footer>
  );
}
