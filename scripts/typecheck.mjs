import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const cwd = process.cwd();
const tempConfigPath = join(cwd, "tsconfig.typecheck.tmp.json");

try {
  execSync("npx next typegen", { cwd, stdio: "inherit" });

  const tsconfig = JSON.parse(readFileSync(join(cwd, "tsconfig.json"), "utf8"));
  tsconfig.include = [
    "next-env.d.ts",
    "src/**/*",
    ".next/types/routes.d.ts",
    ".next/types/validator.ts",
    ".next/types/cache-life.d.ts",
  ];

  writeFileSync(tempConfigPath, `${JSON.stringify(tsconfig, null, 2)}\n`);
  execSync(`./node_modules/.bin/tsc -p ${tempConfigPath} --noEmit`, {
    cwd,
    stdio: "inherit",
  });
} finally {
  try {
    unlinkSync(tempConfigPath);
  } catch {
    // Ignore missing temp file.
  }
}
