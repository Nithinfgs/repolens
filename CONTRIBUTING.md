# Contributing to RepoLens

Thank you for helping make codebase onboarding easier.

## Before you start

1. Search existing issues and discussions.
2. For large changes, open an issue first with the user problem and a proposed approach.
3. Keep pull requests small, testable, and focused on one behavior.

## Local development

```sh
npm install
npm run build
node dist/cli.js analyze examples/sample-project --output /tmp/repolens-report
```

## Pull request checklist

- [ ] `npm run build` succeeds
- [ ] I tested against a fixture or representative repository
- [ ] I updated docs when behavior or output changed
- [ ] I described the user-visible effect and verification steps

## Good first contributions

Useful starting points include new framework signatures, manifest parsers, fixture projects, report copy improvements, and accessibility upgrades to the HTML report.
