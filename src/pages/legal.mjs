import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = join(dirname(fileURLToPath(import.meta.url)), '..', 'static');
const meta = JSON.parse(readFileSync(join(here, 'meta.json'), 'utf8'));
// Only the third-party notices (open-source attributions) are public; the privacy policy and terms drafts are not published.
// their bodies live in src/static (rendered from the original Markdown).
export const legalPages = () => ['legal-third-party-notices'].map((k) => ({ path: meta[k].path, title: meta[k].title, description: meta[k].description, og: meta[k].og, body: readFileSync(join(here, `${k}.html`), 'utf8'), static: true }));
