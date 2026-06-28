import { Calendar, Tag } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CategoryShowDialog({ category, open, onOpenChange }) {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="size-5 text-primary" />
            {category.name}
          </DialogTitle>
          <DialogDescription>Category details</DialogDescription>
        </DialogHeader>

        <dl className="grid gap-3">
          <div className="rounded-lg border bg-muted/50 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">ID</dt>
            <dd className="mt-1 font-mono">{category.id}</dd>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Name</dt>
            <dd className="mt-1">{category.name}</dd>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
              <Calendar className="size-3.5" />
              Created
            </dt>
            <dd className="mt-1 text-sm">{formatDate(category.created_at)}</dd>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
              <Calendar className="size-3.5" />
              Updated
            </dt>
            <dd className="mt-1 text-sm">{formatDate(category.updated_at)}</dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
