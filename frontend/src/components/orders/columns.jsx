import { Eye, Pencil, Trash2 } from "lucide-react";

import {
  formatDate,
  formatOrderClients,
  formatOrderProducts,
  statusClassName,
  statusLabel,
} from "@/components/orders/order-form";
import { formatPrice } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table";

export function getOrderColumns({ onView, onEdit, onDelete, deletingId }) {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => (
        <span className="font-mono text-muted-foreground">#{row.getValue("id")}</span>
      ),
    },
    {
      id: "clients",
      accessorFn: (row) => formatOrderClients(row.clients),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Clients" />,
      cell: ({ row }) => (
        <span className="max-w-[180px] truncate text-muted-foreground">
          {formatOrderClients(row.original.clients)}
        </span>
      ),
    },
    {
      id: "products",
      accessorFn: (row) => formatOrderProducts(row.products),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Products" />,
      cell: ({ row }) => (
        <span className="max-w-[220px] truncate text-muted-foreground">
          {formatOrderProducts(row.original.products)}
        </span>
      ),
    },
    {
      accessorKey: "total_price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
      cell: ({ row }) => formatPrice(row.getValue("total_price")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <span className={statusClassName(status)}>{statusLabel(status)}</span>
        );
      },
    },
    {
      accessorKey: "order_date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order date" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{formatDate(row.getValue("order_date"))}</span>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const order = row.original;
        const isDeleting = deletingId === order.id;

        return (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => onView(order)} title="View">
              <Eye className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(order)} title="Edit">
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:text-destructive"
              disabled={isDeleting}
              onClick={() => onDelete(order)}
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
