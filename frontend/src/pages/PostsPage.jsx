import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Plus } from "lucide-react";
import { toast } from "sonner";

import { getPostColumns } from "@/components/posts/columns";
import PostCreateDialog from "@/components/posts/PostCreateDialog";
import PostDeleteDialog from "@/components/posts/PostDeleteDialog";
import PostEditDialog from "@/components/posts/PostEditDialog";
import PostShowDialog from "@/components/posts/PostShowDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { deletePost, getPosts } from "@/services/posts";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [showPost, setShowPost] = useState(null);
  const [showOpen, setShowOpen] = useState(false);

  const [editPost, setEditPost] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deletePostTarget, setDeletePostTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);

  const loadPosts = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load posts. Make sure the backend is running.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleView = useCallback((post) => {
    setShowPost(post);
    setShowOpen(true);
  }, []);

  const handleEdit = useCallback((post) => {
    setEditPost(post);
    setEditOpen(true);
  }, []);

  const handleDeleteClick = useCallback((post) => {
    setDeletePostTarget(post);
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deletePostTarget) return;

    const { id, title } = deletePostTarget;
    setDeletingId(id);

    try {
      await deletePost(id);
      await loadPosts();
      setDeleteOpen(false);
      setDeletePostTarget(null);
      toast.success("Post deleted", {
        description: `"${title}" has been removed.`,
      });
    } catch {
      toast.error("Delete failed", {
        description: `Could not delete "${title}".`,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const columns = useMemo(
    () =>
      getPostColumns({
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
          <h1 className="text-3xl font-semibold tracking-tight">Posts</h1>
          <p className="mt-2 text-muted-foreground">
            Manage articles in a sortable, filterable data table.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus data-icon="inline-start" />
          New post
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
            Loading posts...
          </CardContent>
        </Card>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <FileText className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground">No posts found.</p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus data-icon="inline-start" />
              Create a post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={posts}
          filterColumn="title"
          filterPlaceholder="Filter posts..."
        />
      )}

      <PostShowDialog post={showPost} open={showOpen} onOpenChange={setShowOpen} />

      <PostEditDialog
        post={editPost}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={loadPosts}
      />

      <PostDeleteDialog
        post={deletePostTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        loading={deletingId === deletePostTarget?.id}
      />

      <PostCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={loadPosts}
      />
    </div>
  );
}
