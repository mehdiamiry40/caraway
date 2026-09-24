// Native fallback never delivers, reads, logs, or reflects the submitted body.
export function POST() {
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/form-unavailable",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
