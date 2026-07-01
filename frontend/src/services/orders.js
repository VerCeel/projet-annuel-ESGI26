import api from "./api";

export function getOrderErrorMessage(error, fallback = "Something went wrong.") {
  return error?.response?.data?.error ?? fallback;
}

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

export async function downloadOrderInvoice(id) {
  const response = await api.get(`/orders/${id}/invoice`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-order-${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
