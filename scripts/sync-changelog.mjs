#!/usr/bin/env node
// Snapshot the app's ONE changelog (packages/protocol/src/changelog.ts in the app repo: the same list that drives the in-app
// What's new, the update pill and the release notes) into data/changelog.json for the site build.
//   CHANGELOG_SRC=/path/to/idx/packages/protocol/src/changelog.ts node scripts/sync-changelog.mjs
// The app file imports nothing, so node can load it directly. Until the What's new work is merged in the app repo this reads the
// in-flight file; re-run after it lands so the site and the app can never disagree.
import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const src = resolve(process.env.CHANGELOG_SRC ?? '../app/packages/protocol/src/changelog.ts');
const m = await import(pathToFileURL(src).href);
mkdirSync('data', { recursive: true });
writeFileSync('data/changelog.json', JSON.stringify({ source: 'packages/protocol/src/changelog.ts', entries: m.CHANGELOG }, null, 1));
console.log('changelog:', m.CHANGELOG.length, 'entries, newest', m.CHANGELOG[0].version);
