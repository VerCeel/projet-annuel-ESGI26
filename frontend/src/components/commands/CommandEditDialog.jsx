import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  CommandFormFields,
  commandToForm,
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
import { updateCommand } from "@/services/commands";
import { getClients } from "@/services/clients";
import { getProducts } from "@/services/products";

export default function CommandEditDialog({ command, open, onOpenChange, onUpdated }) {
  const [values, setValues] = useState(emptyCommandForm());
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !command) return;

    setValues(commandToForm(command));
    setError("");

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
  }, [open, command]);

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
      const updated = await updateCommand(command.id, formToPayload(values));
      toast.success("Command updated", {
        description: `Order #${updated.id} has been updated.`,
      });
      onUpdated?.(updated);
      onOpenChange(false);
    } catch (err) {
      const message = extractApiError(err, "Failed to update the command. Please try again.");
      setError(message);
      toast.error("Update failed", { description: message });
    } finally {
      setLoading(false);
    }
  };

  if (!command) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit command #{command.id}</DialogTitle>
          <DialogDescription>
            Update the client, status, or ordered products. Stock is adjusted automatically.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <CommandFormFields
            idPrefix="edit-command"
            values={values}
            onChange={setValues}
            clients={clients}
            clientsLoading={clientsLoading}
            products={products}
            productsLoading={productsLoading}
            showStatus
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
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
