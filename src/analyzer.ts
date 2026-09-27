import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import type { Analysis, Dependency, FileInfo, Finding } from "./types.js";

const IGNORED = new Set(["node_modules", ".git", "dist", "build", "coverage", ".next", ".cache", "vendor"]);
const LANGUAGE: Record<string, string> = { ".ts": "TypeScript", ".tsx": "TypeScript", ".js": "JavaScript", ".jsx": "JavaScript", ".py": "Python", ".go": "Go", ".rs": "Rust", ".java": "Java", ".kt": "Kotlin", ".rb": "Ruby", ".php": "PHP", ".cs": "C#", ".cpp": "C++", ".c": "C", ".swift": "Swift", ".vue": "Vue", ".svelte": "Svelte", ".html": "HTML", ".css": "CSS", ".sql": "SQL" };
const FRAMEWORKS: Record<string, string> = { react: "React", next: "Next.js", express: "Express", fastify: "Fastify", vue: "Vue", nuxt: "Nuxt", svelte: "Svelte", "@sveltejs/kit": "SvelteKit", django: "Django", flask: "Flask", fastapi: "FastAPI", "@nestjs/core": "NestJS", prisma: "Prisma", vite: "Vite", electron: "Electron" };

function walk(root: string, current = root, files: FileInfo[] = []): FileInfo[] {
  for (const entry of readdirSync(current, { withFileTypes: true })) {
    if (IGNORED.has(entry.name) || entry.name.startsWith(".")) continue;
    const full = join(current, entry.name);
    if (entry.isDirectory()) walk(root, full, files);
    else if (entry.isFile()) files.push({ path: relative(root, full), extension: extname(entry.name), bytes: statSync(full).size });
  }
  return files;
}

function packageInfo(root: string): { deps: Dependency[]; scripts: Record<string, string>; name?: string } {
  const file = join(root, "package.json");
  if (!existsSync(file)) return { deps: [], scripts: {} };
  try {
    const pkg = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;
    const unpack = (value: unknown, kind: Dependency["kind"]) => Object.entries((value ?? {}) as Record<string, string>).map(([name, version]) => ({ name, version, kind }));
    return { name: typeof pkg.name === "string" ? pkg.name : undefined, scripts: (pkg.scripts ?? {}) as Record<string, string>, deps: [...unpack(pkg.dependencies, "production"), ...unpack(pkg.devDependencies, "development")] };
  } catch { return { deps: [], scripts: {} }; }
}

export function analyze(root: string): Analysis {
  const files = walk(root);
  const info = packageInfo(root);
  const languages: Record<string, number> = {};
  for (const file of files) { const language = LANGUAGE[file.extension]; if (language) languages[language] = (languages[language] ?? 0) + 1; }
  const names = new Set(info.deps.map(d => d.name));
  const frameworks = Object.entries(FRAMEWORKS).filter(([dependency]) => names.has(dependency)).map(([, label]) => label);
  const entrypoints = files.filter(file => /(^|\/)(index|main|app|server|cli)\.(ts|tsx|js|jsx|py|go|rs)$/.test(file.path)).map(file => file.path).slice(0, 12);
  const hasReadme = files.some(f => /^readme/i.test(basename(f.path)));
  const hasTests = files.some(f => /(^|\/)(__tests__|test|tests|spec)(\/|\.)/i.test(f.path));
  const findings: Finding[] = [];
  if (!hasReadme) findings.push({ severity: "high", title: "No README found", detail: "New users need installation, a first example, and project purpose before they can adopt the project." });
  if (!hasTests) findings.push({ severity: "medium", title: "No test files detected", detail: "Add a small smoke test suite before changing behavior or inviting contributors." });
  if (!files.some(f => f.path === "LICENSE" || f.path === "LICENSE.md")) findings.push({ severity: "medium", title: "No license found", detail: "A license tells users and contributors how the project may be used." });
  if (files.length > 500) findings.push({ severity: "low", title: "Large repository", detail: "Start onboarding from the detected entrypoints and dependency map rather than reading the tree linearly." });
  if (entrypoints.length === 0) findings.push({ severity: "low", title: "No conventional entrypoint detected", detail: "Document the main runtime path so new maintainers can orient themselves quickly." });
  return { root, name: info.name ?? basename(root), generatedAt: new Date().toISOString(), files, languages, dependencies: info.deps, scripts: info.scripts, frameworks, entrypoints, findings, hasReadme, hasTests };
}
