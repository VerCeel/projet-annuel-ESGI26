import { ShoppingCart } from "lucide-react";

import {
  formatDate,
  formatOrderClients,
  formatOrderProducts,
  statusClassName,
  statusLabel,
} from "@/components/orders/order-form";
import { formatPrice } from "@/components/products/product-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function OrderShowDialog({ order, open, onOpenChange }) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5 text-primary" />
            Order #{order.id}
          </DialogTitle>
          <DialogDescription>Order details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Clients</dt>
            <dd className="mt-2 text-sm">{formatOrderClients(order.clients)}</dd>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Products</dt>
            <dd className="mt-2 text-sm">{formatOrderProducts(order.products)}</dd>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Total</dt>
              <dd className="mt-1 font-medium">{formatPrice(order.total_price)}</dd>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Status</dt>
              <dd className="mt-1">
                <span className={statusClassName(order.status)}>
                  {statusLabel(order.status)}
                </span>
              </dd>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Order date</dt>
              <dd className="mt-1 text-sm">{formatDate(order.order_date)}</dd>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Delivery date
              </dt>
              <dd className="mt-1 text-sm">{formatDate(order.delivery_date)}</dd>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4 sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Delivery address
              </dt>
              <dd className="mt-1 text-sm">{order.delivery_address}</dd>
            </div>
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}
