/* ============================================================
   MSM Pokédex — application logic
   UI ≠ Application Logic ≠ Data.
   This file must never hardcode monster/variant/class names.
   ============================================================ */

const state = {
  monsters: [],
  islands: [],
  taxonomy: null,
  breeding: [],
  monsterById: {},
  islandById: {},
  breedingByTarget: {},
  breedingByParents: {},
  currentView: "monsters",
  selectedMonsterId: null,
  selectedVariantId: null,
  profileOpen: false,
  searchQuery: "",
  activeFilters: { classes: [], variants: [], elements: [], islands: [] },
  filterDrawerOpen: false,
  selectedIslandId: null,
};

// ---------- Data loading pipeline ----------
// loadData -> validateData -> normalizeData -> initializeState -> renderApplication

async function loadData() {
  const [monsters, islands, taxonomy, breeding] = await Promise.all([
    fetchJSON("data/monsters.json"),
    fetchJSON("data/islands.json"),
    fetchJSON("data/taxonomy.json"),
    fetchJSON("data/breeding.json"),
  ]);
  return { monsters, islands, taxonomy, breeding };
}

async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

function validateData(data) {
  const problems = [];
  const seenMonsterIds = new Set();

  for (const m of data.monsters) {
    if (!m.id) { problems.push("Monster missing id"); continue; }
    if (seenMonsterIds.has(m.id)) problems.push(`Duplicate monster id: ${m.id}`);
    seenMonsterIds.add(m.id);

    if (!data.taxonomy.classes[m.classId]) {
      problems.push(`Monster ${m.id} references unknown classId "${m.classId}"`);
    }
    const system = data.taxonomy.classes[m.classId] &&
      data.taxonomy.variantSystems[data.taxonomy.classes[m.classId].variantSystem];
    if (system && !system.variants.some((v) => m.variants[v])) {
      problems.push(`Monster ${m.id} has no variant matching its variant system`);
    }
  }

  if (problems.length) {
    console.warn("[MSM Pokédex] Data validation issues:", problems);
  }
  return problems;
}

function normalizeData(data) {
  state.monsters = data.monsters;
  state.islands = data.islands;
  state.taxonomy = data.taxonomy;
  state.breeding = data.breeding;

  state.monsterById = Object.fromEntries(data.monsters.map((m) => [m.id, m]));
  state.islandById = Object.fromEntries(data.islands.map((i) => [i.id, i]));

  state.breedingByTarget = {};
  state.breedingByParents = {};
  for (const b of data.breeding) {
    const targetKey = `${b.targetMonsterId}:${b.targetVariantId}`;
    (state.breedingByTarget[targetKey] ||= []).push(b);
    for (const parentId of b.parents) {
      (state.breedingByParents[parentId] ||= []).push(b);
    }
  }
}

// ---------- Search + Filters ----------

function getAllVariantIds() {
  const ids = new Set();
  for (const m of state.monsters) {
    for (const v of Object.keys(m.variants)) ids.add(v);
  }
  return [...ids];
}

function getAllIslands() {
  const names = new Set();
  for (const m of state.monsters) {
    for (const v of Object.values(m.variants)) {
      for (const isl of v.islands || []) names.add(isl);
    }
  }
  return [...names].sort();
}

function monsterMatchesSearch(monster, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  const classDef = state.taxonomy.classes[monster.classId];
  const haystack = [
    monster.name,
    classDef?.name,
    ...(monster.elements || []).map((id) => state.taxonomy.elements[id]?.name),
    ...Object.values(monster.variants).flatMap((v) => [v.name, ...(v.islands || [])]),
  ].filter(Boolean).join(" ").toLowerCase();
  return haystack.includes(q);
}

function monsterMatchesFilters(monster) {
  const f = state.activeFilters;

  if (f.classes.length && !f.classes.includes(monster.classId)) return false;

  if (f.elements.length && !(monster.elements || []).some((e) => f.elements.includes(e))) return false;

  if (f.variants.length && !Object.keys(monster.variants).some((v) => f.variants.includes(v))) return false;

  if (f.islands.length) {
    const monsterIslands = new Set(Object.values(monster.variants).flatMap((v) => v.islands || []));
    if (!f.islands.some((isl) => monsterIslands.has(isl))) return false;
  }

  return true;
}

function getVisibleMonsters() {
  return state.monsters.filter(
    (m) => monsterMatchesSearch(m, state.searchQuery) && monsterMatchesFilters(m)
  );
}

function toggleFilter(category, value) {
  const list = state.activeFilters[category];
  const idx = list.indexOf(value);
  if (idx === -1) list.push(value); else list.splice(idx, 1);
}

function countActiveFilters() {
  const f = state.activeFilters;
  return f.classes.length + f.variants.length + f.elements.length + f.islands.length;
}

function updateFilterCountBadge() {
  const badge = document.getElementById("filter-count");
  const n = countActiveFilters();
  badge.textContent = n;
  badge.hidden = n === 0;
}

function renderFilterDrawer() {
  const sortByLabel = (a, b) => a.label.localeCompare(b.label);

  const classOptions = Object.entries(state.taxonomy.classes).map(([id, c]) => ({ id, label: c.name })).sort(sortByLabel);
  const variantOptions = getAllVariantIds().map((id) => ({ id, label: id })).sort(sortByLabel);
  // Elements like "primordial-air" are redundant in this filter: Class=Primordial + Element=Air already
  // narrows to the same result, so redundant prefixed entries are excluded here (still used for sigil display elsewhere).
  const elementOptions = Object.entries(state.taxonomy.elements)
    .filter(([id]) => !id.startsWith("primordial-"))
    .map(([id, e]) => ({ id, label: e.name }))
    .sort(sortByLabel);
  const islandOptions = getAllIslands().map((name) => ({ id: name, label: name })).sort(sortByLabel);

  renderFilterGroup("filter-classes", "classes", classOptions);
  renderFilterGroup("filter-variants", "variants", variantOptions);
  renderFilterGroup("filter-elements", "elements", elementOptions);
  renderFilterGroup("filter-islands", "islands", islandOptions);
}

function renderFilterGroup(containerId, category, options) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (const opt of options) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "filter-chip";
    chip.textContent = opt.label;
    if (state.activeFilters[category].includes(opt.id)) chip.classList.add("is-selected");
    chip.addEventListener("click", () => {
      toggleFilter(category, opt.id);
      chip.classList.toggle("is-selected");
      updateFilterCountBadge();
    });
    container.appendChild(chip);
  }
}

function openFilterDrawer() {
  state.filterDrawerOpen = true;
  renderFilterDrawer();
  document.getElementById("filter-backdrop").hidden = false;
  document.getElementById("filter-drawer").hidden = false;
}

function closeFilterDrawer() {
  state.filterDrawerOpen = false;
  document.getElementById("filter-backdrop").hidden = true;
  document.getElementById("filter-drawer").hidden = true;
}



function renderMonsterGrid() {
  const grid = document.getElementById("monster-grid");
  grid.innerHTML = "";

  const visible = getVisibleMonsters();

  if (!visible.length) {
    grid.innerHTML = `<div class="empty-state"><h3>No monsters found.</h3><p>Try clearing a filter or changing your search.</p></div>`;
    return;
  }

  const sorted = [...visible].sort((a, b) => a.name.localeCompare(b.name));

  for (const monster of sorted) {
    grid.appendChild(renderMonsterCard(monster));
  }
}

function pickDisplayVariantId(monster, system) {
  const activeVariants = state.activeFilters.variants;
  if (activeVariants.length) {
    const match = system.variants.find((v) => activeVariants.includes(v) && monster.variants[v]);
    if (match) return match;
  }
  return resolveDefaultVariantId(monster, system);
}

// Picks readable placeholder/icon text color (near-black or near-white) against a given hex background.
function contrastTextColor(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16), g = parseInt(c.substring(2, 4), 16), b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1a1a1a" : "#ffffff";
}

function renderMonsterCard(monster) {
  const classDef = state.taxonomy.classes[monster.classId];
  const system = state.taxonomy.variantSystems[classDef.variantSystem];
  const displayVariantId = pickDisplayVariantId(monster, system);
  const variantData = monster.variants[displayVariantId];

  const card = document.createElement("button");
  card.type = "button";
  card.className = "monster-card";
  card.style.setProperty("--card-border", classDef.theme.border);
  card.style.setProperty("--card-glow", classDef.theme.glow);
  card.style.setProperty("--card-gradient", classDef.theme.gradient);
  card.style.setProperty("--card-accent", classDef.theme.accent);
  card.style.setProperty("--card-fill-text", contrastTextColor(classDef.theme.accent));
  card.setAttribute("aria-label", `${monster.name}, ${classDef.name}`);

  card.innerHTML = `
    <div class="monster-card__name">${escapeHTML(monster.name)}</div>
    <div class="monster-card__image-wrap">
      ${imageOrPlaceholderHTML(variantData?.image, monster.name)}
    </div>
  `;

  card.addEventListener("click", () => openProfile(monster.id, displayVariantId));
  return card;
}

function imageOrPlaceholderHTML(src, altBase) {
  if (!src) return `<span class="monster-card__placeholder">🖼</span>`;
  return `<img class="monster-card__image" src="${src}" alt="${escapeHTML(altBase)}"
            onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'monster-card__placeholder',textContent:'🖼'}))" />`;
}

// Islands: prefer the vertical wordmark when both orientations exist.
function resolveIslandWordmark(island) {
  if (!island.wordmark) return null;
  return island.wordmark.vertical || island.wordmark.horizontal || null;
}

function resolveDefaultVariantId(monster, system) {
  if (monster.variants[system.defaultVariant]) return system.defaultVariant;
  // Fall back to first available variant defined by the data (never a locked placeholder)
  return system.variants.find((v) => monster.variants[v]) || Object.keys(monster.variants)[0];
}

// ---------- View switching (Monsters / Islands) ----------

function switchView(view) {
  state.currentView = view;
  state.selectedIslandId = null;

  const toggle = document.getElementById("view-toggle");
  toggle.textContent = view === "monsters" ? "Islands" : "Monsters";
  toggle.dataset.view = view === "monsters" ? "islands" : "monsters";

  document.getElementById("monster-grid").hidden = view !== "monsters";
  document.getElementById("island-view").hidden = view !== "islands";
  document.querySelector(".search-bar").hidden = view !== "monsters";

  if (view === "islands") renderIslandList();
}

function monstersOnIsland(islandName) {
  return state.monsters.filter((m) =>
    Object.values(m.variants).some((v) => (v.islands || []).includes(islandName))
  );
}

function majorityClassColor(islandName) {
  const tally = {};
  for (const m of state.monsters) {
    const onIsland = Object.values(m.variants).some((v) => (v.islands || []).includes(islandName));
    if (onIsland) tally[m.classId] = (tally[m.classId] || 0) + 1;
  }
  let bestClass = null, bestCount = -1;
  for (const [classId, count] of Object.entries(tally)) {
    if (count > bestCount) { bestCount = count; bestClass = classId; }
  }
  const theme = bestClass ? state.taxonomy.classes[bestClass]?.theme : null;
  return theme ? theme.accent : "#3a3a3f";
}

function renderIslandList() {
  document.getElementById("island-roster").hidden = true;
  const list = document.getElementById("island-list");
  list.hidden = false;
  list.innerHTML = "";

  if (!state.islands.length) {
    list.innerHTML = `<div class="empty-state"><h3>No islands yet.</h3></div>`;
    return;
  }

  const mainIslands = state.islands.filter((i) => !i.name.startsWith("Mirror ")).sort((a, b) => a.name.localeCompare(b.name));
  const mirrorIslands = state.islands.filter((i) => i.name.startsWith("Mirror ")).sort((a, b) => a.name.localeCompare(b.name));

  list.appendChild(buildIslandGroup("Main Timeline", mainIslands));
  list.appendChild(buildIslandGroup("Mirror Timeline", mirrorIslands));
}

function buildIslandGroup(title, islands) {
  const section = document.createElement("div");
  section.className = "island-group";
  const heading = document.createElement("h2");
  heading.className = "island-group__title";
  heading.textContent = title;
  section.appendChild(heading);

  for (const island of islands) {
    const count = monstersOnIsland(island.name).length;
    const wordmark = resolveIslandWordmark(island);
    const fillColor = majorityClassColor(island.name);
    const textColor = contrastTextColor(fillColor);

    const row = document.createElement("button");
    row.type = "button";
    row.className = "island-row";
    row.style.setProperty("--island-fill", fillColor);
    row.style.setProperty("--island-text", textColor);
    row.innerHTML = `
      <div class="island-row__left">
        ${wordmark
          ? `<img class="island-row__wordmark" src="${wordmark}" alt="${escapeHTML(island.name)}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'island-row__name-fallback',textContent:'${escapeHTML(island.name)}'}))">`
          : `<span class="island-row__name-fallback">${escapeHTML(island.name)}</span>`}
        <span class="island-row__count">${count} Monster${count === 1 ? "" : "s"}</span>
      </div>
      ${island.image ? `<img class="island-row__image" src="${island.image}" alt="" onerror="this.remove()">` : ""}
    `;
    row.addEventListener("click", () => renderIslandRoster(island.id));
    section.appendChild(row);
  }
  return section;
}

function renderIslandRoster(islandId) {
  state.selectedIslandId = islandId;
  const island = state.islandById[islandId];
  const roster = monstersOnIsland(island.name);

  document.getElementById("island-list").hidden = true;
  document.getElementById("island-roster").hidden = false;

  const wordmark = resolveIslandWordmark(island);
  document.getElementById("island-roster-header").innerHTML = `
    ${island.image ? `<img class="island-row__image" src="${island.image}" alt="" onerror="this.remove()">` : ""}
    ${wordmark ? `<img class="island-row__wordmark" src="${wordmark}" alt="${escapeHTML(island.name)}">` : `<span>${escapeHTML(island.name)}</span>`}
    <span class="island-roster__count">${roster.length} Monster${roster.length === 1 ? "" : "s"}</span>
  `;

  const grid = document.getElementById("island-roster-grid");
  grid.innerHTML = "";
  if (!roster.length) {
    grid.innerHTML = `<div class="empty-state"><h3>No monsters here yet.</h3></div>`;
    return;
  }
  const sorted = [...roster].sort((a, b) => a.name.localeCompare(b.name));
  for (const monster of sorted) grid.appendChild(renderMonsterCard(monster));
}



function openProfile(monsterId, variantId) {
  state.selectedMonsterId = monsterId;
  state.selectedVariantId = variantId;
  state.profileOpen = true;
  renderProfile();

  document.getElementById("profile-backdrop").hidden = false;
  document.getElementById("profile-sheet").hidden = false;
  history.pushState({ profileOpen: true }, "");
}

function closeProfile(pushHistory = true) {
  state.profileOpen = false;
  state.selectedMonsterId = null;
  state.selectedVariantId = null;
  document.getElementById("profile-backdrop").hidden = true;
  document.getElementById("profile-sheet").hidden = true;
  if (pushHistory && history.state && history.state.profileOpen) {
    history.back();
  }
}

function renderProfile() {
  const monster = state.monsterById[state.selectedMonsterId];
  const classDef = state.taxonomy.classes[monster.classId];
  const system = state.taxonomy.variantSystems[classDef.variantSystem];
  const variant = monster.variants[state.selectedVariantId];

  // Apply class theme as CSS variables (Principle 1: class = primary theme)
  const sheet = document.getElementById("profile-sheet");
  sheet.style.setProperty("--class-accent", classDef.theme.accent);
  sheet.style.setProperty("--class-glow", classDef.theme.glow);
  sheet.style.setProperty("--class-gradient", classDef.theme.gradient);
  sheet.style.setProperty("--class-border", classDef.theme.border);

  document.getElementById("profile-name").textContent = variant.name || monster.name;
  document.getElementById("profile-class").textContent = classDef.name;

  const img = document.getElementById("profile-image");
  if (variant.image) {
    img.src = variant.image;
    img.alt = variant.name || monster.name;
    img.style.display = "";
    img.onerror = () => { img.style.display = "none"; };
  } else {
    img.style.display = "none";
  }

  renderVariantTiles(monster, system);

  // Classes render as text only (handled above via profile-class).
  // Subclasses and Elements render with their sigil before the text.
  // Subclass concept dropped: the real MSM data has no separate subclass field
  // distinct from elements, so this section stays hidden unless a future
  // data source populates monster.subclassId again.
  const subclassDef = monster.subclassId ? state.taxonomy.subclasses?.[monster.subclassId] : null;
  setIconTextSection("section-subclass", "profile-subclass", subclassDef?.sigil, subclassDef?.name);

  const elementDefs = (monster.elements || [])
    .map((id) => state.taxonomy.elements[id])
    .filter(Boolean);
  setSigilChipSection("section-elements", "profile-elements", elementDefs);

  // Islands are stored as display-name strings for this bulk import (not yet
  // normalized to island IDs) — render them directly.
  setChipSection("section-islands", "profile-islands", variant.islands || []);

  renderBreedingSection(monster, variant);
  renderEggRequirements(variant);

  renderListSection("section-acquisition", "profile-acquisition",
    (variant.alternativeAcquisition || []).map((a) => {
      if (typeof a === "string") return a;
      const label = state.taxonomy.acquisitionMethods[a.method]?.name || a.method;
      return a.detail ? `${label} — ${a.detail}` : label;
    }));

  renderListSection("section-notes", "profile-notes", variant.notes || []);

  setSection("section-fact", "profile-fact", variant.interestingFact);
}

function renderVariantTiles(monster, system) {
  const container = document.getElementById("variant-tiles");
  container.innerHTML = "";

  const alternateSlots = system.variants.filter((v) => v !== state.selectedVariantId);

  // If there are zero alternate slots at all, hide the row entirely.
  if (alternateSlots.length === 0) return;

  for (const variantId of alternateSlots) {
    const exists = Boolean(monster.variants[variantId]);
    const tile = document.createElement("button");
    tile.type = "button";

    if (exists) {
      tile.className = "variant-tile";
      tile.textContent = variantId;
      tile.addEventListener("click", () => {
        state.selectedVariantId = variantId;
        renderProfile();
      });
    } else {
      tile.className = "variant-tile variant-tile--locked";
      tile.disabled = true;
      tile.innerHTML = `<span class="variant-tile__lock">🔒</span> Unreleased`;
    }
    container.appendChild(tile);
  }
}

function renderBreedingSection(monster, variant) {
  const el = document.getElementById("profile-breeding");
  el.innerHTML = "";

  // Real-data path: breeding info embedded directly on the variant as text
  // (the source combos are too varied in phrasing to safely auto-parse into
  // strict parent IDs for reverse lookup — see project notes).
  if (variant.breeding && variant.breeding.description) {
    document.getElementById("section-breeding").hidden = false;
    const div = document.createElement("div");
    div.className = "breed-combo";
    div.innerHTML = `
      <div>${escapeHTML(variant.breeding.description)}</div>
      <div class="breed-combo__timers">
        <span>Regular: ${escapeHTML(variant.breeding.timeNormal || "—")}</span>
        <span>Enhanced: ${escapeHTML(variant.breeding.timeEnhanced || "—")}</span>
      </div>
    `;
    el.appendChild(div);
    return;
  }

  // Legacy path: structured breeding.json lookup (used by any monster that
  // doesn't carry its own breeding text yet).
  const key = `${monster.id}:${state.selectedVariantId}`;
  const combos = (state.breedingByTarget[key] || []).slice().sort((a, b) => a.priority - b.priority);
  if (!combos.length) {
    document.getElementById("section-breeding").hidden = true;
    return;
  }
  document.getElementById("section-breeding").hidden = false;
  combos.forEach((combo, i) => {
    const parentNames = combo.parents.map((id) => state.monsterById[id]?.name || id).join(" + ");
    const div = document.createElement("div");
    div.className = "breed-combo";
    div.innerHTML = `
      <div class="breed-combo__label">${i === 0 ? "Recommended" : "Alternative"}</div>
      <div>${escapeHTML(parentNames)}</div>
      <div class="breed-combo__timers">
        <span>Regular: ${escapeHTML(combo.timers?.regular || "—")}</span>
        <span>Enhanced: ${escapeHTML(combo.timers?.enhanced || "—")}</span>
      </div>
    `;
    el.appendChild(div);
  });
}

// Subclass label rendered with its sigil before the text (icon load failures
// simply drop the icon rather than showing a broken-image glyph).
function setIconTextSection(sectionId, fieldId, sigilSrc, label) {
  const section = document.getElementById(sectionId);
  if (!label) { section.hidden = true; return; }
  section.hidden = false;
  const el = document.getElementById(fieldId);
  el.innerHTML = `${sigilSrc ? `<img class="sigil" src="${sigilSrc}" alt="" onerror="this.remove()">` : ""}<span>${escapeHTML(label)}</span>`;
}

// Element chips rendered with each element's sigil before its text.
function setSigilChipSection(sectionId, fieldId, defs) {
  const section = document.getElementById(sectionId);
  if (!defs.length) { section.hidden = true; return; }
  section.hidden = false;
  const el = document.getElementById(fieldId);
  el.innerHTML = defs.map((d) => `
    <span class="chip chip--sigil">
      ${d.sigil ? `<img class="sigil" src="${d.sigil}" alt="" onerror="this.remove()">` : ""}${escapeHTML(d.name)}
    </span>
  `).join("");
}

function renderEggRequirements(variant) {
  const section = document.getElementById("section-eggs");
  const eggs = variant.eggRequirements;
  if (!eggs || !eggs.length) { section.hidden = true; return; }
  section.hidden = false;
  const el = document.getElementById("profile-eggs");
  el.innerHTML = eggs.map((e) => `
    <li>
      <span><span class="egg-count">${e.count}×</span>${escapeHTML(e.monster)}</span>
      ${e.hatchTime ? `<span class="egg-time">${escapeHTML(e.hatchTime)}</span>` : ""}
    </li>
  `).join("");
}

function setSection(sectionId, fieldId, value) {
  const section = document.getElementById(sectionId);
  if (!value) { section.hidden = true; return; }
  section.hidden = false;
  document.getElementById(fieldId).textContent = value;
}

function setChipSection(sectionId, fieldId, values) {
  const section = document.getElementById(sectionId);
  if (!values.length) { section.hidden = true; return; }
  section.hidden = false;
  const el = document.getElementById(fieldId);
  el.innerHTML = values.map((v) => `<span class="chip">${escapeHTML(v)}</span>`).join("");
}

function renderListSection(sectionId, fieldId, items) {
  const section = document.getElementById(sectionId);
  if (!items.length) { section.hidden = true; return; }
  section.hidden = false;
  const el = document.getElementById(fieldId);
  el.innerHTML = items.map((v) => `<li>${escapeHTML(v)}</li>`).join("");
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// ---------- Wiring ----------

function wireEvents() {
  document.getElementById("profile-close").addEventListener("click", () => closeProfile());
  document.getElementById("profile-backdrop").addEventListener("click", () => closeProfile());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.profileOpen) closeProfile();
    if (e.key === "Escape" && state.filterDrawerOpen) closeFilterDrawer();
  });
  window.addEventListener("popstate", () => {
    if (state.profileOpen) closeProfile(false);
  });

  let searchDebounce;
  document.getElementById("search-input").addEventListener("input", (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      state.searchQuery = e.target.value.trim();
      renderMonsterGrid();
    }, 150);
  });

  document.getElementById("filter-btn").addEventListener("click", openFilterDrawer);
  document.getElementById("filter-close").addEventListener("click", closeFilterDrawer);
  document.getElementById("filter-backdrop").addEventListener("click", closeFilterDrawer);
  document.getElementById("filter-apply").addEventListener("click", () => {
    closeFilterDrawer();
    renderMonsterGrid();
  });
  document.getElementById("filter-clear").addEventListener("click", () => {
    state.activeFilters = { classes: [], variants: [], elements: [], islands: [] };
    updateFilterCountBadge();
    renderFilterDrawer();
  });

  document.querySelectorAll(".view-switch__btn").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  document.getElementById("island-roster-back").addEventListener("click", renderIslandList);
}

// ---------- Boot ----------

async function init() {
  wireEvents();
  try {
    const data = await loadData();
    validateData(data);
    normalizeData(data);
    renderMonsterGrid();
  } catch (err) {
    console.error(err);
    document.getElementById("monster-grid").innerHTML =
      `<div class="empty-state"><h3>Couldn't load the database.</h3><p>Check your connection and reopen the app.</p></div>`;
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(console.error);
  }
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist();
  }
}

init();
