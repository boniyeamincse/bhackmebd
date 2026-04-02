# 🛡️ B-HackMe
> **The Ultimate "Hack & Learn" Platform for Bangladesh** 🇧🇩

[![Project Status](https://img.shields.io/badge/status-development-orange)](docs/task/B-HackMe-100-Tasks.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Commit Activity](https://img.shields.io/github/last-commit/boniyeamincse/bhackmebd)](https://github.com/boniyeamincse/bhackmebd)

B-HackMe is a gamified, interactive platform designed to teach Linux and cybersecurity to the next generation of Bangladeshi hackers. Built with a focus on real-world practical skills, it provides a safe, Docker-contained environment for users to experiment, learn, and compete.

---

## ✨ Key Features

- **🚀 Interactive Terminals**: Real-time terminal access within your browser, powered by Docker and `xterm.js`.
- **🎮 Gamified Learning**: Earn XP, level up, and unlock prestigious badges as you complete challenges.
- **📚 Curated Paths**: From Linux basics to advanced penetration testing, all structured for progressive learning.
- **🇧🇩 Built for Bangladesh**: Localized content and a community-focused leaderboard.
- **🛠️ Admin Dashboard**: Full control over content, user progress, and container resources.

---

## 🛠️ Tech Stack

### 📱 Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Real-time**: Socket.io Client

### ⚙️ Backend
- **Framework**: Node.js & Express
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Authentication**: JWT (Access + Refresh)

### 🏗️ Infrastructure & Engine
- **Orchestration**: Docker & Docker Compose
- **Terminal Engine**: Dockerode & `node-pty`
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions

---

## 🚀 Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Local Development
1. **Clone the repository**:
   ```bash
   git clone https://github.com/boniyeamincse/bhackmebd.git
   cd bhackmebd
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Spin up the development environment**:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

4. **Access the platform**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

---

## 🗺️ Roadmap & Tasks

The project follows a rigorous **100-Task Development Plan**. You can track our progress here:

👉 [**B-HackMe 100-Task Development Plan**](docs/task/B-HackMe-100-Tasks.md)

---

## 🤝 Contributing

We welcome contributions! Please follow our [Branching Strategy](docs/task/B-HackMe-100-Tasks.md#🏗️-phase-1-project-setup-&-infrastructure):
- `main`: Production-ready code.
- `dev`: Active development and integration.
- `feature/*`: New features and bug fixes.

---

**B-HackMe** --- *Learn Linux. Think Like a Hacker. Built for Bangladesh.* 🇧🇩
