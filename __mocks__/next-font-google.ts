/**
 * `next/font/google` is resolved by the Next.js compiler, not by Node, so it is
 * not callable under Vitest. Tests that import the root layout only need the
 * shape of the returned object (a `variable` class name), never real font data.
 */
type FontResult = {
  className: string;
  variable: string;
  style: { fontFamily: string };
};

const stub = (options?: { variable?: string }): FontResult => ({
  className: "__mock_font",
  variable: options?.variable ? `__mock_font_${options.variable.replace(/^--/, "")}` : "__mock_font_variable",
  style: { fontFamily: "mock" },
});

export const Inter = stub;
export const Source_Serif_4 = stub;
