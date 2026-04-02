#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# B-HackMe — Git branch setup
# Run once after cloning to configure the standard branch layout.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

info()    { echo -e "\033[1;36m[INFO]\033[0m  $*"; }
success() { echo -e "\033[1;32m[OK]\033[0m    $*"; }

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# ── Ensure we're on main ──────────────────────────────────────────────────────
CURRENT=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT" != "main" ]; then
    info "Switching to main branch..."
    git checkout main
fi

# ── Create dev branch if it doesn't exist ────────────────────────────────────
if git show-ref --quiet refs/heads/dev; then
    info "Branch 'dev' already exists."
else
    info "Creating 'dev' branch from main..."
    git checkout -b dev
    git checkout main
    success "Branch 'dev' created."
fi

# ── Configure local branch tracking ──────────────────────────────────────────
info "Setting up branch descriptions..."
git config branch.main.description   "Production branch — protected, CI/CD deploys from here"
git config branch.dev.description    "Integration branch — all feature/* branches merge here first"

# ── Set up default push behaviour ────────────────────────────────────────────
git config push.default current

success "Git branching strategy configured:"
echo ""
echo "  main  ← production (protected)"
echo "  dev   ← integration (all PRs target here)"
echo ""
echo "  Start a new feature with:"
echo "    git checkout dev"
echo "    git checkout -b feature/<task-id>-<description>"
echo ""
echo "  See CONTRIBUTING.md for full workflow."
