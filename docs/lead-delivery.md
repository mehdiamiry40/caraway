# Lead capture and recovery

An action succeeds only after Upstash acknowledges an enquiry record. A provider
outage can delay notification without discarding the saved enquiry. Records,
payload fingerprints and channel outcomes expire seven days after capture.
This is a recovery window, not a permanent CRM or a promise of final inbox receipt.

The one exception is an outage of Upstash itself, where an enquiry is emailed
directly instead of being saved. See
[When storage is unreachable](#when-storage-is-unreachable).

## Configuration and release checks

- Use the existing complete `KV_REST_API_URL`/`KV_REST_API_TOKEN` pair, or a complete
  direct `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` pair. Direct credentials
  take precedence. Use a persistent Upstash database; disable data eviction and
  restrict staff/service access. [Upstash durability](https://upstash.com/docs/redis/features/durability).
- Configure at least one valid delivery channel per form. The current deployment
  has email and no webhook; `fullyRedundant:false` truthfully describes outbound
  channel configuration. Saved recovery is additional protection, not a second
  outbound provider. Never invent a webhook or change recipients to make health green.
- `QUOTE_NOTIFICATION_TO` and `CONTACT_NOTIFICATION_TO` take one mailbox or a
  comma-separated list of up to five plain addresses. Listing a second inbox at a
  different mail provider means one provider's spam filter, outage or full
  mailbox no longer hides an enquiry. It is still one email through one sending
  provider, so it does not make `fullyRedundant` true. Changing the list parks
  enquiries that are waiting to retry, as any destination change does.
- Set `LEAD_WORKER_HEARTBEAT_URL` in Production to the check-in address of a
  dead-man's-switch monitor (Healthchecks.io, Better Stack, Cronitor). See
  [Monitoring and reconciliation](#monitoring-and-reconciliation). Without it a
  failed delivery raises no alert. If `ALLOWED_ENDPOINT_HOSTS` is set, add the
  monitor's hostname to it.
- Keep `CRON_SECRET` configured. `/api/cron/lead-delivery` runs every five minutes;
  this schedule needs Vercel Pro (the current team plan was checked as Pro).
- The synthetic monitor is not scheduled: recipients asked to stop the daily
  labeled enquiries, so `/api/health/lead-delivery` runs only when called by
  hand with the cron secret. Keep `LEAD_MONITOR_ENABLED=1` only when recipients
  expect those messages. The monitor calls the same capture/processor path and
  verifies every configured channel reached provider acceptance. Its IDs are
  stable per day and derived with the cron secret, so public callers cannot
  predict/reserve them.
- Before release, run the clean-install quality gates, verify preview namespaces,
  confirm production storage settings, then arrange a specifically approved live
  receipt test. No real email/CRM submission is required for unit or browser tests.

## State and duplicate handling

Keys start with `caraway:leads:v1:<environment>:<branch-hash>`. Production and
preview use different prefixes; preview branches are distinct. A record key adds
`:<quote|contact>:<submission-id>`. `:pending` indexes actionable work and
`:attention` indexes records requiring an operator. These index members contain
IDs, not enquiry text. Read an individual record only through authorized Redis
access; never add public record lookup endpoints.

The submission ID contains server time and a random UUID. It is minted when a
visitor first submits and retained in tab storage until acknowledgement. An
unchanged retry finds the same record. Changed details never overwrite a saved
record, and new capture refuses IDs older than 24 hours, so expiry of the
seven-day server record cannot silently reopen an old operation. Missing IDs
are refused.

None of those refusals is a dead end for the visitor. Each carries
`restart: true`, and the form answers by dropping the ID, fetching a new one and
sending the same details once more as a new enquiry. A visitor who corrects a
typo after an unclear outcome therefore produces a second enquiry holding the
corrected details, where they used to be told to phone on every attempt. The
"please call" wording is shown only if that second attempt fails as well, or to
a browser still running a page loaded before this behaviour shipped.

Capture and queue indexing happen in one Lua operation. Channel claims use
version compare-and-set; only the acknowledged winner sends. A 30-second lease
and per-attempt token prevent stale workers overwriting newer state. Actual
provider requests have eight-second abort signals and a nine-second outer bound.

| State | Meaning | Next action |
|---|---|---|
| pending | Saved, no request started | Worker may claim. |
| sending | Claimed, provider outcome not yet committed | Wait for lease; treat a lost response as unknown. |
| retry | Email not confirmed, still within safe retry window | Same email request/key, retried until 22 hours after the first attempt. |
| accepted | Provider acknowledged request | Never automatically resend. Resend ID retained where available. |
| manual | Unknown webhook outcome, email still unconfirmed after 22 hours, or changed destination | Contact the customer, then clear it with `npm run leads:attention`. |
| resolved | An operator handled a `manual` enquiry outside the website | None. The saved copy still expires on its original date. |
| disabled | Channel was not usable when captured | No automatic delivery to a newly configured destination. |

Resend keys remain valid for 24 hours, so the application retries a failed email
with the same key until 22 hours after the first claim. Retries back off from
one minute to a 15-minute ceiling; with the five-minute worker that is roughly
four attempts an hour. There is no attempt limit: an earlier limit of four
ended retries about 15 minutes into an outage.
[Provider contract](https://resend.com/docs/dashboard/emails/idempotency-keys).
Unknown webhook outcomes are never automatically replayed, even when an
Idempotency-Key header was sent: receiver support has not been assumed.
Destination fingerprints cover the email sender and recipients, and the webhook
endpoint. Changes pause pending work rather than sending it somewhere new. The
email API key is not part of the fingerprint: rotating it keeps the destination,
so queued email continues with the new key. If an attempt made with the old key
was accepted without confirmation, the worst case is one duplicate notification
to the same recipients.

## When storage is unreachable

Rate-limit counters and saved enquiries live in the same Upstash database. An
outage there used to stop every enquiry three times over: the request proxy
answered 503, the submission ID route answered 503, and the form action
reported a failure. Visitors saw "try again or call" for as long as it lasted.

The enquiry path now keeps working, with less protection and no saved copy:

- **Limits.** `leadRateLimit` in `src/lib/rate-limit.ts` counts a sender inside
  the server instance when the shared counter fails, against a smaller
  allowance: 4 a minute per sender and 10 a minute for all senders. Several
  instances can be running, each with its own count, which is why the numbers
  are lower than the normal 10 and 100. Only the enquiry path does this. The
  chat assistant and the synthetic monitor still refuse.
- **Delivery.** The form action emails the enquiry directly and reports success
  only if Resend accepts it. The same happens when the counters work but a
  storage read or write fails twice in a row (each is tried twice).
- **No duplicate.** The direct email carries the provider key the queue would
  have used. If a write did land despite the error, the worker's later send of
  that record is recognised by Resend as the same message.

What is lost in this mode: the enquiry is not saved, so there is no retry if the
mailbox later rejects it, no webhook delivery, and nothing for
`npm run leads:attention` to list. If the email is not accepted the visitor is
told it failed. A deployment with no Upstash settings at all is a setup mistake,
not an outage, and still refuses.

Each enquiry handled this way logs one error line,
`[lead-capture] <quote|contact>/<id> storage_unavailable emailed_without_saving`
or `... email_not_confirmed <code>` (codes as in
[Failure reasons](#failure-reasons)). The worker also fails while storage is
down, so the heartbeat monitor reports the outage itself.

## The hidden spam-trap field

Each form has a "Website" field that visitors cannot see. Automated senders fill
it in. So can a browser autofill tool acting for a real customer, and the form
used to ignore that customer's click without any message.

The browser now passes the field to the server, which looks at the rest of the
submission:

- Every real field valid: the enquiry is saved and delivered with
  `[Possible spam]` at the start of the email subject, a one-line explanation
  in the body, `possibleSpam: true` on the saved record and in the webhook
  body. The trap's contents are discarded.
- Any real field invalid: refused as "Invalid form data", like any other
  invalid submission. No false success is shown.

Both cases log a `[honeypot]` warning naming the form and the outcome, with no
submitted values. Labelled enquiries pass the same rate limits as any other.

## Monitoring and reconciliation

`GET /api/health` is a public **configuration** check. It does not contact Redis,
Resend or a webhook. `leadCaptureConfigured` and distributed-limit readiness mean
settings are present/valid, not that writes or notifications currently work.

The worker requires `Authorization: Bearer <CRON_SECRET>`. Its uncached response
reports processed, pending, attention, overdue and failure counts, and uses HTTP
503 for storage/processing errors, records requiring attention, or overdue
delivery. An enquiry is overdue when it was captured more than 15 minutes ago
and no channel has delivered it yet, so a long provider outage is reported after
15 minutes instead of when the 22-hour retry window closes. The on-demand monitor
also requires the secret and reports HTTP 503 when capture or configured-channel
acceptance cannot be verified. Neither proves final inbox receipt.

Nothing reads the worker's HTTP response, so the worker also reports every run
to the monitor in `LEAD_WORKER_HEARTBEAT_URL`. A clean run posts to that address.
A run with a processing failure, a parked (`manual`) enquiry, an overdue
enquiry or unreachable storage posts to the same address with `/fail` appended.
Only the five counts are sent, never enquiry details. Create the check with a
five-minute period and a grace time of about ten minutes: the monitor then
alerts on a reported failure and on missing runs, which is what a wrong
`CRON_SECRET` or a stopped schedule looks like. The check recovers on its own
when an overdue enquiry is delivered, and stays failed while any enquiry is
parked.

To see who is waiting and clear the alert, pull the production environment and
run the attention tool on a trusted machine:

```bash
vercel env pull .env.production.local --environment=production
npm run leads:attention -- --env-file=.env.production.local --environment=production
npm run leads:attention -- --env-file=.env.production.local --environment=production resolve quote <id>
rm .env.production.local
```

The listing shows overdue enquiries that are still retrying and parked
enquiries that will not be retried, each with the customer's details and why
delivery has not happened. Contact the customer directly, then `resolve` a
parked enquiry. An overdue one needs no clearing: it leaves the list when it is
delivered. The tool never sends or re-sends anything.

With the monitor unscheduled, nothing now exercises capture and delivery
end to end on its own. The five-minute worker still surfaces failures for real
enquiries, but a broken provider is only detected once a customer submits a
form. Run the monitor by hand, or restore its schedule, when that gap matters.

Give the heartbeat monitor a named owner and an alert channel that person
actually sees. A scheduled request alone does not establish that an alert exists.
Handle parked enquiries before the seven-day recovery window ends: the saved
copy, and with it the customer's details, is deleted at that point whether or
not anyone was told. Expired pending-index entries are removed as the worker
reads them.

For `manual` records, use the saved provider ID, channel state and submission ID
to check the actual provider/CRM. Confirm whether the original request was
accepted or delivered. Do not reset a lease, delete a deduplication record, or
requeue an uncertain webhook blindly. If a new delivery is needed after the
provider's idempotency window, obtain a human reconciliation decision and retain
it with the business record. Customer details remain available in the saved
payload until expiry. Access/deletion requests must account for provider copies
as well as the temporary website record.

## Failure reasons

Each attempt that is not accepted is logged as
`[lead-delivery] <kind>/<id>/<channel> provider_not_confirmed <code> attempt=<n>`,
and the same code is saved on the record as `provider_not_confirmed:<code>`.
The code is the email provider's own error name and HTTP status (for example
`validation_error_422` or `rate_limit_exceeded_429`), a webhook HTTP status
(`http_502`), or a fixed word: `timeout`, `deadline`, `request_failed`,
`no_delivery_id`, `configuration_invalid`. Provider message text is never
logged or stored, because it can contain mailbox addresses, endpoint URLs or
enquiry details.

## Verification

Run `npm ci`, `npm run turbo:check`, `npm run test:e2e`, and `npm run turbo:verify`.
Browser tests use isolated blank integration settings and local mock delivery.
For live Redis atomicity tests only, set `LEAD_STORE_TEST_URL` and
`LEAD_STORE_TEST_TOKEN` to a **disposable test database**, then run
`npm test -- src/lib/__tests__/lead-store.integration.test.ts`. The suite uses
synthetic fixtures, unique test prefixes and deletes its keys. It must never use
production credentials. A live email/CRM receipt check and natural cron/alert
verification are separate operational release checks.
