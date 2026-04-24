"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PLACES_NONCE_COOKIE, PLACES_NONCE_HEADER } from "@/lib/places-session";

interface Suggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
}

interface AddressAutocompleteProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  /** Fired only when the user picks a suggestion (not on plain typing). */
  onPlaceSelected?: (formattedAddress: string) => void;
}

const DEBOUNCE_MS = 200;
const MIN_QUERY_LENGTH = 3;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
}

/**
 * Address input with Google Places autocomplete.
 *
 * Calls our own /api/places/autocomplete proxy (which forwards to
 * the Places API New) so the API key never enters the client bundle.
 *
 * If the proxy returns 503 (e.g. key missing or upstream blocked),
 * the input silently falls back to plain text and the form keeps
 * working — no console noise for the end user.
 *
 * Country-restricted to Australia by the proxy.
 */
export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  onBlur,
  className,
  ...rest
}: AddressAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [manualEntryActive, setManualEntryActive] = useState(false);
  // Tracks the value the user just picked, so the debounce effect
  // skips the refetch that `onChange` would otherwise trigger. The
  // next keystroke clears it.
  const [justPickedValue, setJustPickedValue] = useState<string | null>(null);
  // Latest request id, so out-of-order responses can't overwrite newer ones.
  const requestIdRef = useRef(0);

  // Debounced fetch
  useEffect(() => {
    const trimmed = value.trim();
    if (justPickedValue === trimmed || trimmed.length < MIN_QUERY_LENGTH) {
      return;
    }

    const id = ++requestIdRef.current;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setShowNoResults(false);
      setOpen(true);
      try {
        const res = await fetch(
          `/api/places/autocomplete?q=${encodeURIComponent(trimmed)}`,
          {
            signal: controller.signal,
            headers: {
              [PLACES_NONCE_HEADER]: readCookie(PLACES_NONCE_COOKIE) ?? "",
            },
          },
        );
        if (!res.ok) {
          // If the proxy is unavailable or the browser cannot present a valid
          // first-party session, keep this as a plain input so real leads can
          // still submit a manually typed pickup address.
          if (id === requestIdRef.current) {
            setSuggestions([]);
            setOpen(false);
            setIsLoading(false);
            setShowNoResults(false);
            setManualEntryActive(true);
          }
          return;
        }
        const data = (await res.json()) as { suggestions?: Suggestion[] };
        if (id !== requestIdRef.current) return;
        const next = data.suggestions ?? [];
        setSuggestions(next);
        setShowNoResults(next.length === 0);
        setOpen(true);
        setActiveIndex(-1);
        setIsLoading(false);
        setManualEntryActive(false);
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        if (id === requestIdRef.current) {
          setSuggestions([]);
          setOpen(false);
          setIsLoading(false);
          setShowNoResults(false);
          setManualEntryActive(true);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [value, justPickedValue]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node | null;
      if (containerRef.current && target && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const pick = useCallback(
    (s: Suggestion) => {
      setJustPickedValue(s.fullText);
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      setIsLoading(false);
      setShowNoResults(false);
      onChange(s.fullText);
      onPlaceSelected?.(s.fullText);
      // Return focus to the input so the user can keep tabbing forward.
      inputRef.current?.focus();
    },
    [onChange, onPlaceSelected],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "ArrowDown" && suggestions.length > 0) {
        setOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        break;
      case "Enter":
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          e.preventDefault();
          pick(suggestions[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        break;
      case "Tab":
        // Let Tab work normally, but close the popup.
        setOpen(false);
        break;
    }
  };

  const activeOptionId =
    open && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined;

  return (
    <div ref={containerRef} className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          // Typing invalidates any "just picked" guard.
          setJustPickedValue(null);
          if (next.trim().length < MIN_QUERY_LENGTH) {
            setSuggestions([]);
            setOpen(false);
            setIsLoading(false);
            setShowNoResults(false);
          }
          onChange(next);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
        }}
        onBlur={onBlur}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={activeOptionId}
        autoComplete="off"
        className={className}
        {...rest}
      />
      {manualEntryActive && (
        <p className="sr-only" role="status" aria-live="polite">
          Address suggestions are unavailable. Continue typing the pickup address manually.
        </p>
      )}
      {open && (suggestions.length > 0 || isLoading || showNoResults) && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Address suggestions"
          className={cn(
            "absolute z-50 left-0 right-0 mt-1 max-h-[50vh] overflow-y-auto overflow-x-hidden",
            "rounded-xl border border-border/60 bg-card shadow-[0_24px_48px_-32px_hsl(var(--shadow-color)/0.4)]",
            "py-1",
          )}
        >
          {isLoading && suggestions.length === 0 && (
            <li
              role="presentation"
              className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground"
            >
              <span
                aria-hidden="true"
                className="inline-block h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin motion-reduce:animate-none"
              />
              Searching…
            </li>
          )}
          {!isLoading && showNoResults && (
            <li
              role="presentation"
              className="px-4 py-3 text-sm text-muted-foreground"
            >
              No addresses found. Try a different suburb or type the full address.
            </li>
          )}
          {suggestions.map((s, i) => {
            const isActive = i === activeIndex;
            return (
              <li
                key={s.placeId}
                id={`${listboxId}-opt-${i}`}
                role="option"
                aria-selected={isActive}
                // Use mousedown so the click fires before the input's blur.
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(s);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "cursor-pointer px-4 py-3 text-sm leading-tight transition-colors duration-150 motion-reduce:transition-none",
                  isActive ? "bg-muted" : "bg-transparent",
                )}
              >
                <div className="font-medium text-foreground">{s.mainText}</div>
                {s.secondaryText && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {s.secondaryText}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
