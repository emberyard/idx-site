#!/usr/bin/env node
// Refresh data/releases.json (the offline fallback) from the public releases repo.
import { fetchReleases, writeSnapshot } from '../src/release.mjs';
const rels = await fetchReleases();
writeSnapshot(rels);
console.log('releases:', rels.length, 'snapshot written');
