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
- **GST Council** (`gstcouncil.gov.in`) — "What's New" section → GST
- **CHAMPIONS Portal** (`champions.gov.in`) — MSME "what's new" ticker → MSME Schemes
- **Reserve Bank of India** (`rbi.org.in`) — press release listing, keyword-
  matched (mostly regulatory/monetary items, occasionally investment-scheme
  announcements like Sovereign Gold Bond tranches)
- **Ministry of Heavy Industries** (`heavyindustries.gov.in`) — "what's new"
  ticker (auto PLI) → Production Incentives
- **Ministry of Steel** (`steel.gov.in`) — "what's new" listing (specialty
  steel PLI) → Production Incentives
- **MNRE** (`mnre.gov.in`) — news ticker (solar/green-hydrogen schemes) →
  Gov. Subsidies
- **CBIC legacy portal** (`cbic-gst.gov.in`) — Central Excise/Service Tax
  flash-news marquee → Customs Schemes
- **Department of Revenue** (`dor.gov.in`) — "what's new" marquee → Taxation
- **SIDBI** (`sidbi.in`) — news slider → Gov. Investment Schemes
- **RIICO** (`riico.co.in`) — Rajasthan state industrial/land scheme updates
  → Central & State Gov. Schemes
- **UPEIDA** (`upeida.up.gov.in`) — UP expressway industrial land tenders/
  notices → Central & State Gov. Schemes
- **NICDC** (`nicdc.in`) — industrial corridor/BHAVYA scheme marquee →
  Production Incentives
- **MIDC** (`midcindia.org`) — Maharashtra industrial plot/land notices
  (Marathi) → Central & State Gov. Schemes

All 8 scheme categories now have live coverage across 14 sources (202
items/run, zero scraper errors as of the last check): GST, MSME Schemes,
Production Incentives, Gov. Subsidies, Customs Schemes, and Central & State
Gov. Schemes all have multiple dedicated sources; Taxation and Gov.
Investment Schemes are thinner but real, dated content. General
cross-ministry items (PIB, RBI) fall back to whichever category their
keywords match, or "General" otherwise.

### 22-source request (2026-07-29)

Tested 22 additional sources against the same no-browser fetch+cheerio
constraint. 5 were scrapable and are listed above (SIDBI, RIICO, UPEIDA,
NICDC, MIDC). The other 17 were rejected — see the "Coverage Status" tab
in the companion Google Sheet for the full per-URL breakdown, summarized
here:

- **JS single-page apps** (empty shell without JS execution): myscheme.gov.in
  (API returns 401 without an undiscovered key), dpiit.gov.in/offerings,
  msme.gov.in, meity.gov.in/schemes, dgft.gov.in (AJAX-loaded, "No data
  found!" without JS)
- **Blocks Node's `fetch` (403), likely bot detection**: investindia.gov.in,
  indiantradeportal.in, jansamarth.in, incometaxindia.gov.in (both the root
  site and the circulars sub-path)
- **Unreachable** (connection timeout/refused from this environment):
  ifciltd.com, icegate.gov.in, niveshmitra.up.nic.in (its `.gov.in` mirror
  loads but has no scrapable news feed, just static award badges)
- **No public content feed found**: india.gov.in (a link aggregator to other
  properties like PIB, not its own content source), nsws.gov.in (Drupal-
  based, but the homepage has no public listing — approvals/scheme data is
  behind login), startupindia.gov.in (public "newsletters" page is stale;
  the live notifications feed requires login), gidc.gujarat.gov.in
  (homepage marquee is just a phone number, no notice/tender listing found)
- **Placeholder page, not the real site**: kiadb.in (serves a "Website
  Launch" holding page)

This validates the approach described in the sourcing master sheet (one
source-adapter per government portal, daily/weekly check frequency, results
merged into a single feed). To add another source: create a new file in
`server/src/scrapers/` implementing `SourceDefinition` from
`server/src/scrapers/types.ts`, then add it to `server/src/scrapers/registry.ts`.

**Still not covered:** the canonical *aggregator* portals for these
categories (DPIIT, MeitY, CBIC's main site, DGFT, Income Tax Dept, myScheme)
are all modern JS single-page apps — they return an empty shell to a plain
HTTP fetch. The ministry/department sites added above are real substitutes,
not full replacements. A rendering-as-a-service API (ScrapingBee is planned)
would let these be scraped too; see the "Coverage Status" tab in the
companion Google Sheet for the full investigation (headless browser blocked
in this dev sandbox, Invest India/Make in India/Jina Reader rejected).

## Deploying to Vercel

The repo is set up to deploy as a single Vercel project:

- `vercel.json` builds the client (`npm run build` at the repo root) and
  serves `client/dist` as the static site
- `/api/*` requests are rewritten to the `api/index.ts` serverless function,
  which serves the same Express app used locally (`server/src/app.ts`)

To deploy: import this GitHub repo in the Vercel dashboard (no other config
needed — it reads `vercel.json` automatically), or run `vercel --prod` from
the repo root with the Vercel CLI.
