import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCategory, updateCategory } from "@/services/categories";

export default function EditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategory(id)
      .then((category) => setName(category.name ?? ""))
      .catch(() => setError("Category not found or unavailable."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateCategory(id, { name: name.trim() });
      toast.success("Category updated", {
        description: `"${updated.name}" has been saved.`,
      });
      navigate("/categories");
    } catch {
      setError("Failed to update the category. Please try again.");
      toast.error("Update failed", {
        description: "Could not save the category.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Loading category...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !name) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-destructive">{error}</p>
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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 md:px-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link to="/categories">
          <ArrowLeft data-icon="inline-start" />
          Back to categories
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit category</CardTitle>
          <CardDescription>Update the category name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={255}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link to="/categories">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
