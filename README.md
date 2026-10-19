# IDX site

Static site for IDX (a working name). Zero-dependency Node build, published to GitHub Pages at https://emberyard.github.io/idx-site/.

```sh
SITE_BASE=/idx-site/ SITE_ORIGIN=https://emberyard.github.io node build.mjs   # dist/
node scripts/public-audit.mjs dist      # fails on local paths, prices, names, secrets, private URLs
node scripts/serve.mjs dist 8765        # local preview
node scripts/qa.mjs --widths 320,1280,2560   # headless Chrome checks: overflow, contrast, targets, alt, console
python3 scripts/images.py               # raw captures -> WebP set
```

- `site.config.mjs`: name (working name), tagline, access state, flags. Version, date, size and release count are NOT set here: `src/release.mjs` reads them from the public releases repo at build time (falls back to `data/releases.json`). The deploy also rebuilds every 6 hours, so they cannot go stale.
- `src/pages/*.mjs`, `src/static/*.html`: pages. `src/base.css`, `src/site.css`: styles.
- `data/changelog.json`: snapshot of the app changelog (released versions only), shown on the What's new page. After each release: `CHANGELOG_SRC=<changelog.ts> npm run changelog`, which also refreshes `data/releases.json`.
- Screenshots use invented demo data only.
- Deploys on every merge to `main` (squash merge only; PR title carries a Jira key).
