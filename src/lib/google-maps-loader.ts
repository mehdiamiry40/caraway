/**
 * Lightweight loader for the Google Maps JavaScript API (Places library).
 *
 * - Injects the script tag once and dedupes concurrent callers.
 * - Resolves with `null` (no throw) if the API key is missing or the
 *   script fails to load, so callers can fall back to a plain input.
 * - Safe to call during SSR — it short-circuits when `window` is absent.
 *
 * Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to be set at build time.
 * Restrict the key in Google Cloud Console to your production hostnames.
 */

export interface GoogleAutocompleteInstance {
  addListener(event: string, handler: () => void): void;
  getPlace(): { formatted_address?: string };
}

export interface GooglePlacesNamespace {
  Autocomplete: new (
    input: HTMLInputElement,
    opts?: {
      fields?: string[];
      types?: string[];
      componentRestrictions?: { country: string | string[] };
    },
  ) => GoogleAutocompleteInstance;
}

interface GoogleMapsGlobal {
  maps: {
    places: GooglePlacesNamespace;
    event: { clearInstanceListeners(instance: unknown): void };
  };
}

declare global {
  interface Window {
    google?: GoogleMapsGlobal;
  }
}

let loaderPromise: Promise<GooglePlacesNamespace | null> | null = null;

export function loadGoogleMapsPlaces(): Promise<GooglePlacesNamespace | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  if (window.google?.maps?.places) {
    return Promise.resolve(window.google.maps.places);
  }

  if (loaderPromise) return loaderPromise;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return Promise.resolve(null);

  loaderPromise = new Promise<GooglePlacesNamespace | null>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-google-maps-loader]",
    );
    if (existing) {
      existing.addEventListener("load", () =>
        resolve(window.google?.maps?.places ?? null),
      );
      existing.addEventListener("error", () => {
        loaderPromise = null;
        resolve(null);
      });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey,
    )}&libraries=places&loading=async&v=weekly`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = "true";
    script.onload = () => resolve(window.google?.maps?.places ?? null);
    script.onerror = () => {
      loaderPromise = null;
      resolve(null);
    };
    document.head.appendChild(script);
  });

  return loaderPromise;
}
