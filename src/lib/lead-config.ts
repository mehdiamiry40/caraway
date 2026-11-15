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
  | { status: "ready"; apiKey: string; from: string; to: string | string[] }
  | { status: "disabled"; apiKey?: never; from?: never; to?: never }
  | { status: "invalid"; apiKey?: never; from?: never; to?: never };

export interface LeadConfiguration {
  webhook: LeadWebhookConfiguration;
  email: LeadEmailConfiguration;
}

const emailAddressSchema = z.email();

// Accept one plain address or the usual Display Name <address> form. Control
// characters and unbalanced brackets are configuration errors. A sender is
// always one mailbox; recipient lists are handled by parseRecipients.
function isMailbox(value: string): boolean {
  if (/[\r\n\x00-\x1f\x7f]/.test(value)) return false;
  const trimmed = value.trim();
  if (emailAddressSchema.safeParse(trimmed).success) return true;
  const named = /^(?:"(?:[^"\\]|\\.)+"|[^<>@,;"\\]+)\s*<([^<>]+)>$/.exec(trimmed);
  return Boolean(named && emailAddressSchema.safeParse(named[1]).success);
}

export const MAX_NOTIFICATION_RECIPIENTS = 5;

/**
 * One mailbox, or a comma-separated list of plain addresses so a notification
 * can reach inboxes at more than one mail provider. A single mailbox stays a
 * string so the provider request is unchanged for existing deployments.
 */
function parseRecipients(value: string): string | string[] | null {
  if (isMailbox(value)) return value.trim();
  if (/[\r\n\x00-\x1f\x7f]/.test(value)) return null;
  const addresses = value.split(",").map((address) => address.trim());
  const distinct = new Set(addresses.map((address) => address.toLowerCase()));
  return addresses.length >= 2 &&
    addresses.length <= MAX_NOTIFICATION_RECIPIENTS &&
    distinct.size === addresses.length &&
    addresses.every((address) => emailAddressSchema.safeParse(address).success)
    ? addresses
    : null;
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
  const configuredTo = readOptionalEnv(`${prefix}_NOTIFICATION_TO`);
  const to = parseRecipients(process.env[`${prefix}_NOTIFICATION_TO`] ?? "");
  const apiKey = readOptionalEnv("RESEND_API_KEY");
  let email: LeadEmailConfiguration;
  if (!from && !configuredTo) {
    email = { status: "disabled" };
  } else if (
    !apiKey ||
    /[\s\x00-\x1f\x7f]/.test(apiKey) ||
    !from ||
    !to ||
    !isMailbox(process.env[`${prefix}_NOTIFICATION_FROM`] ?? "")
  ) {
    email = { status: "invalid" };
  } else {
    email = { status: "ready", apiKey, from, to };
  }

  return { webhook, email };
}
