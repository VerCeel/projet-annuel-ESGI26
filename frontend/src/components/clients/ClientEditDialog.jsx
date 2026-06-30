import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ClientFormFields,
  clientToForm,
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
import { updateClient } from "@/services/clients";

export default function ClientEditDialog({ client, open, onOpenChange, onUpdated }) {
  const [values, setValues] = useState(clientToForm(null));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (client && open) {
      setValues(clientToForm(client));
      setError("");
    }
  }, [client, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!client) return;

    const validationError = validateClientForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      const updated = await updateClient(client.id, formToPayload(values));
      toast.success("Client updated", {
        description: `${updated.first_name} ${updated.last_name} has been saved.`,
      });
      onUpdated?.(updated);
      onOpenChange(false);
    } catch {
      setError("Failed to update the client. Please try again.");
      toast.error("Update failed", {
        description: "Could not save the client.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit client</DialogTitle>
          <DialogDescription>
            Update client #{client.id}.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <ClientFormFields idPrefix="edit-client" values={values} onChange={setValues} />

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
