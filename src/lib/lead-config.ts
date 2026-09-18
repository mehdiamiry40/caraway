// Server-side delivery configuration. Consumers must expose only the channel
// statuses in health responses, never these endpoint or credential values.
import * as z from "zod/mini";
import { readOptionalEnv } from "./env";
import { validateEndpoint } from "./validate-endpoint";

export type LeadKind = "quote" | "contact";

export type LeadWebhookConfiguration =
  | { status: "ready"; endpoint: string }
  | { status: "disabled"; endpoint?: never }
  | { status: "invalid"; endpoint?: never };

export type LeadEmailConfiguration =
  | { status: "ready"; apiKey: string; from: string; to: string }
  | { status: "disabled"; apiKey?: never; from?: never; to?: never }
  | { status: "invalid"; apiKey?: never; from?: never; to?: never };

export interface LeadConfiguration {
  webhook: LeadWebhookConfiguration;
  email: LeadEmailConfiguration;
}

const emailAddressSchema = z.email();

// Accept one plain address or the usual Display Name <address> form. Mailbox
// lists, control characters, and unbalanced brackets are configuration errors.
function isMailbox(value: string): boolean {
  if (/[\r\n\x00-\x1f\x7f]/.test(value)) return false;
  const trimmed = value.trim();
  if (emailAddressSchema.safeParse(trimmed).success) return true;
  const named = /^(?:"(?:[^"\\]|\\.)+"|[^<>@,;"\\]+)\s*<([^<>]+)>$/.exec(trimmed);
  return Boolean(named && emailAddressSchema.safeParse(named[1]).success);
}

export function getLeadConfiguration(kind: LeadKind): LeadConfiguration {
  const prefix = kind === "quote" ? "QUOTE" : "CONTACT";
  const endpoint = readOptionalEnv(`${prefix}_ENDPOINT`);
  const webhook: LeadWebhookConfiguration = !endpoint
    ? { status: "disabled" }
    : validateEndpoint(endpoint)
      ? { status: "ready", endpoint }
      : { status: "invalid" };

  const from = readOptionalEnv(`${prefix}_NOTIFICATION_FROM`);
  const to = readOptionalEnv(`${prefix}_NOTIFICATION_TO`);
  const apiKey = readOptionalEnv("RESEND_API_KEY");
  let email: LeadEmailConfiguration;
  if (!from && !to) {
    email = { status: "disabled" };
  } else if (
    !apiKey ||
    /[\s\x00-\x1f\x7f]/.test(apiKey) ||
    !from ||
    !to ||
    !isMailbox(process.env[`${prefix}_NOTIFICATION_FROM`] ?? "") ||
    !isMailbox(process.env[`${prefix}_NOTIFICATION_TO`] ?? "")
  ) {
    email = { status: "invalid" };
  } else {
    email = { status: "ready", apiKey, from, to };
  }

  return { webhook, email };
}
