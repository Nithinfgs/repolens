export type Dependency = { name: string; version: string; kind: "production" | "development" };
export type Finding = { severity: "high" | "medium" | "low"; title: string; detail: string; source?: string };
export type FileInfo = { path: string; extension: string; bytes: number };
export type Analysis = {
  root: string; name: string; generatedAt: string; files: FileInfo[]; languages: Record<string, number>;
  dependencies: Dependency[]; scripts: Record<string, string>; frameworks: string[]; entrypoints: string[];
  findings: Finding[]; hasReadme: boolean; hasTests: boolean;
};
