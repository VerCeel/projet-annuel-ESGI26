import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { getClientColumns } from "@/components/clients/columns";
import ClientCreateDialog from "@/components/clients/ClientCreateDialog";
import ClientDeleteDialog from "@/components/clients/ClientDeleteDialog";
import ClientEditDialog from "@/components/clients/ClientEditDialog";
import ClientShowDialog from "@/components/clients/ClientShowDialog";
import { formatClientName } from "@/components/clients/client-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { deleteClient, getClients } from "@/services/clients";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [showClient, setShowClient] = useState(null);
  const [showOpen, setShowOpen] = useState(false);

  const [editClient, setEditClient] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteClientTarget, setDeleteClientTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);

  const loadClients = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getClients();
      setClients(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load clients. Make sure the backend is running.");
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleView = useCallback((client) => {
    setShowClient(client);
    setShowOpen(true);
  }, []);

  const handleEdit = useCallback((client) => {
    setEditClient(client);
    setEditOpen(true);
  }, []);

  const handleDeleteClick = useCallback((client) => {
    setDeleteClientTarget(client);
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteClientTarget) return;

    const { id } = deleteClientTarget;
    const name = formatClientName(deleteClientTarget);
    setDeletingId(id);

    try {
      await deleteClient(id);
      await loadClients();
      setDeleteOpen(false);
      setDeleteClientTarget(null);
      toast.success("Client deleted", {
        description: `${name} has been removed.`,
      });
    } catch {
      toast.error("Delete failed", {
        description: `Could not delete ${name}.`,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const columns = useMemo(
    () =>
      getClientColumns({
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
          <h1 className="text-3xl font-semibold tracking-tight">Clients</h1>
          <p className="mt-2 text-muted-foreground">
            Manage client contact information in a sortable data table.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus data-icon="inline-start" />
          New client
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
            Loading clients...
          </CardContent>
        </Card>
      ) : clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <Users className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground">No clients found.</p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus data-icon="inline-start" />
              Create a client
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={clients}
          filterColumn="email"
          filterPlaceholder="Filter clients..."
        />
      )}

      <ClientShowDialog client={showClient} open={showOpen} onOpenChange={setShowOpen} />

      <ClientEditDialog
        client={editClient}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={loadClients}
      />

      <ClientDeleteDialog
        client={deleteClientTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        loading={deletingId === deleteClientTarget?.id}
      />

      <ClientCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={loadClients}
      />
    </div>
  );
}
