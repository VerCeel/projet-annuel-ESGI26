import { Eye, Pencil, Trash2 } from "lucide-react";

import { clientLabel, COMMAND_STATUSES } from "@/components/commands/command-form";
import { formatPrice } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table";

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLES = {
  pending: "bg-amber-500/10 text-amber-600",
  paid: "bg-primary/10 text-primary",
  shipped: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-destructive/10 text-destructive",
};

function statusLabel(value) {
  return COMMAND_STATUSES.find((status) => status.value === value)?.label ?? value;
}

export function getCommandColumns({ onView, onEdit, onDelete, deletingId }) {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => (
        <span className="font-mono text-muted-foreground">#{row.getValue("id")}</span>
      ),
    },
    {
      id: "client",
      accessorFn: (row) => clientLabel(row.client),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Client" />,
      cell: ({ row }) => <span className="font-medium">{clientLabel(row.original.client)}</span>,
    },
    {
      id: "items",
      accessorFn: (row) => row.products?.length ?? 0,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Items" />,
      cell: ({ row }) => {
        const count = row.original.products?.length ?? 0;
        return (
          <span className="text-muted-foreground">
            {count} product{count === 1 ? "" : "s"}
          </span>
        );
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
      cell: ({ row }) => formatPrice(row.getValue("total")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"}`}
          >
            {statusLabel(status)}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{formatDate(row.getValue("created_at"))}</span>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const command = row.original;
        const isDeleting = deletingId === command.id;

        return (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => onView(command)} title="View">
              <Eye className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(command)} title="Edit">
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:text-destructive"
              disabled={isDeleting}
              onClick={() => onDelete(command)}
              title="Delete"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
