import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { createCategory } from "@/services/categories";

export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setLoading(true);
    try {
      const category = await createCategory({ name: name.trim() });
      toast.success("Category created", {
        description: `"${category.name}" has been added.`,
      });
      navigate("/categories");
    } catch {
      setError("Failed to create the category. Please try again.");
      toast.error("Create failed", {
        description: "Could not create the category.",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <CardTitle>Create a new category</CardTitle>
          <CardDescription>Add a name for your category.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Technology, Travel, Food..."
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
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create category"}
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
