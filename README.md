# Scheme Grid

A live dashboard for browsing Indian government and financial schemes across
Gov. Subsidies, Taxation, Production Incentives, Customs Schemes, Gov.
Investment Schemes, Central & State Gov. Schemes, GST, and MSME Schemes.

## Structure

- `server/` — Express + TypeScript API serving scheme data
  (`/api/schemes`, `/api/categories`, `/api/stats`)
- `client/` — React + TypeScript + Vite frontend rendering the Scheme Grid,
  filters, search, and a scheme detail panel

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
