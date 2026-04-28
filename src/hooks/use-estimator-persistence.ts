"use client";

import { useEffect, useRef } from "react";
import {
  parsePersistedState,
  type PersistedState,
} from "@/lib/persisted-estimator-state";

const STORAGE_KEY = "caraway-estimator-state";
const PERSIST_DEBOUNCE_MS = 400;

interface PersistenceArgs {
  payload: PersistedState;
  isSuccess: boolean;
  onHydrated: (parsed: PersistedState) => void;
}

// Owns the sessionStorage lifecycle for the price estimator: hydrate on
// mount, debounced persist on change, clear on success. PII is never
// persisted — the caller must only pass non-PII fields in `payload`.
export function useEstimatorPersistence({
  payload,
  isSuccess,
  onHydrated,
}: PersistenceArgs) {
  const hydratedRef = useRef(false);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Pin the hydrate callback so the hydrate effect runs exactly once per
  // mount, regardless of caller stability.
  const onHydratedRef = useRef(onHydrated);
  useEffect(() => {
    onHydratedRef.current = onHydrated;
  }, [onHydrated]);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = parsePersistedState(raw);
      if (!parsed) {
        window.sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      onHydratedRef.current(parsed);
    } catch {
      // sessionStorage may be unavailable (private mode / quota / SecurityError);
      // cache hydration is best-effort, so let the user start fresh silently.
    }
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === "undefined") return;
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // sessionStorage may throw on quota/private-mode; persistence is
        // cosmetic, so drop silently rather than spamming the console.
      }
    }, PERSIST_DEBOUNCE_MS);
    return () => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    };
  }, [payload]);

  useEffect(() => {
    if (!isSuccess) return;
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [isSuccess]);
}
