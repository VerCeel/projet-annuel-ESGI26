import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, StickyNote } from "lucide-react";
import { toast } from "sonner";

import NoteCard from "@/components/notes/NoteCard";
import NoteCreateDialog from "@/components/notes/NoteCreateDialog";
import NoteDeleteDialog from "@/components/notes/NoteDeleteDialog";
import NoteEditDialog from "@/components/notes/NoteEditDialog";
import NoteShowDialog from "@/components/notes/NoteShowDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { deleteNote, getNotes } from "@/services/notes";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [showNote, setShowNote] = useState(null);
  const [showOpen, setShowOpen] = useState(false);

  const [editNote, setEditNote] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteNoteTarget, setDeleteNoteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);

  const loadNotes = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load notes. Make sure the backend is running.");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleView = useCallback((note) => {
    setShowNote(note);
    setShowOpen(true);
  }, []);

  const handleEdit = useCallback((note) => {
    setEditNote(note);
    setEditOpen(true);
  }, []);

  const handleDeleteClick = useCallback((note) => {
    setDeleteNoteTarget(note);
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteNoteTarget) return;

    const { id, title } = deleteNoteTarget;
    setDeletingId(id);

    try {
      await deleteNote(id);
      await loadNotes();
      setDeleteOpen(false);
      setDeleteNoteTarget(null);
      toast.success("Note deleted", {
        description: `"${title}" has been removed.`,
      });
    } catch {
      toast.error("Delete failed", {
        description: `Could not delete "${title}".`,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query),
    );
  }, [notes, search]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Notes</h1>
          <p className="mt-2 text-muted-foreground">
            Browse and manage your notes in a card layout.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus data-icon="inline-start" />
          New note
        </Button>
      </div>

      {!loading && notes.length > 0 && (
        <Input
          placeholder="Search notes..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
      )}

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="py-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading notes...
          </CardContent>
        </Card>
      ) : notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <StickyNote className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground">No notes found.</p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus data-icon="inline-start" />
              Create a note
            </Button>
          </CardContent>
        </Card>
      ) : filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No notes match your search.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              deleting={deletingId === note.id}
            />
          ))}
        </div>
      )}

      <NoteShowDialog note={showNote} open={showOpen} onOpenChange={setShowOpen} />

      <NoteEditDialog
        note={editNote}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={loadNotes}
      />

      <NoteDeleteDialog
        note={deleteNoteTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        loading={deletingId === deleteNoteTarget?.id}
      />

      <NoteCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={loadNotes}
      />
    </div>
  );
}
