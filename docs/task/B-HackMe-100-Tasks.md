# 🛡️ B-HackMe: 100-Task Development Plan
> **Bangladesh Hack & Learn Platform --- Full Project Build Plan**
> 10 Phases • 100 Tasks • ~55 Development Days • Version 1.0.0

---

## 📊 Progress Dashboard

**Overall Completion:** 
`[████████░░░░░░░░░░░░░]` **42%** (42/100 Tasks Completed)

| Phase | Description | Tasks | Est. Days | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Project Setup & Infrastructure | 12/12 | 6 days | ✅ Done |
| **Phase 2** | Database & Backend Foundation | 16/16 | 8 days | ✅ Done |
| **Phase 3** | Docker Terminal Engine | 14/14 | 7 days | ✅ Done |
| **Phase 4** | Learning Content API | 0/13 | 7 days | 🔲 Todo |
| **Phase 5** | Frontend Foundation | 0/13 | 7 days | 🔲 Todo |
| **Phase 6** | Terminal UI & Learn Page | 0/11 | 6 days | 🔲 Todo |
| **Phase 7** | Gamification & User Profile | 0/8 | 4 days | 🔲 Todo |
| **Phase 8** | Admin Panel | 0/7 | 4 days | 🔲 Todo |
| **Phase 9** | Content Seeding | 0/4 | 2 days | 🔲 Todo |
| **Phase 10** | QA, Security Audit & Launch | 0/2 | 1 day | 🔲 Todo |

---

## 🏗️ Phase 1: Project Setup & Infrastructure
- [x] **01** Initialize Git repository and define branching strategy (main/dev/feature) 🔴
- [x] **02** Create root `docker-compose.yml` with all service definitions 🔴
- [x] **03** Write base Dockerfiles for frontend, backend, and terminal containers 🔴
- [x] **04** Set up PostgreSQL 16 container with persistent volume and `init.sql` 🔴
- [x] **05** Set up Redis 7 container with `appendonly` persistence and memory limits 🔴
- [x] **06** Configure Nginx reverse proxy with upstream routing for API, WS, and frontend 🔴
- [x] **07** Create `.env.example` with all required environment variable keys documented 🟡
- [x] **08** Build Alpine Linux terminal base image with security hardening 🔴
- [x] **09** Configure isolated Docker bridge network (`terminal-net`, no internet access) 🔴
- [x] **10** Set up GitHub Actions CI pipeline (lint → test → build → push) 🟡
- [x] **11** Configure Certbot for automatic SSL/TLS with Nginx on production VPS 🟡
- [x] **12** Write `docker-compose.dev.yml` with hot-reload settings for local development 🟡

---

## 🗄️ Phase 2: Database & Backend Foundation
- [x] **13** Initialize Node.js/Express backend project with TypeScript/ESM config 🔴
- [x] **14** Set up Prisma ORM with PostgreSQL connection and initial schema file 🔴
- [x] **15** Write Prisma schema: `users`, `chapters`, `lessons`, `tasks` tables 🔴
- [x] **16** Write Prisma schema: `user_progress`, `user_sessions`, `badges` tables 🔴
- [x] **17** Run initial Prisma migration and verify schema in PostgreSQL 🔴
- [x] **18** Set up Redis client (`ioredis`) with connection pool and error handling 🟡
- [x] **19** Configure Winston logger with daily file rotation and console transport 🟡
- [x] **20** Implement global error handler middleware with proper HTTP status codes 🔴
- [x] **21** Set up Helmet.js, CORS, rate limiting (`express-rate-limit`) middleware 🔴
- [x] **22** Write Joi input validation schemas for all major API request bodies 🟡
- [x] **23** Implement JWT auth: access token (15m) + refresh token (7d) strategy 🔴
- [x] **24** Build `POST /api/auth/register` endpoint with bcrypt password hashing 🔴
- [x] **25** Build `POST /api/auth/login` with credential check and token issuance 🔴
- [x] **26** Build `POST /api/auth/refresh` and `POST /api/auth/logout` endpoints 🟡
- [x] **27** Build `GET /api/auth/me` endpoint with auth middleware guard 🟡
- [x] **28** Write unit tests for all auth endpoints using Jest + Supertest 🟡

---

## 🚀 Phase 3: Docker Terminal Engine
- [x] **29** Install and configure Dockerode for Docker API access from backend container 🔴
- [x] **30** Build `DockerService`: `getOrCreateContainer(userId)` function 🔴
- [x] **31** Build `DockerService`: `killContainer(containerId)` with cleanup logic 🔴
- [x] **32** Implement container pool: max 50 concurrent containers with queue 🔴
- [x] **33** Attach `node-pty` pseudo-terminal to running Docker container 🔴
- [x] **34** Build 1-hour idle timeout: auto-kill containers with BullMQ delayed jobs 🔴
- [x] **35** Store active container metadata in Redis (`userId` → `containerId`, IP, expiry) 🟡
- [x] **36** Implement `POST /api/terminal/start` and `GET /api/terminal/status` REST endpoints 🟡
- [x] **37** Implement `DELETE /api/terminal/stop` with graceful container shutdown 🟡
- [x] **38** Initialize Socket.io server on backend with JWT handshake authentication 🔴
- [x] **39** Implement `terminal:connect` handler: spawn/reuse container, attach pty 🔴
- [x] **40** Implement `terminal:input` handler: write keystrokes to pty process 🔴
- [x] **41** Implement `terminal:output` stream: pipe pty output to client via WebSocket 🔴
- [x] **42** Implement `terminal:resize` handler and `terminal:disconnect` cleanup 🟡

---

## 📚 Phase 4: Learning Content API
- [ ] **43** Build `GET /api/chapters` endpoint (list all published chapters, paginated) 🔴
- [ ] **44** Build `GET /api/chapters/:id` (single chapter with lesson list) 🔴
- [ ] **45** Build `GET /api/chapters/:id/lessons` (ordered lesson list for a chapter) 🔴
- [ ] **46** Build `GET /api/lessons/:id` (lesson with full markdown content + tasks) 🔴
- [ ] **47** Build task validation service: exact, contains, regex, custom modes 🔴
- [ ] **48** Build `POST /api/progress/validate`: check output, award XP, update DB 🔴
- [ ] **49** Build XP service: calculate level from total XP, trigger level-up events 🔴
- [ ] **50** Build badge service: check criteria after each task completion, unlock badges 🟡
- [ ] **51** Build `GET /api/progress` endpoint (full chapter/lesson/task progress map) 🟡
- [ ] **52** Build `GET /api/progress/stats` (XP, level, badge count, streak) 🟡
- [ ] **53** Build `GET /api/leaderboard` (top 50 users by XP with pagination) 🟢
- [ ] **54** Implement daily login streak tracking in Redis (key: `streak:{userId}`) 🟢
- [ ] **55** Write integration tests for progress and validation endpoints 🟡

---

## 🎨 Phase 5: Frontend Foundation
- [ ] **56** Initialize Next.js 14 project with TypeScript, Tailwind CSS, and ESLint 🔴
- [ ] **57** Configure Zustand global store (auth, progress, terminal state slices) 🔴
- [ ] **58** Build API client (axios/fetch wrapper) with JWT auto-attach and refresh logic 🔴
- [ ] **59** Build `useSocket` hook for Socket.io connection lifecycle management 🔴
- [ ] **60** Build Navbar component: logo, user XP badge, level indicator, logout 🟡
- [ ] **61** Build Sidebar component: chapter/lesson tree navigation with completion ticks 🟡
- [ ] **62** Build Landing page (`index.tsx`): hero, features, CTA, screenshot mockup 🟡
- [ ] **63** Build Login page with form validation and JWT token storage 🔴
- [ ] **64** Build Register page with username/email/password validation 🔴
- [ ] **65** Build Dashboard page: XP bar, level badge, recent chapters, stats cards 🟡
- [ ] **66** Build Chapter List page: cards with level filter, progress ring, lock states 🟡
- [ ] **67** Implement protected route HOC/middleware for authenticated pages 🔴
- [ ] **68** Set up React Query for server-state caching (chapters, lessons, progress) 🟡

---

## 💻 Phase 6: Terminal UI & Learn Page
- [ ] **69** Integrate `xterm.js` `TerminalEmulator` component with `FitAddon` and `WebLinksAddon` 🔴
- [ ] **70** Apply dark terminal theme (background: #0D1117, green foreground, JetBrains Mono font) 🟡
- [ ] **71** Wire `TerminalEmulator` to `useSocket`: input → socket, output → xterm write 🔴
- [ ] **72** Build `TerminalToolbar`: Reset, Clear screen, Copy output buttons 🟢
- [ ] **73** Build `InstructionPanel`: Markdown renderer with syntax-highlighted code blocks 🔴
- [ ] **74** Build `TaskCard`: task description, [Validate] button, attempt counter, hint toggle 🔴
- [ ] **75** Build split-panel layout (resizable left/right) for the main learn page 🔴
- [ ] **76** Implement task validation flow: capture buffer → call API → show result toast 🔴
- [ ] **77** Build XP toast notification and badge earned modal on success events 🟡
- [ ] **78** Build lesson progress bar and chapter navigation (prev/next) buttons 🟡
- [ ] **79** Implement auto-scroll to next task on completion with smooth animation 🟢

---

## 🏆 Phase 7: Gamification & User Profile
- [ ] **80** Build `XPBar` component: animated fill, level label, XP to next level display 🟡
- [ ] **81** Build `BadgeGallery` component: grid of earned/locked badges with tooltips 🟡
- [ ] **82** Build Leaderboard page: top 50 table with avatar, XP, level, rank badges 🟢
- [ ] **83** Build User Profile page: avatar upload, stats, completed chapters list 🟡
- [ ] **84** Implement 7-day streak calendar widget on dashboard 🟢
- [ ] **85** Seed 15 badge definitions into database with icons and criteria values 🟡
- [ ] **86** Build level-up animation overlay (full-screen confetti on level change) 🟢
- [ ] **87** Implement Socket.io `badge:earned` event handler → show modal in real-time 🟡

---

## 🛠️ Phase 8: Admin Panel
- [ ] **88** Build Admin Dashboard: user count, active containers, XP distributed, chart 🟡
- [ ] **89** Build Chapter Manager: create/edit/delete/reorder chapters with publish toggle 🔴
- [ ] **90** Build Lesson Editor: Markdown editor (CodeMirror/Monaco) with live preview 🔴
- [ ] **91** Build Task Builder: add tasks with validation rule tester (test output live) 🔴
- [ ] **92** Build User Manager: list users, view progress, ban/unban, force session kill 🟡
- [ ] **93** Build Container Monitor: live list of active containers with resource gauges 🟡
- [ ] **94** Implement admin-only route guards on both frontend and backend middleware 🔴

---

## 🌱 Phase 9: Content Seeding
- [ ] **95** Write seed script for 3 beginner chapters (15 lessons, 45 tasks) with content 🔴
- [ ] **96** Write Bangla title translations for all beginner chapter and lesson titles 🟡
- [ ] **97** Write 2 intermediate chapters (Permissions + Processes) with tasks and hints 🟡
- [ ] **98** Write 1 Hacker chapter: nmap scanning lab with 5 progressive CTF-style tasks 🟡

---

## 🛡️ Phase 10: QA, Security Audit & Launch
- [ ] **99** Full security audit: pentest container escape, API fuzzing, JWT tampering, rate limits 🔴
- [ ] **100** Production deployment: VPS setup, DNS, SSL, smoke test all features end-to-end 🔴

---

**B-HackMe --- Learn Linux. Think Like a Hacker. Built for Bangladesh.** 🇧🇩
