"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Package,
  ShoppingCart,
  Tags,
  Users,
} from "lucide-react";

import Footer from "@/components/static/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  {
    icon: Package,
    title: "Product catalog",
    description: "Track items, prices, stock levels, and availability in one place.",
  },
  {
    icon: Tags,
    title: "Categories",
    description: "Organize your inventory with clear product groupings.",
  },
  {
    icon: Users,
    title: "Clients",
    description: "Manage customer contacts linked to your orders.",
  },
  {
    icon: ShoppingCart,
    title: "Orders",
    description: "Create and follow orders across clients and products.",
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 py-16 md:px-6 md:py-24">
        <section className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
            <Boxes className="size-3.5" />
            Stock management platform
          </div>

          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Manage your inventory with{" "}
            <span className="text-primary">Canaria</span>
          </h1>

          <p className="text-lg text-muted-foreground md:text-xl">
            Canaria helps you run your stock operations — products, categories, clients,
            and orders — from a single modern dashboard built on Laravel and Next.js.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isAuthenticated ? (
              <Button asChild size="lg">
                <Link href="/products">
                  Go to dashboard
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/login">
                    Get started
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/register">Create an account</Link>
                </Button>
              </>
            )}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border bg-background/60 backdrop-blur">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="rounded-2xl border bg-background/70 p-8 text-center backdrop-blur md:p-12">
          <h2 className="text-2xl font-semibold tracking-tight">
            Ready to take control of your stock?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {isAuthenticated
              ? "Open the dashboard to manage products, clients, and orders."
              : "Sign in to access the full dashboard with sidebar navigation, or browse public notes while you explore the platform."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <>
                <Button asChild>
                  <Link href="/products">Open dashboard</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/notes">Browse notes</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/login">Sign in to dashboard</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/notes">Browse notes</Link>
                </Button>
              </>
            )}
          </div>
        </section>
      </div>
      </div>
      <Footer />
    </>
  );
}
