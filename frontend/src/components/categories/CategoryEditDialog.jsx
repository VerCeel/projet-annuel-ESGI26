import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCategory } from "@/services/categories";

export default function CategoryEditDialog({ category, open, onOpenChange, onUpdated }) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category && open) {
      setName(category.name ?? "");
      setError("");
    }
  }, [category, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!category) return;

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateCategory(category.id, { name: name.trim() });
      toast.success("Category updated", {
        description: `"${updated.name}" has been saved.`,
      });
      onUpdated?.(updated);
      onOpenChange(false);
    } catch {
      setError("Failed to update the category. Please try again.");
      toast.error("Update failed", {
        description: "Could not save the category.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription>
            Update the name for category #{category.id}.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="edit-category-name">Name</Label>
            <Input
              id="edit-category-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={255}
              autoFocus
            />
          </div>

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
