import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  CommandFormFields,
  emptyCommandForm,
  extractApiError,
  formToPayload,
  validateCommandForm,
} from "@/components/commands/command-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createCommand } from "@/services/commands";
import { getClients } from "@/services/clients";
import { getProducts } from "@/services/products";

export default function CommandCreateDialog({ open, onOpenChange, onCreated }) {
  const [values, setValues] = useState(emptyCommandForm());
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
    setValues(emptyCommandForm());
    setError("");
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateCommandForm(values, products);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const command = await createCommand(formToPayload(values));
      toast.success("Command created", {
        description: `Order #${command.id} has been registered.`,
      });
      onCreated?.(command);
      handleOpenChange(false);
    } catch (err) {
      const message = extractApiError(err, "Failed to create the command. Please try again.");
      setError(message);
      toast.error("Create failed", { description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a new command</DialogTitle>
          <DialogDescription>
            Pick a client and add the ordered products with their quantities.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <CommandFormFields
            idPrefix="create-command"
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
            <Button type="submit" disabled={loading || clients.length === 0}>
              {loading ? "Creating..." : "Create command"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
