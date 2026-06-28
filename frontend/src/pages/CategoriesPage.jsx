import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Tag } from "lucide-react";
import { toast } from "sonner";

import CategoryCreateDialog from "@/components/categories/CategoryCreateDialog";
import CategoryDeleteDialog from "@/components/categories/CategoryDeleteDialog";
import CategoryEditDialog from "@/components/categories/CategoryEditDialog";
import CategoryShowDialog from "@/components/categories/CategoryShowDialog";
import { getCategoryColumns } from "@/components/categories/columns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { deleteCategory, getCategories } from "@/services/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [showCategory, setShowCategory] = useState(null);
  const [showOpen, setShowOpen] = useState(false);

  const [editCategory, setEditCategory] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);

  const loadCategories = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load categories. Make sure the backend is running.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleView = useCallback((category) => {
    setShowCategory(category);
    setShowOpen(true);
  }, []);

  const handleEdit = useCallback((category) => {
    setEditCategory(category);
    setEditOpen(true);
  }, []);

  const handleDeleteClick = useCallback((category) => {
    setDeleteCategoryTarget(category);
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteCategoryTarget) return;

    const { id, name } = deleteCategoryTarget;
    setDeletingId(id);

    try {
      await deleteCategory(id);
      await loadCategories();
      setDeleteOpen(false);
      setDeleteCategoryTarget(null);
      toast.success("Category deleted", {
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

  const handleCategoryUpdated = async () => {
    await loadCategories();
  };

  const columns = useMemo(
    () =>
      getCategoryColumns({
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
          <h1 className="text-3xl font-semibold tracking-tight">
            Categories
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage categories in a sortable, filterable data table.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus data-icon="inline-start" />
          New category
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
            Loading categories...
          </CardContent>
        </Card>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <Tag className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground">No categories found.</p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus data-icon="inline-start" />
              Create a category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={categories}
          filterColumn="name"
          filterPlaceholder="Filter categories..."
        />
      )}

      <CategoryShowDialog
        category={showCategory}
        open={showOpen}
        onOpenChange={setShowOpen}
      />

      <CategoryEditDialog
        category={editCategory}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={handleCategoryUpdated}
      />

      <CategoryDeleteDialog
        category={deleteCategoryTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        loading={deletingId === deleteCategoryTarget?.id}
      />

      <CategoryCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={loadCategories}
      />
    </div>
  );
}
