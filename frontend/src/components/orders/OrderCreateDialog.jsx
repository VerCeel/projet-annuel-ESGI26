"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  OrderFormFields,
  emptyOrderForm,
  formToPayload,
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
import { createOrder, getOrderErrorMessage } from "@/services/orders";
import { getProducts } from "@/services/products";

export default function OrderCreateDialog({ open, onOpenChange, onCreated }) {
  const [values, setValues] = useState(emptyOrderForm());
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const resetForm = () => {
    setValues(emptyOrderForm());
    setError("");
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateOrderForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder(formToPayload(values));
      toast.success("Order created", {
        description: `Order #${order.id} has been added.`,
      });
      onCreated?.(order);
      handleOpenChange(false);
    } catch (err) {
      const message = getOrderErrorMessage(err, "Failed to create the order. Please try again.");
      setError(message);
      toast.error("Create failed", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create a new order</DialogTitle>
          <DialogDescription>
            Link clients and products to a new order.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <OrderFormFields
            idPrefix="create-order"
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
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || clients.length === 0 || products.length === 0}
            >
              {loading ? "Creating..." : "Create order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
