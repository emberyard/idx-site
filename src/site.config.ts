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
  TAGLINE: 'A Mac cockpit for Claude Code.',
  DESCRIPTION:
    'Bring your own Claude Code. IDX runs the Claude Code you already installed and signed in to, one window per project, every session back after a restart.',
  /** Contact is GitHub issues; nothing is bought (no domain, no mailbox). */
  ISSUES_URL: 'https://github.com/emberyard/idx-site/issues',
  LEGAL_NOTE:
    'IDX is an independent project, not affiliated with or endorsed by Anthropic or Google. Claude is a trademark of Anthropic PBC; Gemini is a trademark of Google LLC.',
} as const;

export type SiteKey = keyof typeof site;
