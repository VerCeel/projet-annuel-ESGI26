import api from "./api";

export async function getNotes() {
  const response = await api.get("/notes");
  return response.data;
}

export async function getNote(id) {
  const response = await api.get(`/notes/${id}`);
  return response.data;
}

export async function createNote(payload) {
  const response = await api.post("/notes", payload);
  return response.data;
}

export async function updateNote(id, payload) {
  const response = await api.put(`/notes/${id}`, payload);
  return response.data;
}

export async function deleteNote(id) {
  await api.delete(`/notes/${id}`);
}
