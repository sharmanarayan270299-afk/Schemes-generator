# Scheme Grid

A live dashboard for browsing Indian government and financial schemes across
Gov. Subsidies, Taxation, Production Incentives, Customs Schemes, Gov.
Investment Schemes, Central & State Gov. Schemes, GST, and MSME Schemes.

## Structure

- `server/` — Express + TypeScript API serving scheme data and live source
  updates (`/api/schemes`, `/api/categories`, `/api/stats`, `/api/live-updates`)
- `client/` — React + TypeScript + Vite frontend rendering the Scheme Grid,
  filters, search, a scheme detail panel, and a Live Government Updates feed
- `api/` — Vercel serverless entry point that re-exports the Express app in
  `server/src/app.ts` for production deployment

## Running locally

In two terminals:

```bash
cd server && npm install && npm run dev   # http://localhost:4000
cd client && npm install && npm run dev   # http://localhost:5173
```

The client dev server proxies `/api` requests to the backend on port 4000.

## API

- `GET /api/schemes?category=&status=&level=&search=` — list schemes with
  optional filters
- `GET /api/schemes/:id` — single scheme
- `GET /api/categories` — category names with counts
- `GET /api/stats` — total/active/upcoming/closed counts
- `GET /api/live-updates` — latest items scraped from live government
  sources (15 min cache; pass `?refresh=true` to force a re-fetch)
- `GET /api/live-updates/sources` — the list of configured live sources

## Live updates (proof of concept)

`server/src/scrapers/` implements a small source-adapter pipeline that
fetches, normalizes, and categorizes updates from real government sites:

- **PIB** (`pib.gov.in`) — official RSS feed of press releases, categorized
  by keyword matching against the 8 scheme categories
- **GST Council** (`gstcouncil.gov.in`) — "What's New" section scraped with
  `cheerio`

This validates the approach described in the sourcing master sheet (one
source-adapter per government portal, daily/weekly check frequency, results
merged into a single feed). To add another source: create a new file in
`server/src/scrapers/` implementing `SourceDefinition` from
`server/src/scrapers/types.ts`, then add it to `server/src/scrapers/registry.ts`.

## Deploying to Vercel

The repo is set up to deploy as a single Vercel project:

- `vercel.json` builds the client (`npm run build` at the repo root) and
  serves `client/dist` as the static site
- `/api/*` requests are rewritten to the `api/index.ts` serverless function,
  which serves the same Express app used locally (`server/src/app.ts`)

To deploy: import this GitHub repo in the Vercel dashboard (no other config
needed — it reads `vercel.json` automatically), or run `vercel --prod` from
the repo root with the Vercel CLI.
