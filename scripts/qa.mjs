#!/usr/bin/env node
// Responsive + accessibility QA in hidden headless Chrome over CDP (no visible window, no screen capture).
//   node scripts/qa.mjs [--dist dist] [--widths 320,768,1280,2560] [--themes dark,light] [--pages home,features] [--shots outDir] [--full]
// Per page, width and theme: horizontal overflow, elements outside the viewport, broken or alt-less images, h1 count, landmarks,
// tap targets under 24 px, text under 12 px, WCAG AA text contrast (4.5, or 3 for large text) against the resolved background,
// console and network errors. Exit 1 when anything fails.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const root = resolve(arg('dist', 'dist'));
const widths = arg('widths', '320,768,1280,2560').split(',').map(Number);
const themes = arg('themes', 'dark,light').split(',');
const only = arg('pages', '') ? arg('pages').split(',') : null;
const shotsDir = arg('shots', '');
if (shotsDir) mkdirSync(shotsDir, { recursive: true });
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = createServer((req, res) => {
  let f = join(root, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404, { 'content-type': 'text/html' }); return res.end(existsSync(join(root, '404.html')) ? readFileSync(join(root, '404.html')) : 'nf'); }
  res.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const sport = server.address().port;
const dbg = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${dbg}`, `--user-data-dir=${join(tmpdir(), 'idx-qa-' + dbg)}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
let targets; for (let i = 0; i < 60; i++) { try { targets = await (await fetch(`http://127.0.0.1:${dbg}/json`)).json(); if (targets.length) break; } catch {} await new Promise((r) => setTimeout(r, 200)); }
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
let id = 0; const pend = new Map(); const events = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } else events.push(d); };
await new Promise((r) => (ws.onopen = r));
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
for (const d of ['Page', 'Runtime', 'Network', 'Log']) await send(d + '.enable');
const pages = JSON.parse(readFileSync('_work/pages.json', 'utf8')).filter((p) => p.path !== '404.html' && (!only || only.includes(p.path.replace(/\/$/, '') || 'home')));
pages.push({ path: '404.html' });

const PROBE = `(() => {
  const de = document.documentElement, vw = de.clientWidth, out = { vw, sw: de.scrollWidth, h1: document.querySelectorAll('h1').length, lang: de.lang, title: document.title, landmarks: ['main', 'nav', 'header', 'footer'].filter((t) => !document.querySelector(t)), over: [], broken: [], noalt: [], small: [], tiny: [], contrast: [], docH: document.body.scrollHeight };
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgba = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const over = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; };
  const bgOf = (el) => { const stack = []; let e = el; while (e) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none') return null; const c = rgba(cs.backgroundColor); if (c[3] > 0) stack.push(c); if (c[3] === 1) break; e = e.parentElement; } let base = rgba(getComputedStyle(document.body).backgroundColor); if (base[3] === 0) base = [255, 255, 255, 1]; for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base); return base; };
  const seen = new Set();
  document.querySelectorAll('body *').forEach((e) => {
    const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden' || !r.width || !r.height) return;
    const inPan = e.closest('.fig.pan .frame, .tablewrap, pre, .copyblock');
    if ((r.right > vw + 1 || r.left < -1) && !inPan) out.over.push(e.tagName.toLowerCase() + '.' + String(e.className).slice(0, 30));
    if (e.tagName === 'IMG') { if (!e.complete || e.naturalWidth === 0) out.broken.push(e.getAttribute('src')); if (!e.hasAttribute('alt')) out.noalt.push(e.getAttribute('src')); }
    if (['A', 'BUTTON', 'SUMMARY'].includes(e.tagName) && cs.display !== 'inline' && (r.height < 24 || r.width < 24) && !e.closest('.skip')) out.small.push((e.innerText || e.getAttribute('aria-label') || '').slice(0, 24) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
    if (!own) return;
    const fs = parseFloat(cs.fontSize); if (fs < 12) out.tiny.push(e.tagName + ' ' + fs + 'px ' + e.innerText.slice(0, 20));
    const bg = bgOf(e); if (!bg) return;
    const fg = over(rgba(cs.color), bg); const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const large = fs >= 24 || (fs >= 18.66 && parseInt(cs.fontWeight) >= 700); const need = large ? 3 : 4.5;
    const key = cs.color + '|' + bg.join(',') + '|' + fs; if (ratio < need && !seen.has(key)) { seen.add(key); out.contrast.push(ratio.toFixed(2) + ' (need ' + need + ') ' + e.tagName.toLowerCase() + '.' + String(e.className).slice(0, 24) + ' "' + e.innerText.trim().slice(0, 30) + '"'); }
  });
  return out;
})()`;

let bad = 0, views = 0;
for (const p of pages) for (const w of widths) for (const th of themes) {
  events.length = 0; views++;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: w < 600 ? 800 : w >= 2000 ? 1440 : 900, deviceScaleFactor: 1, mobile: w < 600 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: th }] });
  await send('Page.navigate', { url: `http://127.0.0.1:${sport}/${p.path === '404.html' ? 'nope/' : p.path}` });
  await new Promise((r) => setTimeout(r, 700));
  await send('Runtime.evaluate', { expression: `document.querySelectorAll('img[loading=lazy]').forEach(i=>{i.loading='eager'});window.scrollTo(0,document.body.scrollHeight);` });
  await new Promise((r) => setTimeout(r, 700));
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' });
  const v = (await send('Runtime.evaluate', { returnByValue: true, expression: PROBE })).result.result.value;
  const errs = events.filter((e) => e.method === 'Runtime.exceptionThrown' || (e.method === 'Log.entryAdded' && e.params.entry.level === 'error' && !/favicon|404/.test(e.params.entry.text + (e.params.entry.url ?? ''))) || (e.method === 'Network.loadingFailed' && !(p.path === '404.html')));
  const issues = [];
  if (v.sw > v.vw) issues.push(`H-SCROLL ${v.sw}>${v.vw}`);
  if (v.over.length) issues.push(`outside viewport: ${[...new Set(v.over)].slice(0, 4).join(' | ')}`);
  if (v.broken.length) issues.push(`broken img: ${v.broken.slice(0, 2)}`);
  if (v.noalt.length) issues.push(`no alt: ${v.noalt.slice(0, 2)}`);
  if (v.h1 !== 1) issues.push(`h1 count ${v.h1}`);
  if (!v.lang) issues.push('no lang');
  if (v.landmarks.length && p.path !== '404.html') issues.push(`missing landmarks ${v.landmarks}`);
  if (v.small.length) issues.push(`small targets: ${v.small.slice(0, 3)}`);
  if (v.tiny.length) issues.push(`text under 12px: ${v.tiny.slice(0, 2)}`);
  if (v.contrast.length) issues.push(`contrast: ${v.contrast.slice(0, 3).join(' ; ')}`);
  if (errs.length) issues.push(`console/net: ${errs.length}`);
  if (issues.length) { bad++; console.log(`FAIL ${p.path || 'home'} ${w} ${th}: ${issues.join(' ; ')}`); }
  if (shotsDir && (!only || only.includes(p.path.replace(/\/$/, '') || 'home'))) {
    const h = Math.min(v.docH, has('full') ? 16000 : 2400);
    const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: h, scale: 1 } });
    writeFileSync(join(shotsDir, `${(p.path || 'home').replace(/\W+/g, '_')}-${w}-${th}.png`), Buffer.from(s.result.data, 'base64'));
  }
}
ws.close(); chrome.kill(); server.close();
console.log(`qa: ${views} page-views (${pages.length} pages x ${widths.join('/')} x ${themes.join('/')}), ${bad} with issues`);
process.exit(bad ? 1 : 0);
