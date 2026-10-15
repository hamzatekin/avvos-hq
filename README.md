# Avvos HQ

One plain page for my apps, inbox, calendar and AI tools.

- **Sidebar links:** Pergent (with its News, Tech and Pains tabs), Aletheia, Gmail, Calendar, Claude and ChatGPT.
- **Today's one thing:** write one goal for the day and tick it off. If yesterday's didn't get done, the page offers to carry it over. It is saved in this browser only (`localStorage`).
- **Ask:** type a question and open it in Claude or ChatGPT.
- **Thought for today:** a Stoic passage from Seneca, Marcus Aurelius or Epictetus, different each day.

Keys: `1`–`6` open the links, `/` jumps to the ask box.

## Stack

Built with [Vite+](https://viteplus.dev) (the `vp` toolchain: Vite 8, Vitest, Oxlint, Oxfmt) and [Void](https://void.cloud), VoidZero's full-stack framework and deploy CLI for Cloudflare Workers. Pages are React, server-rendered by Void's pages mode, styled with [Tailwind CSS v4](https://tailwindcss.com) and self-hosted [Inter](https://rsms.me/inter/).

The look is a light, Linear-style dashboard. Motion and interaction details follow Emil Kowalski's [design engineering skills](https://github.com/emilkowalski/skills): press feedback on buttons, no animation on keyboard actions, short ease-out transitions, hover styles only on devices that can hover.

| Path               | What it is                                                         |
| ------------------ | ------------------------------------------------------------------ |
| `pages/layout.tsx` | The sidebar and keyboard shortcuts                                 |
| `pages/index.tsx`  | The home page: greeting, today's one thing, ask, thought for today |
| `src/rooms.ts`     | The sidebar links. Add one here; `key` sets its number shortcut    |
| `src/thoughts.ts`  | Stoic passages and the short line under the greeting. Add your own |
| `src/styles.css`   | Tailwind theme: colours, shadows, easing curves                    |
| `src/ui.tsx`       | Shared pieces: card, buttons, input, keyboard key                  |
| `void.config.ts`   | Site `<head>` defaults and the Worker compatibility date           |

## Run it

Needs Node.js 24.21 or newer (Void's requirement) and pnpm.

```sh
pnpm install
pnpm dev        # vp dev, http://localhost:5173
pnpm check      # vp check: format, lint
pnpm build      # vp build
```

## Deploy

Every push to `main` deploys through GitHub Actions (`.github/workflows/void-deploy.yml`), which runs
`void deploy --platform cloudflare`. It needs one repository secret, `CLOUDFLARE_API_TOKEN`: a Cloudflare
API token made from the "Edit Cloudflare Workers" template. If the token can reach more than one account,
also set a `CLOUDFLARE_ACCOUNT_ID` repository variable.

The site sits behind Cloudflare Access, and `void deploy` checks each new version before switching traffic to
it, so the workflow also needs an Access service token: create one under Zero Trust → Access controls →
Service credentials → Service Tokens, add a **Service Auth** policy that includes it to the Worker's Access
application, and save its ID and secret as the `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` repository
secrets.

To deploy from your own machine instead:

```sh
pnpm run deploy  # void deploy: signs in to Cloudflare the first time, builds and uploads
```
