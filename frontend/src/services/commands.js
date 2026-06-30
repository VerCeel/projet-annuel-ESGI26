import api from "./api";

export async function getCommands() {
  const response = await api.get("/commands");
  return response.data;
}

export async function getCommand(id) {
  const response = await api.get(`/commands/${id}`);
  return response.data;
}

export async function createCommand(payload) {
  const response = await api.post("/commands", payload);
  return response.data;
}

export async function updateCommand(id, payload) {
  const response = await api.put(`/commands/${id}`, payload);
  return response.data;
}

export async function deleteCommand(id) {
  const response = await api.delete(`/commands/${id}`);
  return response.data;
}
