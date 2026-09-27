# RepoLens

**Understand an unfamiliar codebase in minutes.**

RepoLens scans a local repository and produces a practical architecture map, onboarding guide, dependency inventory, and heuristic risk register. It works locally by default; your source code does not leave your machine.

```sh
npx repolens analyze .
```

It writes:

```text
repolens-output/
├── ARCHITECTURE.md
├── ONBOARDING.md
├── DEPENDENCY-MAP.md
├── RISK-REGISTER.md
├── analysis.json
└── repolens-report.html
```

## Why RepoLens?

Joining a new repository usually means piecing together the file tree, package scripts, dependencies, and undocumented conventions. RepoLens creates a starting map in one command so an engineer can orient quickly and spend their time on the work that matters.

## Install

Requires Node.js 20 or newer.

```sh
npm install -g repolens
repolens analyze /path/to/repository
```

Or run the project source:

```sh
npm install
npm run build
node dist/cli.js analyze .
```

## Commands

```sh
# Scan the current project; outputs to ./repolens-output
repolens analyze .

# Choose an output directory
repolens analyze ../some-project --output ./reports/some-project

# Confirm the zero-config setup
repolens init
```

## What it detects

- Source-language file counts and conventional entrypoints
- `package.json` dependencies and scripts
- Common framework signals such as React, Next.js, Express, FastAPI, Django, Vite, and Prisma
- Missing README, license, test files, and entrypoint documentation signals

RepoLens is intentionally conservative: its risk register is a codebase-orientation aid, **not** a security audit or vulnerability scanner.

## Roadmap

- [ ] GitHub Action that posts a branch comparison summary on pull requests
- [ ] Branch comparison and architecture-drift reports
- [ ] Python, Go, Rust, and Java manifest parsing
- [ ] Optional citation-backed AI explanations
- [ ] Configurable project conventions and policy checks

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), choose a `good first issue`, and open a focused pull request. Please follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE)
