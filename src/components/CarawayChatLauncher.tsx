import { MessageCircle } from "lucide-react";
import type { Ref } from "react";

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
  const label = busy
    ? "Opening Caraway chat"
    : errorMessage
      ? "Retry opening Caraway chat"
      : "Open Caraway chat";

  return (
    <div className="fixed right-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-[201] flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-2 sm:right-6 sm:bottom-6">
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
        aria-busy={busy || undefined}
        aria-expanded="false"
        aria-controls="caraway-chat-panel"
        aria-label={label}
        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-primary/20 bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_hsl(var(--shadow-color)/0.28)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80 motion-reduce:transform-none"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        <span>
          {busy ? "Opening chat…" : errorMessage ? "Try chat again" : "Ask Caraway"}
        </span>
      </button>
    </div>
  );
}
