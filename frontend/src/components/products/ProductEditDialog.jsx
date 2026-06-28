import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ProductFormFields,
  formToPayload,
  productToForm,
  validateProductForm,
} from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCategories } from "@/services/categories";
import { updateProduct } from "@/services/products";

export default function ProductEditDialog({ product, open, onOpenChange, onUpdated }) {
  const [values, setValues] = useState(productToForm(null));
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setCategoriesLoading(true);
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, [open]);

  useEffect(() => {
    if (product && open) {
      setValues(productToForm(product));
      setError("");
    }
  }, [product, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!product) return;

    const validationError = validateProductForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProduct(product.id, formToPayload(values));
      toast.success("Product updated", {
        description: `"${updated.name}" has been saved.`,
      });
      onUpdated?.(updated);
      onOpenChange(false);
    } catch {
      setError("Failed to update the product. Please try again.");
      toast.error("Update failed", {
        description: "Could not save the product.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>Update product #{product.id}.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <ProductFormFields
            idPrefix="edit-product"
            values={values}
            onChange={setValues}
            categories={categories}
            categoriesLoading={categoriesLoading}
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
