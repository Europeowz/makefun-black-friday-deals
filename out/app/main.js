// The deal finder app: hash routing, search and filters.
// Routes: #/ is the deal board; #/deal/<id> is one deal's page.
// State lives in the URL hash, so a filtered view is a link.

import { deals } from "./data.js";
import { cardHTML, detailHTML, discountOf } from "./views.js";

const board = document.getElementById("board");
const detail = document.getElementById("detail");
const count = document.getElementById("count");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const storeSelect = document.getElementById("store");
const discountSelect = document.getElementById("discount");
const sortSelect = document.getElementById("sort");

const categories = [...new Set(deals.map((d) => d.category))].sort();
const stores = [...new Set(deals.map((d) => d.store))].sort();
for (const c of categories) {
  const o = document.createElement("option");
  o.value = c;
  o.textContent = c;
  categorySelect.appendChild(o);
}
for (const s of stores) {
  const o = document.createElement("option");
  o.value = s;
  o.textContent = s;
  storeSelect.appendChild(o);
}

function readState() {
  const q = new URLSearchParams(location.hash.slice(1).split("?")[1] ?? "");
  return {
    view: location.hash.startsWith("#/deal/") ? "detail" : "board",
    id: location.hash.startsWith("#/deal/") ? location.hash.slice(7).split("?")[0] : "",
    search: q.get("q") ?? "",
    category: q.get("cat") ?? "",
    store: q.get("store") ?? "",
    minDiscount: Number(q.get("off") ?? "0"),
    sort: q.get("sort") ?? "discount",
  };
}

function writeState(state) {
  const q = new URLSearchParams();
  if (state.search) q.set("q", state.search);
  if (state.category) q.set("cat", state.category);
  if (state.store) q.set("store", state.store);
  if (state.minDiscount) q.set("off", String(state.minDiscount));
  if (state.sort !== "discount") q.set("sort", state.sort);
  const qs = q.toString();
  location.hash = "#/" + (qs ? "?" + qs : "");
}

function filtered(state) {
  const needle = state.search.trim().toLowerCase();
  let list = deals.filter((d) => {
    if (state.category && d.category !== state.category) return false;
    if (state.store && d.store !== state.store) return false;
    if (discountOf(d) < state.minDiscount) return false;
    if (needle && !(d.title + " " + d.store + " " + d.category).toLowerCase().includes(needle)) return false;
    return true;
  });
  if (state.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  else if (state.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  else if (state.sort === "new-low") {
    const rank = { "New low": 0, "Strong price": 1, "Solid deal": 2 };
    list = [...list].sort((a, b) => rank[a.signal] - rank[b.signal] || discountOf(b) - discountOf(a));
  } else list = [...list].sort((a, b) => discountOf(b) - discountOf(a));
  return list;
}

function render() {
  const state = readState();
  if (state.view === "detail") {
    const d = deals.find((x) => x.id === state.id);
    board.hidden = true;
    detail.hidden = false;
    detail.innerHTML = d
      ? detailHTML(d)
      : '<p class="empty">That deal is not on this board. <a href="#/">Back to all deals</a>.</p>';
    document.getElementById("filters").hidden = true;
    return;
  }
  document.getElementById("filters").hidden = false;
  detail.hidden = true;
  board.hidden = false;
  searchInput.value = state.search;
  categorySelect.value = state.category;
  storeSelect.value = state.store;
  discountSelect.value = String(state.minDiscount);
  sortSelect.value = state.sort;
  const list = filtered(state);
  count.textContent =
    list.length + (list.length === 1 ? " deal" : " deals") + " · " + deals.length + " checked today";
  board.innerHTML = list.length
    ? list.map(cardHTML).join("")
    : '<p class="empty">No deals match those filters. <a href="#/">Clear the filters</a>.</p>';
}

for (const el of [searchInput, categorySelect, storeSelect, discountSelect, sortSelect]) {
  el.addEventListener("input", () => {
    writeState({
      search: searchInput.value,
      category: categorySelect.value,
      store: storeSelect.value,
      minDiscount: Number(discountSelect.value),
      sort: sortSelect.value,
    });
  });
}

window.addEventListener("hashchange", render);
render();
