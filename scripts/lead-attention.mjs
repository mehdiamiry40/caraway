#!/usr/bin/env node
/**
 * Lists saved enquiries that have not reached the team, and clears a parked
 * one after it has been dealt with.
 *
 * The delivery worker raises an alert while an enquiry is parked for a person
 * ("attention") or has waited more than 15 minutes and is still retrying
 * ("overdue"). This is how the operator finds out who the customer is, and how
 * the worker is told a parked enquiry is handled. Nothing is ever re-sent from
 * here: contact the customer directly using the details printed.
 *
 *   npm run leads:attention -- --env-file=.env.production.local --environment=production
 *   npm run leads:attention -- --env-file=.env.production.local --environment=production resolve quote <id>
 *
 * The env file needs the same Upstash credentials the deployment uses
 * (`vercel env pull .env.production.local --environment=production`). It
 * prints customer details, so run it only on a trusted machine and delete the
 * pulled env file afterwards.
 */
import { registerHooks } from "node:module";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ENVIRONMENTS = ["production", "preview", "development"];
const LIST_LIMIT = 100;

export function parseArgs(argv) {
  const args = {
    environment: undefined, branch: undefined, envFile: undefined,
    command: "list", kind: undefined, id: undefined,
  };
  const positional = [];
  for (const arg of argv) {
    if (arg.startsWith("--environment=")) args.environment = arg.slice("--environment=".length);
    else if (arg.startsWith("--branch=")) args.branch = arg.slice("--branch=".length);
    else if (arg.startsWith("--env-file=")) args.envFile = arg.slice("--env-file=".length);
    else if (arg.startsWith("--")) throw new Error(`Unknown option ${arg}`);
    else positional.push(arg);
  }
  if (!ENVIRONMENTS.includes(args.environment))
    throw new Error(`--environment must be one of ${ENVIRONMENTS.join(", ")}`);
  if (args.environment === "preview" && !args.branch)
    throw new Error("--branch is required with --environment=preview");
  if (positional.length === 0 || (positional.length === 1 && positional[0] === "list")) return args;
  const [command, kind, id, ...rest] = positional;
  if (command !== "resolve" || (kind !== "quote" && kind !== "contact") || !id || rest.length)
    throw new Error("Usage: resolve <quote|contact> <id>");
  return { ...args, command, kind, id };
}

/** Enquiry text comes from the public. Never let it drive the terminal. */
function printable(value) {
  return String(value).replace(/[\u0000-\u001f\u007f-\u009f]+/g, " ").trim();
}

function when(timestamp) {
  return new Date(timestamp).toLocaleString("en-AU", {
    timeZone: "Australia/Brisbane",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function describeRecord(record) {
  const lines = [
    `${record.kind} ${record.id}`,
    `  Captured ${when(record.createdAt)}; website copy expires ${when(record.expiresAt)} (Brisbane time)`,
  ];
  for (const [channel, state] of Object.entries(record.channels)) {
    if (state.state === "disabled") continue;
    const reason = state.reason ? `, ${printable(state.reason)}` : "";
    lines.push(`  ${channel}: ${state.state}${reason}, ${state.attempts} attempt(s)`);
  }
  for (const [field, value] of Object.entries(record.payload)) {
    if (field === "honeypot" || value === undefined || value === "") continue;
    lines.push(`  ${field}: ${printable(value)}`);
  }
  return lines.join("\n");
}

async function loadStore(args) {
  if (args.envFile) process.loadEnvFile(args.envFile);
  // The store derives its key prefix from these, exactly as the deployment does.
  process.env.VERCEL_ENV = args.environment;
  if (args.branch) process.env.VERCEL_GIT_COMMIT_REF = args.branch;
  // The application imports its own modules without file extensions.
  registerHooks({
    resolve(specifier, context, nextResolve) {
      const extensionless = /^\.{1,2}\//.test(specifier) && !/\.[cm]?[jt]sx?$/.test(specifier);
      return nextResolve(extensionless ? `${specifier}.ts` : specifier, context);
    },
  });
  const storage = await import(new URL("../src/lib/lead-store.ts", import.meta.url).href);
  if (!storage.isLeadStorageConfigured())
    throw new Error(
      "No Upstash credentials found. Pass them with --env-file=<file> (see the header of this script).",
    );
  return { storage, store: storage.getLeadStore() };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { storage, store } = await loadStore(args);
  if (args.command === "resolve") {
    const resolved = await storage.resolveDelivery(store, args.kind, args.id);
    if (!resolved) {
      console.error("Nothing to clear: no saved enquiry with that ID is waiting for attention.");
      process.exitCode = 1;
      return;
    }
    console.log(`Cleared ${args.kind} ${args.id}. The worker stops reporting it on its next run.`);
    return;
  }
  const parked = await store.attention(LIST_LIMIT);
  const overdue = await storage.overdueDeliveries(store);
  if (!parked.length && !overdue.length) {
    console.log(`No enquiries are parked or overdue (${args.environment}).`);
    return;
  }
  if (overdue.length) {
    console.log(
      `${count(overdue)} still retrying after more than 15 minutes (${args.environment}).\n` +
        "Delivery will be retried automatically; contact the customer now if it cannot wait.\n",
    );
    for (const record of overdue) console.log(`${describeRecord(record)}\n`);
  }
  if (parked.length) {
    console.log(`${count(parked)} parked and will not be retried (${args.environment}).\n`);
    for (const record of parked) console.log(`${describeRecord(record)}\n`);
    console.log(
      "Contact each parked customer directly, then clear the enquiry with:\n" +
        `  npm run leads:attention -- --env-file=<file> --environment=${args.environment}` +
        `${args.branch ? ` --branch=${args.branch}` : ""} resolve <quote|contact> <id>`,
    );
  }
}

function count(records) {
  return `${records.length} enquir${records.length === 1 ? "y is" : "ies are"}`;
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
