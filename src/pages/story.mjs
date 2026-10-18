import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = join(dirname(fileURLToPath(import.meta.url)), '..', 'static');
// "Who it is for" and "Journey" bodies are kept as reviewed HTML in src/static.
const page = (k) => () => ({ body: readFileSync(join(here, `${k}.html`), 'utf8'), static: true });
export const who = page('who-its-for');
