#!/usr/bin/env node
// Pre-publish gate: fails the build when the public output contains something that must never ship.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2] || 'dist';
const BANNED = [
  [/\/Users\/|\/private\/tmp|\/tmp\/claude/, 'local path'],
  [/airahulsoni|irahulsoni/i, 'personal domain'],
  [/\bRahul\b/, 'maker name'],
  [/\bYantra\b|\bUWM\b|\bxbp\b|\bExela\b/i, 'former/other product or employer name'],
  [/(?<![\w.])[$€£₹]\s?\d/, 'price'],
  [/\b(per month|\/mo\b|per seat|per user)\b/i, 'pricing wording'],
  [/ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{12,}|sk-[A-Za-z0-9]{20,}|BEGIN (RSA|OPENSSH|PRIVATE)/, 'secret'],
  [/github\.com\/emberyard\/(idx|idx-app|idx-releases)\b/, 'private repo URL'],
  [/Posting notes|Do not say free/, 'internal press notes'],
];
let bad = 0;
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!/\.(html|css|js|xml|txt|json|svg)$/.test(f)) continue;
    const s = readFileSync(p, 'utf8');
    for (const [re, why] of BANNED) {
      const m = re.exec(s);
      if (m) { bad++; console.error(`AUDIT FAIL ${p}: ${why}: ${JSON.stringify(s.slice(Math.max(0, m.index - 30), m.index + 40))}`); }
    }
  }
};
walk(dir);
if (bad) { console.error(`${bad} problem(s)`); process.exit(1); }
console.log(`public audit ok (${dir})`);
