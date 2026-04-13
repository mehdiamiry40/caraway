/**
 * Lightweight loader for the Google Maps JavaScript API (Places library).
 *
 * - Injects the script tag once and dedupes concurrent callers.
 * - Uses the modern `importLibrary` API which is required when the
 *   bootstrap script is loaded with `loading=async` — otherwise
 *   `window.google.maps.places` is undefined right after `script.onload`.
 * - Resolves with `null` (no throw) if the API key is missing or the
 *   script fails to load, so callers can fall back to a plain input.
 * - Safe to call during SSR — short-circuits when `window` is absent.
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
    places?: GooglePlacesNamespace;
    importLibrary?(name: string): Promise<unknown>;
    event?: { clearInstanceListeners(instance: unknown): void };
  };
}

declare global {
  interface Window {
    google?: GoogleMapsGlobal;
  }
}

let bootstrapPromise: Promise<void> | null = null;
let placesPromise: Promise<GooglePlacesNamespace | null> | null = null;

function injectBootstrap(apiKey: string): Promise<void> {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-google-maps-loader]",
    );
    if (existing) {
      // If the bootstrap is already in flight, just wait for it.
      if (window.google?.maps?.importLibrary) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("script error")));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey,
    )}&libraries=places&loading=async&v=weekly`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = "true";
    script.onload = () => resolve();
    script.onerror = () => {
      bootstrapPromise = null;
      reject(new Error("Google Maps script failed to load"));
    };
    document.head.appendChild(script);
  });

  return bootstrapPromise;
}

export function loadGoogleMapsPlaces(): Promise<GooglePlacesNamespace | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  if (placesPromise) return placesPromise;

  // Already-loaded fast path.
  if (window.google?.maps?.places) {
    placesPromise = Promise.resolve(window.google.maps.places);
    return placesPromise;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return Promise.resolve(null);

  placesPromise = injectBootstrap(apiKey)
    .then(async () => {
      const maps = window.google?.maps;
      if (!maps) {
        console.error("[google-maps-loader] window.google.maps is undefined after script load");
        return null;
      }
      // Call importLibrary as a method so its `this` binding is preserved.
      // With `loading=async` this is the only way to get the Places library.
      if (typeof maps.importLibrary === "function") {
        await maps.importLibrary.call(maps, "places");
      }
      const places = window.google?.maps?.places ?? null;
      if (!places) {
        console.error("[google-maps-loader] Places namespace still missing after importLibrary");
      }
      return places;
    })
    .catch((error) => {
      console.error("[google-maps-loader] failed to load Places:", error);
      placesPromise = null;
      return null;
    });

  return placesPromise;
}
