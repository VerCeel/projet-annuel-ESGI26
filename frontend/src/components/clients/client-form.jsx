import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ClientFormFields({ idPrefix, values, onChange }) {
  const set = (field) => (event) =>
    onChange({ ...values, [field]: event.target.value });

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-first-name`}>First name</Label>
          <Input
            id={`${idPrefix}-first-name`}
            value={values.first_name}
            onChange={set("first_name")}
            maxLength={255}
            placeholder="Jean"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-last-name`}>Last name</Label>
          <Input
            id={`${idPrefix}-last-name`}
            value={values.last_name}
            onChange={set("last_name")}
            maxLength={255}
            placeholder="Dupont"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-email`}>Email</Label>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          value={values.email}
          onChange={set("email")}
          maxLength={255}
          placeholder="jean.dupont@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-phone`}>Phone</Label>
        <Input
          id={`${idPrefix}-phone`}
          value={values.phone}
          onChange={set("phone")}
          maxLength={255}
          placeholder="+33 6 12 34 56 78"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-address`}>Address</Label>
        <Input
          id={`${idPrefix}-address`}
          value={values.address}
          onChange={set("address")}
          maxLength={255}
          placeholder="12 rue de Paris"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-zip`}>Zip code</Label>
        <Input
          id={`${idPrefix}-zip`}
          value={values.zip}
          onChange={set("zip")}
          maxLength={255}
          placeholder="75001"
        />
      </div>
    </div>
  );
}

export function emptyClientForm() {
  return {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    zip: "",
  };
}

export function clientToForm(client) {
  return {
    first_name: client?.first_name ?? "",
    last_name: client?.last_name ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    address: client?.address ?? "",
    zip: client?.zip ?? "",
  };
}

export function formToPayload(values) {
  return {
    first_name: values.first_name.trim(),
    last_name: values.last_name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    address: values.address.trim(),
    zip: values.zip.trim(),
  };
}

export function validateClientForm(values) {
  if (!values.first_name.trim() || !values.last_name.trim()) {
    return "First name and last name are required.";
  }
  if (!values.email.trim()) {
    return "Email is required.";
  }
  if (!values.phone.trim()) {
    return "Phone is required.";
  }
  if (!values.address.trim()) {
    return "Address is required.";
  }
  if (!values.zip.trim()) {
    return "Zip code is required.";
  }
  return "";
}

export function formatClientName(client) {
  if (!client) return "—";
  return `${client.first_name} ${client.last_name}`;
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
