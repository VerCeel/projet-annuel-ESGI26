import api from "./api";

export async function getClients() {
  const response = await api.get("/clients");
  return response.data;
}

export async function getClient(id) {
  const response = await api.get(`/clients/${id}`);
  return response.data;
}
