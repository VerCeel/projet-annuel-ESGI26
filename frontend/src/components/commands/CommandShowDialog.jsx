import { ShoppingCart, User } from "lucide-react";

import { clientLabel, COMMAND_STATUSES } from "@/components/commands/command-form";
import { formatPrice } from "@/components/products/product-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

function statusLabel(value) {
  return COMMAND_STATUSES.find((status) => status.value === value)?.label ?? value;
}

export default function CommandShowDialog({ command, open, onOpenChange }) {
  if (!command) return null;

  const products = command.products ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5 text-primary" />
            Command #{command.id}
          </DialogTitle>
          <DialogDescription>Order details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                <User className="size-3.5" />
                Client
              </dt>
              <dd className="mt-1 font-medium">{clientLabel(command.client)}</dd>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Status</dt>
              <dd className="mt-1 font-medium">{statusLabel(command.status)}</dd>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Total</dt>
              <dd className="mt-1 font-medium">{formatPrice(command.total)}</dd>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Created</dt>
              <dd className="mt-1 text-sm">{formatDate(command.created_at)}</dd>
            </div>
          </dl>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Unit price</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const unitPrice = Number(product.pivot?.unit_price ?? product.price);
                  const quantity = Number(product.pivot?.quantity ?? 0);
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{formatPrice(unitPrice)}</TableCell>
                      <TableCell className="text-right">{quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(unitPrice * quantity)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
