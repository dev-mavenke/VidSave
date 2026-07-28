# VidSave - frontend

React 19 + Vite + Tailwind CSS v4 single-page app.

```bash
npm install
npm run dev      # http://localhost:5173, proxies /api to localhost:5000
npm run build    # -> dist/
npm run lint
```

Copy `.env.example` to `.env` only if the API lives on a different origin than the
site; locally the dev proxy handles it.

See the [root README](../README.md) for the full project, API reference, and
deployment notes.
