# Lead capture and recovery

An action succeeds only after Upstash acknowledges an enquiry record. A provider
outage can delay notification without discarding the saved enquiry. Records,
payload fingerprints and channel outcomes expire seven days after capture.
This is a recovery window, not a permanent CRM or a promise of final inbox receipt.

## Configuration and release checks

- Use the existing complete `KV_REST_API_URL`/`KV_REST_API_TOKEN` pair, or a complete
  direct `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` pair. Direct credentials
  take precedence. Use a persistent Upstash database; disable data eviction and
  restrict staff/service access. [Upstash durability](https://upstash.com/docs/redis/features/durability).
- Configure at least one valid delivery channel per form. The current deployment
  has email and no webhook; `fullyRedundant:false` truthfully describes outbound
  channel configuration. Saved recovery is additional protection, not a second
  outbound provider. Never invent a webhook or change recipients to make health green.
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
unchanged retry finds the same record. Changed details with the same unresolved
ID are rejected rather than producing a second delivery. Missing IDs are rejected.
New capture refuses IDs older than 24 hours, so expiry of the seven-day server
record cannot silently reopen an old operation.

Capture and queue indexing happen in one Lua operation. Channel claims use
version compare-and-set; only the acknowledged winner sends. A 30-second lease
and per-attempt token prevent stale workers overwriting newer state. Actual
provider requests have eight-second abort signals and a nine-second outer bound.

| State | Meaning | Next action |
|---|---|---|
| pending | Saved, no request started | Worker may claim. |
| sending | Claimed, provider outcome not yet committed | Wait for lease; treat a lost response as unknown. |
| retry | Email not confirmed, still within safe retry window | Same email request/key, up to four total attempts. |
| accepted | Provider acknowledged request | Never automatically resend. Resend ID retained where available. |
| manual | Unknown webhook outcome, exhausted/expired email retries, or changed configuration | Reconcile with the provider before any new delivery. |
| disabled | Channel was not usable when captured | No automatic delivery to a newly configured destination. |

Resend keys remain valid for 24 hours; the application stops retrying at 22 hours
from the first claim and after four attempts. [Provider contract](https://resend.com/docs/dashboard/emails/idempotency-keys).
Unknown webhook outcomes are never automatically replayed, even when an
Idempotency-Key header was sent: receiver support has not been assumed.
Configuration fingerprints include recipients, endpoint and email credential
identity. Changes pause pending work rather than sending it somewhere new.

## Monitoring and reconciliation

`GET /api/health` is a public **configuration** check. It does not contact Redis,
Resend or a webhook. `leadCaptureConfigured` and distributed-limit readiness mean
settings are present/valid, not that writes or notifications currently work.

The worker requires `Authorization: Bearer <CRON_SECRET>`. Its uncached response
reports processed, pending, attention and failure counts, and uses HTTP 503 for
storage/processing errors or records requiring attention. The on-demand monitor
also requires the secret and reports HTTP 503 when capture or configured-channel
acceptance cannot be verified. Neither proves final inbox receipt.

With the monitor unscheduled, nothing now exercises capture and delivery
end to end on its own. The five-minute worker still surfaces failures for real
enquiries, but a broken provider is only detected once a customer submits a
form. Run the monitor by hand, or restore its schedule, when that gap matters.

Configure an external uptime/log alert for failures **and missing runs**, with a
named owner. A scheduled request alone does not establish that an alert exists.
Review a rising backlog before the seven-day recovery window ends. Expired
pending-index entries are removed as the worker reads them.

For `manual` records, use the saved provider ID, channel state and submission ID
to check the actual provider/CRM. Confirm whether the original request was
accepted or delivered. Do not reset a lease, delete a deduplication record, or
requeue an uncertain webhook blindly. If a new delivery is needed after the
provider's idempotency window, obtain a human reconciliation decision and retain
it with the business record. Customer details remain available in the saved
payload until expiry. Access/deletion requests must account for provider copies
as well as the temporary website record.

## Verification

Run `npm ci`, `npm run turbo:check`, `npm run test:e2e`, and `npm run turbo:verify`.
Browser tests use isolated blank integration settings and local mock delivery.
For live Redis atomicity tests only, set `LEAD_STORE_TEST_URL` and
`LEAD_STORE_TEST_TOKEN` to a **disposable test database**, then run
`npm test -- src/lib/__tests__/lead-store.integration.test.ts`. The suite uses
synthetic fixtures, unique test prefixes and deletes its keys. It must never use
production credentials. A live email/CRM receipt check and natural cron/alert
verification are separate operational release checks.
