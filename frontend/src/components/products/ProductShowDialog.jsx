import { Package, Tag } from "lucide-react";

import { formatPrice } from "@/components/products/product-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProductShowDialog({ product, open, onOpenChange }) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="size-5 text-primary" />
            {product.name}
          </DialogTitle>
          <DialogDescription>Product details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {product.image && (
            <div className="overflow-hidden rounded-lg border bg-muted/50">
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-cover"
              />
            </div>
          )}

          <div className="rounded-lg border bg-muted/50 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Description</dt>
            <dd className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
              {product.description}
            </dd>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Price</dt>
              <dd className="mt-1 font-medium">{formatPrice(product.price)}</dd>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Stock</dt>
              <dd className="mt-1 font-medium">{product.stock}</dd>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                <Tag className="size-3.5" />
                Category
              </dt>
              <dd className="mt-1">{product.category?.name ?? "—"}</dd>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Status</dt>
              <dd className="mt-1 capitalize">{product.status}</dd>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4 sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Created</dt>
              <dd className="mt-1 text-sm">{formatDate(product.created_at)}</dd>
            </div>
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}
