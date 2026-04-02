---
description: Feature Development & Deployment Workflow
---

This workflow defines the mandatory steps for every feature update to ensure stability and consistency.

## 📋 Development Steps

### 1. Write & Run Core Tests 🧪
Before any code is committed, ensure that the core logic is covered by tests.
- Backend: Run `npm test` in the `backend` directory.
- Frontend: Run `npm run lint` and any relevant unit tests.

### 2. Verify Local Environment 🐳
Ensure all containers are running correctly with the new changes.
- Check YAML validity: `docker compose config`
- Start services: `docker compose up -d`
- Check status: `docker compose ps`

### 3. Documentation 📝
If the feature changes the API or user flow, update the relevant documentation.
- Update `docs/task/B-HackMe-100-Tasks.md` progress.
- Update `README.md` or specialized docs if needed.

### 4. Upload to GitHub 🚀
Commit and push changes to the relevant branch.
- Stage changes: `git add .`
- Commit: `git commit -m "feat: <description>"`
- Push to Dev: `git push origin dev`
- Merge to Main (if approved): `git checkout main && git merge dev --no-edit && git push origin main && git checkout dev`

### 5. Final Browser Verification 🌐
Perform a smoke test of the new feature in the browser.
- Verify the UI looks premium and follows the "Mission Control" theme.
- Test main user interactions (e.g., upload avatar, save profile).
- Check for console errors.

// turbo
## 🛠️ Quick Sync Command
If you just want to sync dev to main and push:
```bash
git checkout main && git merge dev --no-edit && git push origin main && git checkout dev
```
