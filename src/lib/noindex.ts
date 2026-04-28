export function shouldNoindexSite(): boolean {
  return (
    process.env.NEXT_PUBLIC_NOINDEX === "1" ||
    process.env.VERCEL_ENV !== "production"
  );
}
