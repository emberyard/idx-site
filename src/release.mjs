// Release facts come from the PUBLIC releases repo, so the site can never name a version that is not out.
// Build time: ask GitHub (public, no auth needed) for the releases; if that fails, use data/releases.json, the snapshot
// that `npm run releases` writes. The latest release is the highest version among them.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'emberyard/idx-releases';
const snapshotPath = join(root, 'data', 'releases.json');
const vparts = (v) => v.split('.').map(Number);
export const cmpVersion = (a, b) => { const x = vparts(a), y = vparts(b); for (let k = 0; k < 3; k++) if (x[k] !== y[k]) return x[k] - y[k]; return 0; };

export async function fetchReleases() {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'idx-site-build' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, { headers, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const list = await res.json();
  return list.filter((r) => !r.draft && !r.prerelease && /^v\d+\.\d+\.\d+$/.test(r.tag_name)).map((r) => {
    const dmg = (r.assets || []).find((a) => /\.dmg$/.test(a.name));
    return { version: r.tag_name.slice(1), published: r.published_at, dmgBytes: dmg ? dmg.size : null };
  });
}

export function readSnapshot() {
  return JSON.parse(readFileSync(snapshotPath, 'utf8')).releases;
}

export function writeSnapshot(releases) {
  mkdirSync(dirname(snapshotPath), { recursive: true });
  writeFileSync(snapshotPath, JSON.stringify({ source: `github.com/${REPO} releases`, releases }, null, 1) + '\n');
}

// Returns the release facts for the site. `base` is the static part of site.config.mjs (minMacOS, chip).
export async function loadRelease(base) {
  let rels, from;
  try { rels = await fetchReleases(); from = 'github'; } catch (e) { rels = readSnapshot(); from = `snapshot (${e.message})`; }
  if (!rels.length) throw new Error('no releases found');
  rels = [...rels].sort((a, b) => cmpVersion(b.version, a.version));
  const latest = rels[0];
  const first = rels.reduce((m, r) => (r.published < m ? r.published : m), rels[0].published);
  const day = (iso) => Math.floor((Date.parse(iso) + 19800000) / 86400000); // calendar day in IST, like the app's changelog dates
  const days = (day(latest.published) - day(first)) + 1;
  const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const rel = {
    ...base,
    version: latest.version,
    date: fmt(latest.published),
    sizeMB: latest.dmgBytes ? Math.round(latest.dmgBytes / 1048576) : base.sizeMB,
    releasesCount: rels.length,
    spanDays: days,
    firstDate: fmt(first),
  };
  console.log(`release: v${rel.version} (${rel.date}), ${rel.releasesCount} releases over ${days} days, ${rel.sizeMB} MB, from ${from}`);
  return rel;
}
