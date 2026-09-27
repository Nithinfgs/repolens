import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { analyze } from "./analyzer.js";

const here = dirname(fileURLToPath(import.meta.url));
const fixture = join(here, "../examples/sample-project");

test("analyzes scripts, dependencies, framework, and entrypoint", () => {
  const result = analyze(fixture);
  assert.equal(result.name, "sample-project");
  assert.equal(result.dependencies.some(d => d.name === "express"), true);
  assert.equal(result.frameworks.includes("Express"), true);
  assert.deepEqual(result.entrypoints, ["src/server.js"]);
  assert.equal(result.hasTests, false);
});
