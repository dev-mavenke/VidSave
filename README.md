# VidSave

Save public videos from YouTube, TikTok, Instagram, and Twitter/X. Paste a link,
pick a quality, get the file. No sign-up and no account access.

The repo holds two independently deployable pieces:

| Directory  | What it is                                                     |
| ---------- | -------------------------------------------------------------- |
| `server/`  | Express 5 API that wraps `yt-dlp` for metadata and streaming     |
| `vidsave/` | React 19 + Vite + Tailwind v4 single-page frontend               |

## Requirements

- Node.js 20+
- Python 3 and `ffmpeg` on the machine running the API (`yt-dlp` needs both).
  On Railway these come from `server/railpack.json`.

## Local development

Install both projects:

```bash
npm run install:all
```

Then run each side in its own terminal:

```bash
npm run dev:server
```

```bash
npm run dev:web
```

The frontend starts on `http://localhost:5173` and proxies `/api` to the server on
port 5000, so no CORS configuration or environment variable is needed locally.

## Environment variables

Copy each `.env.example` and fill it in as needed.

**`server/.env`**

| Variable      | Default | Purpose                                                       |
| ------------- | ------- | ------------------------------------------------------------- |
| `PORT`        | `5000`  | Port the API listens on.                                      |
| `CORS_ORIGIN` | unset   | Comma-separated allowlist of browser origins. Unset = permissive (dev only). |

**`vidsave/.env`**

| Variable       | Default | Purpose                                                        |
| -------------- | ------- | -------------------------------------------------------------- |
| `VITE_API_URL` | `""`    | Base URL of the API. Leave empty for same-origin; set it when the frontend and API are on different domains. |

## API

| Method | Path            | Query                    | Returns                                        |
| ------ | --------------- | ------------------------ | ---------------------------------------------- |
| `GET`  | `/health`       | -                        | `{ ok: true }`                                 |
| `GET`  | `/api/info`     | `url`                    | `{ title, thumbnail, duration, formats[] }`    |
| `GET`  | `/api/download` | `url`, `formatId`, `title` | The video file as an attachment              |

`/api` is rate-limited to 20 requests per minute per IP. `formatId` must be one of
the ids returned by `/api/info`; anything else is rejected with a 400.

Errors come back as `{ "error": "..." }` with a meaningful status - 400 for an
unsupported link, 403 for private or age-restricted videos, 404 for removed ones,
429 when the upstream platform rate-limits us, 451 for geo-blocks.

## Building and deploying

```bash
npm run build:web
```

The two services deploy separately:

- **API** - deploy `server/`. `railpack.json` provides Python and `ffmpeg`. Point
  the health check at `/health` and set `CORS_ORIGIN` to the frontend's origin.
- **Frontend** - deploy `vidsave/` as a static site from `vidsave/dist`, with
  `VITE_API_URL` set to the deployed API. `public/_redirects` supplies the SPA
  fallback so deep links survive a refresh; hosts that ignore `_redirects` need an
  equivalent rewrite rule of their own.

### Deployment checklist

Two values are deliberately left unset in this repo, because a wrong guess ships a
site that silently cannot reach its API. Both must be filled in before the
deployed frontend will work.

| Where | Variable | Set it to | If you skip it |
| ----- | -------- | --------- | -------------- |
| Frontend build env | `VITE_API_URL` | The deployed API origin, e.g. `https://vidsave-api.up.railway.app` | The site calls its own origin, and every `/api/*` request 404s |
| API host env (Railway) | `CORS_ORIGIN` | The deployed frontend origin, e.g. `https://vidsave.example.com` | The API stays open to every origin |

`VITE_API_URL` is read at **build time**, not at runtime - set it in the host's
build environment and rebuild after changing it. Verify a deploy with:

```bash
curl https://<your-api-host>/health
```

That should return `{"ok":true}`. The frontend is wired up correctly when the
network tab shows `/api/info` hitting your API host rather than the site's own
origin.

## Scope

VidSave only reads publicly visible content. It does not bypass logins, age gates,
or regional restrictions, and it never asks for platform credentials. You are
responsible for having the right to save whatever you download.
