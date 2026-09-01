import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const workflow = fs.readFileSync(
  path.join(process.cwd(), ".github/workflows/ci.yml"),
  "utf8",
);

function workflowStep(name: string): string {
  const step = workflow
    .split("\n      - ")
    .find((candidate) => candidate.startsWith(`name: ${name}\n`));

  if (!step) throw new Error(`Missing CI step: ${name}`);
  return step;
}

describe("CI secret isolation", () => {
  it("runs pull-request artifact verification without production secrets", () => {
    const step = workflowStep("Verify production artifacts without secrets");

    expect(step).toContain("if: github.event_name == 'pull_request'");
    expect(step).toContain("run: npm run turbo:verify");
    expect(step).toContain("SITE_URL: https://caraway.au");
    expect(step).not.toContain("secrets.");
    expect(step).not.toContain("QUOTE_ENDPOINT");
    expect(step).not.toContain("CONTACT_ENDPOINT");
  });

  it("limits secret-bearing artifact verification to push-main", () => {
    const step = workflowStep("Verify production artifacts on main");

    expect(step).toContain(
      "if: github.event_name == 'push' && github.ref == 'refs/heads/main'",
    );
    expect(step).toContain("QUOTE_ENDPOINT: ${{ secrets.QUOTE_ENDPOINT }}");
    expect(step).toContain(
      "CONTACT_ENDPOINT: ${{ secrets.CONTACT_ENDPOINT }}",
    );
  });
});
