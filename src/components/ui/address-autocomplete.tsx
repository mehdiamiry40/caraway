"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  // Tracks the value the user just picked, so we don't immediately
  // re-fetch suggestions for the address we just inserted.
  const justPickedRef = useRef<string | null>(null);
  // Latest request id, so out-of-order responses can't overwrite newer ones.
  const requestIdRef = useRef(0);

  // Debounced fetch
  useEffect(() => {
    const trimmed = value.trim();
    if (justPickedRef.current === trimmed) {
      // Suppress the round-trip caused by our own setValue after a pick.
      // Clear the ref so this only suppresses the immediate refetch — if
      // the user later types (or re-enters) the same string, we still fetch.
      justPickedRef.current = null;
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const id = ++requestIdRef.current;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/places/autocomplete?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );
        if (!res.ok) {
          // 503 = proxy unavailable; stay silent and act as a plain input.
          if (id === requestIdRef.current) {
            setSuggestions([]);
            setOpen(false);
          }
          return;
        }
        const data = (await res.json()) as { suggestions?: Suggestion[] };
        if (id !== requestIdRef.current) return;
        const next = data.suggestions ?? [];
        setSuggestions(next);
        setOpen(next.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        if (id === requestIdRef.current) {
          setSuggestions([]);
          setOpen(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [value]);

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
      justPickedRef.current = s.fullText;
      onChange(s.fullText);
      onPlaceSelected?.(s.fullText);
      setOpen(false);
      setActiveIndex(-1);
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
          // User typing invalidates any previous "just picked" guard.
          justPickedRef.current = null;
          onChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
        }}
        onBlur={onBlur}
        role="combobox"
        aria-label="Address"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={activeOptionId}
        autoComplete="off"
        className={className}
        {...rest}
      />
      {open && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className={cn(
            "absolute z-50 left-0 right-0 mt-1 max-h-72 overflow-y-auto",
            "rounded-lg border border-border bg-card shadow-lg",
            "py-1",
          )}
        >
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
                  "cursor-pointer px-3 py-2 text-sm leading-tight",
                  isActive ? "bg-muted" : "bg-transparent",
                )}
              >
                <div className="font-medium text-foreground">{s.mainText}</div>
                {s.secondaryText && (
                  <div className="text-xs text-muted-foreground">
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
