import { useEffect, useState } from "react";
import api from "./services/api";
import { createPost, deletePost, getPosts } from "./services/posts";
import { Button } from "./components/ui/button";

function App() {
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    const data = await getPosts();
    setPosts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    api.get("/test").then((response) => {
      setMessage(response.data?.message ?? "");
    });

    api.get("/user").then((response) => {
      setUserData(response.data);
    });

    loadPosts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    setLoading(true);
    try {
      await createPost({ title, content });
      setTitle("");
      setContent("");
      await loadPosts();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    await loadPosts();
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-black">
     
      <p className="text-center">{message}</p>
      {userData && (
        <div>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}

      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
        <input
          className="w-full border rounded p-2"
          placeholder="Post title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <textarea
          className="w-full border rounded p-2"
          placeholder="Post content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Post"}
        </Button>
      </form>

      <div className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border rounded p-3">
              <h3 className="font-semibold">{post.title}</h3>
              <p>{post.content}</p>
              <Button className="mt-2" onClick={() => handleDelete(post.id)}>
                Delete
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
