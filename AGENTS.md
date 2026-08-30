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
- **Labels**: Choose relevant labels based on the categories defined in `.github/release-drafter.yml`:
    - `new-feature`: Additions of new functionalities.
    - `core-fix`: Bug fixes for core extension functionality.
    - `new-connector`: Addition of support for a new music service connector.
    - `fixed-connector`: Fixes for issues with existing music service connectors.
    - `updated`: Dependency updates or other component updates.
    - `maintenance`: General maintenance, refactoring, or infrastructure improvements.

    Additionally, every PR **must** include exactly one of the following versioning labels to determine the next release version:
    - `major-change`: Use for major overhauls or breaking changes.
    - `minor-change`: Use for new features or new connectors.
    - `patch-change`: Use for bug fixes or maintenance changes.

Ensure your commit messages and PR titles follow Conventional Commits (as per `CLAUDE.md`).
