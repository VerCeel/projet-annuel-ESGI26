import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/services/posts";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    try {
      const post = await createPost({ title: title.trim(), content: content.trim() });
      toast.success("Post created", {
        description: `"${post.title}" has been published.`,
      });
      navigate("/posts");
    } catch {
      setError("Failed to create the post. Please try again.");
      toast.error("Create failed", {
        description: "Could not publish the post.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 md:px-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link to="/posts">
          <ArrowLeft data-icon="inline-start" />
          Back to posts
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create a new post</CardTitle>
          <CardDescription>
            Share a title and content — it will be saved to your Laravel API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a catchy title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Publishing..." : "Publish post"}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link to="/posts">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
