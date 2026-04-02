# B-HackMe Next-Level Testing Plan

This document defines the next testing level for B-HackMe based on the current codebase status.

## 1) Project Testing Snapshot (Current State)

- Backend test framework exists (Jest + Supertest).
- Existing backend endpoint tests are limited to auth and progress.
- Frontend has no automated tests yet.
- Terminal and websocket flow is a critical feature but currently has no automated regression suite.
- Forgot/reset password endpoints exist but do not yet have dedicated full-case tests.
- Lab content volume is growing; schema and curriculum rule validation is needed.

## 2) Next-Level Testing Goals

1. Prevent regressions on core user journey: auth -> chapters -> learn -> terminal -> progress.
2. Lock reliability for terminal session lifecycle and token refresh behavior.
3. Add curriculum quality gates for lab JSON files (20 commands, 5 exercises, 5 MCQ).
4. Add CI quality gates so broken features cannot be merged.
5. Build confidence for production rollout with security and performance smoke tests.

## 3) Test Architecture (Target)

### A. Backend Tests

- Unit tests:
  - Validator service rules (contains, regex, custom, mcq)
  - XP service level logic and progress write behavior
  - Docker service container lifecycle methods (mocked docker API)
  - Terminal service command routing and session handling (mocked pty)

- Integration/API tests (Supertest + mocked external dependencies where needed):
  - Auth:
    - register/login/refresh/logout/me
    - forgot-password (known email and unknown email behavior)
    - reset-password (valid token, invalid token, expired token, replay token)
  - Progress:
    - validate pass/fail, attempts, xp award
    - mapping fallback from task.lesson to chapter/lesson IDs
  - Chapter/Lesson routes:
    - chapter listing, chapter detail, lesson detail ordering and visibility
  - Terminal routes:
    - session create, exec command, cleanup

### B. Frontend Tests

- Component/integration tests (React Testing Library + Jest/Vitest):
  - auth store behavior
  - progress store mapping and percentage logic
  - chapters filtering (level and search)
  - terminal component status and error rendering

- End-to-end tests (Playwright preferred):
  - user login -> open chapter -> open lesson
  - run terminal command and verify output appears
  - complete one task and confirm progress update on chapters page
  - forgot-password and reset-password flow UI
  - admin login basic smoke (dashboard open)

### C. Content and Curriculum Validation Tests

- Add a lab JSON validation script that checks every chapter file for:
  - exactly 5 lessons in required structure (Learn, Command Part 1, Command Part 2, Exercises, MCQ)
  - exactly 20 command tasks total
  - exactly 5 exercise tasks
  - exactly 5 MCQ tasks
  - XP range between 50 and 100 at chapter level
  - required task fields present and valid

- Run this script in CI on each PR.

## 4) Critical Regression Suite (Must Pass)

1. Auth token lifecycle (access + refresh).
2. Socket reconnect after token expiry.
3. Terminal command execution as non-root learning user.
4. Progress write and chapters percentage display.
5. Lab completion XP and level update.
6. Forgot/reset password end-to-end success and failure cases.

## 5) Tooling and Setup Tasks

### Backend

- Keep using Jest + Supertest.
- Add test factories for users, chapters, lessons, tasks, progress.
- Add deterministic mocks for redis and docker interactions.

### Frontend

- Add testing packages:
  - @testing-library/react
  - @testing-library/jest-dom
  - @testing-library/user-event
  - vitest or jest
  - playwright

### CI

- Add pipeline stages:
  1) lint
  2) backend tests
  3) frontend tests
  4) e2e smoke
  5) lab JSON validation script

## 6) Coverage Targets (Practical)

- Backend lines: minimum 70% (core services and controllers prioritized).
- Frontend lines: minimum 50% initially, then 65% after stabilization.
- Critical paths listed in section 4 should target near 100% path coverage.

## 7) 3-Phase Rollout Plan

### Phase 1 (Fast Stabilization)

- Add missing auth forgot/reset tests.
- Add progress mapping regression tests.
- Add terminal API smoke tests.
- Add lab JSON validator script.

### Phase 2 (User Journey Confidence)

- Add frontend component tests for chapters/progress/terminal states.
- Add Playwright full user flow and forgot/reset UI flow.

### Phase 3 (Release Hardening)

- Add websocket reconnect and race-condition tests.
- Add security smoke tests (rate limit, auth abuse, token replay).
- Add performance smoke for terminal session startup and API response times.

## 8) Definition of Done for Next-Level Testing

- CI fails on any regression in critical suite.
- No production blocker in auth, terminal, progress, or chapter flow.
- Every new lab JSON passes curriculum validation checks.
- Testing docs are updated with run instructions for local and CI.

## 9) Suggested Immediate Task List (Next 7 Days)

1. Create backend tests for forgot/reset password edge cases.
2. Add regression test for progress fallback mapping.
3. Add minimal terminal route test suite.
4. Bootstrap frontend test runner and first chapters/progress tests.
5. Add Playwright smoke test for login -> chapter -> terminal command.
6. Add lab JSON validation script and wire it to CI.
