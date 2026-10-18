#!/usr/bin/env node
// Zero-framework static build: node build.mjs [--out dist]. (Rebuilt 19 Oct 2026; output matches the previous build.)
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import cfg from './site.config.mjs';
import { context, esc } from './src/lib.mjs';
import { pages } from './src/pages/index.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const oi = process.argv.indexOf('--out');
const out = resolve(root, oi > 0 ? process.argv[oi + 1] : 'dist');
const c = context(cfg);
const { N, B, base, url, abs } = c;

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'assets', 'fonts'), { recursive: true });
cpSync(join(root, 'public'), out, { recursive: true });
cpSync(join(root, 'src', 'fonts'), join(out, 'assets', 'fonts'), { recursive: true });
const css = readFileSync(join(root, 'src', 'base.css'), 'utf8') + readFileSync(join(root, 'src', 'site.css'), 'utf8');
const js = readFileSync(join(root, 'src', 'site.js'), 'utf8');
writeFileSync(join(out, 'assets', 'site.css'), css);
writeFileSync(join(out, 'assets', 'site.js'), js);
const hash = (s) => createHash('sha1').update(s).digest('hex').slice(0, 8);

const mark = `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="var(--accent)"/><rect x="7" y="8" width="18" height="16" rx="2.5" fill="none" stroke="var(--on-accent)" stroke-width="2"/><path d="M14.5 8v16" stroke="var(--on-accent)" stroke-width="2"/></svg>`;
const NAV = [['features/', 'Features'], ['claude-and-gemini/', 'Claude + Gemini'], ['who-its-for/', 'Who it is for'], ['faq/', 'FAQ'], ['changelog/', 'What’s new'], ['privacy/', 'Privacy']];
const links = (list) => list.map(([p, t]) => `<a href="${url(p)}">${esc(t)}</a>`).join('');
const header = `<header class="site-header">
  <div class="wrap wide bar">
    <a class="brand" href="${url('')}">${mark}<span>${esc(N)}</span><span class="tag">Private beta</span></a>
    <nav class="primary" aria-label="Main">${links(NAV)}</nav>
    <div class="hdr-actions">
      <button class="icon-btn" id="theme-toggle" type="button" aria-label="Switch between dark and light theme"><svg class="theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
      <button class="icon-btn menu-btn" id="menu-btn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mobile-nav"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    </div>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile"><div class="wrap">${links(NAV)}</div></nav>
</header>`;
const footer = `<footer class="site">
  <div class="wrap wide">
    <div class="cols">
      <div><a class="brand" href="${url('')}">${mark}<span>${esc(N)}</span></a><p style="margin-top:.8rem;max-width:24rem">${esc(B.tagline)} Private beta, Mac only.</p></div>
      <div><p class="foot-h">Product</p><ul><li><a href="${url('features/')}">Features</a></li><li><a href="${url('claude-and-gemini/')}">Claude + Gemini</a></li><li><a href="${url('who-its-for/')}">Who it is for</a></li><li><a href="${url('changelog/')}">What’s new</a></li></ul></div>
      <div><p class="foot-h">Learn</p><ul><li><a href="${url('faq/')}">FAQ</a></li><li><a href="${url('privacy/')}">Privacy and security</a></li></ul></div>
      <div><p class="foot-h">Legal</p><ul><li><a href="${url('legal/third-party-notices/')}">Third-party notices</a></li><li>Contact: ${c.mail()}</li></ul></div>
    </div>
    <div class="legal">
      <span>${esc(N)} ${esc(cfg.nonAffiliation)}</span>
      <span>Version ${esc(cfg.release.version)} (${esc(cfg.release.date)}).. Screenshots show invented demo data.</span>
    </div>
  </div>
</footer>`;

const all = pages(c);
const rebase = (h) => (base === '/' ? h : h.replace(/(href|src)="\/(?!\/)/g, `$1="${base}`));
const DOC = (x) => x;
const render = (p) => {
  const title = p.home ? `${N}: ${B.tagline.replace(/\.$/, '')}` : `${p.title} · ${N}`;
  const isErr = p.path === '404.html';
  const canon = isErr ? '' : `<link rel="canonical" href="${abs(p.path)}">\n`;
  const og = abs(`og/${p.og || 'default'}.png`);
  const robots = cfg.flags.indexable ? '' : '<meta name="robots" content="noindex,nofollow">\n';
  const draftBar = cfg.flags.draft ? `<div class="draft-bar" role="note">Early preview. ${esc(N)} is a working name and will change.</div>\n` : '';
  const ld = p.home ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: N, applicationCategory: 'DeveloperApplication', operatingSystem: `macOS ${cfg.release.minMacOS}+`, description: B.statement, softwareVersion: cfg.release.version })}</script>` : (p.head || '');
  return (`<!doctype html>
<html lang="en" class="nojs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description)}">
${robots}${canon}<meta name="theme-color" content="#161514" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#f6f3ec" media="(prefers-color-scheme: light)">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(N)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(p.description)}">
${isErr ? '' : `<meta property="og:url" content="${abs(p.path)}">\n`}<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="${url('favicon.svg')}" type="image/svg+xml">
<link rel="preload" href="${url('assets/fonts/geist-latin-wght-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<script>(function(){var d=document.documentElement;d.className='js';try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t)}catch(e){}})()</script>
<link rel="stylesheet" href="${url('assets/site.css')}?v=${hash(css)}">
${ld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${draftBar}${header}
<main id="main">
${p.static ? rebase(p.body) : p.body}
</main>
${footer}
<script src="${url('assets/site.js')}?v=${hash(js)}" defer></script>
</body>
</html>
`);
};
for (const p of all) {
  const f = p.path === '404.html' ? '404.html' : join(p.path, 'index.html');
  mkdirSync(dirname(join(out, f)), { recursive: true });
  writeFileSync(join(out, f), render(p));
}
// Old v1 URLs that no longer have a page: a small redirect so a saved link lands somewhere useful instead of a 404.
const REDIRECTS = [['legal/privacy/', 'privacy/'], ['legal/terms/', '']];
for (const [from, to] of REDIRECTS) {
  mkdirSync(join(out, from), { recursive: true });
  const dest = abs(to);
  writeFileSync(join(out, from, 'index.html'), `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>Moved</title><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${url(to)}"><link rel="canonical" href="${dest}"></head><body><p>This page moved. <a href="${url(to)}">Continue</a>.</p></body></html>\n`);
}
writeFileSync(join(out, 'robots.txt'), cfg.flags.indexable ? `User-agent: *\nAllow: /\nSitemap: ${abs('sitemap.xml')}\n` : '# Draft preview: not for search engines yet.\nUser-agent: *\nDisallow: /\n');
writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all.filter((p) => p.path !== '404.html').map((p) => `  <url><loc>${abs(p.path)}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(root, '_work', 'pages.json'), JSON.stringify(all.map((p) => ({ path: p.path, title: p.title })), null, 1));
console.log(`built ${all.length - 1} pages + 404 to ${out} (base ${base}, origin ${c.origin})`);
