// THE ONE PLACE for everything that can change: name, tagline, domain, email, theme direction, release facts,
// access state, draft flags. No page hard-codes the product name; renaming the product is a one-line change
// (brand.name) plus `npm run og` to redraw the share images.
//
// Env overrides (used for the sub-path build and for CI):
//   SITE_ORIGIN  e.g. https://emberyard.github.io        (default: brand.domain over https)
//   SITE_BASE    e.g. /           for a subdomain root     (default)
//                     /idx/       for a sub-path, e.g. https://emberyard.github.io/idx-site/

export default {
  brand: {
    // WORKING NAME. Not official, will change. Everything on the site reads this one value.
    name: process.env.SITE_NAME || 'IDX',
    nameIsWorking: true,
    tagline: 'A cockpit for your AI coding agents.',
    // The one-line statement (used for meta descriptions and the share text).
    statement:
      'A Mac app that gives each project its own window over the coding CLIs you already use: Claude Code, Gemini CLI, Antigravity, Grok Build and Cursor CLI. Chats, terminal and files stay together, and everything comes back after a restart.',
    // Published at https://emberyard.github.io/idx-site/ (builds set SITE_ORIGIN and SITE_BASE). No custom domain yet.
    domain: 'emberyard.github.io',
    // Contact. Leave empty until an address exists; pages then say contact details arrive with the launch.
    email: '',
  },

  // Direction picked from the design lab: B (product-led, teal). A (editorial, clay) and C (technical, sage)
  // stay available: change this letter and rebuild. Fonts, accent and type are swapped by the tokens file.
  theme: { direction: 'B' },

  release: {
    version: '0.1.26',
    date: '15 Oct 2026',
    sizeMB: 137, // IDX-0.1.26-arm64.dmg is 143,252,084 bytes = about 136.6 MiB (GitHub release asset, read 18 Oct)
    minMacOS: '13', // LSMinimumSystemVersion 13.0 in the installed app's Info.plist (read 18 Oct)
    chip: 'Apple Silicon',
    releasesCount: 27, // v0.1.0 to v0.1.26, 11 to 15 Oct 2026 (re-count at launch)
  },

  // How people get the app. 'placeholder' = nothing is open yet (clearly labelled). 'waitlist' = url is a form.
  // 'download' = url is a direct DMG link. No pricing is stated anywhere until Rahul decides.
  access: { state: 'placeholder', url: '' },

  flags: {
    // While true, placeholders and draft notes are visibly tagged, and the site tells search engines to stay away.
    draft: true,
    indexable: false,
  },

  nonAffiliation:
    'is an independent project. It is not made by, or affiliated with, Anthropic, Google, xAI or Anysphere. Claude, Gemini, Antigravity, Grok and Cursor are their owners’ trademarks.',
};
