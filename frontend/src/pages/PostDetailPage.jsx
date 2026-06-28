import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import PostDeleteDialog from "@/components/posts/PostDeleteDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deletePost, getPost } from "@/services/posts";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");

    getPost(id)
      .then(setPost)
      .catch(() => setError("Post not found or unavailable."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeleteConfirm = async () => {
    if (!post) return;

    setDeleting(true);
    try {
      await deletePost(post.id);
      toast.success("Post deleted", {
        description: `"${post.title}" has been removed.`,
      });
      navigate("/posts");
    } catch {
      toast.error("Delete failed", {
        description: `Could not delete "${post.title}".`,
      });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Loading post...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-destructive">{error || "Post not found."}</p>
            <Button asChild variant="outline">
              <Link to="/posts">
                <ArrowLeft data-icon="inline-start" />
                Back to posts
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 md:px-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link to="/posts">
          <ArrowLeft data-icon="inline-start" />
          Back to posts
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <CardTitle className="text-2xl md:text-3xl">{post.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="size-4" />
                {formatDate(post.created_at)}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link to={`/posts/${post.id}/edit`}>
                  <Pencil data-icon="inline-start" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleting}
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 data-icon="inline-start" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-base leading-8">{post.content}</div>
        </CardContent>
      </Card>

      <PostDeleteDialog
        post={post}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </div>
  );
}
