import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ProductFormFields,
  emptyProductForm,
  formToPayload,
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
import { createProduct } from "@/services/products";

export default function ProductCreateDialog({ open, onOpenChange, onCreated }) {
  const [values, setValues] = useState(emptyProductForm());
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setCategoriesLoading(true);
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, [open]);

  const resetForm = () => {
    setValues(emptyProductForm());
    setError("");
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateProductForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const product = await createProduct(formToPayload(values));
      toast.success("Product created", {
        description: `"${product.name}" has been added.`,
      });
      onCreated?.(product);
      handleOpenChange(false);
    } catch {
      setError("Failed to create the product. Please try again.");
      toast.error("Create failed", {
        description: "Could not create the product.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create a new product</DialogTitle>
          <DialogDescription>
            Add product details and link it to a category.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <ProductFormFields
            idPrefix="create-product"
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
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || categories.length === 0}>
              {loading ? "Creating..." : "Create product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
