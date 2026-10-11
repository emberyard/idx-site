/**
 * Every constant the site reads. The product name mirrors `PRODUCT_NAME` in the app repo
 * (`packages/protocol/src/config.ts`); it is the only place on this site where the name is spelled out.
 * `index.html` reads these through `{{key}}` placeholders (see the plugin in `vite.config.ts`).
 */
export const site = {
  PRODUCT_NAME: 'IDX',
  ORG: 'emberyard',
  /** Where the built site is served. The base path must match `base` in `vite.config.ts`. */
  SITE_URL: 'https://emberyard.github.io/idx-site/',
  DOWNLOAD_URL: 'https://github.com/emberyard/idx-releases/releases',
  /** The app repo is private until Rahul opens it. While false, "Read the docs" points at the page's own FAQ
   *  and nothing on the page links to the private repo. Flip to true and rebuild once the repo is public. */
  DOCS_PUBLIC: false,
  DOCS_URL: 'https://github.com/emberyard/idx#readme',
  APP_REPO_URL: 'https://github.com/emberyard/idx',
  RELEASES_REPO_URL: 'https://github.com/emberyard/idx-releases',
  SITE_REPO_URL: 'https://github.com/emberyard/idx-site',
  ORG_URL: 'https://github.com/emberyard',
  DATA_DIR: '~/Library/Application Support/IDX',
  CLAUDE_DIR: '~/.claude/projects',
  TAGLINE: 'Claude Code, as a Mac app.',
  DESCRIPTION:
    'A macOS cockpit over the real Claude Code CLI. Your own login, one window per project, every session back after a restart.',
} as const;

export type SiteKey = keyof typeof site;
