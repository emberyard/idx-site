import { esc, pageHead } from '../lib.mjs';

// Five-CLI table (IDX-490). Every cell has a source in the app repo (emberyard/idx, private):
//   CL = packages/protocol/src/changelog.ts entry (version in the cell note), CF = CLI_FEATURES / PERMISSION_MODES / GROK_CLI in
//   packages/protocol/src/config.ts, AD = docs/adapters/{README,grok,cursor}.md (read at v0.1.41).
// Support table (Claude Code and Gemini CLI in detail), derived from reading the app's code against Claude Code 2.1.295 and Gemini CLI 0.64 at app v0.1.21 (re-verified against the current build before launch).
// F = fully supported, P = partly, T = only in the terminal, N = not yet, X = does not apply to that tool.
const ROWS = [
  ['Chat', [
    ['Chat with streaming replies and thinking', 'F', 'F', ''],
    ['Stop a turn, queue a message, redirect', 'F', 'P', 'Gemini: stop works, no queue'],
    ['Plan mode and plan approval', 'F', 'P', 'Gemini: plan text shows as a card, approval is a generic permission'],
    ['Questions from the agent, answered as choices', 'F', 'N', ''],
    ['To-do list as a live checklist', 'F', 'P', 'Gemini: flattened into text'],
    ['Context meter, compact', 'F', 'P', 'Gemini: token line only'],
    ['Switch model, rewind, fork', 'F', 'P', 'Gemini: model switch works; no fork; rewind is partial'],
    ['Images, @ file mentions, paste', 'F', 'F', ''],
    ['Web search and fetch', 'F', 'F', ''],
  ]],
  ['Permissions and trust', [
    ['Permission cards with Allow once, Always allow, Deny', 'F', 'F', ''],
    ['Permission modes', 'F', 'F', ''],
    ['Folder trust', 'P', 'P', 'Trust levels per project; CLI trust dialogs still need the terminal'],
  ]],
  ['Background work', [
    ['Subagents: one chip in the chat that opens in a Details panel, with Stop', 'F', 'P', 'Gemini: shown as ordinary tool calls'],
    ['Background commands: move to background, a Running tray', 'F', 'N', ''],
    ['Monitors', 'F', 'X', ''],
    ['Workflow runs', 'P', 'X', 'Shown as a generic task row'],
    ['Background sessions (agent view)', 'T', 'X', 'Run claude agents in a terminal tab'],
    ['Scheduled loops and wakeups', 'N', 'X', 'A fired wakeup still shows its reply'],
    ['Reply to a running subagent or teammate', 'N', 'X', ''],
    ['Cloud routines and remote sessions', 'N', 'X', ''],
  ]],
  ['Around the chat', [
    ['Phone access (Claude app remote control)', 'F', 'X', 'Off by default, per chat'],
    ['Resume, rename, archive, import from terminal', 'F', 'F', ''],
    ['Chat to terminal and back', 'F', 'F', ''],
    ['Usage, cost and rate limits', 'F', 'P', 'Gemini: token counts, no quota meter'],
    ['Slash commands and skills menu', 'F', 'P', 'Commands that need the full terminal screen do nothing in Gemini chat'],
    ['Files Claude sends you, as previews', 'F', 'X', ''],
  ]],
  ['Setup and management', [
    ['MCP servers: see status', 'P', 'N', 'Claude: read-only list in Settings'],
    ['MCP approvals, sign-in, reconnect, add', 'T', 'N', ''],
    ['Hooks: their messages in the chat', 'P', 'N', ''],
    ['Hooks and plugins management', 'T', 'N', ''],
    ['Memory files (CLAUDE.md, GEMINI.md): view or edit', 'T', 'N', ''],
    ['Effort, fast mode, output style pickers', 'N', 'N', ''],
    ['Task checklist tools (newer models)', 'N', 'N', 'Shown as generic tool rows'],
  ]],
];

// [capability, claude, gemini, antigravity, grok, cursor]. Plain words only; a cell with no support says so.
const FIVE = [
  ['How it runs in the app', 'Chat view, over Claude Code’s own SDK', 'Chat view, over Gemini CLI’s editor protocol; the terminal as fallback', 'A terminal tab only', 'Chat view, over Grok’s agent protocol', 'Chat view, over Cursor CLI’s agent protocol'], // AD README "Driver"
  ['Chat | Terminal switch on the same conversation', 'Yes', 'Yes', 'Always a terminal', 'Yes', 'Yes'], // CL 0.1.39: "Grok, Cursor and Gemini chats get the Chat | Terminal switch, like Claude chats."
  ['New chat in terminal (⌥⌘T)', 'Yes', 'No, chat view only', 'Always a terminal', 'Yes', 'Yes'], // CL 0.1.40
  ['Permission modes', 'Ask first, Accept edits, Auto, Don’t ask, Plan only, Bypass', 'Those the CLI offers', 'None: the terminal owns it', 'Ask, Accept edits, Plan, Auto, Bypass', 'Ask, Accept edits, Plan, Bypass. Auto and Don’t ask act as Ask'], // CF PERMISSION_MODES, GROK_CLI.modes; AD cursor.md "How it maps"
  ['A message sent while it works', 'Send now or Redirect', 'Held, sent when the turn ends', 'Not offered', 'Grok queues it; the bubble says how many are ahead', 'Held, sent when the turn ends'], // AD README, grok.md (CL 0.1.41), cursor.md
  ['Context meter', 'Yes', 'Not reported by Gemini', 'Not reported', 'Yes', 'Not reported by Cursor'], // CF contextFrom = claude, grok; CL 0.1.40
  ['Usage and cost', 'Plan usage meter', 'None', 'None', 'Tokens and cost per turn', 'None reported'], // AD README; CL 0.1.38 (Grok cost)
  ['Fork, fast mode, output styles, MCP list, phone access', 'Yes', 'Dimmed, with the reason', 'Dimmed, with the reason', 'Dimmed, with the reason', 'Dimmed, with the reason'], // CF claudeOnly; CL 0.1.40
  ['Models', 'Your Claude Code’s list', 'The CLI’s list, and any id you type', 'In the terminal', 'The CLI’s list; effort levels where the CLI lists them', 'Marked Included in your plan or Billed per token; a billed model asks once per project'], // AD README; CL 0.1.38, 0.1.39, 0.1.41
];
const LBL = { F: ['Full', 'full'], P: ['Partial', 'part'], T: ['Terminal only', 'part'], N: ['Not yet', 'no'], X: ['n/a', 'no'] };

export function support(c) {
  const { N, url } = c;
  const table = ROWS.map(([g, rows]) => `<h3 style="margin:2.5rem 0 .8rem">${esc(g)}</h3><div class="tablewrap"><table><thead><tr><th scope="col">Capability</th><th scope="col">Claude Code</th><th scope="col">Gemini CLI</th><th scope="col">Note</th></tr></thead><tbody>${rows.map(([n, a, b, note]) => `<tr><th scope="row" style="text-transform:none;letter-spacing:0;font-family:inherit;font-size:.95rem;color:var(--text);background:none;font-weight:400">${esc(n)}</th><td class="${LBL[a][1]}">${LBL[a][0]}</td><td class="${LBL[b][1]}">${LBL[b][0]}</td><td class="muted">${esc(note)}</td></tr>`).join('')}</tbody></table></div>`).join('');
  const five = `<div class="tablewrap"><table><thead><tr><th scope="col">Capability</th><th scope="col">Claude Code</th><th scope="col">Gemini CLI</th><th scope="col">Antigravity</th><th scope="col">Grok Build</th><th scope="col">Cursor CLI</th></tr></thead><tbody>${FIVE.map(([n, ...cells]) => `<tr><th scope="row" style="text-transform:none;letter-spacing:0;font-family:inherit;font-size:.95rem;color:var(--text);background:none;font-weight:400">${esc(n)}</th>${cells.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const body = pageHead('Five coding CLIs, and what is not covered yet.', `${esc(N)} drives the tools you already installed: Claude Code, Gemini CLI, Antigravity, Grok Build and Cursor CLI. Claude Code support is deepest. Each of the others is real and thinner. The lists below say what is missing.`, 'Supported CLIs') +
    `<div class="wrap">
  <div class="tools" style="margin-bottom:1.5rem">
    <div class="card"><h2>Claude Code</h2><p class="muted">Runs through Claude Code’s own SDK, using the copy you installed and signed in to. Chat, plans, approvals, subagents, background commands, files, rewind and fork all work. Plan usage, effort and fast-mode pickers, tool-server questions, background tasks and the agent’s checklist are in. Background sessions and scheduled loops are not yet, or only in the terminal.</p></div>
    <div class="card"><h2>Gemini CLI</h2><p class="muted">Runs in the chat view over Gemini CLI’s editor protocol, for API-key, paid and company plans. Model and mode lists, approvals, file edits with diffs and finished replies work. Background work, questions from the agent and MCP status do not show up in chat yet. The terminal is always there as a fallback.</p></div>
  </div>
  <div class="tools" style="margin-bottom:1.5rem">
    <div class="card"><h2>Grok Build</h2><p class="muted">Runs in the chat view, with the Chat | Terminal switch and a new chat in terminal. Pick the model and reasoning effort in the chat. Grok queues your next message itself, and its chats show cost and how full the conversation is. Chats start lean, without your Claude Code setup, unless you turn that on in Settings. No rewind or fork.</p></div>
    <div class="card"><h2>Cursor CLI</h2><p class="muted">Runs in the chat view, with the Chat | Terminal switch and a new chat in terminal. The model menu marks each model <em>Included in your plan</em> or <em>Billed per token</em>, and a billed model asks once per project before it is used. Cursor reports no usage or context to the app.</p></div>
  </div>
  <p class="muted" style="margin-bottom:1.5rem">${esc(N)} never signs in for you to any of them. A missing or signed-out CLI gets a notice that says what to run.</p>
  <div class="card" style="margin-bottom:1.5rem"><h3>Antigravity: a terminal, and only a terminal</h3><p class="muted">${esc(N)} also opens Google’s Antigravity CLI (<code>agy</code>) as a terminal tab you type into, each Google account with its own folder. That is all it does. Google’s FAQ says that wrapping Antigravity in another app, or rotating accounts automatically, is not supported on consumer plans, so ${esc(N)} never types for it, never parses its screen and never switches your account. When a plan limit is hit, switching account is a button <em>you</em> press, and it is never offered for Antigravity.</p></div>
  <div class="card" style="margin-bottom:3rem"><h3>A note on Google’s change</h3><p class="muted">On 18 June 2026 Google stopped serving Gemini CLI requests for individual accounts (free sign-in, and personal Google AI plans). API-key and company plans were not affected, and individuals were pointed to Google’s separate Antigravity CLI. ${esc(N)} supports Gemini CLI with an API key, a paid plan or a company plan. Please check Google’s own announcement for the current terms.</p></div>
  <h2>The five side by side</h2>
  ${five}
  <p class="smallprint">Read from the app’s code and release notes at version 0.1.41. A CLI changes faster than this page can: if something here looks wrong for your version, trust the app and the <a href="${url('changelog/')}">changelog</a>.</p>
  <h2 style="margin-top:3rem">Claude Code and Gemini CLI, item by item</h2>
  <p class="legend"><b>Full</b> works in the chat view. <b>Partial</b> works with gaps. <b>Terminal only</b> works, in the real terminal. <b>Not yet</b> is not built. <b>n/a</b> does not exist in that tool.</p>
  ${table}
  <p class="smallprint">Derived from reading the app’s code against Claude Code 2.1.295 and Gemini CLI 0.64.0 at version ${esc(c.cfg.release.version)}, on 14 Oct 2026, with later rows touched up on 18 Oct. These tools change weekly, so the list will move with each release. See the <a href="${url('changelog/')}">changelog</a>.</p>
  <h2 style="margin-top:3rem">Not made by the makers of these tools</h2>
  <p class="muted">${esc(N)} ${esc(c.cfg.nonAffiliation)} It ships none of the tools, and each keeps its own sign-in.</p>
</div>`;
  return { body };
}

export const FAQ = (c) => {
  const { N, url, cfg } = c;
  const r = cfg.release;
  return [
    ['The basics', [
      [`What is ${N}?`, `A Mac app that gives each AI coding project its own window and keeps your chats, terminal and files together, over Claude Code, Gemini CLI, Antigravity, Grok Build and Cursor CLI. It is a cockpit over your own tools, not a new tool.`],
      [`Is ${N} the final name?`, `No. ${N} is a working name and will change before a public launch. Nothing on this site is final.`],
      ['Is it a new AI model?', 'No. It works with the tools you already use. It does not sell or resell a model.'],
      ['Does it replace the terminal?', 'No. Each conversation can be read as a chat or as the real terminal, and you can switch any time.'],
      ['Who makes it?', `One independent maker, directing a team of AI agents.`],
    ]],
    ['Getting it', [
      ['Is it free? What does it cost?', `Price has not been decided, and nothing here quotes one.`],
      ['How do I get it?', `It is a private beta and closed for now. How people get in has not been decided yet.`],
      ['Can I see the code?', `No. The code is private for now, and this site has no source link.`],
      ['Which Macs and which macOS?', `Apple Silicon Macs only, on macOS ${r.minMacOS} (Ventura) or newer. The download is about ${r.sizeMB} MB. There is no Intel build, and no Windows or Linux version.`],
      ['Is it signed? Does it update itself?', `Yes. Releases are signed with a Developer ID, approved by Apple (notarized) and update themselves. A Restart to update button appears when one is ready and warns you if chats are still running.`],
    ]],
    ['Your tools and accounts', [
      ['Which CLIs does it work with?', `Claude Code, Gemini CLI, Antigravity, Grok Build and Cursor CLI. You need at least one installed and signed in. ${N} runs your own copy, ships none of them, and each keeps its own sign-in. <a href="${url('claude-and-gemini/')}">What each one supports</a>.`],
      ['Do I need an API key or an account with you?', `Not for ${N} itself: there is no ${N} account, no sign-up and no server in between. Your use of each CLI is billed by its maker, Anthropic, Google, xAI or Anysphere, to your own account.`],
      ['Does it work with Gemini?', `Yes, in the chat view with Gemini CLI on an API key, a paid plan or a company plan. It is thinner than Claude support. Since 18 June 2026 Google no longer serves Gemini CLI for individual accounts, so a free personal sign-in will not work. See <a href="${url('claude-and-gemini/')}">Claude + Gemini</a>.`],
      ['Is it made by Anthropic or Google?', `No. ${N} ${cfg.nonAffiliation}`],
    ]],
    ['Your data and safety', [
      ['Where is my data?', `On your Mac. Projects, windows and settings are in one local database under <code>~/Library/Application Support</code>. Transcripts stay where your CLI keeps them. Delete the folder and ${N} forgets everything. <a href="${url('privacy/')}">Privacy and security</a>.`],
      ['What happens if I quit or the Mac restarts?', `Your windows, tabs and chats come back. If a chat cannot resume, ${N} tells you and offers Retry; it does not fail quietly.`],
      ['Will it delete my projects?', 'No. Archive hides things and Discard on a sandbox keeps the folder. Removing something for good is a separate, explicit action in Settings.'],
      ['Is it safe to let agents run?', `You choose a trust level per project: careful, balanced (the default) or full access. Full access asks you to confirm. Accounts that bill per use are marked and are never chosen for you.`],
    ]],
    ['Young and limited', [
      ['What is missing?', `Files are read-only. There is no search across a whole project yet. Support for the other CLIs is thinner than for Claude Code. There are no Slack or email alerts when you are away. It is Mac only, needs your own CLIs, and is version 0.x, so some corners are rough.`],
      ['Is it your main tool already?', `Not yet for everyone, and not fully for me. I am moving my real projects across now. I will say so here when that changes.`],
      ['Does it work on a big screen or two?', `That is what it was built for: one project per window, and windows return on their own display after a restart. It also works in a small window.`],
    ]],
  ];
};

export function faq(c) {
  const G = FAQ(c);
  const body = pageHead('Questions, answered plainly.', `If something is limited, it says so.`, 'FAQ') +
    `<div class="wrap narrow" style="padding-bottom:5rem">${G.map(([g, qs]) => `<div class="faq-group"><h2>${esc(g)}</h2>${qs.map(([q, a]) => `<details class="q"><summary>${esc(q)}</summary><div><p>${a}</p></div></details>`).join('')}</div>`).join('')}<p class="muted" style="margin-top:3rem">Something missing? Contact: ${c.mail()}</p></div>`;
  const ld = `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: G.flatMap(([, qs]) => qs).map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) })}</script>`;
  return { body, head: ld };
}
