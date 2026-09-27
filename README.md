# UvA Tweaks

Private Chrome/Edge extension (Manifest V3) with two local-only tweaks for UvA sites. Nothing is sent anywhere; everything runs as content scripts in your browser.

## What it does

- **ans.uva.nl looks offline.** Any visit is replaced, before the page renders, with the browser's own error screen: Chrome's "This site can't be reached" or Edge's "Hmmm... can't reach this page", both with `ERR_CONNECTION_TIMED_OUT`. The address bar keeps the real URL.
- **Canvas OVV-1 announcements are hidden.** Scoped to the OVV-1 course only:
  - The "Recente aankondigingen" block on the course home is removed.
  - The "Aankondigingen" link is removed from the left course menu.
  - The Announcements page shows only announcements currently in your To-do list; the rest are hidden.
  - Opening a hidden announcement by direct URL is blocked.
  - Removing an item from the To-do list drops it everywhere, live.

  All hiding is injected at `document_start`, so nothing flashes on screen before it is removed.

## Install (Chrome or Edge)

1. Open `chrome://extensions` (Chrome) or `edge://extensions` (Edge).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.

## Course scope

The Canvas tweak targets the OVV-1 course by id, with a fallback match on its course code and name. To point it at a different course, edit `course` in `src/canvas/config.js`.

## Auto-update (macOS)

Loading unpacked does not auto-update by itself, and Manifest V3 forbids an extension from fetching its own code. Instead a login agent pulls the latest commit into the loaded folder; Chrome/Edge picks it up on the next browser restart. Silent, no prompts.

```sh
sh tools/install-macos.sh
```

This clones the repo to `~/Library/Application Support/pdfextractor` and installs a `launchd` agent that runs `tools/update.sh` at login and every 30 minutes. Load unpacked from that folder (not the zip). Edit and `git push` from your dev clone; installed copies fast-forward to it.

## License

UvA Tweaks is **source-available**, licensed under the [PolyForm Noncommercial License 1.0.0](./LICENSE) — **not** an OSI open-source license.

- **You may** use, modify, fork, and share UvA Tweaks freely for any **noncommercial** purpose, as long as you keep the copyright and `Required Notice:` lines (see [`NOTICE`](./NOTICE)) and credit *"UvA Tweaks by Keygraph, Inc."*
- **You may not** sell it, bundle it into a paid product, or run it as a paid/hosted service **without a commercial license**.

Copyright (c) 2026 Keygraph, Inc. Commercial licensing enquiries: see [`NOTICE`](./NOTICE).
