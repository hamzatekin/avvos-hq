# Avvos HQ

A calm home base: one page that greets you, keeps a single intention for the day,
offers a Stoic thought, and puts every app you live in one key away.

- **Rooms**: Pergent (with its News, Tech and Pains tabs), Aletheia, Gmail, Calendar, Claude and ChatGPT.
- **The presence**: the orb in the middle breathes, follows your pointer, ticks the seconds on its dial,
  and changes colour with the time of day (dawn, day, dusk, night).
- **Thought for today**: a different Stoic passage each day from Seneca, Marcus Aurelius and Epictetus.
- **Today's one thing**: write one intention, tick it off, and carry it over if yesterday's slipped.
  It is stored in this browser only (`localStorage`).
- **Ask a mind**: type a question and open it in Claude or ChatGPT.
- **Zen**: click the orb (or press `Z`) for a guided breathing loop: in 4, hold 4, out 6.

## Shortcuts

| Key | Does |
| --- | --- |
| `1`–`6` | Open Pergent, Aletheia, Gmail, Calendar, Claude, ChatGPT |
| `/` | Focus the ask bar |
| `Z` | Enter or leave zen |
| `Esc` | Leave zen |

## Make it yours

- Add or change a room in `public/index.html` (each one is an `<a class="room">` in the sidebar;
  give it a `data-key` to get a number shortcut).
- Add your own principles to `HQ_THOUGHTS` in `public/thoughts.js`; they join the daily rotation.
  The short lines under the greeting live in `HQ_WHISPERS` in the same file.

## Run it

It is plain HTML, CSS and JavaScript with no build step.

```sh
npx wrangler dev          # http://localhost:8787, served the way Cloudflare will serve it
# or
python3 -m http.server -d public 8000
```

## Deploy

`wrangler.jsonc` serves `public/` with Cloudflare Workers Static Assets.

```sh
npx wrangler deploy
```
