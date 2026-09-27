#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { analyze } from "./analyzer.js";
import { architecture, dependencyMap, html, onboarding, risks } from "./render.js";

const [command = "help", target = ".", ...args] = process.argv.slice(2);
function usage() { console.log("RepoLens — understand an unfamiliar codebase in minutes.\n\nUsage:\n  repolens analyze [path] [--output path]\n  repolens init\n"); }
if (command === "help" || command === "--help" || command === "-h") usage();
else if (command === "init") console.log("RepoLens uses no configuration for its first scan. Run: repolens analyze .");
else if (command === "analyze") {
  const root = resolve(target);
  if (!existsSync(root)) { console.error(`Path does not exist: ${root}`); process.exitCode = 1; }
  else {
    const outputFlag = args.indexOf("--output"); const out = resolve(outputFlag >= 0 && args[outputFlag + 1] ? args[outputFlag + 1] : join(root, "repolens-output"));
    mkdirSync(out, { recursive: true }); const result = analyze(root);
    const documents: Record<string, string> = { "ARCHITECTURE.md": architecture(result), "ONBOARDING.md": onboarding(result), "DEPENDENCY-MAP.md": dependencyMap(result), "RISK-REGISTER.md": risks(result), "repolens-report.html": html(result), "analysis.json": JSON.stringify(result, null, 2) + "\n" };
    for (const [file, contents] of Object.entries(documents)) writeFileSync(join(out, file), contents);
    console.log(`RepoLens scanned ${result.files.length} files and wrote ${Object.keys(documents).length} reports to ${out}`);
  }
} else { console.error(`Unknown command: ${command}`); usage(); process.exitCode = 1; }
