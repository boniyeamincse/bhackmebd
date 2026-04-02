# B-HackMe Missing Features Task List (Big Thinking)

This file lists high-impact missing features and next-stage tasks based on current codebase state.

## How to Use This List

- Priority scale: P0 (critical), P1 (important), P2 (growth), P3 (future).
- Mark each item complete when delivered and tested in staging.
- Target outcome: production-ready, secure, scalable learning platform.

---

## P0: Security and Production Readiness

- [ ] P0-01: Run full security audit (container escape tests, JWT tampering tests, API fuzzing, SSRF checks).
- [ ] P0-02: Add centralized audit logging for auth, admin actions, and task validation abuse.
- [ ] P0-03: Add brute-force lockout and suspicious login detection for auth endpoints.
- [ ] P0-04: Enforce stronger password policy (complexity + breached-password check).
- [ ] P0-05: Add forgot-password email delivery (SMTP provider integration) with signed reset links.
- [ ] P0-06: Add reset-token rate limiting by IP and email pair.
- [ ] P0-07: Add CSRF protection strategy for auth if cookie mode is introduced.
- [ ] P0-08: Add secrets scanning and dependency vulnerability checks in CI.
- [ ] P0-09: Fix and validate production compose file issues (duplicate nginx service block and config drift).
- [ ] P0-10: Complete production deployment playbook (DNS, SSL verification, backup/restore drill).

## P1: Reliability, Testing, and Observability

- [ ] P1-01: Add missing backend integration tests for terminal routes and chapter/lesson routes.
- [ ] P1-02: Add tests for new forgot/reset password flow (success, expired token, invalid token, replay token).
- [ ] P1-03: Add frontend e2e tests for login, learn flow, progress update, and password reset.
- [ ] P1-04: Add health checks for Redis, PostgreSQL, Docker socket, and queue workers.
- [ ] P1-05: Add metrics dashboard (request latency, error rate, socket session count, container count).
- [ ] P1-06: Add alerting rules for API 5xx spikes, Redis disconnects, DB pool saturation.
- [ ] P1-07: Implement structured trace IDs across API and WebSocket events.
- [ ] P1-08: Add dead-letter queue and retry visibility for timeout/cleanup jobs.
- [ ] P1-09: Add backup automation for PostgreSQL with restore test schedule.
- [ ] P1-10: Add log retention and PII-safe log masking policy.

## P1: Learning Engine and Content Quality

- [ ] P1-11: Expand beginner content to full standardized format for all labs (20 commands, 5 exercises, 5 MCQ each).
- [ ] P1-12: Add intermediate and advanced labs in the same standardized format.
- [ ] P1-13: Add content versioning so lesson updates do not break existing user progress.
- [ ] P1-14: Add prerequisite gating per lesson/chapter (must complete previous milestone).
- [ ] P1-15: Improve validator coverage for command correctness (more custom validators, context-aware checks).
- [ ] P1-16: Add anti-cheat logic for output copy/paste abuse and impossible completion times.
- [ ] P1-17: Add hint-penalty and retry scoring model (balanced progression).
- [ ] P1-18: Add chapter-end challenge task to verify practical competence.
- [ ] P1-19: Add bilingual content parity checks (English/Bangla sync and review workflow).
- [ ] P1-20: Add content QA checklist automation before publishing any new lesson.

## P2: User Experience and Product Features

- [ ] P2-01: Add email verification flow for new registrations.
- [ ] P2-02: Add profile security page (change password, active sessions, logout from all devices).
- [ ] P2-03: Add in-app notifications center (badge earned, level up, chapter unlocked).
- [ ] P2-04: Add resume-learning CTA on dashboard (continue from last incomplete task).
- [ ] P2-05: Add achievement timeline view with shareable progress card.
- [ ] P2-06: Add richer leaderboard filters (weekly, monthly, level-specific, country/campus).
- [ ] P2-07: Add accessibility pass (keyboard navigation, focus states, contrast checks).
- [ ] P2-08: Add offline-safe frontend error states and retry UX.
- [ ] P2-09: Add dark/light theme options while preserving hacker brand identity.
- [ ] P2-10: Add onboarding checklist for first-time users.

## P2: Admin and Content Operations

- [ ] P2-11: Add admin workflow states (draft, review, approved, published).
- [ ] P2-12: Add role separation (super-admin, content-editor, reviewer).
- [ ] P2-13: Add publish scheduling for chapters and lessons.
- [ ] P2-14: Add content diff/history UI for lesson revisions.
- [ ] P2-15: Add bulk import/export for chapter/lesson/task JSON files.
- [ ] P2-16: Add media and asset management for lesson illustrations.
- [ ] P2-17: Add moderation tools for reports/abuse handling.
- [ ] P2-18: Add operational dashboard for stuck user sessions and broken tasks.

## P3: Growth and Future Platform Expansion

- [ ] P3-01: Add team/classroom mode for instructors and institutions.
- [ ] P3-02: Add challenge events (time-limited CTF tournaments).
- [ ] P3-03: Add recommendation engine for next best lesson by user performance.
- [ ] P3-04: Add AI tutor assistant for contextual hints and explanation.
- [ ] P3-05: Add payment/subscription tiers with Bangladeshi gateways.
- [ ] P3-06: Add API partner mode for campus integrations.
- [ ] P3-07: Add mobile-focused terminal UX optimization.
- [ ] P3-08: Add multilingual support beyond Bangla/English.

---

## Suggested 3-Sprint Execution Plan

### Sprint 1 (Stability + Security)

- [ ] Deliver all P0 items.
- [ ] Add tests for forgot/reset password and core auth protections.
- [ ] Freeze release until audit baseline is green.

### Sprint 2 (Learning Quality + Test Coverage)

- [ ] Deliver P1 reliability items.
- [ ] Standardize all beginner labs to the new curriculum blueprint.
- [ ] Add validator and anti-cheat upgrades.

### Sprint 3 (Product Expansion)

- [ ] Deliver top P2 user and admin features.
- [ ] Ship leaderboard and profile improvements.
- [ ] Prepare roadmap announcement for P3 features.

---

## Definition of Done (Per Feature)

- [ ] Feature merged with tests.
- [ ] API and UI validated in staging.
- [ ] Security and performance checks passed.
- [ ] Docs and runbooks updated.
- [ ] Monitoring and alerts configured if required.
