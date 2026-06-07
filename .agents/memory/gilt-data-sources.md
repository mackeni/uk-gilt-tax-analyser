---
name: Gilt data sources and API limitations
description: Why gilt prices may be estimated vs live, and how the caching/fallback chain works
---

# UK Gilt Data Sources — Architecture

## The Problem
No free, unblocked API provides actual UK gilt prices. Every source has a blocker:

- **DividendData.co.uk**: Was scrapable (66 gilts in Sept 2025), now blocked by Cloudflare bot protection
- **Alpha Vantage**: Works in production Cloudflare Workers but is **limited to 25 API calls/day** on the free tier. Returns US Treasury yields (not UK), used as a proxy for the UK yield curve.
- **FMP (Financial Modeling Prep)**: Legacy `/api/v3/treasury` endpoint deprecated after Aug 31 2025
- **Finnhub**: No UK gilt bond data access
- **DMO (Debt Management Office)**: Blocked by ShieldSquare bot protection
- **Bank of England API**: Returns HTML, not data — requires JavaScript rendering

## The Solution (Implemented)

### Three-tier fallback chain:
1. **Cloudflare Cache API** (23-hour TTL): Caches gilt data at the edge, so Alpha Vantage is only called ONCE per day regardless of traffic
2. **Alpha Vantage live data**: When cache misses, calls Alpha Vantage for current yield → generates prices for 38 gilts via yield curve model → caches result
3. **Yield-based estimates**: When Alpha Vantage is rate-limited (quota exhausted), generates approximate current-date prices using 4.5% base yield (as of June 2026). Labels `dataSource: 'estimated'`

### Critical fix: `timeout` option is invalid in Cloudflare Workers
All `fetch({ timeout: N })` calls must use `AbortController` instead. Invalid `timeout` causes silent failures.

**Why:** Cloudflare Workers' fetch API follows the WHATWG Fetch spec strictly — `timeout` is not a valid option. Using it causes the fetch to fail with an internal error in workerd.

### Date format
Alpha Vantage returns ISO dates ("2026-06-04"). The `generateLiveGiltPrices()` function must convert to UK DD/MM/YYYY format for the UI.

## Data Source Labels (UI display)
- `'live'` → "📊 Live market data" (Alpha Vantage succeeded)
- `'estimated'` → "📐 Estimated prices — based on current yield curve" (API rate-limited, using 4.5% default)
- `'cached_today'` → "💾 Today's cached data" (browser localStorage)
- `'fallback'` → "⚠️ Static data" (last resort, very old)

## Local Dev Limitation
`wrangler dev` in the Replit sandbox fails ALL outbound HTTPS with "TLS peer's certificate is not trusted". APIs cannot be tested locally — must deploy to Cloudflare production to test API integrations.

## Key Files
- `src/lib/api-data-fetcher.js`: `fetchDailyGiltData()`, `generateLiveGiltPrices()`, fetch calls with AbortController
- `src/lib/gilt-data.js`: Three-tier fallback logic, `fetchFromDividendData()`
- `src/index.js`: Cloudflare Cache API integration in `getGiltData()`
