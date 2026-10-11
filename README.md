# idx-site

Landing page for IDX. Static: Vite + vanilla TypeScript + Tailwind 4. No framework, no analytics, no forms,
no third-party scripts. Deployed to GitHub Pages at https://emberyard.github.io/idx-site/.

## Run

Node 22 (`.nvmrc`).

```sh
npm ci
npm run dev        # http://localhost:5173/idx-site/
npm run build      # dist/
npm run preview    # serves dist/ at http://localhost:4173/idx-site/
npm run typecheck
```

## Deploy

Push to `main`. `.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages
(`actions/configure-pages`, `upload-pages-artifact`, `deploy-pages`). The Pages source is "GitHub Actions";
the base path is `/idx-site/` (`base` in `vite.config.ts`).

## Where things live

| Path | What |
|---|---|
| `src/site.config.ts` | Every constant: product name, URLs, tagline. `index.html` reads them as `{{KEY}}`. The product name mirrors `PRODUCT_NAME` in the app repo and is spelled out nowhere else. `DOCS_PUBLIC` is `false` while the app repo is private: "Read the docs" then points at `#faq`, the GitHub link at the org page, and the footer drops the app-repo link. Flip it and push once the repo is public. |
| `src/styles.css` | IDX design tokens (OKLCH, from the app's `packages/tokens`) as CSS variables, mapped into Tailwind. Dark by default; light via `prefers-color-scheme` or the toggle (`data-theme`). |
| `index.html` | The landing page. Header and footer come from `src/partials/*.html` (`{{HEADER}}` / `{{FOOTER}}`), shared with the legal pages. |
| `legal/*.md` | Terms of Use, Privacy, Third-party notices (Markdown sources). `scripts/legal.mjs` renders them to `legal/<slug>/index.html` (gitignored) before every `dev`/`build`; Vite builds those as extra pages at `/legal/<slug>/`. Regenerate `third-party-notices.md` on each app release with `pnpm -r licenses list --prod --json` in the app repo and replace the file. |
| `src/main.ts` | Theme toggle (swaps the dark/light screenshots too) and the mobile menu. |
| `public/img/*.webp` | Real app screenshots, 1600 px wide (2× of the 800 px display size), both themes. |
| `public/video/` | Hero video: `intro.mp4`, `intro.webm`, `poster.jpg`. Optional; see below. |
| `scripts/og.html`, `scripts/og.mjs` | The Open Graph image. `npm run og` renders `public/og.jpg` (1200×630) with the local Chrome. |

## Wording rules (from the terms pass, Confluence "Terms & compliance — IDX")

Say "Bring your own Claude Code", "runs the Claude Code you already installed and signed in to", "billed by Anthropic
to your own account". Never "Claude Code for Mac", "Claude Code GUI", "sign in to Claude from IDX", "use your Claude Max
plan with IDX". No Anthropic or Google logos; plain-text names only. Gemini: lead with "Gemini API key (recommended by
Google)". Contact is GitHub issues; no email address or domain (nothing is bought).

## Hero video

Drop `intro.mp4` (required), `intro.webm` and `poster.jpg` (optional) into `public/video/` and push. The build
checks which files exist and writes the matching `<video>`; when `intro.mp4` is missing the hero shows a
screenshot with a "coming soon" tag instead, so the live page never requests a file that is not there.

## Screenshots

Source PNGs come from the app at 2× (2880×1800 or 2560×1520). Convert with:

```sh
magick in.png -resize 1600x -strip png:- | cwebp -q 78 -m 6 -o public/img/name-dark.webp -- -
```

Keep each file under 300 KB and give every image a `data-dark` / `data-light` pair.
