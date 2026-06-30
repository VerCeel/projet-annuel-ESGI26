import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import NoteDeleteDialog from "@/components/notes/NoteDeleteDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteNote, getNote } from "@/services/notes";

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

export default function NoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");

    getNote(id)
      .then(setNote)
      .catch(() => setError("Note not found or unavailable."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeleteConfirm = async () => {
    if (!note) return;

    setDeleting(true);
    try {
      await deleteNote(note.id);
      toast.success("Note deleted", {
        description: `"${note.title}" has been removed.`,
      });
      navigate("/notes");
    } catch {
      toast.error("Delete failed", {
        description: `Could not delete "${note.title}".`,
      });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Loading note...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-destructive">{error || "Note not found."}</p>
            <Button asChild variant="outline">
              <Link to="/notes">
                <ArrowLeft data-icon="inline-start" />
                Back to notes
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
        <Link to="/notes">
          <ArrowLeft data-icon="inline-start" />
          Back to notes
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <CardTitle className="text-2xl md:text-3xl">{note.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="size-4" />
                {formatDate(note.created_at)}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link to={`/notes/${note.id}/edit`}>
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
          <div className="whitespace-pre-wrap text-base leading-8">{note.content}</div>
        </CardContent>
      </Card>

      <NoteDeleteDialog
        note={note}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </div>
  );
}
