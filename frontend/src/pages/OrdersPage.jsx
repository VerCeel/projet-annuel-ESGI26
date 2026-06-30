import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { getOrderColumns } from "@/components/orders/columns";
import OrderCreateDialog from "@/components/orders/OrderCreateDialog";
import OrderDeleteDialog from "@/components/orders/OrderDeleteDialog";
import OrderEditDialog from "@/components/orders/OrderEditDialog";
import OrderShowDialog from "@/components/orders/OrderShowDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { deleteOrder, getOrders } from "@/services/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [showOrder, setShowOrder] = useState(null);
  const [showOpen, setShowOpen] = useState(false);

  const [editOrder, setEditOrder] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteOrderTarget, setDeleteOrderTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);

  const loadOrders = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load orders. Make sure the backend is running.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleView = useCallback((order) => {
    setShowOrder(order);
    setShowOpen(true);
  }, []);

  const handleEdit = useCallback((order) => {
    setEditOrder(order);
    setEditOpen(true);
  }, []);

  const handleDeleteClick = useCallback((order) => {
    setDeleteOrderTarget(order);
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteOrderTarget) return;

    const { id } = deleteOrderTarget;
    setDeletingId(id);

    try {
      await deleteOrder(id);
      await loadOrders();
      setDeleteOpen(false);
      setDeleteOrderTarget(null);
      toast.success("Order deleted", {
        description: `Order #${id} has been removed.`,
      });
    } catch {
      toast.error("Delete failed", {
        description: `Could not delete order #${id}.`,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const columns = useMemo(
    () =>
      getOrderColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
        deletingId,
      }),
    [deletingId, handleView, handleEdit, handleDeleteClick],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-2 text-muted-foreground">
            Manage orders linked to clients and products.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus data-icon="inline-start" />
          New order
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="py-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading orders...
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <ShoppingCart className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground">No orders found.</p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus data-icon="inline-start" />
              Create an order
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          filterColumn="status"
          filterPlaceholder="Filter by status..."
        />
      )}

      <OrderShowDialog order={showOrder} open={showOpen} onOpenChange={setShowOpen} />

      <OrderEditDialog
        order={editOrder}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={loadOrders}
      />

      <OrderDeleteDialog
        order={deleteOrderTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        loading={deletingId === deleteOrderTarget?.id}
      />

      <OrderCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={loadOrders}
      />
    </div>
  );
}
