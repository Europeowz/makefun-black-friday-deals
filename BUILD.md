# BUILD.md — Midnight Sale (black-friday-deal-finder-01)

## What it is

A static deal-finder site in `app/`: 25 real Black Friday deals, checked
November 27, 2026, at Amazon, Best Buy and Walmart. Each deal carries
product, store, store link (the store's own search URL for that product, no
affiliate tags), sale price, usual price, discount, price-checked time
(`2026-11-27T07:30:00Z`) and source. The site adds an honest signal per
deal — New low / Strong price / Solid deal — with the evidence on the deal
page, and search + filters (category, store, minimum discount) and sorting,
all working in the browser with no network requests.

## How the deals were checked

Prices were read on 2026-11-27 from the deals coverage named on each deal
(9to5Toys, 9to5Google, Best Buy's own Black Friday release, TradingView /
Benzinga, Redmond Pie, BeeBulletin, Pete Matheson, Medium, Neeshu, Nintendo).
Two prices in the set are from a few days earlier (Ring Doorbell 2K $39.99,
Nov 23–24; Fire TV Stick 4K $19.99, Nov 24) and are labelled as such in
their sources; the rest are November 27. The $228 Hisense TV price is
Walmart's listed price, flagged in its source as possibly a pricing error.
The site says so on each deal page ("where it was read") and warns that
prices move during Black Friday week.

## Files

- `app/index.html` — shell: masthead, filters, board, detail mount, footer
  explaining the signals.
- `app/data.js` — the 25 deals (id, title, store, category, price, was,
  url, checked, source, signal, evidence).
- `app/views.js` — card and detail rendering, price/discount formatting.
- `app/main.js` — hash routing (`#/` board, `#/deal/<id>` detail),
  search/filters/sort, filter state in the URL hash.
- `app/style.css` — original "Midnight Sale" dark storefront; text glyphs
  only, no webfonts, no images, no network.
- `main.ts` — hand-in program (written for this entry): copies `app/` and
  `screenshots/` to the output dir and writes `dossier.json` via
  `buildDossier` from `vendor/makefun-frontend.ts` (kit copy, verbatim).
- `serve.ts` — tiny local static server for testing (`node serve.ts`).
- `screenshots/` — 4 real renders of the running site, taken with local
  headless Chrome: board (1280×800), AirPods Pro 3 deal page (1280×800),
  Sony XM5 deal page on a phone (390×844), search "headphones" (1280×800).

## Verification

- Screenshots inspected visually: board shows 25 deals, cards show price /
  was / discount / signal / checked time; detail page shows facts grid and
  store CTA; phone layout stacks cleanly; search "headphones" returns
  exactly the 3 headphone deals.
- A CSS bug found while screenshotting (`.filters { display: flex }`
  overrode the `hidden` attribute, so filters leaked onto deal pages) was
  fixed with a `[hidden] { display: none !important; }` rule and the
  affected shots retaken.
- `main.ts` run locally: dossier built, see below.
