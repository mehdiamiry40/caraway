"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";

type CopyLinkButtonProps = {
  url: string;
};

async function copyToClipboard(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("Copy command failed");
  } finally {
    document.body.removeChild(textarea);
  }
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const label = status === "copied" ? "Copied!" : "Copy link";
  const announcement =
    status === "copied"
      ? "Article link copied to clipboard."
      : status === "failed"
        ? "Unable to copy article link."
        : "";

  async function handleCopy() {
    try {
      await copyToClipboard(url);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("failed");
      window.setTimeout(() => setStatus("idle"), 2400);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
        aria-label="Copy link to article"
      >
        <Link2 className="h-3.5 w-3.5" aria-hidden />
        <span>{label}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </>
  );
}
