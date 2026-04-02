# Contributing to B-HackMe

## Branching Strategy

This project follows **Git Flow** with three tiers of branches.

### Branch Types

| Branch | Pattern | Purpose |
|---|---|---|
| `main` | `main` | Production-ready code only. Protected — no direct pushes. |
| `dev` | `dev` | Integration branch. All features merge here first. |
| `feature/*` | `feature/<task-id>-<short-desc>` | Individual feature or task work. |
| `fix/*` | `fix/<issue-id>-<short-desc>` | Bug fixes. |
| `hotfix/*` | `hotfix/<short-desc>` | Emergency fixes directly to `main`. |
| `release/*` | `release/v<semver>` | Release preparation (version bumps, changelog). |

### Workflow

```
feature/01-git-setup
        │
        │  PR + code review
        ▼
       dev  ◄────────────────── all feature/* branches
        │
        │  PR + full test suite
        ▼
      main  ────► CI/CD ────► Production VPS
```

### Branch Naming Examples

```bash
# New feature (referenced by task ID)
git checkout -b feature/01-git-setup
git checkout -b feature/13-prisma-schema

# Bug fix
git checkout -b fix/42-terminal-reconnect

# Hotfix on production
git checkout -b hotfix/jwt-expiry
```

### Commit Message Format

Follow **Conventional Commits**:

```
<type>(<scope>): <short summary>

Types: feat | fix | chore | docs | refactor | test | ci | perf
```

**Examples:**
```
feat(auth): add JWT refresh token rotation
fix(terminal): handle pty resize race condition
chore(deps): upgrade Next.js to 14.2
ci(github): add lint step to CI pipeline
```

### Pull Request Rules

1. All PRs target `dev` (except hotfixes which target `main`)
2. At least 1 reviewer approval required
3. All CI checks must pass (lint + test + build)
4. PR title must follow Conventional Commits format
5. Squash merge into `dev`; merge commit into `main`

### Setting Up Locally

```bash
# Clone and set up branches
git clone https://github.com/yourname/b-hackme.git
cd b-hackme
git checkout -b dev origin/dev   # track remote dev
git checkout -b feature/my-task  # start your work
```
