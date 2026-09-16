import { countryByCode, normalizeShoppingCountryCode } from "./regions";

export const STORAGE_DELIVERY_LOCATION = "user_delivery_location";
export const STORAGE_LOCATION_LABEL = "user_location";

export interface DeliveryLocation {
  label: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  city?: string;
  country?: string;
  postalCode?: string;
}

export const COUNTRY_MAP_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  US: { lat: 39.8283, lng: -98.5795, zoom: 4 },
  MW: { lat: -13.2543, lng: 34.3015, zoom: 6 },
  CA: { lat: 56.1304, lng: -106.3468, zoom: 4 },
  ZA: { lat: -30.5595, lng: 22.9375, zoom: 5 },
};

const SHORT_NAMES: Record<string, string> = {
  US: "USA",
  MW: "Malawi",
  CA: "Canada",
  ZA: "South Africa",
};

export function shoppingCountryShortName(countryCode: string | undefined): string {
  const code = normalizeShoppingCountryCode(countryCode);
  return SHORT_NAMES[code] ?? countryByCode(code).name;
}

export function mapCenterForCountry(countryCode: string | undefined) {
  const code = normalizeShoppingCountryCode(countryCode);
  return COUNTRY_MAP_CENTERS[code] ?? COUNTRY_MAP_CENTERS.MW;
}

export function hasCoordinates(
  location: DeliveryLocation | null | undefined,
): location is DeliveryLocation {
  return Boolean(
    location &&
      Number.isFinite(location.lat) &&
      Number.isFinite(location.lng) &&
      !(location.lat === 0 && location.lng === 0),
  );
}

export function readDeliveryLocation(): DeliveryLocation | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_DELIVERY_LOCATION);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as DeliveryLocation;
      if (parsed && typeof parsed.label === "string" && parsed.label.trim()) {
        return parsed;
      }
    } catch {
      // Fall through to the legacy string key.
    }
  }

  const legacy = localStorage.getItem(STORAGE_LOCATION_LABEL);
  if (legacy?.trim()) {
    return {
      label: legacy.trim(),
      formattedAddress: legacy.trim(),
      lat: 0,
      lng: 0,
    };
  }

  return null;
}

export function writeDeliveryLocation(location: DeliveryLocation): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_DELIVERY_LOCATION, JSON.stringify(location));
  localStorage.setItem(STORAGE_LOCATION_LABEL, location.label);
}

export function labelFromAddressComponents(
  components: Array<{ long_name: string; short_name: string; types: string[] }> | undefined,
  formattedAddress: string,
): string {
  const get = (type: string) =>
    components?.find((item) => item.types.includes(type))?.long_name;

  const city =
    get("locality") ||
    get("sublocality") ||
    get("postal_town") ||
    get("administrative_area_level_2") ||
    get("administrative_area_level_1");
  const country = get("country");
  const postalCode = get("postal_code");

  if (city && postalCode) return `${city} ${postalCode}`;
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  const firstLine = formattedAddress.split(",")[0]?.trim();
  return firstLine || formattedAddress;
}
