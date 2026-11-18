"use client";
import { useRef } from "react";
import { submissionIssuedAt } from "@/lib/submission-id";

/** Retain an unresolved attempt across edits/reloads; never store form values. */
export function useSubmissionId(kind: "quote" | "contact") {
  const current = useRef<string | null>(null);
  const pending = useRef<Promise<string> | null>(null);
  const key = `caraway:submission:${kind}`;

  async function getId(): Promise<string> {
    if (current.current) return current.current;
    try {
      const saved = JSON.parse(sessionStorage.getItem(key) ?? "null");
      if (saved && submissionIssuedAt(saved.id) !== null) {
        current.current = saved.id;
        return saved.id;
      }
    } catch {
      /* Browser storage is optional. */
    }
    if (!pending.current) {
      pending.current = (async () => {
        // Server time keeps a visitor's incorrect device clock from
        // rejecting a legitimate enquiry or defeating expiry protection.
        const response = await fetch("/api/forms/submission-id", {
          method: "POST",
          cache: "no-store",
          signal: AbortSignal.timeout(5_000),
        });
        if (!response.ok) throw new Error("Could not start the enquiry");
        const result: unknown = await response.json();
        const id =
          result && typeof result === "object" && "id" in result
            ? result.id
            : null;
        if (submissionIssuedAt(id) === null)
          throw new Error("Invalid enquiry response");
        current.current = id as string;
        try {
          sessionStorage.setItem(key, JSON.stringify({ id }));
        } catch {
          /* Keep in memory. */
        }
        return id as string;
      })().finally(() => {
        pending.current = null;
      });
    }
    return pending.current;
  }

  function reset() {
    current.current = null;
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* Optional browser storage. */
    }
  }

  /**
   * Sends one enquiry under the retained ID. When the server answers that the
   * ID itself can never succeed (it is too old, or it already holds an enquiry
   * with other details), the ID is dropped and the same details are sent once
   * more under a new one, as a new enquiry. Otherwise a visitor who came back
   * to an old tab, or corrected a typo after an unclear outcome, would be told
   * to phone on every attempt.
   */
  async function submit<
    Result extends { success: boolean; restart?: boolean },
  >(send: (id: string) => Promise<Result>): Promise<Result> {
    const first = await send(await getId());
    if (first.success || !first.restart) return first;
    reset();
    return send(await getId());
  }

  return { getId, reset, submit };
}
