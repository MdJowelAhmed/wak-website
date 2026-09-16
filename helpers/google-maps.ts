const SCRIPT_ID = "google-maps-js";

let mapsPromise: Promise<typeof google> | null = null;

function mapsReady(): boolean {
  return Boolean(window.google?.maps?.Map && window.google.maps.places && window.google.maps.Geocoder);
}

export function getGoogleMapsKey(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS?.trim() || "";
}

export function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }

  if (mapsReady()) {
    return Promise.resolve(window.google);
  }

  if (mapsPromise) return mapsPromise;

  const key = getGoogleMapsKey();
  if (!key) {
    return Promise.reject(new Error("Missing Google Maps key"));
  }

  mapsPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google), { once: true });
      existing.addEventListener("error", () => reject(new Error("Google Maps failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => {
      mapsPromise = null;
      reject(new Error("Google Maps failed to load"));
    };
    document.head.appendChild(script);
  });

  return mapsPromise;
}
