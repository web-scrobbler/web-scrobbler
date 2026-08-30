# Agent Instructions

This document provides guidance for agents working on this project.

## Development Tasks

### Running Tests
Use `npm run test` to run the test suite using `vitest`.

### Compiling the Extension
Use `npm run dist chrome|firefox` to build the extension for distribution.

### Linting and Fixing
- To run all linters: `npm run lint`
- To fix Prettier issues: `npm run prettierfix`
- To fix Stylelint issues: `npm run fixstyle`

## Pull Requests

When creating pull requests:
- **Template**: Always use the template provided in `.github/PULL_REQUEST_TEMPLATE.md`.
- **Labels**: You MUST select exactly one label from each of the two sets defined in `.github/release-drafter.yml`:

    **Category labels** (choose one):
    - `new-feature`
    - `core-fix`
    - `new-connector`
    - `fixed-connector`
    - `updated`
    - `maintenance`

    **Versioning labels** (choose one):
    - `major-change`
    - `minor-change`
    - `patch-change`

Ensure your commit messages and PR titles follow Conventional Commits (as per `CLAUDE.md`).
