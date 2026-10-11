// Renders public/og.jpg (1200×630) from scripts/og.html with the local Chrome. Run: npm run og
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const chrome =
  process.env.CHROME ??
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!chrome) throw new Error('Chrome not found; set CHROME=/path/to/chrome');

const tmp = mkdtempSync(join(tmpdir(), 'idx-og-'));
const png = join(tmp, 'og.png');
execFileSync(chrome, [
  '--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630',
  `--screenshot=${png}`, `file://${join(root, 'scripts/og.html')}`,
], { stdio: 'ignore' });
execFileSync('magick', [png, '-quality', '88', join(root, 'public/og.jpg')]);
rmSync(tmp, { recursive: true, force: true });
console.log('wrote public/og.jpg');
