# B-HackMe — Bangladesh Hack & Learn Platform
## Full Project Documentation

**Version:** 1.0.0
**Author:** Boni
**Date:** April 2026
**Type:** Full-Stack Cybersecurity Learning Platform

---

## Table of Contents

1. Project Overview
2. Objectives & Goals
3. Target Users
4. System Architecture
5. Technology Stack
6. Database Design
7. Docker Architecture & Containerization
8. Backend API Design (Node.js/Express)
9. WebSocket & Terminal Engine
10. Frontend Design (React/Next.js)
11. Module Breakdown
12. Security Design
13. Learning Content Structure
14. Task Validation System
15. Gamification System
16. Admin Panel
17. CI/CD & Deployment
18. Project Folder Structure
19. Environment Configuration
20. API Reference
21. Roadmap & Future Features

---

## 1. Project Overview

**B-HackMe** is a full-stack, containerized, interactive Linux learning and cybersecurity practice platform built specifically for Bangladeshi learners. It combines structured book-style instruction with a live, real-time Linux terminal — giving users hands-on command-line experience inside isolated Docker environments.

### Platform Philosophy

- **Learn by Doing** — Every concept is immediately practiced in a live terminal
- **Guided Progression** — Chapter-by-chapter, step-by-step learning flow
- **Cybersecurity First** — Linux skills are taught in the context of security
- **Bangladesh-Friendly** — Bangla UI support, local context, affordable pricing tiers

### Core Experience

```
📘 Instruction Panel (Left)    💻 Terminal Panel (Right)
┌─────────────────────────┐    ┌─────────────────────────┐
│ Chapter 3: File System  │    │ $ ls -la /etc           │
│                         │    │ total 156               │
│ Step 2: List hidden     │    │ drwxr-xr-x 2 root root  │
│ files using ls -la      │    │ -rw-r--r-- 1 root root  │
│                         │    │                         │
│ Try: ls -la /etc        │    │ ✅ Correct! +50 XP      │
└─────────────────────────┘    └─────────────────────────┘
```

---

## 2. Objectives & Goals

### Primary Objectives

- Provide complete A→Z Linux command-line education
- Build real-world skills applicable in: Cybersecurity, DevOps, System Administration
- Make the platform available and affordable for Bangladeshi students and professionals
- Simulate real attack/defense scenarios in a safe sandboxed environment

### Learning Goals by Level

| Level | Topics |
|---|---|
| Beginner | File system, navigation, basic commands |
| Intermediate | Permissions, processes, networking |
| Advanced | Scripting, system hardening, monitoring |
| Hacker | CTF challenges, exploit lab, red team tactics |

---

## 3. Target Users

- CSE and Diploma students
- Linux beginners
- Cybersecurity learners (SOC, Pentesting)
- DevOps engineers entering the field
- IT professionals upgrading their skills
- CTF (Capture The Flag) competitors

---

## 4. System Architecture

### High-Level Architecture

```
                        ┌──────────────────────────────────────┐
                        │            B-HackMe Platform          │
                        └──────────────────────────────────────┘
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              │                           │                           │
    ┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
    │   Frontend      │        │    Backend API  │        │  Admin Panel    │
    │  Next.js/React  │◄──────►│  Node.js/Express│◄──────►│  React Admin    │
    │  + xterm.js     │        │  REST + WS      │        │  Dashboard      │
    └─────────────────┘        └─────────────────┘        └─────────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
           ┌─────────────┐     ┌─────────────────┐    ┌─────────────────┐
           │  PostgreSQL  │     │  Docker Manager │    │   Redis Cache   │
           │  (Users/     │     │  Container Pool │    │  Sessions/Queue │
           │   Content)  │     │  Per-user Linux  │    └─────────────────┘
           └─────────────┘     └─────────────────┘
                                          │
                         ┌────────────────┴───────────────┐
                         │         Docker Containers       │
                         │  ┌──────┐ ┌──────┐ ┌──────┐   │
                         │  │User1 │ │User2 │ │User3 │   │
                         │  │Linux │ │Linux │ │Linux │   │
                         │  └──────┘ └──────┘ └──────┘   │
                         └─────────────────────────────────┘
```

### Request Flow

```
User Types Command
      │
      ▼
xterm.js (Frontend)
      │  WebSocket
      ▼
WebSocket Server (Backend)
      │
      ▼
Docker Manager
      │
      ▼
User's Isolated Container (Alpine Linux)
      │
      ▼
Command Output → WebSocket → xterm.js (Display)
      │
      ▼
Validator Service → XP/Badge Award
```

---

## 5. Technology Stack

### Frontend

| Technology | Purpose | Version |
|---|---|---|
| Next.js | React framework with SSR | 14.x |
| React | UI components | 18.x |
| Tailwind CSS | Styling | 3.x |
| xterm.js | Terminal emulator in browser | 5.x |
| Socket.io-client | WebSocket client | 4.x |
| Zustand | State management | 4.x |
| React Query | Data fetching/caching | 5.x |
| Framer Motion | Animations | 11.x |

### Backend

| Technology | Purpose | Version |
|---|---|---|
| Node.js | Runtime | 20.x LTS |
| Express.js | REST API | 4.x |
| Socket.io | WebSocket server | 4.x |
| Dockerode | Docker API client | 4.x |
| node-pty | Pseudo-terminal | 1.x |
| Passport.js | Auth middleware | 0.7.x |
| JWT | Token auth | 9.x |
| Joi | Input validation | 17.x |
| Winston | Logging | 3.x |
| Bull/BullMQ | Job queues | 4.x |

### Database

| Technology | Purpose | Version |
|---|---|---|
| PostgreSQL | Main database | 16.x |
| Redis | Sessions, caching, queues | 7.x |
| Prisma ORM | Database access layer | 5.x |

### DevOps & Infrastructure

| Technology | Purpose |
|---|---|
| Docker | Container engine |
| Docker Compose | Multi-service orchestration |
| Nginx | Reverse proxy |
| Certbot | SSL/TLS certificates |
| GitHub Actions | CI/CD pipeline |

---

## 6. Database Design

### Schema Overview (PostgreSQL)

#### users
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(150),
  avatar_url    VARCHAR(500),
  role          ENUM('student', 'admin', 'instructor') DEFAULT 'student',
  level         ENUM('beginner','intermediate','advanced','hacker') DEFAULT 'beginner',
  total_xp      INTEGER DEFAULT 0,
  badges        TEXT[] DEFAULT '{}',
  is_active     BOOLEAN DEFAULT true,
  last_login    TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);
```

#### chapters
```sql
CREATE TABLE chapters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(255) NOT NULL,
  title_bn      VARCHAR(255),  -- Bangla title
  description   TEXT,
  level         ENUM('beginner','intermediate','advanced','hacker'),
  order_index   INTEGER,
  is_published  BOOLEAN DEFAULT false,
  thumbnail_url VARCHAR(500),
  xp_reward     INTEGER DEFAULT 100,
  created_at    TIMESTAMP DEFAULT NOW()
);
```

#### lessons
```sql
CREATE TABLE lessons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id    UUID REFERENCES chapters(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  title_bn      VARCHAR(255),
  content_md    TEXT NOT NULL,  -- Markdown instruction content
  order_index   INTEGER,
  xp_reward     INTEGER DEFAULT 50,
  is_published  BOOLEAN DEFAULT false,
  created_at    TIMESTAMP DEFAULT NOW()
);
```

#### tasks
```sql
CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id       UUID REFERENCES lessons(id) ON DELETE CASCADE,
  description     TEXT NOT NULL,
  expected_output TEXT,
  validation_type ENUM('exact','contains','regex','custom') DEFAULT 'contains',
  validation_rule TEXT,  -- regex or custom function name
  hint            TEXT,
  xp_reward       INTEGER DEFAULT 25,
  order_index     INTEGER
);
```

#### user_progress
```sql
CREATE TABLE user_progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  chapter_id    UUID REFERENCES chapters(id),
  lesson_id     UUID REFERENCES lessons(id),
  task_id       UUID REFERENCES tasks(id),
  status        ENUM('not_started','in_progress','completed') DEFAULT 'not_started',
  attempts      INTEGER DEFAULT 0,
  completed_at  TIMESTAMP,
  xp_earned     INTEGER DEFAULT 0,
  UNIQUE(user_id, task_id)
);
```

#### user_sessions
```sql
CREATE TABLE user_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  container_id    VARCHAR(255),
  container_ip    VARCHAR(50),
  started_at      TIMESTAMP DEFAULT NOW(),
  last_active     TIMESTAMP DEFAULT NOW(),
  expires_at      TIMESTAMP,
  is_active       BOOLEAN DEFAULT true
);
```

#### badges
```sql
CREATE TABLE badges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) UNIQUE NOT NULL,
  description   TEXT,
  icon_url      VARCHAR(500),
  criteria_type VARCHAR(50),  -- xp_milestone, lesson_count, etc.
  criteria_value INTEGER
);
```

### Entity Relationship Summary

```
users ──< user_progress >── tasks ──< lessons >── chapters
users ──< user_sessions
users ──< user_badges >── badges
```

---

## 7. Docker Architecture & Containerization

### Full Docker Composition

The entire platform runs in Docker. Every service is containerized including the database, backend, frontend, Redis, Nginx, and individual user terminal containers.

### docker-compose.yml

```yaml
version: '3.9'

networks:
  bhackme-net:
    driver: bridge
  terminal-net:
    driver: bridge
    internal: true  # No internet for user containers

volumes:
  postgres-data:
  redis-data:
  nginx-certs:
  uploads:

services:

  # ── Nginx Reverse Proxy ──────────────────────────────
  nginx:
    image: nginx:alpine
    container_name: bhackme-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - nginx-certs:/etc/letsencrypt
    depends_on:
      - frontend
      - backend
    networks:
      - bhackme-net
    restart: always

  # ── Frontend (Next.js) ───────────────────────────────
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: bhackme-frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000
      - NEXT_PUBLIC_WS_URL=ws://backend:4000
    networks:
      - bhackme-net
    restart: unless-stopped

  # ── Backend (Node.js) ────────────────────────────────
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: bhackme-backend
    environment:
      - DATABASE_URL=postgresql://bhackme:secret@postgres:5432/bhackme
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - DOCKER_SOCKET=/var/run/docker.sock
      - USER_CONTAINER_IMAGE=bhackme/terminal:latest
      - MAX_CONTAINERS=50
      - CONTAINER_TIMEOUT=3600  # 1 hour session
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    depends_on:
      - postgres
      - redis
    networks:
      - bhackme-net
    restart: unless-stopped

  # ── PostgreSQL ────────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    container_name: bhackme-postgres
    environment:
      - POSTGRES_DB=bhackme
      - POSTGRES_USER=bhackme
      - POSTGRES_PASSWORD=secret
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - bhackme-net
    restart: always

  # ── Redis ─────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: bhackme-redis
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data
    networks:
      - bhackme-net
    restart: always

  # ── User Terminal Container Image (Build only) ────────
  terminal-base:
    build:
      context: ./labs/terminal-base
      dockerfile: Dockerfile
    image: bhackme/terminal:latest
    profiles:
      - build-only
```

### User Terminal Container (labs/terminal-base/Dockerfile)

```dockerfile
FROM alpine:3.19

# Install Linux tools
RUN apk add --no-cache \
    bash curl wget git vim nano \
    net-tools nmap netcat-openbsd \
    python3 py3-pip \
    openssh-client \
    htop tree file \
    grep sed awk \
    tcpdump traceroute \
    binutils strace

# Create non-root user
RUN addgroup -S hacker && adduser -S hacker -G hacker
USER hacker
WORKDIR /home/hacker

# Set shell
SHELL ["/bin/bash", "-c"]
CMD ["/bin/bash"]
```

### Container Lifecycle Management

```
User Login
    │
    ▼
Check existing active container in Redis
    │
    ├──► Container exists → Reconnect
    │
    └──► No container → Spawn new container
              │
              ▼
         docker run --rm \
           --name bhackme-user-{userId} \
           --network terminal-net \
           --memory 128m \
           --cpus 0.5 \
           --pids-limit 50 \
           --read-only \
           --tmpfs /tmp:size=50m \
           --security-opt no-new-privileges \
           bhackme/terminal:latest
              │
              ▼
         Attach node-pty → WebSocket → xterm.js
              │
              ▼
         Set expiry timer (1hr inactivity → kill)
```

---

## 8. Backend API Design

### Project Structure

```
backend/
├── src/
│   ├── index.js               # Entry point
│   ├── app.js                 # Express setup
│   ├── config/
│   │   ├── database.js        # Prisma client
│   │   ├── redis.js           # Redis client
│   │   └── docker.js          # Dockerode setup
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── chapter.routes.js
│   │   │   ├── lesson.routes.js
│   │   │   ├── terminal.routes.js
│   │   │   ├── progress.routes.js
│   │   │   └── admin.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── chapter.controller.js
│   │   │   ├── terminal.controller.js
│   │   │   ├── progress.controller.js
│   │   │   └── admin.controller.js
│   │   └── middleware/
│   │       ├── auth.middleware.js
│   │       ├── validate.middleware.js
│   │       ├── rateLimit.middleware.js
│   │       └── error.middleware.js
│   ├── services/
│   │   ├── docker.service.js  # Container management
│   │   ├── terminal.service.js
│   │   ├── validator.service.js
│   │   ├── xp.service.js
│   │   └── badge.service.js
│   ├── websocket/
│   │   ├── server.js          # Socket.io server
│   │   └── handlers/
│   │       ├── terminal.handler.js
│   │       └── progress.handler.js
│   └── utils/
│       ├── logger.js
│       ├── errors.js
│       └── helpers.js
├── prisma/
│   └── schema.prisma
├── Dockerfile
└── package.json
```

### REST API Endpoints

#### Auth Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | Login, returns JWT |
| POST | /api/auth/logout | Invalidate token |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/refresh | Refresh JWT token |

#### Chapter/Lesson Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/chapters | List all chapters |
| GET | /api/chapters/:id | Get single chapter |
| GET | /api/chapters/:id/lessons | Lessons in chapter |
| GET | /api/lessons/:id | Get lesson + tasks |

#### Terminal Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/terminal/start | Spawn user container |
| DELETE | /api/terminal/stop | Kill user container |
| GET | /api/terminal/status | Container status |

#### Progress Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/progress | Full user progress |
| POST | /api/progress/validate | Submit task answer |
| GET | /api/progress/stats | XP and badges |
| GET | /api/leaderboard | Top 50 users |

#### Admin Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/admin/chapters | Create chapter |
| PUT | /api/admin/chapters/:id | Update chapter |
| DELETE | /api/admin/chapters/:id | Delete chapter |
| POST | /api/admin/lessons | Create lesson |
| PUT | /api/admin/lessons/:id | Update lesson |
| GET | /api/admin/users | List all users |
| GET | /api/admin/system | System stats |

---

## 9. WebSocket & Terminal Engine

### Socket.io Events

#### Client → Server

| Event | Payload | Description |
|---|---|---|
| terminal:connect | { lessonId } | Request terminal connection |
| terminal:input | { data: string } | Send keystroke to container |
| terminal:resize | { cols, rows } | Resize terminal |
| terminal:disconnect | {} | Close session |
| task:validate | { taskId, output } | Validate task result |

#### Server → Client

| Event | Payload | Description |
|---|---|---|
| terminal:ready | { containerId } | Container is ready |
| terminal:output | { data: string } | Terminal output chunk |
| terminal:error | { message } | Error message |
| task:result | { success, xp, message } | Validation result |
| badge:earned | { badge } | New badge awarded |

### Terminal Handler Logic

```javascript
// websocket/handlers/terminal.handler.js

io.on('connection', (socket) => {
  let ptyProcess = null;
  let containerId = null;

  socket.on('terminal:connect', async ({ lessonId }) => {
    const userId = socket.user.id;

    // 1. Get or create Docker container
    const container = await DockerService.getOrCreateContainer(userId);
    containerId = container.id;

    // 2. Attach pseudo-terminal (node-pty)
    ptyProcess = pty.spawn('docker', [
      'exec', '-it', containerId, '/bin/bash'
    ], { cols: 80, rows: 24 });

    // 3. Stream output → client
    ptyProcess.on('data', (data) => {
      socket.emit('terminal:output', { data });

      // 4. Buffer for task validation
      OutputBuffer.append(userId, data);
    });

    socket.emit('terminal:ready', { containerId });
  });

  socket.on('terminal:input', ({ data }) => {
    ptyProcess?.write(data);
  });

  socket.on('terminal:resize', ({ cols, rows }) => {
    ptyProcess?.resize(cols, rows);
  });

  socket.on('disconnect', async () => {
    await DockerService.updateLastActive(userId);
  });
});
```

---

## 10. Frontend Design (Next.js/React)

### Page Structure

```
pages/
├── index.tsx           # Landing page
├── login.tsx
├── register.tsx
├── dashboard.tsx       # User dashboard
├── learn/
│   ├── index.tsx       # Chapter list
│   ├── [chapterId]/
│   │   └── [lessonId].tsx  # Main learn page
└── admin/
    ├── index.tsx
    ├── chapters.tsx
    └── users.tsx
```

### Main Learning Page Layout

```
┌──────────────────────────────────────────────────────────────┐
│  B-HackMe  [Chapter 1 > Lesson 2]          XP: 350  Level: 3│
├──────────────────────────┬───────────────────────────────────┤
│                          │                                   │
│  📘 INSTRUCTION PANEL    │      💻 TERMINAL PANEL            │
│                          │                                   │
│  Chapter 1: Linux Basics │  ┌─────────────────────────────┐  │
│  Lesson 2: File System   │  │$ _                          │  │
│  ──────────────────────  │  │                             │  │
│  In Linux, everything    │  │                             │  │
│  is a file. The root     │  │                             │  │
│  directory is /          │  │                             │  │
│                          │  │                             │  │
│  Try these commands:     │  └─────────────────────────────┘  │
│  ┌──────────────────┐    │                                   │
│  │ ls /             │    │  ─────── Current Task ───────     │
│  │ cd /home         │    │  List all files in /etc           │
│  │ pwd              │    │  Command: ls /etc                 │
│  └──────────────────┘    │                                   │
│                          │  [✅ Validate] [💡 Hint]          │
│  ──── Task 2/5 ────      │                                   │
│  ▓▓▓▓▓░░░░░ 40%         │  ✅ Correct! +25 XP Earned!       │
│                          │                                   │
├──────────────────────────┴───────────────────────────────────┤
│  [← Prev Lesson]                          [Next Lesson →]   │
└──────────────────────────────────────────────────────────────┘
```

### Key Components

```
components/
├── layout/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
├── learn/
│   ├── InstructionPanel.tsx   # Left panel: markdown renderer
│   ├── TerminalPanel.tsx      # Right panel: xterm.js wrapper
│   ├── TaskCard.tsx           # Current task display
│   ├── ProgressBar.tsx
│   └── ChapterNav.tsx
├── gamification/
│   ├── XPBar.tsx
│   ├── BadgeDisplay.tsx
│   ├── LevelBadge.tsx
│   └── Leaderboard.tsx
├── terminal/
│   ├── TerminalEmulator.tsx   # xterm.js integration
│   └── TerminalToolbar.tsx
└── ui/
    ├── Button.tsx
    ├── Modal.tsx
    ├── CodeBlock.tsx
    └── Alert.tsx
```

### xterm.js Terminal Component

```typescript
// components/terminal/TerminalEmulator.tsx
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { useSocket } from '@/hooks/useSocket';

const TerminalEmulator = () => {
  const termRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    const term = new Terminal({
      theme: {
        background: '#0d1117',
        foreground: '#58d68d',
        cursor: '#58d68d',
      },
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 14,
      cursorBlink: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(termRef.current!);
    fitAddon.fit();
    terminal.current = term;

    // Send input to backend
    term.onData((data) => {
      socket.emit('terminal:input', { data });
    });

    // Receive output from backend
    socket.on('terminal:output', ({ data }) => {
      term.write(data);
    });

    socket.emit('terminal:connect', { lessonId: currentLessonId });

    return () => { term.dispose(); };
  }, []);

  return <div ref={termRef} className="h-full w-full" />;
};
```

---

## 11. Module Breakdown

### Module 1 — User Module

**Responsibilities:**
- Registration with email verification
- JWT-based authentication
- Profile management (avatar, display name)
- Password reset flow
- OAuth (Google) — future

**Key Files:**
- `backend/src/api/controllers/auth.controller.js`
- `backend/src/api/middleware/auth.middleware.js`
- `frontend/pages/login.tsx`, `register.tsx`

### Module 2 — Learning Module

**Responsibilities:**
- Chapter and lesson CRUD (admin)
- Markdown content rendering (student)
- Code block syntax highlighting
- Bangla language toggle
- Lesson navigation

**Content Types:**
- Markdown text with code blocks
- Inline command references
- Embedded hints
- Visual diagrams (ASCII)

### Module 3 — Terminal Module

**Responsibilities:**
- Docker container lifecycle (spawn, reuse, kill)
- WebSocket bidirectional terminal stream
- node-pty pseudo-terminal management
- Terminal resize handling
- Auto-session timeout

### Module 4 — Validation Module

**Responsibilities:**
- Capture terminal output buffer
- Compare against expected output rules
- Support 4 validation modes:
  - **exact** — exact string match
  - **contains** — output contains substring
  - **regex** — regex pattern match
  - **custom** — custom JS validation function
- Award XP on success
- Track attempts

### Module 5 — Gamification Module

**Responsibilities:**
- XP point tracking and leveling
- Badge unlock logic
- Leaderboard (top 50)
- Level progression gates

### Module 6 — Admin Panel

**Responsibilities:**
- Chapter/Lesson/Task CRUD
- User management
- Container monitoring
- System health stats
- Content publishing control

---

## 12. Security Design

### Container Isolation

Every user gets their own ephemeral Docker container:

```
docker run \
  --rm \                              # Auto-remove on exit
  --name bhackme-user-{userId} \
  --network terminal-net \            # Isolated internal network
  --memory="128m" \                   # RAM limit
  --memory-swap="128m" \             # No swap
  --cpus="0.5" \                     # CPU limit
  --pids-limit=50 \                  # Process limit
  --ulimit nofile=256:256 \          # File descriptor limit
  --read-only \                       # Read-only root filesystem
  --tmpfs /tmp:size=50m,noexec \     # Writable tmp only
  --tmpfs /home/hacker:size=100m \   # User home
  --security-opt no-new-privileges \  # No privilege escalation
  --cap-drop ALL \                    # Drop all capabilities
  --cap-add NET_RAW \                 # Only needed capabilities
  bhackme/terminal:latest
```

### Backend Security

- JWT access tokens (15 min) + refresh tokens (7 days)
- Rate limiting: 100 requests/minute per IP
- Helmet.js for HTTP security headers
- Input sanitization with Joi
- SQL injection prevention via Prisma parameterized queries
- CORS restricted to allowed origins
- Command injection prevention (no shell passthrough)

### Network Security

```
Internet → Nginx (443) → Frontend / Backend
                              │
                        terminal-net (internal, no internet)
                              │
                        User Containers
```

User containers have no internet access — all learning happens offline inside the container.

### Session Security

- Containers auto-destroy after 1 hour of inactivity
- Max 1 active container per user
- Admin can force-kill any container
- All container actions logged

---

## 13. Learning Content Structure

### Content Organization

```
Linux Curriculum
├── Module 1: Getting Started (Beginner)
│   ├── Chapter 1: Introduction to Linux
│   │   ├── Lesson 1.1: What is Linux?
│   │   ├── Lesson 1.2: The Terminal
│   │   └── Lesson 1.3: Your First Commands
│   ├── Chapter 2: File System
│   │   ├── Lesson 2.1: Directory Navigation
│   │   ├── Lesson 2.2: Files and Directories
│   │   └── Lesson 2.3: File Operations
│   └── Chapter 3: Text & Editors
│       ├── Lesson 3.1: Reading Files
│       ├── Lesson 3.2: Vim Basics
│       └── Lesson 3.3: Nano Basics
│
├── Module 2: System Skills (Intermediate)
│   ├── Chapter 4: Users & Permissions
│   ├── Chapter 5: Processes
│   ├── Chapter 6: Networking
│   └── Chapter 7: Shell Scripting
│
├── Module 3: Advanced Linux (Advanced)
│   ├── Chapter 8: System Administration
│   ├── Chapter 9: Services & Daemons
│   ├── Chapter 10: Log Analysis
│   └── Chapter 11: Cron & Automation
│
└── Module 4: Security & Hacking (Hacker)
    ├── Chapter 12: Security Fundamentals
    ├── Chapter 13: Network Scanning (nmap)
    ├── Chapter 14: Privilege Escalation
    ├── Chapter 15: Log Forensics
    └── Chapter 16: CTF Challenges
```

### Lesson Content Format (Markdown)

```markdown
## Lesson 2.1: Directory Navigation

In Linux, the file system starts from a single root directory `/`.

### Key Commands

| Command | Description |
|---------|-------------|
| `pwd`   | Print current directory |
| `ls`    | List directory contents |
| `cd`    | Change directory |

### Examples

```bash
# See where you are
pwd

# List files
ls -la

# Navigate to home
cd ~
```

### Your Task

Navigate to the `/etc` directory and list all files.

**Expected:** You should see output containing `passwd` and `hostname`.
```

---

## 14. Task Validation System

### Validation Flow

```
User runs command in terminal
           │
           ▼
Output captured in buffer (last 1000 chars)
           │
           ▼
User clicks [Validate] or auto-triggers
           │
           ▼
POST /api/progress/validate
{ taskId, output: buffer }
           │
           ▼
ValidatorService.check(task, output)
           │
    ┌──────┴──────┐
    │  Rules:     │
    │  exact      │
    │  contains   │
    │  regex      │
    │  custom     │
    └──────┬──────┘
           │
    ┌──────┴──────┐
    │  Pass ✅    │  → Award XP → Update progress → Emit badge check
    │  Fail ❌    │  → Increment attempts → Return hint
    └─────────────┘
```

### Validation Service

```javascript
// services/validator.service.js

const validate = (task, output) => {
  const { validation_type, validation_rule, expected_output } = task;

  switch (validation_type) {
    case 'exact':
      return output.trim() === expected_output.trim();

    case 'contains':
      return output.includes(expected_output);

    case 'regex':
      return new RegExp(validation_rule).test(output);

    case 'custom':
      const fn = customValidators[validation_rule];
      return fn ? fn(output) : false;

    default:
      return false;
  }
};

// Custom validators
const customValidators = {
  file_created: (output) => output.includes('test.txt'),
  permission_700: (output) => /rwx------/.test(output),
  process_running: (output) => output.includes('RUNNING'),
};
```

---

## 15. Gamification System

### XP & Levels

| Level | XP Range | Label | Perks |
|---|---|---|---|
| 1 | 0–499 | 🐣 Beginner | Basic labs |
| 2 | 500–1499 | ⚙️ Intermediate | Network labs |
| 3 | 1500–3499 | 🖥️ Advanced | Admin labs |
| 4 | 3500+ | 🔐 Hacker | CTF access |

### XP Rewards

| Action | XP |
|---|---|
| Complete a task | +25 |
| Complete a lesson | +50 |
| Complete a chapter | +100 |
| First attempt success | +10 bonus |
| Daily login streak | +20 |

### Badges

| Badge | Criteria |
|---|---|
| 🐣 First Step | Complete first lesson |
| 🔥 Streak 7 | 7-day login streak |
| 💻 Terminal Pro | 100 commands executed |
| 🗝️ Key Hunter | First CTF flag captured |
| 🌟 1000 XP | Reach 1000 XP |
| 🏆 Hacker Level | Reach Hacker level |
| ⚡ Speed Demon | Complete lesson in under 5 min |

---

## 16. Admin Panel

### Dashboard Features

- Total users, active sessions, containers running
- New registrations (daily chart)
- Top 10 active users
- System resource usage (CPU/RAM)

### Content Management

- Create/edit/publish chapters and lessons (rich Markdown editor)
- Drag-and-drop reordering
- Preview before publish
- Task builder with validation rule tester

### User Management

- View all users with XP/level/progress
- Force logout / kill session
- Ban/unban users
- View activity logs

### System Monitor

- Active Docker containers list
- Container age and resource usage
- Force-kill individual containers
- Server health (CPU, RAM, Disk)

---

## 17. CI/CD & Deployment

### GitHub Actions Pipeline

```yaml
# .github/workflows/deploy.yml

name: Deploy B-HackMe

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run backend tests
        run: |
          cd backend
          npm ci
          npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker images
        run: |
          docker build -t bhackme/frontend ./frontend
          docker build -t bhackme/backend ./backend
          docker build -t bhackme/terminal ./labs/terminal-base
      - name: Push to registry
        run: |
          docker push bhackme/frontend
          docker push bhackme/backend
          docker push bhackme/terminal

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/b-hackme
            git pull origin main
            docker compose pull
            docker compose up -d --no-deps
```

### Production Nginx Config

```nginx
# nginx/nginx.conf

server {
    listen 443 ssl;
    server_name bhackme.com;

    ssl_certificate /etc/letsencrypt/live/bhackme.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bhackme.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend:4000;
        proxy_set_header Host $host;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://backend:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600;
    }
}
```

---

## 18. Full Project Folder Structure

```
b-hackme/
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── nginx/
│   └── nginx.conf
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── public/
│   │   ├── logo.svg
│   │   └── badges/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── dashboard.tsx
│   │   │   └── learn/
│   │   │       └── [chapterId]/
│   │   │           └── [lessonId].tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── learn/
│   │   │   ├── terminal/
│   │   │   ├── gamification/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   │   ├── useSocket.ts
│   │   │   ├── useTerminal.ts
│   │   │   └── useAuth.ts
│   │   ├── store/
│   │   │   ├── auth.store.ts
│   │   │   └── progress.store.ts
│   │   ├── lib/
│   │   │   └── api.ts
│   │   └── styles/
│   │       └── globals.css
│   └── tsconfig.json
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── index.js
│   │   ├── app.js
│   │   ├── config/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   └── middleware/
│   │   ├── services/
│   │   │   ├── docker.service.js
│   │   │   ├── terminal.service.js
│   │   │   ├── validator.service.js
│   │   │   ├── xp.service.js
│   │   │   └── badge.service.js
│   │   ├── websocket/
│   │   │   └── handlers/
│   │   └── utils/
│   └── prisma/
│       └── schema.prisma
│
├── database/
│   └── init.sql
│
└── labs/
    ├── terminal-base/
    │   └── Dockerfile
    ├── beginner/
    │   ├── chapter-01.json
    │   └── chapter-02.json
    ├── intermediate/
    └── advanced/
```

---

## 19. Environment Configuration

### .env.example

```env
# App
NODE_ENV=production
APP_NAME=B-HackMe
APP_URL=https://bhackme.com
PORT=4000

# Database
DATABASE_URL=postgresql://bhackme:strongpassword@postgres:5432/bhackme

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your-256-bit-secret-here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=another-256-bit-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Docker
DOCKER_SOCKET=/var/run/docker.sock
USER_CONTAINER_IMAGE=bhackme/terminal:latest
MAX_CONCURRENT_CONTAINERS=50
CONTAINER_IDLE_TIMEOUT=3600
CONTAINER_MEMORY_LIMIT=128m
CONTAINER_CPU_LIMIT=0.5

# Frontend
NEXT_PUBLIC_API_URL=https://bhackme.com/api
NEXT_PUBLIC_WS_URL=wss://bhackme.com
```

---

## 20. API Reference

### Authentication

**POST /api/auth/register**
```json
Request: { "username": "boni99", "email": "boni@email.com", "password": "Pass@123" }
Response: { "user": { "id": "uuid", "username": "boni99" }, "token": "jwt..." }
```

**POST /api/auth/login**
```json
Request: { "email": "boni@email.com", "password": "Pass@123" }
Response: { "accessToken": "jwt...", "refreshToken": "jwt...", "user": {...} }
```

### Progress Validation

**POST /api/progress/validate**
```json
Request: { "taskId": "uuid", "output": "passwd hostname shadow" }
Response (pass): { "success": true, "xp": 25, "message": "Correct! +25 XP", "nextTask": {...} }
Response (fail): { "success": false, "attempts": 2, "hint": "Try ls /etc first" }
```

### Terminal

**POST /api/terminal/start**
```json
Response: { "containerId": "abc123", "wsToken": "signed-ws-token" }
```

---

## 21. Roadmap & Future Features

### Phase 1 — MVP (Month 1–3)

- User auth, profile, dashboard
- 3 beginner chapters (15 lessons)
- Real Docker terminal
- Basic XP + badges
- Admin panel v1

### Phase 2 — Growth (Month 4–6)

- Full curriculum (30+ chapters)
- CTF mode with scoreboard
- Bangla UI toggle
- Email notifications
- Mobile responsive design

### Phase 3 — Advanced (Month 7–12)

- AI Hint System (GPT-4o integration)
- Multiplayer lab rooms
- Real-world attack simulation labs
- Instructor accounts (create custom labs)
- Certificate generation on completion

### Phase 4 — Scale

- Flutter mobile app
- Corporate training packages
- University partnerships (Bangladesh)
- Community CTF events
- Public lab hosting API

---

## Appendix: Quick Start (Development)

```bash
# 1. Clone the repository
git clone https://github.com/yourname/b-hackme.git
cd b-hackme

# 2. Copy environment file
cp .env.example .env
# Edit .env with your values

# 3. Build the terminal base image
docker build -t bhackme/terminal:latest ./labs/terminal-base/

# 4. Start all services
docker compose -f docker-compose.dev.yml up --build

# 5. Run database migrations
docker exec bhackme-backend npx prisma migrate dev

# 6. Seed initial content
docker exec bhackme-backend npm run seed

# 7. Access the platform
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
# Admin: http://localhost:3000/admin
```

---

*B-HackMe — Learn Linux. Think Like a Hacker. Built for Bangladesh.*

**Document Version:** 1.0.0 | **Last Updated:** April 2026
