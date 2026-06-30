import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { formatPrice } from "@/components/products/product-form";

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

function clientLabel(client) {
  return `${client.first_name} ${client.last_name}`;
}

export function OrderFormFields({
  idPrefix,
  values,
  onChange,
  clients,
  clientsLoading,
  products,
  productsLoading,
}) {
  const set = (field) => (event) =>
    onChange({ ...values, [field]: event.target.value });

  const toggleClient = (clientId) => {
    const id = String(clientId);
    const next = values.client_ids.includes(id)
      ? values.client_ids.filter((cid) => cid !== id)
      : [...values.client_ids, id];
    onChange({ ...values, client_ids: next });
  };

  const toggleProduct = (productId) => {
    const id = String(productId);
    const isSelected = values.product_items.some((item) => item.product_id === id);
    const nextItems = isSelected
      ? values.product_items.filter((item) => item.product_id !== id)
      : [...values.product_items, { product_id: id, quantity: "1" }];
    onChange({ ...values, product_items: nextItems });
  };

  const setProductQuantity = (productId, quantity) => {
    const id = String(productId);
    onChange({
      ...values,
      product_items: values.product_items.map((item) =>
        item.product_id === id ? { ...item, quantity } : item,
      ),
    });
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label>Clients</Label>
        <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
          {clientsLoading ? (
            <p className="text-sm text-muted-foreground">Loading clients...</p>
          ) : clients.length === 0 ? (
            <p className="text-sm text-muted-foreground">No clients available.</p>
          ) : (
            clients.map((client) => (
              <label
                key={client.id}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={values.client_ids.includes(String(client.id))}
                  onChange={() => toggleClient(client.id)}
                  className="size-4 rounded border-input"
                />
                <span>
                  {clientLabel(client)}{" "}
                  <span className="text-muted-foreground">({client.email})</span>
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Products</Label>
        <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
          {productsLoading ? (
            <p className="text-sm text-muted-foreground">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products available.</p>
          ) : (
            products.map((product) => {
              const selected = values.product_items.find(
                (item) => item.product_id === String(product.id),
              );

              return (
                <div key={product.id} className="flex items-center gap-3 text-sm">
                  <label className="flex flex-1 cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(selected)}
                      onChange={() => toggleProduct(product.id)}
                      className="size-4 rounded border-input"
                    />
                    <span>
                      {product.name}{" "}
                      <span className="text-muted-foreground">
                        ({formatPrice(product.price)})
                      </span>
                    </span>
                  </label>
                  {selected && (
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={selected.quantity}
                      onChange={(event) =>
                        setProductQuantity(product.id, event.target.value)
                      }
                      className="h-8 w-20"
                      aria-label={`Quantity for ${product.name}`}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-total-price`}>Total price (€)</Label>
          <Input
            id={`${idPrefix}-total-price`}
            type="number"
            min="0"
            step="0.01"
            value={values.total_price}
            onChange={set("total_price")}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-status`}>Status</Label>
          <Select id={`${idPrefix}-status`} value={values.status} onChange={set("status")}>
            {ORDER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-order-date`}>Order date</Label>
          <Input
            id={`${idPrefix}-order-date`}
            type="date"
            value={values.order_date}
            onChange={set("order_date")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-delivery-date`}>Delivery date</Label>
          <Input
            id={`${idPrefix}-delivery-date`}
            type="date"
            value={values.delivery_date}
            onChange={set("delivery_date")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-delivery-address`}>Delivery address</Label>
        <Input
          id={`${idPrefix}-delivery-address`}
          value={values.delivery_address}
          onChange={set("delivery_address")}
          placeholder="123 Main St, Paris"
        />
      </div>
    </div>
  );
}

export function emptyOrderForm() {
  return {
    client_ids: [],
    product_items: [],
    total_price: "",
    status: "pending",
    order_date: "",
    delivery_date: "",
    delivery_address: "",
  };
}

export function orderToForm(order) {
  return {
    client_ids: (order?.clients ?? []).map((client) => String(client.id)),
    product_items: (order?.products ?? []).map((product) => ({
      product_id: String(product.id),
      quantity: product.pivot?.quantity != null ? String(product.pivot.quantity) : "1",
    })),
    total_price: order?.total_price != null ? String(order.total_price) : "",
    status: order?.status ?? "pending",
    order_date: order?.order_date ? order.order_date.slice(0, 10) : "",
    delivery_date: order?.delivery_date ? order.delivery_date.slice(0, 10) : "",
    delivery_address: order?.delivery_address ?? "",
  };
}

export function formToPayload(values) {
  return {
    client_ids: values.client_ids.map(Number),
    products: values.product_items.map((item) => ({
      id: Number(item.product_id),
      quantity: Number(item.quantity),
    })),
    total_price: Number(values.total_price),
    status: values.status,
    order_date: values.order_date,
    delivery_date: values.delivery_date,
    delivery_address: values.delivery_address.trim(),
  };
}

export function validateOrderForm(values) {
  if (values.client_ids.length === 0) {
    return "Select at least one client.";
  }
  if (values.product_items.length === 0) {
    return "Select at least one product.";
  }
  for (const item of values.product_items) {
    if (
      item.quantity === "" ||
      Number(item.quantity) < 1 ||
      !Number.isInteger(Number(item.quantity))
    ) {
      return "Each product must have a valid quantity.";
    }
  }
  if (values.total_price === "" || Number(values.total_price) < 0) {
    return "Total price must be a valid number.";
  }
  if (!values.order_date) {
    return "Order date is required.";
  }
  if (!values.delivery_date) {
    return "Delivery date is required.";
  }
  if (values.delivery_date < values.order_date) {
    return "Delivery date must be on or after the order date.";
  }
  if (!values.delivery_address.trim()) {
    return "Delivery address is required.";
  }
  return "";
}

export function formatOrderClients(clients) {
  if (!clients?.length) return "—";
  return clients.map((c) => `${c.first_name} ${c.last_name}`).join(", ");
}

export function formatOrderProducts(products) {
  if (!products?.length) return "—";
  return products
    .map((p) => `${p.name} ×${p.pivot?.quantity ?? 1}`)
    .join(", ");
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function statusLabel(status) {
  return ORDER_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function statusClassName(status) {
  switch (status) {
    case "delivered":
      return "rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary";
    case "cancelled":
      return "rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive";
    case "shipped":
    case "confirmed":
      return "rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-600";
    default:
      return "rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground";
  }
}
