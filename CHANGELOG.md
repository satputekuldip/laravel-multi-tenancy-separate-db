# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2026-10-04

### Added

- **Laravel AI SDK (`laravel/ai`)**: Integrated Laravel's first-party AI SDK (`v1.0.1`) with multi-provider support (OpenAI, Anthropic, Gemini, Groq, Ollama, Mistral, DeepSeek) in `config/ai.php`, persistent conversation storage migration (`create_agent_conversations_table`), and agent stubs.
- **AI SDK Skill**: Added comprehensive development guidelines for AI agents, chatbots, tool calling, and RAG in `.agents/skills`, `.claude/skills`, `.cursor/skills`, and `.github/skills`.

### Changed

- **Upgraded to Laravel 13**: Upgraded `laravel/framework` to `v13.34.0`, requiring PHP `^8.4` (running PHP 8.5).
- **Upgraded to Inertia v3**:
  - Upgraded `inertiajs/inertia-laravel` to `v3.5.1` and `@inertiajs/react` to `v3.8.0`.
  - Modernized `config/inertia.php` to Inertia v3 structure (`pages` and `testing`).
  - Added support for Inertia v3 features (standalone HTTP requests, optimistic updates, instant visits, simplified SSR).
- **Upgraded React & Frontend Stack**:
  - Upgraded React to `19.3.0` (`react`, `react-dom`, `@types/react`, `@types/react-dom`).
  - Upgraded Tailwind CSS to `4.3.3` (`tailwindcss`, `@tailwindcss/vite`).
  - Upgraded Vite to `7.3.6` (`vite`, `@vitejs/plugin-react`).
  - Upgraded Recharts to `3.10.1`.
  - Upgraded ESLint to `9.39.5` and `typescript-eslint` to `8.71.0`.
- **Upgraded Laravel & Spatie Packages**:
  - `spatie/laravel-activitylog` to `5.1.1`.
  - `spatie/laravel-permission` to `8.3.0`.
  - `spatie/laravel-backup` to `10.3.3`.
  - `spatie/laravel-medialibrary` to `11.23.8`.
  - `laravel/fortify` to `1.40.0`.
  - `laravel/tinker` to `3.0.2`.
  - `laravel/wayfinder` to `0.1.21` and `@laravel/vite-plugin-wayfinder` to `0.1.10`.

### Breaking Changes & Fixes

- **Spatie ActivityLog v5**:
  - Migrated `LogsActivity` trait namespace from `Spatie\Activitylog\Traits\LogsActivity` to `Spatie\Activitylog\Models\Concerns\LogsActivity` in `User` model.
  - Updated deprecated `dontSubmitEmptyLogs()` method to `dontLogEmptyChanges()`.
  - Added `attribute_changes` nullable JSON column to the `activity_log` migration.
- **Inertia Component Resolver Typing**:
  - Replaced loose types in `resources/js/app.tsx` and `resources/js/ssr.tsx` with explicit `ResolvedComponent` and `import.meta.glob<ResolvedComponent>()`.
- **Recharts v3 Tooltip Formatter**:
  - Updated tooltip formatter signature in `resources/js/pages/ecommerce/dashboard.tsx` to handle `value: number | string | readonly (number | string)[] | undefined`.
- **React 19 ARIA**:
  - Fixed `aria-haspopup` attribute on `<button>` in `RolesMultiSelect` (`resources/js/components/roles-multi-select.tsx`).
- **Laravel 13 Hardening**:
  - Configured `'serializable_classes' => false` in `config/cache.php` to prevent object injection vulnerabilities.
  - Standardized session cookie name format `Str::snake(env('APP_NAME', 'laravel')).'_session'` in `config/session.php`.

### Security

- Cleared all security vulnerability advisories across both Composer (`composer audit`) and npm (`npm audit`).

## [1.0.0] - 2026-06-23

### Added

- Docker and Github actions setup.
- **Ecommerce dashboard**: Dummy ecommerce dashboard at `/ecommerce` with stats (revenue, orders, customers, conversion), revenue area chart, orders-by-month bar chart, recent orders list, and top products list; uses shadcn Card/Badge and Recharts; sidebar link "Ecommerce" for authenticated users.

- **PasswordInput** component with show/hide toggle (Eye/EyeOff); used for all password fields (login, register, reset/confirm password, settings password, delete account, admin user create/edit).
- **RolesMultiSelect** component: dropdown multi-select for roles on user create and edit forms (replaces role checkboxes).

- **User Story 1 – Role and permission management**: Admin UI for roles CRUD (list, create, edit, delete) with permission assignment; GET `/api/permissions/check?permission=...` for client permission checks; Scribe annotations on Permissions API; admin routes protected by EnsureUserIsAdmin middleware (super-admin or admin role).
- **User Story 2 – User management CRUD**: Admin users list with search (name/email) and role filter; create, edit, delete users with role assignment; delete removes user (audit trail via Spatie Activity Log); Form Request validation (StoreUserRequest, UpdateUserRequest).
- **User Story 3 – Audit and activity logs**: Admin activity log at `/admin/activity-log` with filters (actor, action, date range), pagination; User model already uses LogsActivity for profile changes.
- **User Story 4 – Admin dashboard**: Dashboard shows user count and recent activity widgets with links to admin users and activity log; empty state when no activity.
- **User Story 5 – Settings**: Setting model and Settings facade (user > group > site precedence); admin site settings page at `/admin/site-settings` with default layout (sidebar + form); Form Request validation for updates.
- **User Story 6 – Translations and i18n**: TranslationService and Translations facade (get by key/group with fallback to default locale); SetLocale middleware (locale from session); admin languages CRUD and translations edit at `/admin/languages` and `/admin/languages/{id}/translations`; Scribe annotations on API LanguageController.
- **Menus**: Sidebar and header navigation menus; Dashboard in main menu; Admin section (Users, Roles, Activity Log, Site Settings, Languages, Permissions) shown in sidebar and header when user has admin or super-admin role; shared `auth.canAccessAdmin` for frontend; `NavMain` accepts optional `groupLabel` prop.
- **Settings module**: Site settings and Permissions pages moved under `/settings/site-settings` and `/settings/permissions` with settings layout; sidebar nav includes Site Settings and Permissions; Settings facade/helper documented in quickstart.
- **Navigation reorg**: Languages and Activity Log moved from main admin nav to footer (sidebar and header); admin main nav shows only Users and Roles.
- **Role edit**: Super-admin role permissions cannot be changed (backend skip sync, UI disabled); permissions grouped by module with horizontal checkbox layout on Create and Edit role pages.
- **User management**: Non–super-admin admins do not see super-admin users in the list; only super-admin can change another user’s role and email; users cannot change their own role or email; edit form shows/hides role and email fields via `canChangeRoleAndEmail`; prominent "Create user" button on users index.
- **Form layout**: Centered form layout (`mx-auto max-w-2xl`) applied to admin and settings form pages (roles, users, site settings, permissions, languages Create/Edit/Translations).
- **User management (Phase 13)**: CSV import (POST `/admin/users/import`) with name, email, optional password; row checkboxes and multi-select; bulk delete and bulk assign role with Form Request validation (ImportUsersRequest, BulkDestroyUsersRequest, BulkAssignRoleRequest).

### Fixed

- **Action buttons on Roles and Users index**: Permissions and roles are now shared via Inertia (`auth.permissions`, `auth.roles`) so Edit/Delete and Add Role/Create user buttons render on first load instead of after an async API call. Admin role in `RoleSeeder` now includes `roles.create`, `roles.update`, `roles.delete` so admins see role actions.

### Changed

- Form layout width set to half of parent (`w-1/2`) for admin and settings form pages (roles, users, languages, site settings, permissions) and settings layout content area.
- Site settings and permissions routes added under `/settings/*` (auth, verified, admin); admin routes retained for backward compatibility.
- `NavFooter` supports internal links (Inertia `Link`) for admin footer items (Languages, Activity Log).
[Unreleased]: https://github.com/your-org/laravel-template/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/your-org/laravel-template/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/your-org/laravel-template/releases/tag/v1.0.0
