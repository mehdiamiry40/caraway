"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function LocationViewTracker({ suburb }: { suburb: string }) {
  useEffect(() => {
    trackEvent("location_viewed", { suburb });
  }, [suburb]);
  return null;
}
