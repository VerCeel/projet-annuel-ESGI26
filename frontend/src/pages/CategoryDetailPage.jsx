import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Pencil, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import CategoryDeleteDialog from "@/components/categories/CategoryDeleteDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteCategory, getCategory } from "@/services/categories";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CategoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");

    getCategory(id)
      .then(setCategory)
      .catch(() => setError("Category not found or unavailable."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeleteConfirm = async () => {
    if (!category) return;

    setDeleting(true);
    try {
      await deleteCategory(category.id);
      toast.success("Category deleted", {
        description: `"${category.name}" has been removed.`,
      });
      navigate("/categories");
    } catch {
      toast.error("Delete failed", {
        description: `Could not delete "${category.name}".`,
      });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Loading category...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-destructive">{error || "Category not found."}</p>
            <Button asChild variant="outline">
              <Link to="/categories">
                <ArrowLeft data-icon="inline-start" />
                Back to categories
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 md:px-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link to="/categories">
          <ArrowLeft data-icon="inline-start" />
          Back to categories
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Tag className="size-5" />
                </span>
                {category.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="size-4" />
                Created {formatDate(category.created_at)}
              </CardDescription>
              {category.updated_at !== category.created_at && (
                <CardDescription className="flex items-center gap-2">
                  Updated {formatDate(category.updated_at)}
                </CardDescription>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link to={`/categories/${category.id}/edit`}>
                  <Pencil data-icon="inline-start" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleting}
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 data-icon="inline-start" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-muted/50 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">ID</dt>
              <dd className="mt-1 text-lg font-medium">{category.id}</dd>
            </div>
            <div className="rounded-xl border bg-muted/50 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Name</dt>
              <dd className="mt-1 text-lg font-medium">{category.name}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <CategoryDeleteDialog
        category={category}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </div>
  );
}
