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

const liveFormCheck = fs.readFileSync(
  path.join(process.cwd(), ".github/workflows/live-form-check.yml"),
  "utf8",
);

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

  it("checks lead forms on the production build after it exists, without secrets", () => {
    const step = workflowStep("Check lead forms on the production build");

    expect(step).toContain("run: npm run test:e2e:production");
    expect(step).not.toContain("secrets.");
    expect(step).not.toContain("env:");
    expect(workflow.indexOf("name: Check lead forms on the production build"))
      .toBeGreaterThan(workflow.indexOf("name: Verify production artifacts on main"));
  });
});

describe("browser setup", () => {
  // From the start check to the blank line that ends the browser setup.
  function browserSetup(source: string): string {
    const start = source.indexOf("      - id: chromium\n");
    const end = source.indexOf("\n\n", start);
    if (start === -1 || end === -1)
      throw new Error("Missing the Chromium start check");
    return source.slice(start, end);
  }

  it("installs system packages only when Chromium cannot start", () => {
    for (const source of [workflow, liveFormCheck]) {
      // An unconditional package download fails the job whenever the runner's
      // package mirror is slow, before any check has run.
      expect(source).not.toContain("--with-deps");
      expect(source.match(/install-deps/g)).toHaveLength(2); // one comment, one step
      const setup = browserSetup(source);
      expect(setup).toContain("chromium.launch(");
      expect(setup).toContain('echo "starts=true" >> "$GITHUB_OUTPUT"');
      expect(setup).toContain(
        "      - if: steps.chromium.outputs.starts != 'true'\n        run: npx playwright install-deps chromium\n",
      );
    }
  });

  it("uses the same start check in CI and in the live form check", () => {
    expect(browserSetup(workflow)).toBe(browserSetup(liveFormCheck));
  });
});

describe("live form check workflow", () => {
  it("is read-only, holds no secrets and pins every action to a commit", () => {
    expect(liveFormCheck).toMatch(/^permissions:\n  contents: read$/m);
    expect(liveFormCheck).not.toContain("secrets.");
    const uses = [...liveFormCheck.matchAll(/uses: (\S+)/g)].map((match) => match[1]);
    expect(uses.length).toBeGreaterThan(0);
    for (const action of uses) expect(action).toMatch(/@[0-9a-f]{40}$/);
  });

  it("only reacts to successful Production deployments and always runs the checks from main", () => {
    expect(liveFormCheck).toContain("github.event.deployment_status.state == 'success'");
    expect(liveFormCheck).toContain("github.event.deployment.environment == 'Production'");
    expect(liveFormCheck).toMatch(/uses: actions\/checkout@[0-9a-f]{40}[^\n]*\n\s+with:\n(?:\s+#[^\n]*\n)*\s+ref: main\n/);
  });

  it("keeps events the job skips out of the queue that real checks wait in", () => {
    const oneLine = (text: string | undefined) =>
      (text ?? "").replace(/\s+/g, " ").trim();
    const runsTheJob =
      "github.event_name != 'deployment_status' || " +
      "(github.event.deployment_status.state == 'success' && " +
      "github.event.deployment.environment == 'Production')";

    const jobIf = liveFormCheck.match(/\n    if: >-\n((?: {6}.*\n)+)/);
    expect(oneLine(jobIf?.[1])).toBe(runsTheJob);

    // A preview deployment's event must not be able to replace the waiting
    // check for a Production deployment, so it gets a group no other run has.
    const group = liveFormCheck.match(
      /\nconcurrency:\n  group: >-\n((?: {4}.*\n)+)  cancel-in-progress: false\n/,
    );
    expect(oneLine(group?.[1])).toBe(
      `\${{ (${runsTheJob}) && 'live-site-form-check' || ` +
        "format('live-form-check-skipped-{0}', github.run_id) }}",
    );
    // Branches cut before this rule existed still use the old shared name.
    expect(liveFormCheck).not.toMatch(/group: live-form-check\s/);
  });

  it("points the suite at the canonical site and nowhere else", () => {
    expect(liveFormCheck).toContain("run: npm run test:e2e:production");
    expect([...liveFormCheck.matchAll(/FORM_CHECK_BASE_URL: (\S+)/g)].map((match) => match[1]))
      .toEqual(["https://caraway.au"]);
  });
});
