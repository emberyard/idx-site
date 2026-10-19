#!/usr/bin/env node
// Snapshot the app's ONE changelog (packages/protocol/src/changelog.ts in the private app repo: the same list that drives the
// in-app What's new, the update pill and the release notes) into data/changelog.json for the site build.
//   CHANGELOG_SRC=/path/to/changelog.ts node --experimental-strip-types scripts/sync-changelog.mjs
//   (or, with the gh CLI signed in:  gh api repos/emberyard/idx/contents/packages/protocol/src/changelog.ts -H "Accept: application/vnd.github.raw" > /tmp/changelog.ts)
// Only entries that are actually RELEASED (a tag exists in the public releases repo, see data/releases.json) are kept, so notes for
// work that has not shipped never reach the public site. The app file imports nothing, so node can load it directly.
import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { fetchReleases, writeSnapshot, cmpVersion } from '../src/release.mjs';
const src = resolve(process.env.CHANGELOG_SRC ?? '../app/packages/protocol/src/changelog.ts');
const m = await import(pathToFileURL(src).href);
const rels = await fetchReleases();
writeSnapshot(rels);
const latest = rels.map((r) => r.version).sort(cmpVersion).pop();
// Public wording: the app's notes name the earlier tool; the site says "a previous tool" (public-audit enforces it).
const clean = (v) => (typeof v === 'string' ? v.replace(/\bYantra\b/g, 'a previous tool') : Array.isArray(v) ? v.map(clean) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clean(x)])) : v);
const entries = clean(m.CHANGELOG.filter((e) => cmpVersion(e.version, latest) <= 0));
mkdirSync('data', { recursive: true });
writeFileSync('data/changelog.json', JSON.stringify({ source: 'packages/protocol/src/changelog.ts', entries }, null, 1) + '\n');
console.log(`changelog: ${entries.length} released entries (skipped ${m.CHANGELOG.length - entries.length} unreleased), newest ${entries[0].version}; releases repo latest ${latest}`);
