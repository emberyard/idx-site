import { existsSync, readFileSync } from 'node:fs';
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
  const partial = (name: string) => readFileSync(resolve(import.meta.dirname, `src/partials/${name}.html`), 'utf8').trimEnd();
  return {
    name: 'idx-site-html',
    transformIndexHtml(html) {
      let out = html.replace('{{HEADER}}', partial('header')).replace('{{FOOTER}}', partial('footer'));
      const keep = (name: string, on: boolean) => {
        const re = new RegExp(`<!--${name}-->([\\s\\S]*?)<!--/${name}-->`, 'g');
        out = out.replace(re, on ? '$1' : '');
      };
      keep('video', hasVideo);
      keep('novideo', !hasVideo);
      keep('webm', hasWebm);
      keep('appRepo', site.DOCS_PUBLIC);
      return out.replace(/\{\{([A-Z_]+)\}\}/g, (match, key: string) => {
        if (key === 'BASE' || key === 'HOME') return BASE;
        if (key === 'DOCS_LINK') return site.DOCS_PUBLIC ? site.DOCS_URL : '#faq';
        if (key === 'GITHUB_LINK') return site.DOCS_PUBLIC ? site.APP_REPO_URL : site.ORG_URL;
        if (key === 'POSTER_ATTR') return hasPoster ? `poster="${BASE}video/poster.jpg"` : '';
        if (key in site) return String(site[key as keyof typeof site]);
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
    rollupOptions: {
      // The legal pages are generated from legal/*.md by scripts/legal.mjs before every build.
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        terms: resolve(import.meta.dirname, 'legal/terms/index.html'),
        privacy: resolve(import.meta.dirname, 'legal/privacy/index.html'),
        notices: resolve(import.meta.dirname, 'legal/third-party-notices/index.html'),
      },
    },
  },
});
