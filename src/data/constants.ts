/** Shared UI/runtime constants — kept in one place for reuse & test hooks. */

/** Contact form message maximum character count. */
export const CONTACT_MESSAGE_MAX = 5000;

/** Threshold at which the contact form shows an "approaching limit" warning colour. */
export const CONTACT_MESSAGE_WARN = 4500;

/** Hard timeout for outbound form POST fetches. Matches submit-form.ts server action. */
export const FORM_FETCH_TIMEOUT_MS = 8000;

/** Artificial delay used by the server action mock path in local dev. */
export const FORM_MOCK_DELAY_MS = 1500;
