# Meridian Web Migration (Next.js)

This repository now includes an initial Next.js control plane scaffold while preserving existing CLI and autonomous runtime behavior.

## What was added

- Paths below are relative to the repository root.
- Next.js App Router pages under `app/`
- API routes for dashboard, candidates, config, cycles, actions, lessons, logs, pool memory, blacklist, jobs, events
- Runtime web service extraction under `runtime/`
- Simple token-based role auth for API routes (`WEB_READ_TOKEN`, `WEB_WRITE_TOKEN`, `WEB_ADMIN_TOKEN`)
- Job locks/status/events to avoid duplicate runs in web-triggered cycles

## Security model

- All write endpoints require write/admin token in `Authorization: Bearer <token>`
- All read endpoints require read/write/admin token
- Secrets remain server-side and are never exposed in client bundles

## Run

```bash
npm install
npm run web:dev
```

## API summary

- `GET /api/dashboard`
- `GET /api/candidates?limit=10`
- `GET/POST /api/config`
- `POST /api/cycles/manage`
- `POST /api/cycles/screen`
- `GET /api/jobs`
- `GET /api/events`
- `POST /api/actions/deploy`
- `POST /api/actions/close`
- `POST /api/actions/claim`
- `POST /api/actions/swap`
- `GET /api/lessons`
- `GET /api/logs`
- `GET /api/pool-memory?pool=<address>`
- `GET/POST/DELETE /api/blacklist`

## Notes

- This is the initial phase to establish web runtime boundaries.
- Existing `cli.js` and tool behavior remain unchanged.
- Full UI workflows and stronger session auth can be added incrementally.
