/**
 * Vitest stand-in for `next/font/google`. The real loader is a Next compiler
 * transform and throws when called outside a Next build, so unit tests that
 * import the root layout (for its metadata) resolve fonts through this stub.
 */
type FontOptions = { variable?: string };

function stubFont(options: FontOptions = {}) {
  return {
    className: "",
    variable: options.variable ?? "",
    style: { fontFamily: "sans-serif" },
  };
}

export const Lato = stubFont;
export const Marcellus = stubFont;
