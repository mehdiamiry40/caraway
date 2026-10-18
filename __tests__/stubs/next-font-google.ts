// next/font/google is a compile-time transform that only exists inside the
// Next.js build. Vitest imports the root layout for its metadata, so each font
// loader resolves to this stub instead.
type FontStub = { className: string; variable: string; style: { fontFamily: string } };

function font(name: string) {
  return (): FontStub => ({
    className: `font-${name}`,
    variable: `font-${name}-variable`,
    style: { fontFamily: name },
  });
}

export const Inter = font("inter");
export const Schibsted_Grotesk = font("schibsted-grotesk");
