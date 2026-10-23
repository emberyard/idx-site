import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../lib.mjs';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const latestChanges = (cur, n = 3) => {
  try {
    const all = JSON.parse(readFileSync(join(siteRoot, 'data', 'changelog.json'), 'utf8')).entries;
    const num = (v) => v.split('.').reduce((a, x) => a * 1000 + Number(x), 0);
    return all.filter((e) => num(e.version) <= num(cur)).slice(0, n);
  } catch { return []; }
};

// The six pains, each with before / after. Numbers carry their source; ones that need re-measuring say so.
export const pains = (c) => {
  const { N } = c;
  return [
    {
      id: 'terminals', n: '01', t: 'Scattered terminals',
      why: 'You run agents on many projects. Each chat lives in some terminal tab, in some window.',
      before: 'You hunt for the right tab. The first minutes of every session go on finding your place.',
      after: `Each project gets its own window with its chats, terminal, files and changes together. ${c.kbd('⌘', 'P')} jumps to any project or chat by name.`,
      ev: 'In my own usage logs from my previous tool, 69% of everything I opened was a terminal tab, across 94 projects (audited 14 Oct).',
      link: ['features/#projects', 'Projects and windows'],
    },
    {
      id: 'restart', n: '02', t: 'Lost after a restart',
      why: 'Updates, crashes and reboots happen. Your desk should survive them.',
      before: 'A restart wipes the screen. Which chats were running? In which folder? You rebuild it by hand.',
      after: 'Windows, tabs, chats, half-typed messages and scroll position come back as you left them. Only the chats in front start; the rest resume when you open them.',
      ev: 'Tested with 120 terminal tabs across 3 windows, including after a force quit (release notes v0.1.16). Being re-tested before launch.',
      link: ['features/#persistence', 'Archive and persistence'],
    },
    {
      id: 'noise', n: '03', t: 'Noise, then missed questions',
      why: 'When everything beeps, you stop listening. Then the one real question waits.',
      before: 'Bells ring all day, so you tune them out and miss the one that mattered. Junk sessions pile up on your phone.',
      after: `${N} only calls you when an agent truly asks something or needs a yes: a calm list, a Dock badge, a notification. Phone access is off until you turn it on, chat by chat.`,
      ev: 'In my previous tool, one terminal rang its attention bell 76,425 times in 11 days (my logs, 3 to 13 Oct).',
      link: ['features/#trust', 'Trust and approvals'],
    },
    {
      id: 'approvals', n: '04', t: 'The same question, again and again',
      why: 'Agents ask "may I run this?" all day.',
      before: 'You click yes without reading, or you switch every check off and hope.',
      after: 'Pick how careful to be per project: careful, balanced or full access. Remember the safe actions. Low-risk requests can be answered for you while you are away, and the log shows every one.',
      ev: 'Trust levels and smart approvals: release notes v0.1.19 and v0.1.21. The pain itself is my own experience.',
      link: ['features/#permissions', 'Permissions'],
    },
    {
      id: 'clutter', n: '05', t: 'Throwaway work piles up',
      why: 'Quick experiments are how ideas start. They should be cheap to try and safe to drop.',
      before: 'Scratch folders multiply. A week later you cannot tell which ones matter, and you are afraid to delete the wrong one.',
      after: `A sandbox starts in one step (${c.kbd('⌃', '⌘', 'N')}). Keep it, and it moves to a folder you pick. Discard it, and it goes to the Archive with the folder intact. Archive hides; it never deletes.`,
      ev: '74 of my 94 projects in my previous tool were sandboxes (audited 14 Oct).',
      link: ['features/#persistence', 'Sandboxes and archive'],
    },
    {
      id: 'blind', n: '06', t: 'A heavy Mac and a plan you cannot see',
      why: 'Many live chats eat memory, and plan limits arrive without warning.',
      before: 'Twenty chats open, the fan spins, and you only learn about your usage when a limit hits.',
      after: 'How many chats run at once follows your Mac’s real memory. Idle chats stop on their own and come back when you open them. Usage meters for each Claude account sit in view.',
      ev: 'About half a gigabyte per live chat, and about a second to bring one back, measured on my Mac Studio on 14 Oct. Your Mac will differ.',
      link: ['features/#resources', 'Memory and accounts'],
    },
  ];
};

const tour = (c) => {
  const { N } = c;
  return [
    { tab: 'Windows', t: 'One window per project. Or a few, together.', p: `Each project gets its own window with its chats, terminal, files and changes. Group related projects as tabs, or give each one a display. Windows come back where you left them.`, shot: 'home', alt: `The top left of a ${N} window: project tabs along the top, and a sidebar that lists only the open projects with their chats and status.`, marks: [] },
    { tab: 'Chat and terminal', t: 'Read it as a chat. Flip it to the real terminal.', p: `Your Claude Code or Gemini CLI conversation shows as a clean chat: the plan, each step, inline diffs. One click flips the same conversation to the real terminal. Nothing is hidden behind either view.`, shot: 'project', alt: `A chat in ${N} about adding rate limiting: steps folded into one line each, a Write with its diff, the answer and a list of changed files.`, marks: [] },
    { tab: 'Needs you', t: 'It speaks up only when an agent truly asks.', p: `A permission or a question marks its chat in amber, adds a Dock badge and a notification. Answer with ${c.kbd('1')} ${c.kbd('2')} ${c.kbd('3')}, or jump to the next chat that is waiting with ${c.kbd('⇧', '⌘', 'U')}. Finished work stays quiet.`, shot: 'needs', alt: `A permission card: Allow Bash? with the exact psql command and buttons Allow once, Always allow, Deny.`, marks: [] },
    { tab: 'Switcher', t: 'Any project or chat in a second.', p: `${c.kbd('⌘', 'P')} opens the switcher. Results show their folder, so two projects with the same name never get confused. ${c.kbd('⌘', 'K')} is the command palette, which also searches messages and archived chats.`, shot: 'switcher', alt: `The command palette over a dimmed ${N} window: projects, then chats, each with its folder.`, marks: [] },
    { tab: 'Trust', t: 'Choose how careful it is, per project.', p: `Careful, balanced or full access. Balanced is the default: file edits inside the project go through, commands and anything outside it ask first. Full access asks you to confirm and says plainly what it means.`, shot: 'trust', alt: `The Trust and permissions settings: a Trust level control with Careful, Balanced and Full access, and the default permission mode.`, marks: [] },
    { tab: 'Accounts', t: 'Your accounts, with usage in view.', p: `Choose the account per chat. Claude accounts show their 5-hour and weekly usage from Claude itself. Accounts that bill per use are marked and are never picked for you.`, shot: 'accounts', alt: `The Connected accounts strip: two Claude subscriptions, a Gemini sign-in, a Gemini API key marked Metered, and a Google AI Pro account for Antigravity.`, marks: [] },
  ];
};

// The things that make it a cockpit, each with a real capture of the current build (invented demo data).
const showcase = (c) => {
  const { N, kbd, shot } = c;
  const rows = [
    { id: 'restart', eyebrow: 'Restarts', t: 'A restart does not cost you your place.', p: `After an update, a quit or a crash, every project reopens as it was. A chat that was cut off mid-way is marked “Interrupted by restart” with one Continue button. Continue tells the agent ${N} restarted and asks it to check what is done before going on. It is sent once, and nothing is sent by itself unless you switch auto-continue on.`, img: 'restart', alt: `A chat that was cut off: the last message from the agent, then a line reading “Interrupted by restart. ${N} restarted while this was running. Everything done so far is kept above”, with Continue and Dismiss buttons.`, note: 'New in v0.1.36.' },
    { id: 'details', eyebrow: 'Sub-agents', t: 'Helpers stay out of your way until you want them.', p: `When an agent hands work to a helper, the chat shows one calm line: its name, status, steps and a one-line result. Open it and the whole run unfolds beside the chat: the prompt, every step, the result. A running helper adds steps as they happen. Nothing opens by itself.`, keys: [[kbd(']'), 'next'], [kbd('['), 'previous'], [kbd('W'), 'close'], [kbd('Esc'), 'back to the chat']], img: 'details', alt: `A chat with two sub-agent lines, one done and one working, and the Details panel open beside it showing the finished run: its prompt, its steps and its result table.`, wide: true, note: 'New in v0.1.27; v0.1.28 adds full-size previews.' },
    { id: 'folds', eyebrow: 'Detail level', t: 'See as much or as little as you need.', p: `Long agent work folds into rows that say what is inside: steps, files, failures. A failed step opens itself and never hides. Pick Summary, Normal or Everything per chat, and collapse or expand every step at once. ${N} remembers what you opened, chat by chat.`, keys: [[kbd('⌥', '⌘', 'L'), 'next detail level'], [kbd('⌥', '⌘', 'E'), 'expand all'], [kbd('⇧', '⌥', '⌘', 'E'), 'collapse all']], img: 'folds', alt: `A chat column with steps folded into one line each, a Write step open with its added lines, and a closed row that reads Worked for 1m 34s, 5 steps, 1 file.` },
    { id: 'sendnow', eyebrow: 'Send now', t: 'Talk to an agent while it works.', p: `Type while Claude is mid-task. Send reads your message at the next safe point. Send now cuts in at once but never kills a running command. Redirect stops the tool and sends. You can write while a permission waits; nothing is approved for you.`, keys: [[kbd('↵'), 'send'], [kbd('⌃', '↵'), 'send now'], [kbd('⌘', '↵'), 'redirect']], img: 'sendnow', alt: `The message box while an agent works: a typed message, the hint “send, send now, redirect”, and Stop and Send now buttons.` },
    { id: 'terminal', eyebrow: 'Terminal', t: 'A real terminal, with the features you miss.', p: `Every agent has a real terminal one click away. Find in the whole scrollback, file paths with line numbers that open the file, a button to jump to the newest output, a right-click menu, clear, copy on select (off until you want it), its own text size keys, and a scrollback you choose.`, keys: [[kbd('⌘', 'F'), 'find'], [kbd('⌥', '⌘', 'K'), 'clear'], [kbd('⌃', '⌘', '='), 'bigger text']], img: 'terminal', alt: `The terminal panel beside a chat: a test run, a find bar with the match highlighted and file paths with line numbers.`, note: 'New in v0.1.27.' },
    { id: 'limits', eyebrow: 'Accounts and limits', t: 'You decide when an account switches. Never the app.', p: `Several Claude and Gemini sign-ins, each with its own folder, side by side. When a plan limit is reached, a calm strip says which account and when it resets. Switching account for that chat is a button you press, a reminder at the reset is optional, and nothing is rotated behind your back.`, img: 'limit', alt: `A stopped chat reading “Stopped: session limit”, with when it resets and a note that nothing was lost, above a message box that says the limit is reached and you can still send.`, extra: `<div class="note-honest"><b>Honest about Google Antigravity.</b> ${esc(N)} opens Antigravity as a terminal tab you type into, nothing more. Google’s FAQ says that wrapping it in another app, or rotating accounts automatically, is not supported on consumer plans, so ${esc(N)} never does either. <a href="${c.url('claude-and-gemini/')}">Details</a></div>`, note: 'New in v0.1.27.' },
  ];
  return `
<section id="cockpit">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">The cockpit</p><h2>Built for people who live in their agents all day.</h2><p>Real screens from the current build, with invented demo data.</p></div>
    ${rows.map((r, i) => `<article class="show${i % 2 ? ' flip' : ''}${r.wide ? ' wide' : ''}" id="${r.id}">
      <div class="show-text"><p class="eyebrow">${esc(r.eyebrow)}</p><h3>${r.t}</h3><p class="muted">${r.p}</p>
        ${r.keys ? `<p class="keys">${r.keys.map(([k, l]) => `<span>${k} ${esc(l)}</span>`).join('')}</p>` : ''}
        ${r.extra ?? ''}${r.note ? `<p class="show-note">${esc(r.note)}</p>` : ''}</div>
      <div class="show-img">${shot(r.img, { alt: r.alt, sizes: r.wide ? '(min-width: 120rem) 100rem, 100vw' : '(min-width: 62em) 62vw, 100vw' })}</div>
    </article>`).join('')}
  </div>
</section>`;
};

export function home(c) {
  const { N, B, url, shot, kbd } = c;
  const rel = c.cfg.release;
  const P = pains(c);
  const T = tour(c);
  const dl = c.access;

  const hero = `
<section class="hero">
  <div class="wrap">
    <p class="eyebrow">For people who run AI coding agents on many projects</p>
    <div class="hero-copy"><h1>${esc(B.tagline)}</h1>
    <div><p class="lede">${esc(N)} gives every project its own window on your Mac, over your own Claude Code and Gemini CLI. Its chats, terminal, files and changes stay together. Restart, and it all comes back.</p>
    <div class="btn-row">
      <a class="btn primary" href="${dl.href}">${esc(dl.label)}</a>
      <a class="btn" href="#cockpit">See the cockpit</a>
    </div></div></div>
    <p class="smallprint">Private beta, by invitation. Mac only (${esc(rel.chip)}, macOS ${esc(rel.minMacOS)} or newer). Needs Claude Code or Gemini CLI. ${esc(N)} is a working name and may change.</p>
  </div>
  <div class="wrap wide hero-stage">
    ${shot('hero', { eager: true, mobile: 'hero-m', sizes: '(min-width: 120rem) 120rem, 100vw', alt: `A ${N} window at 4K: a sidebar of projects and chats on the left, a chat in the middle with folded steps, an open diff and the changed files, and the right panel with Files, Browser, Diff, Terminal and Details tabs.`, marks: [[50.7, 2.2, 'Project tabs: one project per tab or window'], [14.6, 31.5, 'Every project and its chats, with status'], [59.6, 5.7, 'Chat or Terminal: the same conversation'], [59.6, 31.5, 'Every step is a row you can open'], [68.9, 5.7, 'Files, Diff, Terminal and Details beside the chat']], caption: 'Real screenshot of the current build at 2560 x 1440, invented demo data.' })}
  </div>
</section>`;

  const showcaseHtml = showcase(c);
  const news = latestChanges(rel.version, 3);
  const whatsNew = `
<section class="band" id="whatsnew">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">What’s new</p><h2>It moves fast, and says plainly what changed.</h2><p>The latest releases, in plain words. The same list the app shows after an update.</p></div>
    <div class="grid c3">${news.map((e) => `<div class="card"><p class="eyebrow">v${esc(e.version)} · ${esc(new Date(e.date + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }))}</p><h3>${esc(e.headlines[0] ?? '')}</h3>${e.headlines[1] ? `<p class="muted">${esc(e.headlines[1])}</p>` : ''}</div>`).join('')}</div>
    <p style="margin-top:1.5rem"><a href="${url('changelog/')}">Every release, newest first</a></p>
  </div>
</section>`;

  const problem = `
<section class="band" id="problem">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">The problem</p><h2>The AI is fine. The desk around it is a mess.</h2>
    <p>When you direct coding agents all day, the tools around them become the problem: loose terminal tabs, bells you stop hearing, a restart that wipes your screen, the same approval again and again.</p></div>
    <div class="quote-lines">
      <p>“Which terminal was that project in?”</p>
      <p>“Did something just ask me a question?”</p>
      <p>“What was running before I restarted?”</p>
    </div>
    <p class="muted" style="max-width:44rem">None of this is the AI being bad. It is the desk around the AI. ${esc(N)} is a calmer desk.</p>
  </div>
</section>`;


  const how = `
<section class="band" id="how">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">How it works</p><h2>Three steps, and no new way of working.</h2></div>
    <div class="grid c3">
      <div class="card"><span class="num">1</span><h3>Open a project</h3><p>It gets its own window. Its chats, terminal, files and changes are inside.</p></div>
      <div class="card"><span class="num">2</span><h3>Work as you do now</h3><p>Chat with Claude Code or Gemini CLI. Flip to the real terminal on the same conversation any time.</p></div>
      <div class="card"><span class="num">3</span><h3>Walk away</h3><p>${esc(N)} only calls you when an agent truly needs you. Quit, restart, come back. Everything is where you left it.</p></div>
    </div>
    <p class="muted" style="margin-top:1.5rem;max-width:46rem">${esc(N)} runs your own Claude Code and Gemini CLI. It does not sell you a model, and it never touches your sign-in.</p>
  </div>
</section>`;

  const painsHtml = `
<section id="pains">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">Six daily pains, before and after</p><h2>What changes, in plain words.</h2><p>Each of these is a small cost you pay every day without noticing. Each one has a number from my own data where I have one, and says so where I do not.</p></div>
    ${P.map((p) => `<article class="pain" id="${p.id}"><h3>${p.n}. ${esc(p.t)}</h3><p class="why">${esc(p.why)}</p>
      <div class="ba"><div class="before"><span class="lbl">Before</span>${esc(p.before)}</div><div class="after"><span class="lbl">With ${esc(N)}</span>${p.after}</div></div>
      <p class="evidence">${esc(p.ev)} <a href="${url(p.link[0])}">${esc(p.link[1])}</a></p></article>`).join('')}
  </div>
</section>`;

  const tourHtml = `
<section class="band tour" id="tour" data-tour>
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">The product, up close</p><h2>Real screens from the current version.</h2><p>Screenshots are from version ${esc(rel.version)} with invented demo data. Dark and light are both real.</p></div>
    <div class="tabs" role="tablist" aria-label="Product tour">${T.map((t, i) => `<button role="tab" type="button" id="tab-${i}" aria-controls="tp-${i}" aria-selected="${i === 0}">${esc(t.tab)}</button>`).join('')}</div>
    ${T.map((t, i) => `<div class="panel" role="tabpanel" id="tp-${i}" aria-labelledby="tab-${i}">
      <div><h3>${t.t}</h3><p class="muted">${t.p}</p><p><a href="${url('features/')}">All features</a></p></div>
      ${shot(t.shot, { alt: t.alt, marks: t.marks, sizes: '(min-width: 62em) 60vw, 100vw' })}
    </div>`).join('')}
  </div>
</section>`;

  const tools = `
<section id="tools">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">Your tools, not ours</p><h2>It sits on top of Claude Code and Gemini CLI.</h2><p>${esc(N)} ships neither and never handles your sign-in. Your usage is billed by each provider to your own account. Google’s Antigravity opens as a plain terminal tab.</p></div>
    <div class="tools">
      <div class="card"><h3>Claude Code</h3><p class="muted">The deepest support. Chat, plans, approvals, subagents, background commands, files, rewind and fork.</p><ul><li>Works through Claude Code’s own SDK</li><li>Some newer Claude Code features are terminal only for now</li></ul></div>
      <div class="card"><h3>Gemini CLI</h3><p class="muted">Chat view for Gemini CLI on an API key, a paid plan or a company plan. Thinner than Claude support today.</p><ul><li>The terminal is always there as a fallback</li><li>Free personal sign-in ended in the CLI on 18 June 2026</li></ul></div>
    </div>
    <p style="margin-top:1.5rem"><a href="${url('claude-and-gemini/')}">What is supported and what is not yet</a></p>
  </div>
</section>`;

  const proof = `
<section class="band" id="proof">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">Made from real use</p><h2>Shaped by my own logs, not a guess.</h2></div>
    <div class="stats-row">
      <div class="stat"><b>94</b><span>projects in my last tool, opened about 2,241 times</span><small>My own data, audited 14 Oct</small></div>
      <div class="stat"><b>69%</b><span>of everything I opened was a terminal tab</span><small>My own data, audited 14 Oct</small></div>
      <div class="stat"><b>${rel.releasesCount}</b><span>signed and notarized releases in ${rel.spanDays} days</span><small>Release history, ${esc(rel.firstDate)} to ${esc(rel.date)}</small></div>
      <div class="stat"><b>~21 h</b><span>from first commit to the first signed release</span><small>Git log and release time; derived</small></div>
    </div>
  </div>
</section>`;

  const limits = `
<section id="limits">
  <div class="wrap">
    <div class="sec-head"><p class="eyebrow">Honest limits</p><h2>What ${esc(N)} is not, yet.</h2><p>It is young, and I would rather you read this before you try it.</p></div>
    <div class="grid c2">
      <ul class="dashes" style="margin:0">
        <li>Mac only, Apple Silicon. No Windows or Linux.</li>
        <li>You need Claude Code or Gemini CLI installed and signed in.</li>
        <li>Version 0.x. It moves fast and some corners are rough.</li>
        <li>Not yet my only daily tool. I am moving my real projects over now.</li>
      </ul>
      <ul class="dashes" style="margin:0">
        <li>Files are read-only: you can read them and see changes, not edit.</li>
        <li>No search across a whole project yet.</li>
        <li>Gemini support is thinner than Claude support.</li>
        <li>No Slack or email alerts when you are away. The name is not final.</li>
      </ul>
    </div>
  </div>
</section>`;

  const privacy = `
<section class="tight band">
  <div class="wrap">
    <div class="grid c2" style="align-items:center">
      <div><p class="eyebrow">Privacy</p><h2>Your data stays on your Mac.</h2></div>
      <div><p class="muted">No account, no sign-up, no analytics, no telemetry. Projects and settings live in one local database. Only your own Claude Code or Gemini CLI talks to its provider, as it already does. <a href="${url('privacy/')}">Read the privacy and security note</a>.</p></div>
    </div>
  </div>
</section>`;

  const accessHtml = `
<section id="access">
  <div class="wrap">
    <div class="access">
      <div>
        <p class="eyebrow">Early access</p>
        <h2>${dl.live ? 'Try it on your Mac.' : 'A private beta, for now.'}</h2>
        <p class="muted" style="margin-top:1rem">${dl.live ? `Signed and approved by Apple. It updates itself.` : `${esc(N)} is a private beta and open by invitation only. It is young, and the working name may change.`}</p>
        <div class="btn-row" style="margin-top:1.25rem">${dl.live ? `<a class="btn primary" href="${dl.href}">${esc(dl.label)}</a>` : `<span class="btn" role="note" aria-label="Access is by invitation">By invitation</span>`}<a class="btn" href="${url('changelog/')}">See the changelog</a></div>
        <p class="smallprint">${B.email ? `Contact: ${c.mail()}` : 'There is no public contact address yet. It will be listed here once there is one.'}</p>
      </div>
      <ul class="facts">
        <li>Version <b>${esc(rel.version)}, ${esc(rel.date)}</b></li>
        <li>Platform <b>macOS ${esc(rel.minMacOS)}+, ${esc(rel.chip)}</b></li>
        <li>Download size <b>about ${rel.sizeMB} MB</b></li>
        <li>Signed and notarized <b>Yes, and it updates itself</b></li>
        <li>Needs <b>Claude Code or Gemini CLI</b></li>
      </ul>
    </div>
  </div>
</section>`;

  const ld = `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: N, applicationCategory: 'DeveloperApplication', operatingSystem: `macOS ${rel.minMacOS}+`, description: B.statement, softwareVersion: rel.version })}</script>`;
  return { body: hero + showcaseHtml + whatsNew + problem + how + painsHtml + tourHtml + tools + proof + limits + privacy + accessHtml, head: ld };
}
