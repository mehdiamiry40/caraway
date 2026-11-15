/**
 * Why a delivery attempt failed, reduced to a short code that is safe to log
 * and to store on the saved enquiry.
 *
 * Provider and network error text can contain mailbox addresses, endpoint URLs
 * or submitted enquiry details, so it never reaches a log line. A code is a
 * provider's own error name, an HTTP status, or one of a few fixed words.
 */
const SAFE_CODE = /^[a-z0-9_]{1,64}$/;

function safeCode(code: string): string {
  return SAFE_CODE.test(code) ? code : "unrecognised";
}

export class DeliveryFailure extends Error {
  readonly code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = "DeliveryFailure";
    this.code = safeCode(code);
  }
}

/** A provider's error name and HTTP status, for example `validation_error_422`. */
export function providerFailureCode(error: {
  name?: unknown;
  statusCode?: unknown;
}): string {
  const name =
    typeof error.name === "string" && SAFE_CODE.test(error.name)
      ? error.name
      : "provider_error";
  const status =
    typeof error.statusCode === "number" &&
    Number.isInteger(error.statusCode) &&
    error.statusCode >= 100 &&
    error.statusCode <= 599
      ? `_${error.statusCode}`
      : "";
  return safeCode(`${name}${status}`);
}

/** The code for anything thrown during a delivery attempt. */
export function failureCode(error: unknown): string {
  if (!(error instanceof Error)) return "request_failed";
  // Checked by shape, not `instanceof`: a module can be loaded more than once.
  if (
    error.name === "DeliveryFailure" &&
    "code" in error &&
    typeof error.code === "string"
  )
    return safeCode(error.code);
  if (error.name === "TimeoutError") return "timeout";
  if (error.name === "AbortError") return "aborted";
  return "request_failed";
}
