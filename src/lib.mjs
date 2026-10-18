// Shared helpers and the page context. (Rebuilt 19 Oct 2026 after the macOS /tmp cleaner deleted the original sources; same behaviour.)
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The head of every inner page: eyebrow, h1 and lede. Arguments are already-escaped HTML. */
export const pageHead = (h1, lede, eyebrow) => `<div class="page-head"><div class="wrap"><p class="eyebrow">${esc(eyebrow)}</p><h1>${h1}</h1><p class="lede">${lede}</p></div></div>`;

export function context(cfg) {
  const B = cfg.brand;
  const N = B.name;
  const base = process.env.SITE_BASE || '/';
  const origin = process.env.SITE_ORIGIN || `https://${B.domain}`;
  const dimsPath = join(root, 'public', 'img', 'dims.json');
  const dims = existsSync(dimsPath) ? JSON.parse(readFileSync(dimsPath, 'utf8')) : {};
  // Every internal link goes through here: works at a domain root (base "/") and under a sub-path (base "/idx/").
  const url = (p = '') => base + String(p).replace(/^\//, '');
  const abs = (p = '') => origin + url(p);
  const kbd = (...k) => k.map((x) => `<kbd>${esc(x)}</kbd>`).join('');

  /** Real product image, dark and light variants, retina srcset. marks = [[x%, y%, text], ...] numbered over the image. */
  function shot(id, { alt, sizes = '100vw', eager = false, marks = [], mobile = null, frame = true, caption = '' } = {}) {
    const d = dims[id];
    if (!d) throw new Error(`No image "${id}" in dims.json. Run: python3 scripts/images.py`);
    const mk = (theme) => {
      const set = (iid) => dims[iid].widths.map((w) => `${url(`img/${iid}-${theme}-${w}.webp`)} ${w}w`).join(', ');
      const big = d.widths[d.widths.length - 1];
      const attrs = `srcset="${set(id)}" sizes="${sizes}" width="${d.w}" height="${d.h}" alt="${esc(alt)}" fetchpriority="${eager ? 'high' : 'auto'}" ${eager ? '' : 'loading="lazy" '}decoding="async"`;
      if (!mobile) return `<img class="img-${theme}" src="${url(`img/${id}-${theme}-${big}.webp`)}" ${attrs}>`;
      const m = dims[mobile];
      return `<picture class="img-${theme}"><source media="(max-width:41.99em)" srcset="${set(mobile)}" sizes="100vw" width="${m.w}" height="${m.h}"><img src="${url(`img/${id}-${theme}-${big}.webp`)}" ${attrs}></picture>`;
    };
    const dots = marks.map((m, i) => `<span class="mark" style="left:${m[0]}%;top:${m[1]}%" aria-hidden="true">${i + 1}</span>`).join('');
    const list = marks.length ? `<ol class="callouts">${marks.map((m) => `<li>${m[2]}</li>`).join('')}</ol>` : '';
    const inner = `<div class="shot">${mk('dark')}${mk('light')}${dots}</div>`;
    const full = d.w >= 2000 && !mobile && frame;
    return `<figure class="fig${d.w < 2000 ? ' crop' : ''}${full ? ' pan' : ''}"><div class="${frame ? 'frame' : ''}">${inner}</div>${full ? '<p class="pan-hint">Swipe sideways to pan</p>' : ''}${list}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
  }

  const draftTag = (t = 'Placeholder') => (cfg.flags.draft ? `<span class="placeholder-tag">${esc(t)}</span>` : '');
  const mail = () => (B.email ? `<a href="mailto:${esc(B.email)}">${esc(B.email)}</a>` : `not published yet${draftTag()}`);
  const a = cfg.access;
  const access = { state: a.state, live: a.state !== 'placeholder', href: a.state === 'placeholder' ? url('') + '#access' : a.url, label: a.state === 'download' ? 'Download for macOS' : a.state === 'waitlist' ? 'Join the waitlist' : 'Early access' };
  return { cfg, B, N, base, origin, url, abs, kbd, shot, esc, draftTag, mail, access, dims };
}
