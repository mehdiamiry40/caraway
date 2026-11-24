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
  const label = status === "copied" ? "Copied" : "Copy link";
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
        className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-md border border-input bg-card px-4 text-[0.9375rem] font-semibold text-primary transition-colors hover:border-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Copy link to article"
      >
        <Link2 className="h-4 w-4" aria-hidden />
        <span>{label}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </>
  );
}
