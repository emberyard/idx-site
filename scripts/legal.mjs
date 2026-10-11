// Renders legal/<slug>.md into legal/<slug>/index.html (Vite entries, gitignored). Runs before `vite build` / `vite dev`.
// The generated pages use the same {{KEY}} placeholders, header and footer as index.html; vite.config.ts fills them.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const dir = join(root, 'legal');
marked.use({ gfm: true });

const pages = readdirSync(dir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const md = readFileSync(join(dir, f), 'utf8');
    const title = /^#\s+(.+)$/m.exec(md)?.[1]?.trim() ?? basename(f, '.md');
    return { slug: basename(f, '.md'), title, md };
  });

const nav = (current) =>
  pages
    .map((p) => `<a class="nav-link${p.slug === current ? ' text-fg-strong' : ''}" href="{{HOME}}legal/${p.slug}/">${p.title}</a>`)
    .join('\n          ');

for (const p of pages) {
  const body = marked.parse(p.md);
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${p.title} — {{PRODUCT_NAME}}</title>
    <meta name="description" content="${p.title} for {{PRODUCT_NAME}}." />
    <link rel="canonical" href="{{SITE_URL}}legal/${p.slug}/" />
    <link rel="icon" href="{{BASE}}favicon.svg" type="image/svg+xml" />
    <meta name="theme-color" content="#1f1e1c" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#f8f7f4" media="(prefers-color-scheme: light)" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="{{PRODUCT_NAME}}" />
    <meta property="og:title" content="${p.title} — {{PRODUCT_NAME}}" />
    <meta property="og:description" content="${p.title} for {{PRODUCT_NAME}}." />
    <meta property="og:url" content="{{SITE_URL}}legal/${p.slug}/" />
    <meta property="og:image" content="{{SITE_URL}}og.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <script>
      (function () {
        try {
          var t = localStorage.getItem('idx-site.theme');
          if (t !== 'light' && t !== 'dark') t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', t);
        } catch (e) {}
      })();
    </script>
    <script type="module" src="/src/main.ts"></script>
  </head>
  <body class="bg-bg text-fg">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 btn btn-primary">Skip to content</a>
{{HEADER}}
    <main id="main" class="wrap py-12 sm:py-16">
      <p class="eyebrow">Legal</p>
      <nav aria-label="Legal pages" class="mt-3 -ml-2.5 flex flex-wrap gap-1">
          ${nav(p.slug)}
      </nav>
      <article class="legal mt-8 max-w-3xl">
${body}
      </article>
    </main>
{{FOOTER}}
  </body>
</html>
`;
  mkdirSync(join(dir, p.slug), { recursive: true });
  writeFileSync(join(dir, p.slug, 'index.html'), html);
  console.log(`legal/${p.slug}/index.html`);
}
