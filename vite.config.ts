import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/site.config';

const BASE = '/idx-site/';

/**
 * - Replaces `{{KEY}}` in index.html with the matching `site` constant, so the product name lives in one place.
 * - Picks the hero media at build time: the `<!--video-->…<!--/video-->` block stays when
 *   `public/video/intro.mp4` exists (IDX-29 drops it there), otherwise the `<!--novideo-->…<!--/novideo-->`
 *   block stays. Deciding at build time means the live page never requests a file that is not there.
 */
function siteHtml(): Plugin {
  const videoDir = resolve(import.meta.dirname, 'public/video');
  const hasVideo = existsSync(resolve(videoDir, 'intro.mp4'));
  const hasPoster = existsSync(resolve(videoDir, 'poster.jpg'));
  const hasWebm = existsSync(resolve(videoDir, 'intro.webm'));
  return {
    name: 'idx-site-html',
    transformIndexHtml(html) {
      let out = html;
      const keep = (name: string, on: boolean) => {
        const re = new RegExp(`<!--${name}-->([\\s\\S]*?)<!--/${name}-->`, 'g');
        out = out.replace(re, on ? '$1' : '');
      };
      keep('video', hasVideo);
      keep('novideo', !hasVideo);
      keep('webm', hasWebm);
      return out.replace(/\{\{([A-Z_]+)\}\}/g, (match, key: string) => {
        if (key === 'BASE') return BASE;
        if (key === 'POSTER_ATTR') return hasPoster ? `poster="${BASE}video/poster.jpg"` : '';
        if (key in site) return site[key as keyof typeof site];
        throw new Error(`index.html references unknown site constant ${match}`);
      });
    },
  };
}

export default defineConfig({
  // GitHub Pages project site: served under /idx-site/.
  base: BASE,
  plugins: [tailwindcss(), siteHtml()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
  },
});
