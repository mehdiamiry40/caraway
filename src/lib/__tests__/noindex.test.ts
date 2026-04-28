import { afterEach, describe, expect, it } from "vitest";
import { shouldNoindexSite } from "@/lib/noindex";

const originalNoindex = process.env.NEXT_PUBLIC_NOINDEX;
const originalVercelEnv = process.env.VERCEL_ENV;

afterEach(() => {
  if (originalNoindex === undefined) {
    delete process.env.NEXT_PUBLIC_NOINDEX;
  } else {
    process.env.NEXT_PUBLIC_NOINDEX = originalNoindex;
  }

  if (originalVercelEnv === undefined) {
    delete process.env.VERCEL_ENV;
  } else {
    process.env.VERCEL_ENV = originalVercelEnv;
  }
});

describe("shouldNoindexSite", () => {
  it("forces noindex when NEXT_PUBLIC_NOINDEX=1 even in production", () => {
    process.env.NEXT_PUBLIC_NOINDEX = "1";
    process.env.VERCEL_ENV = "production";

    expect(shouldNoindexSite()).toBe(true);
  });

  it("keeps production indexable when the override is unset", () => {
    delete process.env.NEXT_PUBLIC_NOINDEX;
    process.env.VERCEL_ENV = "production";

    expect(shouldNoindexSite()).toBe(false);
  });

  it("noindexes non-production environments by default", () => {
    delete process.env.NEXT_PUBLIC_NOINDEX;
    process.env.VERCEL_ENV = "preview";

    expect(shouldNoindexSite()).toBe(true);
  });
});
