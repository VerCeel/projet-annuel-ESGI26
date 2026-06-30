import { useState } from "react";
import { toast } from "sonner";

import {
  ClientFormFields,
  emptyClientForm,
  formToPayload,
  validateClientForm,
} from "@/components/clients/client-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/services/clients";

export default function ClientCreateDialog({ open, onOpenChange, onCreated }) {
  const [values, setValues] = useState(emptyClientForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setValues(emptyClientForm());
    setError("");
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateClientForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const client = await createClient(formToPayload(values));
      toast.success("Client created", {
        description: `${client.first_name} ${client.last_name} has been added.`,
      });
      onCreated?.(client);
      handleOpenChange(false);
    } catch {
      setError("Failed to create the client. Please try again.");
      toast.error("Create failed", {
        description: "Could not create the client.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create a new client</DialogTitle>
          <DialogDescription>Add contact details for a new client.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <ClientFormFields idPrefix="create-client" values={values} onChange={setValues} />

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
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
