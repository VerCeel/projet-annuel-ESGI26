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
import { updateNote } from "@/services/notes";

export default function NoteEditDialog({ note, open, onOpenChange, onUpdated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (note && open) {
      setTitle(note.title ?? "");
      setContent(note.content ?? "");
      setError("");
    }
  }, [note, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!note) return;

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateNote(note.id, {
        title: title.trim(),
        content: content.trim(),
      });
      toast.success("Note updated", {
        description: `"${updated.title}" has been saved.`,
      });
      onUpdated?.(updated);
      onOpenChange(false);
    } catch {
      setError("Failed to update the note. Please try again.");
      toast.error("Update failed", {
        description: "Could not save the note.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit note</DialogTitle>
          <DialogDescription>Update note #{note.id}.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="edit-note-title">Title</Label>
            <Input
              id="edit-note-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={255}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-note-content">Content</Label>
            <Textarea
              id="edit-note-content"
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
