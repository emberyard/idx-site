import { home } from './home.mjs';
import { features } from './features.mjs';
import { support, faq } from './support.mjs';
import { who } from './story.mjs';
import { privacy, changelog, notFound } from './info.mjs';
import { legalPages } from './legal.mjs';

export function pages(c) {
  const { N, B } = c;
  const mk = (path, title, description, fn, extra = {}) => ({ path, title, description, ...fn(c), ...extra });
  return [
    mk('', 'Home', B.statement, home, { home: true, og: 'default' }),
    mk('features/', 'Features', `Every ${N} feature in plain words: projects and windows, chats, terminals, approvals, permissions, panels, archive, shortcuts and memory.`, features, { og: 'features' }),
    mk('claude-and-gemini/', 'Claude Code and Gemini CLI support', `What ${N} supports for Claude Code and Gemini CLI, and what is not covered yet.`, support, { og: 'support' }),
    mk('who-its-for/', 'Who it is for', `The daily frictions of running AI coding agents on many projects, and who ${N} is for.`, who, { og: 'who' }),
    mk('faq/', 'FAQ', `Plain answers about ${N}: price, access, Macs, accounts, data and limits.`, faq, { og: 'default' }),
    mk('changelog/', 'What’s new', `Every ${N} release so far, newest first, in plain words. Generated from the app’s own changelog.`, changelog, { og: 'default' }),
    mk('privacy/', 'Privacy and security', `What stays on your Mac, what leaves it, and what ${N} does not do.`, privacy, { og: 'privacy' }),
    ...legalPages(),
    mk('404.html', 'Page not found', 'The page you asked for is not here. Go back to the home page or the feature list.', notFound, { og: 'default' }),
  ];
}
