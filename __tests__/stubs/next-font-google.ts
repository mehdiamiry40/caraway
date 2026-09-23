// next/font is compiled by Next at build time and can't run under Vitest.
// Tests that import the root layout (for its metadata) get a stand-in that
// returns the same shape the loader does.
type FontStub = { className: string; variable: string; style: { fontFamily: string } };

export function Inter(): FontStub {
  return { className: "font-inter", variable: "--font-inter", style: { fontFamily: "Inter" } };
}
