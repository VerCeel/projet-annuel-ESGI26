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
import { Textarea } from "@/components/ui/textarea";
import { getPost, updatePost } from "@/services/posts";

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPost(id)
      .then((post) => {
        setTitle(post.title ?? "");
        setContent(post.content ?? "");
      })
      .catch(() => setError("Post not found or unavailable."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updatePost(id, { title: title.trim(), content: content.trim() });
      toast.success("Post updated", {
        description: `"${updated.title}" has been saved.`,
      });
      navigate("/posts");
    } catch {
      setError("Failed to update the post. Please try again.");
      toast.error("Update failed", {
        description: "Could not save the post.",
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
            Loading post...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !title && !content) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-destructive">{error}</p>
            <Button asChild variant="outline">
              <Link to="/posts">
                <ArrowLeft data-icon="inline-start" />
                Back to posts
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
        <Link to="/posts">
          <ArrowLeft data-icon="inline-start" />
          Back to posts
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit post</CardTitle>
          <CardDescription>Update the title or content of this article.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
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
                <Link to="/posts">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
