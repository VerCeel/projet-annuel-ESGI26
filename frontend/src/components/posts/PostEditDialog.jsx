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
import { Textarea } from "@/components/ui/textarea";
import { updatePost } from "@/services/posts";

export default function PostEditDialog({ post, open, onOpenChange, onUpdated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (post && open) {
      setTitle(post.title ?? "");
      setContent(post.content ?? "");
      setError("");
    }
  }, [post, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!post) return;

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updatePost(post.id, {
        title: title.trim(),
        content: content.trim(),
      });
      toast.success("Post updated", {
        description: `"${updated.title}" has been saved.`,
      });
      onUpdated?.(updated);
      onOpenChange(false);
    } catch {
      setError("Failed to update the post. Please try again.");
      toast.error("Update failed", {
        description: "Could not save the post.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
          <DialogDescription>Update post #{post.id}.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="edit-post-title">Title</Label>
            <Input
              id="edit-post-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={255}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-post-content">Content</Label>
            <Textarea
              id="edit-post-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-32"
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
