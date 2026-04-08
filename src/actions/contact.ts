"use server";

import { contactFormSchema, type ContactFormValues } from "@/lib/quote-schema";
import { submitForm } from "./submit-form";

export async function submitContact(data: ContactFormValues) {
  return submitForm({
    schema: contactFormSchema,
    data,
    endpointEnvVar: "CONTACT_ENDPOINT",
    label: "Contact submission",
  });
}
