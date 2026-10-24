import { esc, pageHead } from '../lib.mjs';

const dgChatTerminal = `<div class="diagram"><svg viewBox="0 0 520 190" role="img" aria-label="One conversation, two views: a chat view and the real terminal, with a switch between them."><rect class="box" x="10" y="20" width="200" height="150" rx="10"/><text class="t" x="26" y="48">Chat view</text><text class="s" x="26" y="74">Plan, steps, diffs,</text><text class="s" x="26" y="94">answers you can read</text><rect class="hl" x="26" y="112" width="168" height="30" rx="6"/><text class="s" x="38" y="132">Ask or describe a change</text><rect class="box" x="310" y="20" width="200" height="150" rx="10"/><text class="t" x="326" y="48">Real terminal</text><text class="s" x="326" y="74">The CLI itself,</text><text class="s" x="326" y="94">in the project folder</text><text class="s" x="326" y="132" style="font-family:var(--font-mono)">$ claude --resume</text><path class="ln" d="M214 80h92M214 110h92"/><path class="ln" d="M298 74l8 6-8 6M222 104l-8 6 8 6"/><text class="s" x="228" y="62">same</text><text class="s" x="222" y="140">conversation</text></svg></div>`;

const dgMemory = `<div class="diagram"><svg viewBox="0 0 520 170" role="img" aria-label="Chats that are live use memory; idle chats stop and resume when opened."><text class="t" x="10" y="24">Your Mac decides how many chats can run at once</text><g><rect class="acc" x="10" y="44" width="70" height="34" rx="6"/><rect class="acc" x="90" y="44" width="70" height="34" rx="6"/><rect class="acc" x="170" y="44" width="70" height="34" rx="6"/><rect class="acc" x="250" y="44" width="70" height="34" rx="6"/><rect class="box" x="330" y="44" width="70" height="34" rx="6"/><rect class="box" x="410" y="44" width="70" height="34" rx="6"/></g><text class="s" x="10" y="100">Live chats (about half a gigabyte each on my Mac)</text><text class="s" x="330" y="100">Idle: stopped on their own</text><path class="ln" d="M365 112v22M365 134l-6-7M365 134l6-7"/><text class="s" x="10" y="152">Open an idle chat and it resumes, in about a second.</text></svg></div>`;

export const groups = (c) => {
  const { N, kbd, shot } = c;
  const K = (...a) => kbd(...a);
  const has = (id) => !!c.dims[id];
  return [
    {
      id: 'projects', title: 'Projects and windows',
      intro: 'The core idea: a project is a window. Everything about it stays inside.',
      items: [
        { t: 'One window per project, or a few together', p: `Open a project and it gets its own window with its chats, a terminal, its files and its changes. Lock a window to its project, send a project to another window with Move to Window, and pull it back with Bring Here. Or group related projects as tabs in one window.`, why: 'You stop asking which window that project was in.', shot: ['hero', `One ${N} window with project tabs along the top and a sidebar listing every project and chat.`, [[60, 3.0, 'Project tabs'], [18, 40, 'Every project and its chats, with status']]] },
        { t: 'Jump anywhere in a second', p: `${K('⌘', 'P')} switches to any project or chat by name, with its folder shown so same-named projects never get mixed up. ${K('⌃', 'Tab')} cycles recent projects, ${K('⌘', '1')} to ${K('⌘', '9')} jump to a project tab, and ${K('⌘', 'K')} opens the command palette, which also searches messages and archived chats.`, why: 'With dozens of projects, finding beats organising.', shot: ['switcher', `The quick switcher: projects, then chats, each with its folder.`] },
        { t: 'Home and a calm sidebar', p: `Home lists your projects with their status, and a box for a quick question that needs no project. Drag a folder onto the sidebar or onto Home to add it. The sidebar shows Pinned and Active projects; hundreds of projects and chats stay usable, with a fast, searchable list behind All projects.`, why: 'It stays calm at 5 projects and at 500.', shot: ['home', `${N} Home: a quick-chat box and a list of five projects sorted by status, one marked as waiting on you.`] },
        { t: 'Pop out and dock back', p: `Pop a chat, terminal, diff or file out into its own window with ${K('⌥', '⌘', 'N')}, and dock it back with ${K('⌥', '⌘', 'B')}. Pop-outs come back after a restart.`, why: 'Put the thing you are watching on the other display without losing its place.' },
      ],
    },
    {
      id: 'displays', title: 'Big screens, small windows',
      intro: `Built first for a Mac with big or several displays, one project per window, and still fine when you shrink it.`,
      items: [
        { t: 'Windows come back on the right display', p: `On launch, every window returns on its display at its size, with its tabs and its terminal scrollback. Zoom with ${K('⌘', '+')} and ${K('⌘', '−')}, ${K('⇧', '⌘', '0')} resets.`, why: 'Your desk across two or three displays survives a restart.', status: 'Release notes v0.1.16' },
        { t: 'Nothing is cut off in a small window', p: `Menus always fit inside the window and scroll when long. Dialogs scroll inside a short window. Project tabs scroll instead of overlapping. Long names truncate and show in full on hover.`, why: 'Small laptop screen or half of a big one, it still works.' },
        { t: 'Dark and light', p: `Dark and light themes, both designed. A calm, consistent motion style.`, why: 'Easy on the eyes at night, readable in daylight.' },
      ],
    },
    {
      id: 'chats', title: 'Chats and drafts',
      intro: 'Chat first, over the real tool. Nothing you type is lost.',
      items: [
        { t: 'A readable chat for every conversation', p: `Each step Claude takes is a clear row: commands with their output, files read, searches with match counts, and edits with inline red and green diffs. Every reply ends with the files it changed.`, why: 'You can follow what an agent did without reading a wall of terminal text.', shot: ['diff', `An edit shown as a red and green diff in the chat, then the answer and a list of changed files.`] },
        { t: 'Drafts stay drafts, and nothing is lost', p: `A new chat creates nothing until you send the first message. Each chat has its own message box. After a restart your half-typed message and scroll position are back in every chat.`, why: 'No empty chats piling up, and no lost thoughts.' },
        { t: 'A composer that behaves like the terminal', p: `${K('/')} for commands, ${K('@')} to mention a file, smart paste, drag and drop, ${K('⇧', '⌘', 'V')} to attach your latest screenshot. A message sent while Claude works is queued and folded in; ${K('⌘', '↵')} stops the turn and sends now.`, why: 'Your terminal habits carry over.' },
        { t: 'See which model answered, and what it cost you', p: `Every reply ends with a footer: the model, the tokens used and how long it took. Switching model or account shows one clear “Switched to” line. A “models used in this chat” panel lists every model the chat has touched.`, why: 'No guessing which model did the work.', shot: ['footer', 'A reply footer showing the model, tokens in and out, and the time taken.'], status: 'New in v0.1.21' },
        { t: 'Rename, fork, find, copy', p: `Rename a chat (your name always wins over an automatic one), fork it, archive it, find in the transcript with ${K('⌘', 'F')}, jump to the latest message, copy the last answer or the whole transcript as Markdown. One page lists the chats of every project.`, why: 'Small things you reach for constantly, one key away.' },
        { t: 'Clean titles', p: `Chat titles are short and read well, using the title your CLI writes when there is one. Window titles are meaningful, and the header shows the project name in its accent colour so you always know which project you are in.`, why: 'Fifty chats are still distinguishable.' },
      ],
    },
    {
      id: 'claude', title: 'Claude Code support',
      intro: 'The deepest integration. The full list, including what is not yet done, is on its own page.',
      items: [
        { t: 'Your own Claude Code, through its SDK', p: `${N} runs the Claude Code you already installed and signed in to. Plans with approval, questions answered as choices, subagents as live cards with Stop, background commands in a Running tray, a context meter with Compact now, rewind and fork.`, why: 'Same tool, better desk. Nothing about your setup changes.', link: ['claude-and-gemini/', 'See exactly what each CLI supports'] },
        { t: 'Phone access, off by default', p: `Remote access from the Claude app is off until you turn it on, chat by chat, with Continue on phone. Chats get readable names there.`, why: 'No junk sessions flooding your phone.', status: 'Claude only' },
      ],
    },
    {
      id: 'gemini', title: 'Gemini support',
      intro: 'Real, and thinner than Claude support. It says so here.',
      items: [
        { t: 'Gemini CLI in the chat view', p: `Gemini CLI chats run in the chat view for API-key, paid and company plans: model and mode lists, approvals, file edits with diffs, and finished replies. The terminal is always available as a fallback. A chat shows its model and account in the header.`, why: 'One place for both tools, side by side.', link: ['claude-and-gemini/', 'What Gemini support covers, and what is missing'], status: 'Young' },
      ],
    },
    {
      id: 'more-clis', title: 'Antigravity, Grok Build and Cursor CLI',
      intro: 'Three more CLIs next to Claude Code and Gemini CLI. Each is thinner than Claude support, and the page says where.',
      items: [
        { t: 'Grok Build and Cursor CLI in the chat view', p: `Pick Grok or Cursor as the CLI of a chat, with the Chat | Terminal switch and a new chat in terminal (${K('⌥', '⌘', 'T')}). Grok chats show cost and how full the conversation is, and Grok queues your next message itself. The Cursor model menu marks every model Included in your plan or Billed per token, so a paid model is never picked by surprise. ${N} never signs in for you: a missing or signed-out CLI gets a notice that says what to run.`, why: 'Five tools, one window per project.', link: ['claude-and-gemini/', 'What each CLI supports, and what is missing'], status: 'Young' },
        { t: 'Antigravity as a terminal tab', p: `Google’s Antigravity CLI opens as a terminal tab you type into, each Google account with its own folder. ${N} never types for it and never switches your account.`, why: 'Google’s FAQ does not support wrapping it on consumer plans, so it stays a terminal.', status: 'Terminal only' },
        { t: 'A control a CLI cannot offer stays put', p: `Effort, the context meter, Fork, Fast mode, Output style, the MCP list and phone access stay in place when a CLI cannot do them. They are dimmed, and the reason shows when you hover. They do not disappear when you switch CLI.`, why: 'Controls stay where your hand expects them.' },
      ],
    },
    {
      id: 'terminals', title: 'Terminals',
      intro: 'A real terminal, one click from every conversation.',
      items: [
        { t: 'Chat or terminal, same conversation', p: `Flip a conversation between the chat view and the real terminal at any time. Continue a chat in the terminal and the chat waits so the two never both write to it; Return to chat picks up from there. Open chats you started in a terminal, and start any chat directly in the Claude terminal with ${K('⌥', '⌘', 'T')}.`, why: 'You are never locked into the chat view.', shot: ['terminal', 'The real Claude Code terminal screen inside a project window, with the sidebar of projects and chats still beside it. Chat and Terminal are one switch apart.'] },
        { t: 'A terminal drawer and terminal tabs', p: `${K('⌃', '`')} toggles a quick terminal under the chat in the project folder. The right panel can hold terminal tabs too. Your shell setup (PATH, nvm, Homebrew) is used. A Redraw button repaints a garbled terminal. Closing a terminal that is still running something asks first.`, why: 'Run a build or a server without leaving the project window.' },
        { t: 'Terminals come back', p: `Terminal tabs and their scrollback are restored after a restart. Tested with 120 tabs across 3 windows, including after a force quit.`, why: 'A reboot is no longer a reset.', status: 'Being re-tested' },
      ],
    },
    {
      id: 'trust', title: 'Trust and approvals',
      intro: 'Get called when it matters. Be quiet when it does not.',
      items: [
        { t: 'A calm “needs you”', p: `A chat asks for you only when its agent really needs an answer: a permission, a question or a plan to approve. It shows in amber in the sidebar, in a Dock badge and in a notification with Allow once and Open buttons, and it clears when you answer. Terminal bells and idle prompts do not trigger it. ${K('⇧', '⌘', 'U')} jumps to the next waiting chat, and the Dock menu lists them.`, why: 'The one real question is never buried under noise.', shot: ['needs', 'A permission card: Allow Bash? with the command shown before it runs.'] },
        { t: 'See the exact command before it runs', p: `Permission cards show what will run. Answer Allow once ${K('1')}, Always allow ${K('2')} or Deny ${K('3')}, or Deny and tell Claude why. Plans are approved with a clear choice: auto mode, auto-accept edits, or ask for each edit.`, why: 'You decide with the facts in front of you.' },
        { t: 'Smart approvals while you are away', p: `${N} judges how risky a request is and can answer low-risk ones for you while you are away. Cautious requests only get through if you turn that on. Questions that wait too long fall back to a safe default after a timeout. Settings > Diagnostics > Approvals lists every request and what was decided.`, why: 'Less clicking, with a full log to check later.', shot: ['approvals', 'The Approvals log: each request with its risk level and what happened.'], status: 'New in v0.1.21' },
      ],
    },
    {
      id: 'permissions', title: 'Permissions',
      intro: 'How careful each project is, in your hands.',
      items: [
        { t: 'Three trust levels, per project', p: `Careful asks before every risky step. Balanced (the default) accepts file edits inside the project and asks for commands and anything outside it. Full access never asks inside your projects; turning it on asks you to confirm and says what it means.`, why: 'Match the care to the project, not one setting for everything.', shot: ['trust', 'Trust and permissions: a trust level control, default permission mode, and the away settings.'] },
        { t: 'Pre-trust a folder, keep an always-allow list', p: `Pre-trust a folder so it does not ask every time. The always-allow list shows what you chose to allow; for Claude it lives in the project’s own settings file, so you can inspect it. A macOS permissions guide explains Full Disk Access in plain words. ${N} never asks for Screen Recording, Camera, Microphone or Accessibility.`, why: 'No surprises, and you can see what you allowed.' },
        { t: 'Per-use accounts need a confirmation', p: `Accounts that bill per use (API keys, cloud providers) are marked, never picked for you, and ask once per project.`, why: 'No bill you did not choose.' },
      ],
    },
    {
      id: 'panels', title: 'Files, diff and browser panels',
      intro: 'A side panel for the things around the chat.',
      items: [
        { t: 'Files, diff, browser and terminal beside the chat', p: `A right panel holds Files, the Diff, a built-in Browser for previewing your own pages, and Terminal tabs. ${K('⌘', 'J')} toggles it and ${K('⇧', '⌘', 'J')} maximises it. Links in a chat open beside it, and files Claude sends you show as previews.`, why: 'Look at what the agent made without leaving the conversation.', status: 'Files are read-only' },
        { t: 'Open in your editor', p: `“Open in” lists the editors you have installed (Cursor, VS Code, Zed, Xcode) and Finder.`, why: 'Reading here, editing where you already edit.' },
      ],
    },
    {
      id: 'persistence', title: 'Archive and persistence',
      intro: 'Nothing is deleted behind your back.',
      items: [
        { t: 'Archive hides. It never deletes.', p: `Archived chats and projects leave the sidebar with an Undo and wait on one page, each with the reason it is there. Restore puts them back where they were. Closing a tab never archives anything, and ${K('⇧', '⌘', 'T')} reopens what you just closed.`, why: 'You can tidy fearlessly.', shot: ['archive', 'The Archive page: three archived chats, each with the reason and a Restore button.'] },
        { t: 'Sandboxes: try an idea, keep it or drop it', p: `${K('⌃', '⌘', 'N')} opens an empty, git-ready sandbox in its own tab, marked as a Sandbox, with as many chats and a terminal as any project. Keep moves it to a folder you pick and everything comes along. Discard sends it to the Archive and keeps the folder. Sandboxes are never cleaned up automatically unless you choose a period.`, why: 'Cheap to start, safe to abandon.', shot: ['sandbox', 'A sandbox project with its marker, a finished chat and its changed file.'] },
        { t: 'Everything survives a restart or sleep', p: `Windows, tabs, chats, drafts, scroll position and terminals come back. Chats and the background service survive your Mac going to sleep. If a chat cannot resume, ${N} says so and offers Retry instead of failing quietly.`, why: 'Restarting stops being an event.' },
        { t: 'Clean install, clean removal', p: `Releases are signed and approved by Apple, and update themselves, with a Restart to update button that warns you if chats are still running. Settings > Data and privacy has Remove all data, and the Help menu has Uninstall.`, why: 'Easy to try, easy to leave.' },
      ],
    },
    {
      id: 'shortcuts', title: 'Shortcuts',
      intro: 'Every action has a key, and the app teaches them gently.',
      items: [
        { t: 'A shortcuts guide, key hints and one tip a day', p: `${K('⌘', '/')} opens the guide, searchable and sorted by what you actually use. Key hints sit next to actions. After you click an action a few times, ${N} shows its shortcut once and then stops. A short list of favourites:`, keys: [['⌘P', 'Switch project or chat'], ['⌘K', 'Command palette'], ['⌘T', 'New chat in this project'], ['⌃⌘N', 'New sandbox'], ['⇧⌘U', 'Next chat waiting on you'], ['⌘W', 'Close what you are working in'], ['⇧⌘T', 'Reopen closed'], ['⌥⌘N', 'Pop out'], ['⌃`', 'Terminal drawer'], ['⌘J', 'Right panel']], why: 'Faster, without memorising a manual.', shot: ['shortcuts', 'The keyboard shortcuts guide, with the actions you click most listed first.'] },
      ],
    },
    {
      id: 'resources', title: 'Memory, accounts and usage',
      intro: 'Run many chats without a hot Mac, and see your plan.',
      items: [
        { t: 'Chat limits that fit your Mac', p: `How many chats run at once comes from your Mac’s real memory, not a fixed number. In Automatic mode, idle chats stop on their own and resume when you open them; you can also choose 5, 10, 30 or 60 minutes, or never. One Claude process per chat, and no leftover processes after you quit. Low-memory warnings only show when memory is genuinely low. Settings > Diagnostics > Running now shows what is live.`, why: 'Twenty open chats no longer means a spinning fan.', shot: ['running-crop', 'Settings, Diagnostics, Running now: three live chats with their memory and a Stop button, a total, and the Stop idle chats after setting.'] },
        { t: 'Accounts, plans and usage meters', p: `Add several Claude and Gemini accounts and choose one per chat. Each shows its plan and email, and Claude accounts show their 5-hour and weekly usage from Claude itself, with a heads-up above the message box at 80% (amber at 80, red at 95). Custom endpoint accounts connect an AI gateway.`, why: 'You see the limit coming.', shot: ['accounts', 'The Accounts page: a Claude subscription with session and weekly usage meters and a Gemini API-key account.'] },
        { t: 'Local diagnostics, never uploaded', p: `Settings > Diagnostics shows your week (prompts, chats, approvals, errors, tokens) and the versions of the app, Claude Code and Gemini CLI. It stays on your Mac. Report an issue only sends what you choose to send.`, why: 'Know what is going on, without telemetry.' },
      ],
    },
  ];
};

function renderItem(c, it) {
  const { shot } = c;
  const media = it.shot && c.dims[it.shot[0]] ? shot(it.shot[0], { alt: it.shot[1], marks: it.shot[2] || [], sizes: '(min-width: 62em) 55vw, 100vw' }) : it.diagram || '';
  const keys = it.keys ? `<div class="keys">${it.keys.map(([k, l]) => `<span><kbd>${esc(k)}</kbd> ${esc(l)}</span>`).join('')}</div>` : '';
  const link = it.link ? `<p><a href="${c.url(it.link[0])}">${esc(it.link[1])}</a></p>` : '';
  const st = it.status ? `<span class="status${/young|new|re-tested/i.test(it.status) ? ' young' : ''}">${esc(it.status)}</span>` : '';
  const wide = it.shot && c.dims[it.shot[0]] && c.dims[it.shot[0]].w >= 2000;
  if (!media) return `<article class="card mini"><h3>${it.t}${st}</h3><p>${it.p}</p>${keys}${link}<p class="why"><b>Why it matters.</b> ${it.why}</p></article>`;
  return `<article class="feature${wide ? ' wideshot' : ''}"><div><h3>${it.t}${st}</h3><p>${it.p}</p>${keys}${link}<p class="why"><b>Why it matters.</b> ${it.why}</p></div>${media ? `<div>${media}</div>` : ''}</article>`;
}

export function features(c) {
  const G = groups(c);
  const toc = `<nav class="toc" aria-label="Feature groups">${G.map((g) => `<a href="#${g.id}">${esc(g.title)}</a>`).join('')}</nav>`;
  const body = pageHead('Everything it does, in plain words.', `Every feature here is in the current version (${esc(c.cfg.release.version)}). Where something is young, read-only or still being re-tested, it says so.`, 'Features') +
    `<div class="wrap">${toc}${G.map((g) => `<section class="fgroup" id="${g.id}" style="padding-inline:0"><h2>${esc(g.title)}</h2><p class="intro">${esc(g.intro)}</p>${g.items.filter((i) => i.shot || i.diagram).map((it) => renderItem(c, it)).join('')}<div class="grid c2 minis">${g.items.filter((i) => !(i.shot || i.diagram)).map((it) => renderItem(c, it)).join('')}</div></section>`).join('')}</div>`;
  return { body };
}
