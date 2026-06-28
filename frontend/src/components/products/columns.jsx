import { Eye, Pencil, Trash2 } from "lucide-react";

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

export function getProductColumns({ onView, onEdit, onDelete, deletingId }) {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => (
        <span className="font-mono text-muted-foreground">#{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      id: "category",
      accessorFn: (row) => row.category?.name ?? "—",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.category?.name ?? "—"}</span>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
      cell: ({ row }) => formatPrice(row.getValue("price")),
    },
    {
      accessorKey: "stock",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
      cell: ({ row }) => row.getValue("stock"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <span
            className={
              status === "in stock"
                ? "rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                : "rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive"
            }
          >
            {status}
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
        const product = row.original;
        const isDeleting = deletingId === product.id;

        return (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => onView(product)} title="View">
              <Eye className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(product)} title="Edit">
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:text-destructive"
              disabled={isDeleting}
              onClick={() => onDelete(product)}
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
