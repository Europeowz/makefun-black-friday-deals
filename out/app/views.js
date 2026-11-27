// Rendering for the deal finder: deal cards and the deal detail page.
// Every string the site shows comes from data.js or from this file;
// nothing is fetched from another origin.

const CATEGORY_ICONS = {
  TVs: "▣",
  Laptops: "▤",
  Phones: "▯",
  Tablets: "▭",
  Audio: "♪",
  "Smart home": "⌂",
  Gaming: "✛",
  Kitchen: "♨",
  Home: "⬢",
};

const SIGNAL_CLASS = {
  "New low": "signal-new",
  "Strong price": "signal-strong",
  "Solid deal": "signal-solid",
};

export function money(n) {
  return "$" + (Number.isInteger(n) ? String(n) : n.toFixed(2));
}

export function discountOf(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

export function checkedLabel(iso) {
  const dt = new Date(iso);
  return (
    dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) +
    ", " +
    dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC", timeZoneName: "short" })
  );
}

export function iconFor(category) {
  return CATEGORY_ICONS[category] ?? "•";
}

export function cardHTML(d) {
  const pct = discountOf(d);
  return (
    '<article class="card">' +
    '<a class="card-link" href="#/deal/' + d.id + '" aria-label="' + escapeAttr(d.title) + '">' +
    '<div class="card-art" aria-hidden="true"><span class="card-glyph">' + iconFor(d.category) + '</span>' +
    '<span class="card-cat">' + escapeHTML(d.category) + '</span></div>' +
    '<div class="card-body">' +
    '<h3 class="card-title">' + escapeHTML(d.title) + '</h3>' +
    '<p class="card-store">' + escapeHTML(d.store) + '</p>' +
    '<p class="card-price"><span class="now">' + money(d.price) + '</span> ' +
    '<span class="was">' + money(d.was) + '</span> ' +
    '<span class="pct">−' + pct + '%</span></p>' +
    '<p class="card-signal"><span class="signal ' + (SIGNAL_CLASS[d.signal] ?? "") + '">' + escapeHTML(d.signal) + '</span></p>' +
    '<p class="card-checked">Checked ' + checkedLabel(d.checked) + '</p>' +
    '</div></a></article>'
  );
}

export function detailHTML(d) {
  const pct = discountOf(d);
  const saved = d.was - d.price;
  return (
    '<article class="detail">' +
    '<p class="crumbs"><a href="#/">All deals</a> · ' + escapeHTML(d.category) + ' · ' + escapeHTML(d.store) + '</p>' +
    '<div class="detail-art" aria-hidden="true"><span class="detail-glyph">' + iconFor(d.category) + '</span></div>' +
    '<h2 class="detail-title">' + escapeHTML(d.title) + '</h2>' +
    '<p class="detail-price"><span class="now">' + money(d.price) + '</span> ' +
    '<span class="was">' + money(d.was) + '</span> ' +
    '<span class="pct">−' + pct + '% · save ' + money(Math.round(saved * 100) / 100) + '</span></p>' +
    '<p class="detail-signal"><span class="signal ' + (SIGNAL_CLASS[d.signal] ?? "") + '">' + escapeHTML(d.signal) + '</span> ' +
    '<span class="evidence">' + escapeHTML(d.evidence) + '</span></p>' +
    '<dl class="detail-facts">' +
    '<div><dt>Store</dt><dd>' + escapeHTML(d.store) + '</dd></div>' +
    '<div><dt>Category</dt><dd>' + escapeHTML(d.category) + '</dd></div>' +
    '<div><dt>Price checked</dt><dd>' + checkedLabel(d.checked) + '</dd></div>' +
    '<div><dt>Where it was read</dt><dd>' + escapeHTML(d.source) + '</dd></div>' +
    "</dl>" +
    '<p class="detail-cta"><a class="btn" href="' + escapeAttr(d.url) + '" target="_blank" rel="noopener">View at ' + escapeHTML(d.store) + ' ↗</a></p>' +
    '<p class="detail-note">Prices move during Black Friday week. The link opens the store\u2019s search for this exact product; check the price on the store page before you buy.</p>' +
    "</article>"
  );
}

export function escapeHTML(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function escapeAttr(s) {
  return escapeHTML(s).replace(/'/g, "&#39;");
}
