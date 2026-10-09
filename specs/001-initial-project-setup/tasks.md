# Tasks: Initial Project Setup

**Input**: Design documents from `/specs/001-initial-project-setup/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md  

**Tests**: Feature tests included per constitution (all new logic covered by tests).  

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1–US6)
- Include exact file paths in descriptions

## Path Conventions

- Laravel app root: `app/`, `routes/`, `resources/`, `config/`, `database/`, `tests/`
- Admin: `app/Http/Controllers/Admin/`, `resources/js/pages/admin/`
- API: `app/Http/Controllers/Api/`, `routes/api.php`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify tooling and documentation structure for the feature.

- [x] T001 [P] Add or verify knuckleswtf/scribe and run `php artisan scribe:generate` (composer.json, config if added)
- [x] T002 Ensure CHANGELOG.md exists with [Unreleased] and version link blocks at bottom (CHANGELOG.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Admin access control and base structure so all user stories can assume protected admin routes.

**Checkpoint**: Foundation ready – user story implementation can begin.

- [x] T003 Ensure admin routes are protected by permission middleware or gate (e.g. `roles.view` or `super-admin`) in routes/web.php and bootstrap/app.php or middleware
- [x] T004 [P] Add or verify Wayfinder route generation after route changes: `php artisan wayfinder:generate` (document in quickstart or Makefile)

---

## Phase 3: User Story 1 – Role and Permission Management (Priority: P1) – MVP

**Goal**: Admins manage roles and permissions in the admin UI; clients can check if the current user has a permission via the API. Roles CRUD and permission assignment; API includes a single-permission check.

**Independent Test**: Admin creates a role, assigns permissions, assigns role to user; client calls GET /api/permissions/check?permission=... and receives allowed/denied.

### Tests for User Story 1

- [x] T005 [P] [US1] Feature test permission API (index, roles, userPermissions, check) in tests/Feature/Api/PermissionApiTest.php
- [x] T006 [P] [US1] Feature test admin roles list and CRUD in tests/Feature/Admin/RoleManagementTest.php

### Implementation for User Story 1

- [x] T007 [US1] Create RoleController (index, create, store, edit, update, destroy) in app/Http/Controllers/Admin/RoleController.php
- [x] T008 [US1] Add Form Request classes for role store/update in app/Http/Requests/Admin/StoreRoleRequest.php and UpdateRoleRequest.php
- [x] T009 [US1] Add admin routes for roles resource in routes/web.php (admin prefix)
- [x] T010 [P] [US1] Create Inertia page admin/roles/Index.tsx listing roles with links to edit in resources/js/pages/admin/roles/Index.tsx
- [x] T011 [US1] Create Inertia pages admin/roles/Create.tsx and Edit.tsx with form and permission assignment in resources/js/pages/admin/roles/
- [x] T012 [US1] Add GET /api/permissions/check with query param `permission` in app/Http/Controllers/Api/PermissionController.php and routes/api.php
- [x] T013 [US1] Add Scribe annotations to all methods in app/Http/Controllers/Api/PermissionController.php (index, roles, userPermissions, check) with non-empty response examples
- [x] T014 [US1] Update CHANGELOG.md for User Story 1 (role-permission admin and permission check API)

**Checkpoint**: US1 complete – admin can manage roles/permissions; API supports permission check.

---

## Phase 4: User Story 2 – User Management CRUD (Priority: P1)

**Goal**: Admins have full CRUD on users with search/filter, role assignment, and delete/deactivate; changes reflected in permission checks.

**Independent Test**: Admin creates/edits/deletes a user, assigns roles; user list supports search/filter; deleted user cannot log in.

### Tests for User Story 2

- [x] T015 [P] [US2] Feature test admin users CRUD and role assignment in tests/Feature/Admin/UserManagementTest.php

### Implementation for User Story 2

- [x] T016 [US2] Ensure UserController store/update use Form Request validation in app/Http/Controllers/Admin/UserController.php and app/Http/Requests/Admin/
- [x] T017 [US2] Add search and filter to user index (controller + Inertia) in app/Http/Controllers/Admin/UserController.php and resources/js/pages/admin/users/Index.tsx
- [x] T018 [US2] Ensure user delete (or deactivate) and optional audit trail in app/Http/Controllers/Admin/UserController.php
- [x] T019 [US2] Update CHANGELOG.md for User Story 2 (user management CRUD)

**Checkpoint**: US2 complete – user CRUD with search, roles, and delete/deactivate.

---

## Phase 5: User Story 3 – Audit and Activity Logs (Priority: P2)

**Goal**: Admins view activity log with filters (actor, action type, date range) and pagination; key actions (e.g. user/role changes) are logged.

**Independent Test**: Perform an audited action; open admin activity log; see entry and use filters/pagination.

### Tests for User Story 3

- [x] T020 [P] [US3] Feature test activity log admin index and filters in tests/Feature/Admin/ActivityLogTest.php

### Implementation for User Story 3

- [x] T021 [US3] Create ActivityLogController (index with filters and pagination) in app/Http/Controllers/Admin/ActivityLogController.php
- [x] T022 [US3] Add admin route for activity log in routes/web.php
- [x] T023 [US3] Create Inertia page admin/activity-log/Index.tsx with filters (actor, action type, date range) and pagination in resources/js/pages/admin/activity-log/Index.tsx
- [x] T024 [US3] Ensure User and Role changes (and login if desired) are logged via LogsActivity or observers in app/Models/User.php and config
- [x] T025 [US3] Update CHANGELOG.md for User Story 3 (audit and activity logs admin)

**Checkpoint**: US3 complete – activity log viewable and filterable by admins.

---

## Phase 6: User Story 4 – Admin Dashboard (Priority: P2)

**Goal**: Single dashboard with at least two summary widgets (e.g. user count, recent activity) and links to users and activity log; empty states when no data.

**Independent Test**: Admin opens dashboard; sees at least two widgets and can navigate to users and activity log; empty state when applicable.

### Tests for User Story 4

- [x] T026 [P] [US4] Feature test dashboard returns summary data and requires auth in tests/Feature/Admin/DashboardTest.php

### Implementation for User Story 4

- [x] T027 [US4] Create or extend DashboardController to pass user count and recent activity in app/Http/Controllers/Admin/DashboardController.php (or closure in routes/web.php)
- [x] T028 [US4] Update dashboard Inertia page with at least two widgets (user count, recent activity) and links to admin users and activity log in resources/js/pages/dashboard.tsx or resources/js/pages/admin/dashboard.tsx
- [x] T029 [US4] Add empty states for dashboard when no users or no activity in same dashboard page
- [x] T030 [US4] Update CHANGELOG.md for User Story 4 (admin dashboard)

**Checkpoint**: US4 complete – dashboard with widgets and navigation.

---

## Phase 7: User Story 5 – Settings (User, Group, Site) (Priority: P2)

**Goal**: Setting model and Settings facade/helper with user > group > site precedence; admin site-settings UI with default layout.

**Independent Test**: User reads/sets settings via facade; admin opens site settings and saves; precedence works for a key set at multiple levels.

### Tests for User Story 5

- [x] T031 [P] [US5] Feature test Settings facade get/set and precedence in tests/Feature/SettingsTest.php or tests/Unit/SettingServiceTest.php
- [x] T032 [P] [US5] Feature test admin site settings page load and update in tests/Feature/Admin/SiteSettingsTest.php

### Implementation for User Story 5

- [x] T033 [P] [US5] Create migration for settings table (key, value, scope, scope_id, timestamps; unique scope+scope_id+key) in database/migrations/
- [x] T034 [P] [US5] Create Setting model with scopes and validation in app/Models/Setting.php
- [x] T035 [US5] Create SettingService with get/set and precedence (user > group > site) in app/Services/SettingService.php
- [x] T036 [US5] Register Settings facade or helper and bind SettingService in app/Providers/AppServiceProvider.php or app/Support/Facades/Settings.php
- [x] T037 [US5] Create SiteSettingsController (index, update) for admin in app/Http/Controllers/Admin/SiteSettingsController.php
- [x] T038 [US5] Add admin route(s) for site settings in routes/web.php
- [x] T039 [US5] Create Inertia page admin/site-settings/Index.tsx with default layout (sidebar + form) in resources/js/pages/admin/site-settings/Index.tsx
- [x] T040 [US5] Add Form Request for site settings update in app/Http/Requests/Admin/UpdateSiteSettingsRequest.php
- [x] T041 [US5] Update CHANGELOG.md for User Story 5 (settings facade and site settings)

**Checkpoint**: US5 complete – settings facade and admin site settings UI.

---

## Phase 8: User Story 6 – Translations and i18n (Priority: P3)

**Goal**: Translation facade/helper for current locale with fallback; locale in session or user preference; admin UI to manage languages and translations.

**Independent Test**: Set locale; request translation by key via facade; get correct value or fallback. Admin can add language and edit translations.

### Tests for User Story 6

- [x] T042 [P] [US6] Feature test translation helper and locale resolution in tests/Feature/TranslationTest.php
- [x] T043 [P] [US6] Feature test admin languages and translations CRUD in tests/Feature/Admin/LanguageManagementTest.php

### Implementation for User Story 6

- [x] T044 [US6] Create TranslationService (get by key/group, fallback) and facade or helper in app/Services/TranslationService.php and app/Support/ or config
- [x] T045 [US6] Set locale from session or user preference in middleware or HandleInertiaRequests in app/Http/Middleware/HandleInertiaRequests.php or new SetLocale middleware
- [x] T046 [US6] Create Admin LanguageController (languages index, create/store, edit/update; translations per language) in app/Http/Controllers/Admin/LanguageController.php
- [x] T047 [US6] Add admin routes for languages and translations in routes/web.php
- [x] T048 [US6] Create Inertia pages admin/languages/Index.tsx and translation edit in resources/js/pages/admin/languages/
- [x] T049 [US6] Add Scribe annotations to app/Http/Controllers/Api/LanguageController.php with non-empty response examples
- [x] T050 [US6] Update CHANGELOG.md for User Story 6 (translation facade and i18n management)

**Checkpoint**: US6 complete – translation helper and admin language/translation management.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, hygiene, and validation across all stories.

- [x] T051 Run `php artisan scribe:generate` and ensure all API controllers documented (terminal / docs)
- [x] T052 Run `vendor/bin/pint --dirty` on PHP files (terminal)
- [x] T053 Verify CHANGELOG.md has entries for each user story and release link blocks at bottom (CHANGELOG.md)
- [x] T054 Run quickstart.md validation (migrate, seed, test, manual smoke of dashboard and admin) (manual or script)

---

## Phase 10: Settings & Permissions in Settings Module

**Goal**: Move site settings and permissions under the settings area; use settings layout and routes; verify settings facade and helper.

**Independent Test**: Authenticated admin opens /settings/site-settings and /settings/permissions using the settings sidebar layout; Settings facade/helper works in code.

- [x] T055 [US5] Move site settings page to settings module: create resources/js/pages/settings/site-settings/Index.tsx using settings layout (resources/js/layouts/settings/layout.tsx), move or duplicate from admin/site-settings
- [x] T056 [US5] Add site settings and permissions to settings layout sidebar in resources/js/layouts/settings/layout.tsx (sidebarNavItems: Profile, Password, Two-Factor, Appearance, Site Settings, Permissions)
- [x] T057 [US5] Add web routes for /settings/site-settings and /settings/permissions (auth, verified, admin middleware) in routes/web.php or routes/settings.php; point controllers to render Inertia pages under settings (e.g. settings/site-settings/Index, settings/permissions/Index)
- [x] T058 [US5] Move permissions page to settings module: create resources/js/pages/settings/permissions/Index.tsx using settings layout; update route and controller to render settings/permissions/Index
- [x] T059 [P] [US5] Verify and document Settings facade (App\Facades\Settings) and helper usage in quickstart.md or inline; ensure SettingService get/set and getSiteSettings/setSiteSettings are available

**Checkpoint**: Site settings and permissions live under settings module with shared settings layout.

---

## Phase 11: Navigation – Languages & Activity Log in Footer

**Goal**: Move Languages and Activity Log from main admin nav to footer nav; keep them visible to admins.

**Independent Test**: Admin sees Languages and Activity Log in footer (sidebar and/or header); main admin nav no longer lists them.

- [x] T060 Remove Languages and Activity Log from admin main nav (adminNavItems) in resources/js/components/app-sidebar.tsx and resources/js/components/app-header.tsx
- [x] T061 Add Languages and Activity Log to footer nav (footerNavItems) in resources/js/components/app-sidebar.tsx; show only when auth.canAccessAdmin so non-admins do not see admin links in footer
- [x] T062 If header has a footer/secondary nav section, add Languages and Activity Log there for consistency in resources/js/components/app-header.tsx

**Checkpoint**: Languages and Activity Log appear in footer nav for admins only.

---

## Phase 12: Role Edit – Permissions UX & Rules

**Goal**: Allow updating permissions for any role except super-admin; show permissions as checkboxes grouped by module with horizontal layout to optimize space.

**Independent Test**: Admin can edit permissions for admin/user roles; super-admin role permissions are read-only or edit blocked; role edit page shows permissions grouped by module (e.g. users.*, roles.*) in horizontal rows.

- [x] T063 [US1] Backend: prevent permission/role update for role named super-admin in app/Http/Controllers/Admin/RoleController.php (e.g. abort or skip sync) and/or app/Http/Requests/Admin/UpdateRoleRequest.php
- [x] T064 [P] [US1] Role edit UI: group permissions by module (e.g. by prefix before first dot: users.view → "users") in resources/js/pages/admin/roles/Edit.tsx
- [x] T065 [US1] Role edit UI: render permission checkboxes grouped by module with horizontal listing (flex/grid per group) to optimize space in resources/js/pages/admin/roles/Edit.tsx; apply same grouping to resources/js/pages/admin/roles/Create.tsx
- [x] T066 [US1] Add or update feature test for role update: super-admin role cannot have permissions changed in tests/Feature/Admin/RoleManagementTest.php

**Checkpoint**: Role edit allows permission changes except for super-admin; permissions displayed grouped and horizontal.

---

## Phase 13: User Management Enhancements

**Goal**: CSV import, multi-select and bulk actions, hide super-admin from non–super-admins, self-edit rules, and visible Create user button.

**Independent Test**: Admin can import users via CSV; select multiple users and run bulk action; non–super-admin admins do not see super-admin users in list; user can update own name/details; role and email change restricted; Create user button visible on users index.

- [x] T067 [US2] Backend: add POST admin/users/import endpoint with CSV validation and store logic in app/Http/Controllers/Admin/UserController.php; add ImportUsersRequest in app/Http/Requests/Admin/ImportUsersRequest.php
- [x] T068 [US2] Frontend: add CSV import UI (file input, upload, parse feedback) in resources/js/pages/admin/users/index.tsx or dedicated import modal/component
- [x] T069 [US2] Add row checkboxes and multi-select state to user list in resources/js/pages/admin/users/index.tsx
- [x] T070 [US2] Backend: add bulk actions endpoint(s) (e.g. bulk delete, bulk assign role) in app/Http/Controllers/Admin/UserController.php; validate selected IDs and permissions
- [x] T071 [US2] Frontend: add multi-select actions toolbar (e.g. Delete selected, Assign role) and wire to bulk endpoints in resources/js/pages/admin/users/index.tsx
- [x] T072 [US2] Filter user index: hide users with super-admin role from list when current user is not super-admin in app/Http/Controllers/Admin/UserController.php index method
- [x] T073 [US2] User self-edit: allow user to update own name and other profile details via profile/settings; in admin user edit restrict role and email so only super-admin can change other users’ role and email; prevent any user (including super-admin) from changing own role and email in app/Http/Controllers/Admin/UserController.php and app/Http/Requests/Admin/UpdateUserRequest.php
- [x] T074 [US2] Add or ensure prominent "Create user" button on users index in resources/js/pages/admin/users/index.tsx (e.g. top-right with Add/Create user label)
- [x] T075 [US2] Add or update feature tests for CSV import, bulk actions, and super-admin visibility in tests/Feature/Admin/UserManagementTest.php

**Checkpoint**: Users index has CSV import, multi-select, bulk actions, filtered super-admin visibility, and Create user button; self-edit and role/email rules enforced.

---

## Phase 14: Form Layout – Centered and Consistent Width

**Goal**: Center all forms (admin and settings) with a consistent max-width for readability.

**Independent Test**: All form pages (roles Create/Edit, users create/edit, site settings, languages Create/Edit/Translations, etc.) use a centered container with consistent max-width (e.g. max-w-xl or max-w-2xl).

- [x] T076 [P] Apply centered form layout (e.g. container mx-auto max-w-2xl or max-w-xl) to admin form pages in resources/js/pages/admin/roles/Create.tsx, Edit.tsx, resources/js/pages/admin/users/create.tsx, edit.tsx
- [x] T077 [P] Apply centered form layout to settings form pages (site-settings, permissions, languages) in resources/js/pages/settings/ and resources/js/pages/admin/languages/ (Create, Edit, Translations)
- [x] T078 Ensure settings layout content area uses consistent max-width in resources/js/layouts/settings/layout.tsx (e.g. flex-1 md:max-w-2xl already present; verify and align with admin forms)

**Checkpoint**: All forms are centered with a consistent, readable width.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies – start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 – blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2 – no other story required.
- **Phase 4 (US2)**: Depends on Phase 2; uses roles from US1 for assignment – can follow US1.
- **Phase 5 (US3)**: Depends on Phase 2; uses User and activity log – can run after US2.
- **Phase 6 (US4)**: Depends on Phase 2; uses user count and activity – can run after US3.
- **Phase 7 (US5)**: Depends on Phase 2 – independent of US1–US4.
- **Phase 8 (US6)**: Depends on Phase 2; uses Language/Translation (existing) – independent.
- **Phase 9 (Polish)**: Depends on all implemented stories.
- **Phase 10 (Settings module)**: Depends on Phase 7 (US5); moves existing site settings and permissions into settings layout/routes.
- **Phase 11 (Footer nav)**: Depends on Phase 3–8 (existing admin nav); reorg only.
- **Phase 12 (Role edit UX)**: Depends on Phase 3 (US1); backend and frontend role edit changes.
- **Phase 13 (User enhancements)**: Depends on Phase 4 (US2); CSV import, bulk actions, visibility, self-edit.
- **Phase 14 (Form layout)**: Can run after Phase 10 (settings pages exist); affects all form pages.

### User Story Completion Order

- **US1 (P1)**: First – roles/permissions needed for admin gates and US2 role assignment.
- **US2 (P1)**: Second – user CRUD builds on US1 roles.
- **US3 (P2)**: After US2 – activity log references users.
- **US4 (P2)**: After US2/US3 – dashboard shows user count and recent activity.
- **US5 (P2)**: Can run in parallel with US3/US4 after Phase 2.
- **US6 (P3)**: Can run in parallel with US5 after Phase 2.

### Within Each User Story

- Feature tests before or alongside implementation (red-green-refactor).
- Models/migrations before services; services before controllers/pages.
- Scribe and CHANGELOG per story as specified.

### Parallel Opportunities

- Phase 1: T001 and T002 can run in parallel.
- Phase 2: T003 and T004 can run in parallel.
- US1: T005, T006 (tests) in parallel; T010 (Index page) parallel to backend tasks where no dependency.
- US5: T033, T034 (migration + model) in parallel; T031, T032 (tests) in parallel.
- US6: T042, T043 (tests) in parallel.
- Different stories (e.g. US5 and US6) can be worked in parallel by different developers after Phase 2.
- Phase 10: T055, T058 can run in parallel with T056, T057, T059 once structure is decided.
- Phase 12: T064 (grouping) and T066 (test) in parallel; T065 depends on T064.
- Phase 13: T067 (import backend) and T070 (bulk backend) in parallel; T069, T071 frontend after backend.
- Phase 14: T076 and T077 can run in parallel (admin vs settings form pages).

---

## Parallel Example: User Story 1

```text
# Tests in parallel:
T005: Feature test permission API in tests/Feature/Api/PermissionApiTest.php
T006: Feature test admin roles in tests/Feature/Admin/RoleManagementTest.php

# After controller exists, frontend in parallel:
T010: admin/roles/Index.tsx
T011: admin/roles/Create.tsx and Edit.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (US1): tests, RoleController, admin roles UI, permission check API, Scribe, CHANGELOG.
3. Stop and validate: run tests; manually create role, assign permissions, call /api/permissions/check.
4. Deploy or demo MVP.

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. US1 → test independently → deploy (MVP).
3. US2 → test independently → deploy.
4. US3, US4, US5, US6 in priority or parallel as capacity allows.
5. Polish (Phase 9) when all desired stories are done.
6. Refinements: Phase 10 (settings module) → Phase 11 (footer nav) → Phase 12 (role edit UX) → Phase 13 (user enhancements) → Phase 14 (form layout); Phases 10–12 and 14 can overlap with 13 if staffed in parallel.

### Parallel Team Strategy

- After Phase 2: Developer A (US1), Developer B (US2), then US3/US4; Developer C (US5, US6) in parallel with US3/US4.

---

## Notes

- [P] = different files, no blocking dependency.
- [USn] maps task to user story for traceability.
- Each user story is independently completable and testable.
- Run `php artisan test` (or filtered) after each story.
- Commit after each task or logical group; update CHANGELOG per story.
- **Phases 10–14** (T055–T078): Refinements from user input—settings/permissions in settings module, Languages/Activity Log in footer, role edit permissions UX (except super-admin), user CSV import and bulk actions, super-admin visibility, self-edit and role/email rules, Create user button, centered form layout.
