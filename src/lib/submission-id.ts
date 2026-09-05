// A timestamp limits recreation after the server's deduplication record expires.
// Generate on first submit, never while statically rendering the page.
export function createSubmissionId(): string {
  return `${Date.now()}-${crypto.randomUUID()}`;
}

export function submissionIssuedAt(id: unknown): number | null {
  if (typeof id !== "string") return null;
  const match =
    /^(\d{13})-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.exec(
      id,
    );
  return match ? Number(match[1]) : null;
}
