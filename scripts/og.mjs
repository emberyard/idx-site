#!/usr/bin/env node
// Share images (1200x630) for the five OG variants: text on the left, a crop of the current product screenshot on the right.
//   node scripts/og.mjs        (needs public/img from scripts/images.py; hidden headless Chrome, no screen capture)
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import cfg from '../site.config.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const N = cfg.brand.name;
const VARIANTS = {
  default: [cfg.brand.tagline, 'One window per project, over the coding CLIs you already use.'],
  features: ['Everything it does, in plain words.', 'Projects, chats, terminals, approvals, permissions, panels, archive.'],
  privacy: ['Your data stays on your Mac.', 'No account, no analytics, no telemetry.'],
  support: ['Claude Code and Gemini CLI, and what is not covered yet.', 'An honest support list.'],
  who: ['What you do not realise you are paying for.', 'The daily frictions of running agents on many projects.'],
};
const tmp = mkdtempSync(join(tmpdir(), 'og-'));
const shot = 'file://' + join(root, 'public/img/project-dark-2560.webp');
const font = 'file://' + join(root, 'src/fonts/geist-latin-wght-normal.woff2');
const mono = 'file://' + join(root, 'src/fonts/geist-mono-latin-wght-normal.woff2');
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
for (const [id, [h, sub]] of Object.entries(VARIANTS)) {
  const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:G;src:url(${font});font-weight:100 900}@font-face{font-family:M;src:url(${mono});font-weight:100 900}
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#161514;color:#ece9e3;font-family:G,system-ui;overflow:hidden;position:relative}
.top{position:absolute;left:64px;top:60px;display:flex;align-items:center;gap:14px;font-weight:600;font-size:30px}
.top svg{width:38px;height:38px}.pill{font:500 14px M,monospace;letter-spacing:.1em;text-transform:uppercase;color:#b6b1a8;border:1px solid #37352f;border-radius:99px;padding:7px 12px}
h1{position:absolute;left:64px;top:166px;width:560px;font-size:56px;line-height:1.08;font-weight:650;letter-spacing:-.02em}
p{position:absolute;left:64px;top:402px;width:520px;font-size:26px;line-height:1.4;color:#b6b1a8}
.shot{position:absolute;left:640px;top:120px;width:620px;height:520px;border-radius:14px;border:1px solid #37352f;overflow:hidden;box-shadow:0 24px 60px -20px #000}
.shot img{position:absolute;left:0;top:0;width:1300px}.bar{position:absolute;left:0;right:0;bottom:0;height:8px;background:#5cbcab}
</style><div class="top"><svg viewBox="0 0 32 32"><rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="#5cbcab"/><rect x="7" y="8" width="18" height="16" rx="2.5" fill="none" stroke="#10201d" stroke-width="2"/><path d="M14.5 8v16" stroke="#10201d" stroke-width="2"/></svg>${esc(N)}<span class="pill">Private beta</span></div>
<h1>${esc(h)}</h1><p>${esc(sub)}</p><div class="shot"><img src="${shot}"></div><div class="bar"></div>`;
  const f = join(tmp, id + '.html');
  writeFileSync(f, html);
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', `--user-data-dir=${join(tmp, 'p')}`, '--window-size=1200,630', '--virtual-time-budget=4000', `--screenshot=${join(root, 'public/og', id + '.png')}`, 'file://' + f], { stdio: 'ignore' });
  console.log('og', id);
}
