import api from "./api";

export async function getPosts() {
  const response = await api.get("/posts");
  return response.data;
}

export async function createPost(payload) {
  const response = await api.post("/posts", payload);
  return response.data;
}

export async function updatePost(id, payload) {
  const response = await api.put(`/posts/${id}`, payload);
  return response.data;
}

export async function deletePost(id) {
  await api.delete(`/posts/${id}`);
}
