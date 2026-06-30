import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  OrderFormFields,
  formToPayload,
  orderToForm,
  validateOrderForm,
} from "@/components/orders/order-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getClients } from "@/services/clients";
import { updateOrder } from "@/services/orders";
import { getProducts } from "@/services/products";

export default function OrderEditDialog({ order, open, onOpenChange, onUpdated }) {
  const [values, setValues] = useState(orderToForm(null));
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setClientsLoading(true);
    getClients()
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => setClients([]))
      .finally(() => setClientsLoading(false));

    setProductsLoading(true);
    getProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, [open]);

  useEffect(() => {
    if (order && open) {
      setValues(orderToForm(order));
      setError("");
    }
  }, [order, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!order) return;

    const validationError = validateOrderForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      const updated = await updateOrder(order.id, formToPayload(values));
      toast.success("Order updated", {
        description: `Order #${updated.id} has been saved.`,
      });
      onUpdated?.(updated);
      onOpenChange(false);
    } catch {
      setError("Failed to update the order. Please try again.");
      toast.error("Update failed", {
        description: "Could not save the order.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit order</DialogTitle>
          <DialogDescription>Update order #{order.id}.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <OrderFormFields
            idPrefix="edit-order"
            values={values}
            onChange={setValues}
            clients={clients}
            clientsLoading={clientsLoading}
            products={products}
            productsLoading={productsLoading}
          />

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
