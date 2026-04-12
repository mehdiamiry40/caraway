"use client";

import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  loadGoogleMapsPlaces,
  type GoogleAutocompleteInstance,
} from "@/lib/google-maps-loader";

interface AddressAutocompleteProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  /** Fired only when the user picks a suggestion (not on plain typing). */
  onPlaceSelected?: (formattedAddress: string) => void;
}

/**
 * Address input with Google Places autocomplete.
 *
 * Behaves like the regular `<Input>` until the Maps script is ready;
 * if the API key is missing or the script fails to load, it silently
 * stays a normal text input so the form keeps working.
 *
 * Country-restricted to Australia for the cash-for-cars use case.
 */
export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  ...rest
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleAutocompleteInstance | null>(null);

  // Keep callbacks in refs so the effect can stay mount-only.
  const onChangeRef = useRef(onChange);
  const onPlaceSelectedRef = useRef(onPlaceSelected);
  useEffect(() => {
    onChangeRef.current = onChange;
    onPlaceSelectedRef.current = onPlaceSelected;
  });

  useEffect(() => {
    let cancelled = false;
    const input = inputRef.current;
    if (!input) return;

    loadGoogleMapsPlaces().then((places) => {
      if (cancelled || !places || autocompleteRef.current) return;

      const ac = new places.Autocomplete(input, {
        fields: ["formatted_address"],
        types: ["address"],
        componentRestrictions: { country: "au" },
      });

      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (place.formatted_address) {
          onChangeRef.current(place.formatted_address);
          onPlaceSelectedRef.current?.(place.formatted_address);
        }
      });

      autocompleteRef.current = ac;
    });

    return () => {
      cancelled = true;
      const ac = autocompleteRef.current;
      if (ac && typeof window !== "undefined" && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(ac);
      }
      autocompleteRef.current = null;
    };
  }, []);

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}
