import { Mail, MapPin, Phone, User } from "lucide-react";

import { formatClientName, formatDate } from "@/components/clients/client-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ClientShowDialog({ client, open, onOpenChange }) {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            {formatClientName(client)}
          </DialogTitle>
          <DialogDescription>Client details</DialogDescription>
        </DialogHeader>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/50 p-4">
            <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
              <Mail className="size-3.5" />
              Email
            </dt>
            <dd className="mt-1 text-sm">{client.email}</dd>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
              <Phone className="size-3.5" />
              Phone
            </dt>
            <dd className="mt-1 text-sm">{client.phone}</dd>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4 sm:col-span-2">
            <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
              <MapPin className="size-3.5" />
              Address
            </dt>
            <dd className="mt-1 text-sm">
              {client.address}, {client.zip}
            </dd>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4 sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Created</dt>
            <dd className="mt-1 text-sm">{formatDate(client.created_at)}</dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
