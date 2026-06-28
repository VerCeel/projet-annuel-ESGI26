import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Feather, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/services/api";
import { getPosts } from "@/services/posts";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState("loading");
  const [apiMessage, setApiMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    api
      .get("/test")
      .then((response) => {
        setApiMessage(response.data?.message ?? "API connected");
        setApiStatus("online");
      })
      .catch(() => {
        setApiMessage("Unable to reach the API");
        setApiStatus("offline");
      });

    getPosts()
      .then((data) => setPosts(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setPosts([]))
      .finally(() => setLoadingPosts(false));
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8 md:px-6">
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-accent p-8 md:p-12">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-accent blur-3xl" />

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs text-primary">
            <Sparkles className="size-3.5" />
            Laravel + React
          </div>

          <div className="space-y-3">
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
              Welcome to Budgie
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
              A simple content platform powered by your Laravel API. Browse posts,
              create new stories, and manage everything from a clean interface.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/posts">
                Browse posts
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/posts">Write a post</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span
                className={`size-2 rounded-full ${
                  apiStatus === "online"
                    ? "bg-primary"
                    : apiStatus === "offline"
                      ? "bg-destructive"
                      : "animate-pulse bg-muted-foreground"
                }`}
              />
              API status
            </CardTitle>
            <CardDescription>
              {apiStatus === "loading" ? "Checking connection..." : apiMessage}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            <CardDescription>
              {loadingPosts
                ? "Loading count..."
                : `${posts.length > 0 ? "Latest entries available" : "No posts yet — create the first one"}`}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Feather className="size-4 text-primary" />
              Full CRUD
            </CardTitle>
            <CardDescription>
              Create, read, update, and delete posts through the REST API.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Recent posts</h2>
            <p className="text-sm text-muted-foreground">
              A quick look at the latest content from your backend.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/posts">View all</Link>
          </Button>
        </div>

        {loadingPosts ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Loading posts...
            </CardContent>
          </Card>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
              <p className="text-muted-foreground">No posts published yet.</p>
              <Button asChild>
                <Link to="/posts">Create your first post</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription>{formatDate(post.created_at)}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {post.content}
                  </p>
                  <Button asChild variant="outline" className="w-fit">
                    <Link to={`/posts/${post.id}`}>Read more</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
