"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState, type Ref } from "react";

interface CarawayChatLauncherProps {
  buttonRef?: Ref<HTMLButtonElement>;
  busy?: boolean;
  errorMessage?: string;
  onClick: () => void;
}

export function CarawayChatLauncher({
  buttonRef,
  busy = false,
  errorMessage,
  onClick,
}: CarawayChatLauncherProps) {
  const [nearLeadForm, setNearLeadForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setMenuOpen(document.body.dataset.mobileMenuOpen === "true");
    };
    update();
    window.addEventListener("caraway:mobile-menu-change", update);
    return () => {
      window.removeEventListener("caraway:mobile-menu-change", update);
    };
  }, []);

  useEffect(() => {
    if (
      typeof window.matchMedia !== "function" ||
      typeof IntersectionObserver !== "function"
    ) {
      return;
    }
    const media = window.matchMedia("(max-width: 639px)");
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-chat-launcher-suppress]"),
    );
    const visibleTargets = new Set<Element>();
    const update = () => setNearLeadForm(media.matches && visibleTargets.size > 0);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleTargets.add(entry.target);
        else visibleTargets.delete(entry.target);
      }
      update();
    });
    targets.forEach((target) => observer.observe(target));
    media.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  const suppressed = nearLeadForm || menuOpen;

  const label = busy
    ? "Opening Caraway chat"
    : errorMessage
      ? "Retry opening Caraway chat"
      : "Ask Caraway";
  return (
    <div
      data-testid="chat-launcher"
      aria-hidden={suppressed || undefined}
      className={`fixed right-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-[201] flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-2 transition-[opacity,transform] sm:right-6 sm:bottom-6 ${suppressed ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"}`}
    >
      {errorMessage && (
        <p
          role="alert"
          className="max-w-64 rounded-sm border border-destructive/30 bg-card px-3 py-2 text-xs text-foreground shadow-md"
        >
          {errorMessage}
        </p>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        disabled={busy}
        tabIndex={suppressed ? -1 : undefined}
        aria-busy={busy || undefined}
        aria-expanded="false"
        aria-controls="caraway-chat-panel"
        aria-label={label}
        className="inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary p-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_hsl(var(--shadow-color)/0.28)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80 motion-reduce:transform-none sm:h-auto sm:min-h-12 sm:px-4"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">
          {busy ? "Opening chat…" : errorMessage ? "Try chat again" : "Ask Caraway"}
        </span>
      </button>
    </div>
  );
}
