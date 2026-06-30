import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NoteCard({ note, onView, onEdit, onDelete, deleting }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">{note.title}</CardTitle>
        <CardDescription>{formatDate(note.created_at)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
          {note.content}
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" onClick={() => onView(note)}>
          <Eye data-icon="inline-start" />
          View
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(note)}>
          <Pencil data-icon="inline-start" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          disabled={deleting}
          onClick={() => onDelete(note)}
        >
          <Trash2 data-icon="inline-start" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
