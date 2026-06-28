import { Calendar, FileText } from "lucide-react";

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

export default function PostShowDialog({ post, open, onOpenChange }) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            {post.title}
          </DialogTitle>
          <DialogDescription>Post details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Content</dt>
            <dd className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</dd>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">ID</dt>
              <dd className="mt-1 font-mono">#{post.id}</dd>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                <Calendar className="size-3.5" />
                Created
              </dt>
              <dd className="mt-1 text-sm">{formatDate(post.created_at)}</dd>
            </div>
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}
