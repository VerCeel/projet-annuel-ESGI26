import api from "./api";

export async function getOrders() {
  const response = await api.get("/orders");
  return response.data;
}

export async function getOrder(id) {
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

export async function createOrder(payload) {
  const response = await api.post("/orders", payload);
  return response.data;
}

export async function updateOrder(id, payload) {
  const response = await api.put(`/orders/${id}`, payload);
  return response.data;
}

export async function deleteOrder(id) {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
}
