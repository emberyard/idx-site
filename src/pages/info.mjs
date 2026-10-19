import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc, pageHead } from '../lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export function privacy(c) {
  const { N, url } = c;
  const flow = `<div class="diagram"><svg viewBox="0 0 760 270" role="img" aria-label="Data flow. On your Mac: ${esc(N)} keeps a local database and starts your own Claude Code or Gemini CLI, which reads your files. Only that CLI talks to its provider. ${esc(N)} also checks a release feed on GitHub for updates."><rect class="hl" x="8" y="8" width="480" height="254" rx="14"/><text class="s" x="24" y="30">Your Mac</text><rect class="box" x="28" y="48" width="200" height="72" rx="10"/><text class="t" x="44" y="78">${esc(N)}</text><text class="s" x="44" y="100">windows, chats, settings</text><rect class="box" x="268" y="48" width="200" height="72" rx="10"/><text class="t" x="284" y="78">Your CLI</text><text class="s" x="284" y="100">Claude Code or Gemini CLI</text><rect class="box" x="28" y="162" width="200" height="72" rx="10"/><text class="t" x="44" y="192">Local database</text><text class="s" x="44" y="214">stays on this Mac</text><rect class="box" x="268" y="162" width="200" height="72" rx="10"/><text class="t" x="284" y="192">Your files</text><text class="s" x="284" y="214">read by your CLI</text><path class="ln" d="M228 84h40M128 120v42M368 120v42"/><rect class="box" x="548" y="48" width="200" height="72" rx="10"/><text class="t" x="564" y="78">Its provider</text><text class="s" x="564" y="100">Anthropic or Google</text><path class="ln" d="M468 84h80"/><rect class="box" x="548" y="162" width="200" height="72" rx="10" stroke-dasharray="5 4"/><text class="t" x="564" y="192">Update check</text><text class="s" x="564" y="214">a release feed on GitHub</text></svg></div>`;
  const body = pageHead('Privacy and security, in plain words.', `What stays on your Mac, what leaves it, and what ${esc(N)} deliberately does not do.`, 'Privacy') +
    `<div class="wrap">
  <div class="grid c2" style="align-items:start">
    <div>
      <h2 style="font-size:1.6rem;margin-bottom:1rem">The short version</h2>
      <ul class="ticks">
        <li>No ${esc(N)} account, no sign-up, no analytics, no telemetry.</li>
        <li>Projects, windows and settings live in one local database on your Mac.</li>
        <li>${esc(N)} runs your own Claude Code or Gemini CLI. They send your prompts and the files they read to their provider, under their own policies, exactly as they do in a terminal.</li>
        <li>${esc(N)} never reads, stores or sends your Anthropic or Google credentials. You sign in to each CLI yourself.</li>
        <li>The only thing ${esc(N)} itself fetches is the update feed, which tells GitHub your IP address, as any download does.</li>
        <li>Diagnostics are local only. Report an issue sends only what you choose to send.</li>
      </ul>
    </div>
    ${flow}
  </div>

  <h2 style="margin-top:4rem;font-size:1.6rem">Where your data is</h2>
  <p class="muted" style="max-width:46rem">One folder under <code>~/Library/Application Support</code> holds ${esc(N)}’s database (projects, chats index, windows, settings), local logs, sandbox folders and pasted images. It is private to your user account. Your conversation transcripts are written by your CLI into its own folders, for Claude Code under <code>~/.claude</code>. Delete the ${esc(N)} folder and it forgets everything. Settings > Data and privacy has Remove all data, and the Help menu has Uninstall.</p>

  <h2 style="margin-top:3rem;font-size:1.6rem">What it asks your Mac for</h2>
  <p class="muted" style="max-width:46rem">${esc(N)} does not ask for Screen Recording, Camera, Microphone or Accessibility. If your agents need to read protected folders such as Documents or Downloads, macOS may ask about Full Disk Access; a short guide in Settings explains what it does and how to grant it. It is optional.</p>

  <h2 style="margin-top:3rem;font-size:1.6rem">Staying in control of what agents do</h2>
  <ul class="ticks" style="max-width:46rem"><li>You choose how careful each project is: careful, balanced (default) or full access. Full access asks you to confirm.</li><li>Permission cards show the exact command before it runs.</li><li>Smart approvals only answer low-risk requests, only while you are away, and every decision is logged in Diagnostics.</li><li>Accounts that bill per use are marked and are never chosen for you.</li></ul>

  <h2 style="margin-top:3rem;font-size:1.6rem">What is not done yet</h2>
  <p class="muted" style="max-width:46rem">The code is private, so you cannot read it, and there has been no independent security review. Releases are signed and approved by Apple, and you can watch ${esc(N)}’s network traffic with any tool you trust. If you find a problem, contact: ${c.mail()}.</p>

  <p style="margin:3rem 0 5rem"><a class="btn" href="${url('legal/third-party-notices/')}">Third-party notices</a></p>
</div>`;
  return { body };
}

export const CHANGES = (c) => {
  const N = c.N;
  return [
    ['0.1.21', '14 Oct 2026', 'Smarter approvals, and replies that tell you what ran', ['Low-risk permission requests can be answered for you while you are away. Questions that wait too long fall back to a safe default. Diagnostics lists every approval and what was decided.', 'Sandboxes are never cleaned up automatically any more (you can still choose a period).', 'Every reply ends with a footer: model, tokens, time. A “models used in this chat” panel lists each model.'], true],
    ['0.1.20', '14 Oct 2026', 'One project, one window; archive you can find', ['Lock a window to its project, send a project to another window, bring it back. A Window menu lists your windows.', 'Archived chats have their own page, a message tells you where one went, and you can restore in place.', `⌘P jumps to any project or chat; ⌃Tab cycles. The header shows the project name in its accent colour.`, 'Cleaner chat titles; a Redraw terminal button; shortcut tips that appear once and stop.']],
    ['0.1.19', '14 Oct 2026', 'Chat limits that fit your Mac', ['How many chats run at once follows your Mac’s real memory; idle chats stop on their own in Automatic mode.', 'A shortcuts guide, key hints and a once-a-day tip.', 'Phone access is off by default, per chat with Continue on phone.', 'Trust levels per project, folder pre-trust, an always-allow list and a macOS permissions guide.', 'A new chat stays a draft until you send.']],
    ['0.1.18', '14 Oct 2026', 'Dock menu and lighter memory', ['Right-click the Dock icon for chats waiting on you, pinned and recent projects, and quick actions.', 'Idle chats stop and free memory; no leftover processes after you quit.', 'Meaningful chat names in the sidebar.']],
    ['0.1.17', '14 Oct 2026', 'Gemini polish and model clarity', ['Each reply shows which model answered; a “Switched to” line appears when the model or account changes.', 'Links in chat open beside the chat; files Claude sends show as previews.', 'Gemini thinking reads properly, and the header shows model and account.']],
    ['0.1.16', '14 Oct 2026', 'Sandboxes are full projects; fast, exact restore', ['New sandbox (⌃⌘N) opens a git-ready project in its own tab. Keep moves it to a folder you pick; Discard archives it and keeps the folder.', 'One page lists the chats of every project.', 'Start any chat in the Claude terminal with ⌥⌘T, or flip with the Chat | Terminal switch.', 'Reopening brings back every window on its display, every tab and shell scrollback. Measured with 120 tabs across 3 windows, including after a force quit.', 'A chat only asks for you when it really needs an answer.']],
    ['0.1.15', '13 Oct 2026', 'Gemini CLI 0.64.0', ['Checked against Gemini CLI 0.64.0; a fix so a Gemini chat continued in the terminal reads back correctly.', 'Diagnostics notes when your Gemini CLI is newer than the versions checked.']],
    ['0.1.14', '13 Oct 2026', '⌘W closes what you are working in', ['⌘W closes the focused tab, panel or window, never quits, and ⇧⌘T brings back what you closed.', 'Closing a terminal that is still running something asks first.']],
    ['0.1.13', '13 Oct 2026', 'Faster start and Gemini model menu', ['Opens about a second sooner.', 'Clear Gemini model names, and typing a model id the CLI does not list yet.', 'Drag a folder onto the sidebar to add a project.']],
    ['0.1.12', '13 Oct 2026', 'Pop-out fix', ['A chat popped out into its own window now stays on that chat after moving, resizing and relaunching.']],
    ['0.1.11', '13 Oct 2026', 'Design polish', ['Nothing is cut off in a small window: menus, dialogs and project tabs all fit.', 'Usage bars line up; amber from 80%, red from 95%.']],
    ['0.1.10', '13 Oct 2026', 'Small fixes', ['Account usage readable again; plainer usage heads-up above the message box.']],
    ['0.1.9', '13 Oct 2026', 'Finding your way, and accounts', ['Menus never cut off; a calmer sidebar for hundreds of projects and chats.', 'Rename accounts; see plan and email; usage meters per Claude account; custom endpoint accounts.', 'Chat and terminal stay in sync when you continue a chat in the terminal.']],
    ['0.1.8', '13 Oct 2026', 'Maintenance release', ['No release notes were written for this build.']],
    ['0.1.7', '13 Oct 2026', 'See what Claude’s agents are doing; Gemini in chat', ['Subagents as live cards, a Running tray for background commands, a context meter with Compact now.', 'Messages sent while Claude works are queued; readable tool steps with inline diffs; proper plan approval.', 'Open and continue chats you started in a terminal; phone access per chat.', 'Gemini CLI runs in the chat view.']],
    ['0.1.6', '12 Oct 2026', 'Restore and archive behave', ['Closing a tab no longer archives it; ⇧⌘T reopens closed tabs.', 'Restart brings back half-typed messages, scroll position and everything that was open.']],
    ['0.1.5', '12 Oct 2026', 'A calmer look; pop-outs', ['A calm new look, no purple.', 'Pop a chat, terminal, diff or file into its own window (⌥⌘N) and dock it back (⌥⌘B).', 'Your data folder is private to you; a smaller download.']],
    ['0.1.4', '12 Oct 2026', 'Icon, quick terminal, editors', ['A quick terminal drawer under the chat (⌃`).', '“Open in” lists your installed editors.', 'Signed and notarized install DMG.']],
    ['0.1.3', '11 Oct 2026', 'Updates and removal', ['A Restart to update button that warns if chats are running; chats survive sleep.', 'Remove all data and Uninstall options.']],
    ['0.1.2', '11 Oct 2026', 'Finds Claude Code', [`${N} finds Claude Code wherever it is installed, and Home shows whether it is signed in.`]],
    ['0.1.1', '11 Oct 2026', 'Smarter composer', ['Smart paste, drag and drop, / commands and @ file mentions.', 'A separate dev app so a test build never mixes with the real one.']],
    ['0.1.0', '11 Oct 2026', 'First release', ['The first signed, notarized release with auto-update.']],
  ];
};

export function changelog(c) {
  // Driven by data/changelog.json: a snapshot of the app's one changelog (scripts/sync-changelog.mjs). Falls back to the
  // older hand-written list if the snapshot is missing.
  let entries = null;
  try { entries = JSON.parse(readFileSync(join(root, 'data', 'changelog.json'), 'utf8')).entries; } catch { /* fallback below */ }
  const cur = c.cfg.release.version;
  const vparts = (v) => v.split('.').map(Number);
  const newer = (a, b) => { const x = vparts(a), y = vparts(b); for (let k = 0; k < 3; k++) if (x[k] !== y[k]) return x[k] - y[k]; return 0; };
  const fmt = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const sec = (label, list) => (list && list.length ? `<h3 class="relsec">${label}</h3><ul>${list.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '');
  let html;
  let lede;
  if (entries) {
    const released = entries.filter((e) => newer(e.version, cur) <= 0);
    const next = entries.filter((e) => newer(e.version, cur) > 0);
    const art = (e, isNext) => `<article class="rel" id="v${e.version}"><div class="v">v${e.version}${e.version === cur ? '<span class="pill">Latest</span>' : ''}${isNext ? '<span class="pill">Not released</span>' : ''}<small>${esc(fmt(e.date))}</small></div><div><h2>${esc(e.headlines[0] ?? '')}</h2>${e.headlines[1] ? `<p class="muted">${esc(e.headlines[1])}</p>` : ''}${sec('New', e.new)}${sec('Improved', e.improved)}${sec('Fixed', e.fixed)}</div></article>`;
    html = (next.length ? `<div class="notice-next"><p><b>Coming next.</b> Merged or being finished, not released yet. Dates and wording can still change.</p></div>${next.map((e) => art(e, true)).join('')}<hr class="relsep">` : '') + released.map((e) => art(e, false)).join('');
    lede = `${released.length} releases since 11 Oct 2026, newest first. This page is generated from the same list the app shows as “What’s new”, so the two cannot disagree.`;
  } else {
    const rows = CHANGES(c);
    html = rows.map(([v, d, t, items, curFlag]) => `<article class="rel" id="v${v}"><div class="v">v${v}${curFlag ? '<span class="pill">Latest</span>' : ''}<small>${esc(d)}</small></div><div><h2>${esc(t)}</h2><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div></article>`).join('');
    lede = `${rows.length} releases, newest first. Rewritten in plain words from the release notes.`;
  }
  const body = pageHead('What’s new.', lede, 'Changelog') + `<div class="wrap narrow" style="padding-bottom:5rem">${html}</div>`;
  return { body };
}

export function notFound(c) {
  const { N, url } = c;
  return { body: `<div class="wrap notfound"><p class="eyebrow">404</p><h1>That page is not here.</h1><p class="lede">It may have moved, or never existed. ${esc(N)} is a young product and this site is still being built.</p><div class="btn-row"><a class="btn primary" href="${url()}">Back to home</a><a class="btn" href="${url('features/')}">Features</a></div></div>` };
}
