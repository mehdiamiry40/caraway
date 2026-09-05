"use client";
import {
  useSyncExternalStore,
  type FormEventHandler,
  type ReactNode,
} from "react";
import { BUSINESS } from "@/lib/site";

const subscribe = () => () => {};
const ready = () => true;
const serverReady = () => false;

export function LeadForm({
  children,
  onSubmit,
  className,
}: {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  className?: string;
}) {
  const hydrated = useSyncExternalStore(subscribe, ready, serverReady);
  return (
    <form
      method="post"
      action="/api/forms/unavailable"
      onSubmit={onSubmit}
      noValidate
    >
      {!hydrated && (
        <p role="status" className="mb-5 text-sm text-foreground">
          The online form is not ready yet. If it stays unavailable,{" "}
          <a className="underline" href={BUSINESS.phoneTel}>
            call {BUSINESS.phoneDisplay}
          </a>{" "}
          or{" "}
          <a className="underline" href={BUSINESS.emailHref}>
            email us
          </a>
          .
        </p>
      )}
      <fieldset disabled={!hydrated} className={className}>
        {children}
      </fieldset>
    </form>
  );
}
