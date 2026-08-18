/**
 * Dependency-free quote validation primitives shared by the browser form and
 * the authoritative server schema. Keep browser-facing limits and messages
 * here so the lightweight resolver cannot drift from server validation.
 */

export const auPhoneRegex = /^(?:\+?61|0)[2-478]\d{8}$|^1[38]00\d{6}$/;

export const quoteConditionValues = [
  "running",
  "needs_work",
  "not_running",
  "damaged",
  "scrap",
] as const;

export const QUOTE_VALIDATION_LIMITS = {
  name: { min: 2, max: 200 },
  make: { min: 2, max: 200 },
  model: { min: 1, max: 200 },
  year: { min: 1950, max: new Date().getFullYear() },
  address: { min: 5, max: 500 },
  details: { max: 2000 },
} as const;

export const QUOTE_VALIDATION_MESSAGES = {
  invalidInput: "Invalid input",
  nameRequired: "Name is required",
  nameTooLong: "Name is too long",
  phoneInvalid: "Enter a valid Australian phone number",
  makeRequired: "Car make is required",
  makeTooLong: "Car make is too long",
  modelRequired: "Car model is required",
  modelTooLong: "Car model is too long",
  yearInvalid: "Invalid year",
  conditionRequired: "Please select a condition",
  addressRequired: "Please enter a full pickup address",
  addressTooLong: "Address is too long",
  detailsTooLong: "Vehicle and access details are too long",
  honeypotInvalid: "Invalid form submission",
} as const;

export function stripPhone(value: string): string {
  return value.replace(/[\s\-()]/g, "");
}

export function sanitizeLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ");
}
