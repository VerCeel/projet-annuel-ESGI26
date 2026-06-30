import { Plus, Trash2 } from "lucide-react";

import { formatPrice } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export const COMMAND_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "cancelled", label: "Cancelled" },
];

export function clientLabel(client) {
  if (!client) return "—";
  return `${client.first_name} ${client.last_name}`.trim() || client.email || `#${client.id}`;
}

function emptyItem() {
  return { product_id: "", quantity: "1" };
}

export function emptyCommandForm() {
  return {
    client_id: "",
    status: "pending",
    items: [emptyItem()],
  };
}

export function commandToForm(command) {
  const items =
    command?.products?.map((product) => ({
      product_id: String(product.id),
      quantity: String(product.pivot?.quantity ?? 1),
    })) ?? [];

  return {
    client_id: command?.client_id != null ? String(command.client_id) : "",
    status: command?.status ?? "pending",
    items: items.length > 0 ? items : [emptyItem()],
  };
}

export function formToPayload(values) {
  return {
    client_id: Number(values.client_id),
    status: values.status,
    items: values.items
      .filter((item) => item.product_id !== "")
      .map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      })),
  };
}

export function validateCommandForm(values, products) {
  if (!values.client_id) {
    return "Please select a client.";
  }

  const items = values.items.filter((item) => item.product_id !== "");
  if (items.length === 0) {
    return "Add at least one product.";
  }

  const productIds = items.map((item) => item.product_id);
  if (new Set(productIds).size !== productIds.length) {
    return "A product cannot appear twice. Adjust its quantity instead.";
  }

  for (const item of items) {
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return "Each quantity must be a whole number of at least 1.";
    }
    const product = products.find((p) => String(p.id) === item.product_id);
    if (product && quantity > product.stock) {
      return `Not enough stock for "${product.name}" (available: ${product.stock}).`;
    }
  }

  return "";
}

export function commandTotal(values, products) {
  return values.items.reduce((sum, item) => {
    const product = products.find((p) => String(p.id) === item.product_id);
    if (!product) return sum;
    return sum + Number(product.price) * Number(item.quantity || 0);
  }, 0);
}

/**
 * Pull a readable message out of a Laravel error response (validation / stock).
 */
export function extractApiError(error, fallback) {
  const data = error?.response?.data;
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first[0]) return first[0];
  }
  if (data?.message) return data.message;
  return fallback;
}

export function CommandFormFields({
  idPrefix,
  values,
  onChange,
  clients,
  clientsLoading,
  products,
  productsLoading,
  showStatus = false,
}) {
  const setField = (field) => (event) =>
    onChange({ ...values, [field]: event.target.value });

  const setItem = (index, field, value) => {
    const items = values.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange({ ...values, items });
  };

  const addItem = () =>
    onChange({ ...values, items: [...values.items, emptyItem()] });

  const removeItem = (index) =>
    onChange({ ...values, items: values.items.filter((_, i) => i !== index) });

  const total = commandTotal(values, products);

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-client`}>Client</Label>
          <Select
            id={`${idPrefix}-client`}
            value={values.client_id}
            onChange={setField("client_id")}
            disabled={clientsLoading || clients.length === 0}
          >
            <option value="">
              {clientsLoading
                ? "Loading clients..."
                : clients.length === 0
                  ? "No clients available"
                  : "Select a client"}
            </option>
            {clients.map((client) => (
              <option key={client.id} value={String(client.id)}>
                {clientLabel(client)}
              </option>
            ))}
          </Select>
        </div>

        {showStatus && (
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-status`}>Status</Label>
            <Select
              id={`${idPrefix}-status`}
              value={values.status}
              onChange={setField("status")}
            >
              {COMMAND_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Products</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            disabled={productsLoading || products.length === 0}
          >
            <Plus data-icon="inline-start" />
            Add product
          </Button>
        </div>

        <div className="space-y-2">
          {values.items.map((item, index) => {
            const product = products.find((p) => String(p.id) === item.product_id);
            return (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <Select
                    aria-label={`Product ${index + 1}`}
                    value={item.product_id}
                    onChange={(event) => setItem(index, "product_id", event.target.value)}
                    disabled={productsLoading || products.length === 0}
                  >
                    <option value="">
                      {productsLoading ? "Loading products..." : "Select a product"}
                    </option>
                    {products.map((p) => (
                      <option key={p.id} value={String(p.id)}>
                        {p.name} — {formatPrice(p.price)} ({p.stock} in stock)
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="w-24 space-y-1">
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    aria-label={`Quantity ${index + 1}`}
                    value={item.quantity}
                    onChange={(event) => setItem(index, "quantity", event.target.value)}
                    placeholder="Qty"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="mb-0.5 text-destructive hover:text-destructive"
                  onClick={() => removeItem(index)}
                  disabled={values.items.length === 1}
                  title="Remove product"
                >
                  <Trash2 className="size-4" />
                </Button>
                <div className="mb-2 w-24 text-right text-sm text-muted-foreground">
                  {product
                    ? formatPrice(Number(product.price) * Number(item.quantity || 0))
                    : "—"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-3">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-lg font-semibold">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
