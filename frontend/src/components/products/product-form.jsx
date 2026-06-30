import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const PRODUCT_STATUSES = [
  { value: "in stock", label: "In stock" },
  { value: "out of stock", label: "Out of stock" },
];

export function ProductFormFields({
  idPrefix,
  values,
  onChange,
  categories,
  categoriesLoading,
}) {
  const set = (field) => (event) =>
    onChange({ ...values, [field]: event.target.value });

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-name`}>Name</Label>
        <Input
          id={`${idPrefix}-name`}
          value={values.name}
          onChange={set("name")}
          maxLength={255}
          placeholder="Product name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-description`}>Description</Label>
        <Textarea
          id={`${idPrefix}-description`}
          value={values.description}
          onChange={set("description")}
          className="min-h-24"
          placeholder="Product description"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-price`}>Price (€)</Label>
          <Input
            id={`${idPrefix}-price`}
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={set("price")}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-stock`}>Stock</Label>
          <Input
            id={`${idPrefix}-stock`}
            type="number"
            min="0"
            step="1"
            value={values.stock}
            onChange={set("stock")}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-image`}>Image URL (optional)</Label>
        <Input
          id={`${idPrefix}-image`}
          value={values.image}
          onChange={set("image")}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-category`}>Category</Label>
          <Select
            id={`${idPrefix}-category`}
            value={values.category_id}
            onChange={set("category_id")}
            disabled={categoriesLoading || categories.length === 0}
          >
            <option value="">
              {categoriesLoading
                ? "Loading categories..."
                : categories.length === 0
                  ? "No categories available"
                  : "Select a category"}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-status`}>Status</Label>
          <Select id={`${idPrefix}-status`} value={values.status} onChange={set("status")}>
            {PRODUCT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

export function emptyProductForm() {
  return {
    name: "",
    description: "",
    price: "",
    image: "",
    stock: "",
    status: "in stock",
    category_id: "",
  };
}

export function productToForm(product) {
  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price != null ? String(product.price) : "",
    image: product?.image ?? "",
    stock: product?.stock != null ? String(product.stock) : "",
    status: product?.status ?? "in stock",
    category_id: product?.category_id != null ? String(product.category_id) : "",
  };
}

export function formToPayload(values) {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    price: Number(values.price),
    image: values.image.trim() || null,
    stock: Number(values.stock),
    status: values.status,
    category_id: Number(values.category_id),
  };
}

export function validateProductForm(values) {
  if (!values.name.trim() || !values.description.trim()) {
    return "Name and description are required.";
  }
  if (!values.category_id) {
    return "Please select a category.";
  }
  if (values.price === "" || Number(values.price) < 0) {
    return "Price must be a valid number.";
  }
  if (values.stock === "" || Number(values.stock) < 0 || !Number.isInteger(Number(values.stock))) {
    return "Stock must be a valid whole number.";
  }
  return "";
}

export function formatPrice(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(number);
}
