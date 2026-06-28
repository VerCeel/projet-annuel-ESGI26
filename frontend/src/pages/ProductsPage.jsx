import { useCallback, useEffect, useMemo, useState } from "react";
import { Package, Plus } from "lucide-react";
import { toast } from "sonner";

import { getProductColumns } from "@/components/products/columns";
import ProductCreateDialog from "@/components/products/ProductCreateDialog";
import ProductDeleteDialog from "@/components/products/ProductDeleteDialog";
import ProductEditDialog from "@/components/products/ProductEditDialog";
import ProductShowDialog from "@/components/products/ProductShowDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { deleteProduct, getProducts } from "@/services/products";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [showProduct, setShowProduct] = useState(null);
  const [showOpen, setShowOpen] = useState(false);

  const [editProduct, setEditProduct] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteProductTarget, setDeleteProductTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);

  const loadProducts = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load products. Make sure the backend is running.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleView = useCallback((product) => {
    setShowProduct(product);
    setShowOpen(true);
  }, []);

  const handleEdit = useCallback((product) => {
    setEditProduct(product);
    setEditOpen(true);
  }, []);

  const handleDeleteClick = useCallback((product) => {
    setDeleteProductTarget(product);
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteProductTarget) return;

    const { id, name } = deleteProductTarget;
    setDeletingId(id);

    try {
      await deleteProduct(id);
      await loadProducts();
      setDeleteOpen(false);
      setDeleteProductTarget(null);
      toast.success("Product deleted", {
        description: `"${name}" has been removed.`,
      });
    } catch {
      toast.error("Delete failed", {
        description: `Could not delete "${name}".`,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const columns = useMemo(
    () =>
      getProductColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
        deletingId,
      }),
    [deletingId, handleView, handleEdit, handleDeleteClick],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 text-muted-foreground">
            Manage products linked to categories in a sortable data table.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus data-icon="inline-start" />
          New product
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="py-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading products...
          </CardContent>
        </Card>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <Package className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground">No products found.</p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus data-icon="inline-start" />
              Create a product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={products}
          filterColumn="name"
          filterPlaceholder="Filter products..."
        />
      )}

      <ProductShowDialog product={showProduct} open={showOpen} onOpenChange={setShowOpen} />

      <ProductEditDialog
        product={editProduct}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={loadProducts}
      />

      <ProductDeleteDialog
        product={deleteProductTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        loading={deletingId === deleteProductTarget?.id}
      />

      <ProductCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={loadProducts}
      />
    </div>
  );
}
