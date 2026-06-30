import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { getCommandColumns } from "@/components/commands/columns";
import CommandCreateDialog from "@/components/commands/CommandCreateDialog";
import CommandDeleteDialog from "@/components/commands/CommandDeleteDialog";
import CommandEditDialog from "@/components/commands/CommandEditDialog";
import CommandShowDialog from "@/components/commands/CommandShowDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { deleteCommand, getCommands } from "@/services/commands";

export default function CommandsPage() {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [showCommand, setShowCommand] = useState(null);
  const [showOpen, setShowOpen] = useState(false);

  const [editCommand, setEditCommand] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);

  const loadCommands = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getCommands();
      setCommands(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load commands. Make sure the backend is running.");
      setCommands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommands();
  }, []);

  const handleView = useCallback((command) => {
    setShowCommand(command);
    setShowOpen(true);
  }, []);

  const handleEdit = useCallback((command) => {
    setEditCommand(command);
    setEditOpen(true);
  }, []);

  const handleDeleteClick = useCallback((command) => {
    setDeleteTarget(command);
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    const { id } = deleteTarget;
    setDeletingId(id);

    try {
      await deleteCommand(id);
      await loadCommands();
      setDeleteOpen(false);
      setDeleteTarget(null);
      toast.success("Command deleted", {
        description: `Order #${id} has been removed and its stock restored.`,
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
      getCommandColumns({
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
          <h1 className="text-3xl font-semibold tracking-tight">Commands</h1>
          <p className="mt-2 text-muted-foreground">
            Register multi-product orders for your clients. Stock and totals update automatically.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus data-icon="inline-start" />
          New command
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
            Loading commands...
          </CardContent>
        </Card>
      ) : commands.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <ShoppingCart className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground">No commands found.</p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus data-icon="inline-start" />
              Create a command
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={commands}
          filterColumn="client"
          filterPlaceholder="Filter by client..."
        />
      )}

      <CommandShowDialog command={showCommand} open={showOpen} onOpenChange={setShowOpen} />

      <CommandEditDialog
        command={editCommand}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={loadCommands}
      />

      <CommandDeleteDialog
        command={deleteTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        loading={deletingId === deleteTarget?.id}
      />

      <CommandCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={loadCommands}
      />
    </div>
  );
}
