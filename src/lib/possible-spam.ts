/**
 * Wording added to a notification when the form's hidden spam-trap field
 * arrived filled in. The enquiry is still delivered: automated senders fill
 * that field, but so can a browser autofill tool acting for a real visitor.
 */
export const POSSIBLE_SPAM_SUBJECT_PREFIX = "[Possible spam] ";
export const POSSIBLE_SPAM_NOTE =
  "Possible spam: a hidden field on the form that visitors cannot see was filled in. " +
  "Automated senders do this, but a browser autofill tool can do it for a real customer too, " +
  "so check the details before discarding it.";
