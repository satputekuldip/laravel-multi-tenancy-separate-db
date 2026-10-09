<!--
Sync Impact Report:
- Version change: Initial Template -> 1.3.0
- List of modified principles:
  - Added: Code Quality & Standards
  - Added: Testing Standards
  - Added: User Experience Consistency
  - Added: Performance Requirements
  - Added: Documentation & Transparency
- Added sections: Development Workflow, Technology Stack
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ aligned via Constitution Check)
  - .specify/templates/spec-template.md (✅ aligned via Requirements)
  - .specify/templates/tasks-template.md (✅ aligned via Tasks)
-->

# Laravel App Constitution

## Core Principles

### I. Code Quality & Standards
**Strict adherence to Laravel 12 & Inertia 2 conventions is mandatory.**
- **PHP**: Must follow PSR-12/PER standards (enforced by `pint`). Strict typing is required (return types, typed properties). No "magic" logic without explicit comments.
- **Frontend**: TypeScript strict mode is mandatory. React components must be functional. All code must pass `eslint` and `prettier`.
- **Laravel**: Use Eloquent over raw SQL where possible. Logic belongs in Services/Actions, not Controllers. Use Form Requests for validation.
- **Inertia**: Use strictly typed props. Shared data via HandleInertiaRequests middleware only.

### II. Testing Standards
**Every feature must include automated tests.**
- **Coverage**: All new logic must be covered by tests.
- **Type**: Prefer Feature tests (integration) over Unit tests for higher value.
- **State**: Tests must not depend on external state; use Factories and Seeders.
- **Discipline**: A "Red-Green-Refactor" mindset is encouraged. Tests must pass before merging.

### III. User Experience Consistency
**Consistency is key to trust and usability.**
- **Design System**: Use the established Tailwind CSS design system/theme. Do not introduce arbitrary hex values.
- **Feedback**: Every user action must have feedback (success toast, error message, loading state).
- **Navigation**: Use `Link` components for client-side navigation.
- **Empty States**: Tables and lists must have descriptive empty states.

### IV. Performance Requirements
**Performance is a feature.**
- **Latency**: Server response time must be under 200ms (p95) for standard requests.
- **Database**: Zero N+1 queries allowed. Eager load relationships. Use `explain` for complex queries.
- **Frontend**: Minimize bundle size. Use code splitting (dynamic imports) where appropriate.

### V. Documentation & Transparency
**Documentation must evolve with the code.**
- **Changelog**: `CHANGELOG.md` MUST be updated after every completed user story or significant change. When releasing a version (e.g. 1.4.5): add a new `## [x.y.z] - YYYY-MM-DD` section with **Added** / **Changed** / **Fixed** subsections; update both comparison-link blocks at the bottom (`[Unreleased]`: `vx.y.z...HEAD`, `[x.y.z]`: `vprev...vx.y.z`).
- **Specs**: The `specs/` directory is the source of truth for features. Keep it updated.
- **Comments**: Comment "why", not "what".
- **API documentation (Scribe)**:
  - Use `knuckleswtf/scribe` annotations for **all** API controllers.
  - Every endpoint must document: **body** (`@bodyParam`), **query** (`@queryParam`), **URL** (`@urlParam`) where applicable; **success responses** (`@response` / `@response 200` or `201`); **error responses** (`@response 401`, `403`, `404`, `422`, `500`) as applicable.
  - Response examples must **not leave fields empty**: e.g. `attachments`, `documents`, `certificates`, `created_by`, `updated_by`, `images`, and other arrays/objects must contain at least one example item with realistic data (file names, URLs, IDs, dates). Pagination `prev`/`next` may remain `null` when there is no previous/next page.
  - After changing API controllers or Scribe annotations, run `php artisan scribe:generate`.

### VI. Development Hygiene
**Routine checks keep the codebase consistent.**
- **PHP**: After editing PHP files, run `vendor/bin/pint --dirty` before finalizing.
- **API docs**: After changing API controllers or their docblocks, run `php artisan scribe:generate`.

## Development Workflow

- **Planning**: All features start with a spec in `specs/`. Use `.specify` commands.
- **Review**: Code reviews must verify compliance with this Constitution.
- **Version Control**: Semantic Versioning (SemVer) applies.

## Technology Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: Inertia.js 2 (React 19, TypeScript 5.7)
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (Production), SQLite/PostgreSQL (Dev)
- **Testing**: PHPUnit

## Governance

This Constitution supersedes all other practices. Amendments require documentation, approval, and a migration plan if necessary.
All PRs/reviews must verify compliance.

**Version**: 1.4.0 | **Ratified**: 2026-01-11 | **Last Amended**: 2026-03-01
