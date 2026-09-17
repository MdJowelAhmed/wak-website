export interface ShippingAddress {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  postalCode: string;
  isDefault: boolean;
  latitude: number;
  longitude: number;
}

export interface ShippingAddressPayload {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  postalCode: string;
  isDefault: boolean;
  latitude: number;
  longitude: number;
}

function asAddressList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const row = data as { addresses?: unknown; items?: unknown; data?: unknown };
  if (Array.isArray(row.addresses)) return row.addresses;
  if (Array.isArray(row.items)) return row.items;
  if (Array.isArray(row.data)) return row.data;
  return [];
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function mapShippingAddress(item: unknown): ShippingAddress | null {
  if (!item || typeof item !== "object") return null;
  const row = item as Partial<ShippingAddress> & { id?: string };
  const id = row._id || row.id;
  if (!id) return null;

  return {
    _id: id,
    fullName: row.fullName || "",
    phone: row.phone || "",
    address: row.address || "",
    city: row.city || "",
    state: row.state || "",
    country: row.country || "",
    countryCode: row.countryCode || "",
    postalCode: row.postalCode || "",
    isDefault: Boolean(row.isDefault),
    latitude: asNumber(row.latitude),
    longitude: asNumber(row.longitude),
  };
}

export function mapShippingAddresses(data: unknown): ShippingAddress[] {
  const addresses: ShippingAddress[] = [];
  for (const item of asAddressList(data)) {
    const address = mapShippingAddress(item);
    if (address) addresses.push(address);
  }
  return sortDefaultFirst(addresses);
}

export function sortDefaultFirst(addresses: ShippingAddress[]): ShippingAddress[] {
  return [...addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
}

export function defaultShippingAddress(addresses: ShippingAddress[]): ShippingAddress | null {
  return addresses.find((address) => address.isDefault) || addresses[0] || null;
}

export function shippingAddressLabel(address: ShippingAddress): string {
  if (address.city && address.postalCode) return `${address.city} ${address.postalCode}`;
  if (address.city && address.country) return `${address.city}, ${address.country}`;
  if (address.address) return address.address;
  if (address.city) return address.city;
  return address.country || address.fullName;
}

export function toShippingPayload(
  input: ShippingAddressPayload,
): ShippingAddressPayload {
  return {
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    address: input.address.trim(),
    city: input.city.trim(),
    state: input.state.trim(),
    country: input.country.trim(),
    countryCode: input.countryCode.trim(),
    postalCode: input.postalCode.trim(),
    isDefault: Boolean(input.isDefault),
    latitude: asNumber(input.latitude),
    longitude: asNumber(input.longitude),
  };
}

export function payloadFromAddress(address: ShippingAddress): ShippingAddressPayload {
  return toShippingPayload(address);
}

export function emptyShippingPayload(isDefault = true): ShippingAddressPayload {
  return {
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    countryCode: "",
    postalCode: "",
    isDefault,
    latitude: 0,
    longitude: 0,
  };
}

export function upsertShippingAddress(
  list: ShippingAddress[],
  next: ShippingAddress,
): ShippingAddress[] {
  const others = list.filter((address) => address._id !== next._id);
  const rest = next.isDefault
    ? others.map((address) => ({ ...address, isDefault: false }))
    : others;
  return sortDefaultFirst([...rest, next]);
}

export function addressFromSaveResponse(
  data: unknown,
  fallback: ShippingAddress,
): ShippingAddress {
  const mapped = mapShippingAddress(data);
  if (mapped) return mapped;
  const nested = data && typeof data === "object" ? (data as { address?: unknown }).address : null;
  return mapShippingAddress(nested) || fallback;
}

export function isShippingFormComplete(payload: ShippingAddressPayload): boolean {
  return Boolean(
    payload.fullName.trim() &&
      payload.phone.trim() &&
      payload.address.trim() &&
      payload.city.trim() &&
      payload.state.trim() &&
      payload.country.trim() &&
      payload.postalCode.trim(),
  );
}
