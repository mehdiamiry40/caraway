import { timingSafeEqual } from "node:crypto";
export function isAuthorizedCron(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization");
  if (!secret || !authorization?.startsWith("Bearer ")) return false;
  const expected = Buffer.from(secret);
  const supplied = Buffer.from(authorization.slice(7));
  return (
    expected.length === supplied.length && timingSafeEqual(expected, supplied)
  );
}
