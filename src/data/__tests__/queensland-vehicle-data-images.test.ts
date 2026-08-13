import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import {
  BRISBANE_REUSE_THUMBNAIL,
  VEHICLE_DATA_SOCIAL_IMAGE,
} from "@/data/queensland-vehicle-data";

type HeaderRule = {
  source: string;
  headers: Array<{ key: string; value: string }>;
};

const images = [VEHICLE_DATA_SOCIAL_IMAGE, BRISBANE_REUSE_THUMBNAIL];
const execFileAsync = promisify(execFile);

describe("vehicle-data editorial images", () => {
  it("publishes versioned, compact PNG files with their declared dimensions", async () => {
    for (const image of images) {
      expect(image.src).toMatch(/^\/images\/[a-z0-9-]+-v1\.png$/);
      const file = path.join(process.cwd(), "public", image.src.slice(1));
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).size).toBeGreaterThan(20_000);
      expect(fs.statSync(file).size).toBeLessThan(2_000_000);

      const metadata = await sharp(file).metadata();
      expect(metadata.format).toBe("png");
      expect(metadata.width).toBe(image.width);
      expect(metadata.height).toBe(image.height);
      expect(metadata.space).toMatch(/srgb|rgb/i);
      const channels = (await sharp(file).stats()).channels;
      const alpha = channels[3];
      if (alpha) {
        expect(alpha.min).toBe(255);
        expect(alpha.max).toBe(255);
      }
      expect(image.alt.length).toBeGreaterThan(100);
    }
  });

  it("recreates both immutable v1 files from pinned fonts and renderer inputs", async () => {
    const { stdout } = await execFileAsync(
      process.execPath,
      ["scripts/build-vehicle-data-social-images.mjs", "--check"],
      { cwd: process.cwd() },
    );
    expect(stdout).toContain(VEHICLE_DATA_SOCIAL_IMAGE.src.split("/").at(-1));
    expect(stdout).toContain(BRISBANE_REUSE_THUMBNAIL.src.split("/").at(-1));
  });

  it("exposes only the two editorial images for cross-origin reuse", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");
    const { default: productionConfig } = await import("../../../next.config");
    const headers = await productionConfig.headers?.();
    vi.unstubAllEnvs();
    const rules = (headers ?? []) as HeaderRule[];
    const catchAllIndex = rules.findIndex((entry) => entry.source === "/(.*)");
    const genericImageIndex = rules.findIndex(
      (entry) => entry.source === "/images/(.*)",
    );
    expect(catchAllIndex).toBeGreaterThanOrEqual(0);
    expect(genericImageIndex).toBeGreaterThan(catchAllIndex);
    expect(
      rules[catchAllIndex]?.headers,
    ).toContainEqual({
      key: "Cross-Origin-Resource-Policy",
      value: "same-origin",
    });

    for (const image of images) {
      const ruleIndex = rules.findIndex((entry) => entry.source === image.src);
      expect(ruleIndex).toBeGreaterThan(genericImageIndex);
      const rule = rules[ruleIndex];
      expect(rule).toBeDefined();
      const values = Object.fromEntries(
        rule?.headers.map(({ key, value }) => [key, value]) ?? [],
      );
      expect(values["Cross-Origin-Resource-Policy"]).toBe("cross-origin");
      expect(values["Access-Control-Allow-Origin"]).toBe("*");
      expect(values["Cache-Control"]).toContain("immutable");
    }

    const genericImages = rules.find((entry) => entry.source === "/images/(.*)");
    expect(
      genericImages?.headers.some(
        ({ key }) => key === "Cross-Origin-Resource-Policy",
      ),
    ).toBe(false);
  });
});
