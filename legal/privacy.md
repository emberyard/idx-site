# Privacy

_Last updated 11 October 2026._

## Short version
IDX has no accounts, no sign-up, no analytics and no telemetry. Everything it stores stays on your Mac. The only things that leave your machine are the requests made by the CLIs you installed (Claude Code, Antigravity/Gemini), to their own providers, under their own privacy policies.

## What IDX stores, and where
All IDX data lives in `~/Library/Application Support/IDX/`:
- `idx.db` — your projects, sessions, window layout, settings (SQLite).
- `logs/` — local diagnostic logs (host.log, app logs). Never uploaded.
- `sandboxes/` — scratch folders for chats you start without a project.
- clipboard images you paste into a chat, kept locally so the CLI can read them.
- `host.json` — the local port and token the app uses to talk to its own background process on 127.0.0.1.

Delete that folder and IDX forgets everything. Conversation transcripts themselves are written by the CLIs into their own folders (for Claude Code, `~/.claude/`; for Antigravity, `~/.gemini/`), not by IDX.

## What IDX sends, and to whom
- **To Anthropic**: nothing directly. The Claude Code CLI you installed sends your prompts, files it reads and tool results to Anthropic, authenticated with your own login. Anthropic's rules apply: https://www.anthropic.com/legal/privacy and https://code.claude.com/docs/en/legal-and-compliance.
- **To Google**: nothing directly. The Antigravity or Gemini CLI you installed sends your prompts and interaction data to Google under https://policies.google.com/privacy and https://antigravity.google/terms (Google records "Interactions" to improve its products; you can opt out in the CLI's settings).
- **To GitHub**: when checking for updates, IDX fetches the release feed for `emberyard/idx-releases` over HTTPS. GitHub sees your IP address, as with any download.
- **To us (emberyard)**: nothing. No crash reports, no usage statistics, no identifiers.

## Credentials
IDX never reads, stores or transmits your Anthropic or Google credentials. You sign in to each CLI yourself; the CLIs keep their tokens in the macOS Keychain or their own config folders.

## The built-in browser pane
IDX can open web pages in an embedded browser view. Those pages see what any browser visit shows them. IDX does not inject tracking into them.

## Children
IDX is a developer tool and is not directed at children under 18.

## Changes and contact
We will update the date above when this page changes. Questions: open an issue at https://github.com/emberyard/idx-site/issues
