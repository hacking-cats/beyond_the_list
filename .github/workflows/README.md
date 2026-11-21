# workflows

| File | When | What |
|---|---|---|
| `ci.yml` | Every pull request and push to `main` | lint, type-check, unit tests, web build |
| `pages.yml` | Push to `main` (or run by hand) | Builds the app and deploys it to GitHub Pages: V2 at the site root, V1 at `/v1/` |

Planned: `release.yml` (Android APK on tags `v*`).

**One-time setup (repo admin):** Settings → Pages → Source: **GitHub Actions**. Then add `CI / check` as a required check in the branch protection for `main`.
