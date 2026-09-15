# MSM Pokédex — Phase 1 (+ Phase 4 data pass)

## Phase 4 changelog (Plasma/Mech/Shadow/Crystal Islet — Double-Element Ethereals)

All 13 monsters from the Phase 4 list already existed in `data/monsters.json`
as entries (contrary to the "don't exist yet" note from planning) — but 10 of
the 13 had placeholder/stub breeding data. This pass:

- Verified Common/Rare breeding pairs for all 10 against the MSM Wiki and a
  cross-referencing Steam community guide (Ghazt, Whisp, Nebulob, Sox,
  Jellbilly, Reebro, Arackulele, Bellowfish, Dragong, Boodoo, Kazilleon,
  Jeeode, Fung Pray all use the single+single Ethereal pattern — confirmed,
  not guessed).
- Resolved the 4 Epic breeding combos previously flagged "not yet
  independently confirmed" (Epic Bellowfish, Epic Dragong, Epic Kazilleon,
  Epic Fung Pray) and filled in the remaining 6 Epic combos' timings.
- Added real breeding durations (normal + enhanced) for Common/Rare/Epic
  variants of all 10 monsters.
- Added sourced name-origin trivia (`interestingFact`) for all 10.
- **Art decision made:** rather than generate placeholder art, this build
  relies on the existing image-404 fallback (see `app.js` — a missing image
  already renders a 🖼 placeholder glyph instead of a broken-image icon or
  a crash). All 5 Single-Element Ethereals (Ghazt, Reebro, Grumpyre, Jeeode,
  Humbug) and 8 of the 10 Double-Element Ethereals have **no art yet** —
  they'll show as placeholders until real art is dropped into
  `assets/monsters/` following the naming convention in "Adding your own
  images" below. No code changes were needed for this.
- **Flagged for the Phase 3 audit, not fixed here (out of Phase 4's scope):**
  the Epic variant of all 5 Single-Element Ethereals (Ghazt, Reebro,
  Grumpyre, Jeeode, Humbug) currently reuses the Common variant's breeding
  description verbatim, which is inaccurate — e.g. Epic Reebro's real combo
  is Sox + Kazilleon, not "a Quad-Element and a Triple-Element Natural
  monster." Worth fixing in the Ethereal batch of Phase 3.

## Island View pass (Mirror Timeline grouping + UI fixes)

- **Mirror Timeline grouping:** Mirror islands now render in three fixed
  subgroups — Natural, Magical, Ethereal Islets (in that order) — each
  alphabetical within itself. This is driven by an explicit `mirrorGroup`
  field on each island in `data/islands.json`, not inferred from the name.
- **Added Minor Paironormal Carnival** as its own Mirror-Timeline island
  entry, housing every Paironormal's Minor form. Note on naming: the wiki
  doesn't have a distinct proper name for this — Paironormal Carnival is
  canonically one island with a Major Mode (Main Timeline) and a Minor Mode
  (Mirror Timeline) that share the same in-game name. "Minor Paironormal
  Carnival" is the wiki's own shorthand for the Minor Mode, used here so the
  two modes can be distinct list entries/rosters. All 13 Paironormal
  monsters' Minor-form `islands` arrays were repointed from "Paironormal
  Carnival" to "Minor Paironormal Carnival" to match. Filed under Magical
  for grouping purposes, since Paironormals are a Magical-Island class.
- **Fixed inconsistent tile widths:** `<button>` elements don't stretch to
  fill a block container the way a `<div>` would — they were sizing to
  their own content (photo + wordmark + count text), so tile width varied
  row to row. Added an explicit `width: 100%` to `.island-row`.
- **Fixed unreadable wordmarks:** island wordmarks are full-color logo
  images, not plain text, so laying them directly over a solid
  majority-class accent color could clash badly (a raster image can't
  adapt to its background the way text color can). Wordmarks now sit on a
  small neutral white plate with a drop shadow, so they stay legible
  regardless of the tile's fill color.
- **Fixed back-button scroll jump:** returning from an island's roster now
  restores your exact scroll position in the island list instead of
  snapping to the top tile.

## Still pending

- **Phase 3** — full multi-island breeding audit (batched, in progress).
- **Phase 5** — Celestials / Amber Vessels pass (explicitly deferred, not started).


An offline-first PWA reference app for My Singing Monsters. Data lives in JSON;
the engine (HTML/CSS/JS) never hardcodes monster, class, or variant names.

## What's in this pass

- Data loading pipeline (`loadData → validateData → normalizeData → render`)
- Monster grid (Home view) with class-driven card theming
- Search and the class/variant/element/island filter drawer (live-applies as
  you tap chips — no separate "apply" step needed)
- Island View, including per-island monster rosters
- Monster Profile bottom sheet with working variant switching
- Variant-availability badges on grid cards (one dot per rarity/tier the
  monster's class supports — filled if released, dashed if not, ringed for
  whichever variant the card is currently showing)
- Reverse breeding lookup ("Used To Breed" section on the profile) — see
  caveats below
- Locked/unreleased variant tiles (see `noggin` in `data/monsters.json` — its
  Rare variant is intentionally missing to demonstrate the locked state)
- Service worker: app shell + JSON cached on install/network-first; images
  cached on-demand as you browse, **plus** a background "download all" pass
  that kicks off after the first successful load so the app keeps working
  offline even for monsters you haven't opened yet (see `CACHE_ALL` in
  `service-worker.js`)
- Sample data covering all three variant systems: standard rarity
  (Noggin/Mammott/Furcorn), Celestial lifecycle (Solvane — placeholder),
  Paironormal form (Duantha — placeholder)

**Not yet built:** collection/ownership tracking (deliberately skipped —
not everyone wants a binary "owned" flag when duplicates are common), sort
options beyond alphabetical.

### Reverse breeding lookup — how it works and its limits

Most real breeding combos in this dataset are stored as free-text
descriptions, not structured parent IDs (the phrasing is too varied to
reliably auto-parse into an exact parent list). So "Used To Breed" is a
best-effort merge of two sources:

1. **Structured combos** (`data/breeding.json`) — exact, but only covers the
   handful of monsters still on that legacy path.
2. **Text mentions** — a whole-word, case-insensitive scan of every other
   monster's breeding description for this monster's name. This catches most
   real combos but can't tell *which* variant of a mentioned parent is
   required, and a name mention isn't a 100%-guaranteed pairing. That's why
   the section is captioned "may not be complete" in the UI — treat it as a
   pointer to check in-game, not ground truth.

If you want this to be fully reliable, the real fix is normalizing
`breeding.description` into structured `parents` arrays across the dataset
(a data task, not a code task).

## Adding your own images

Drop your PNGs directly in — no conversion required:

```
assets/monsters/{monster-id}-{variant-id}.png   e.g. noggin-common.png
assets/islands/{island-id}.png                  e.g. plant.png
assets/icons/classes/{class-id}.svg             e.g. natural.svg
```

The filename must match the `image` path referenced in `data/monsters.json`.
If an image 404s, the card/profile falls back to a placeholder icon instead
of a broken-image glyph — nothing crashes.

**Compress before you drop them in.** The original Phase 1 art assets were
~322MB uncompressed (some single icons were over 1MB). They're now resized
to their actual display size and palette-quantized, bringing the whole
asset folder to ~6MB with no visible quality loss. If you add new art,
run it through the same treatment first — resize to roughly:

- Monster art: max 400px on the long edge
- Island photos: max 200px
- Island wordmarks: max 400px wide
- Element sigils: max 128px

and re-save as an indexed/quantized PNG (Pillow's `quantize(colors=256,
method=Image.Quantize.FASTOCTREE)` + `save(optimize=True)` is what was used
here). Skipping this is how the app ends up slow to load and heavy on
mobile data again.

**One gotcha with the cache-first strategy:** if you replace an existing
monster's artwork but keep the same filename, devices that already cached
the old image (including via the background sync pass) will keep serving
the stale version indefinitely — cache-first never re-checks a URL it
already has. Bump `CACHE_VERSION` in `service-worker.js` whenever you
update existing art, not just when you change code.

The two files in `assets/icons/app/` (`icon-192.png`, `icon-512.png`) are
placeholder app icons. Replace them with your own artwork before packaging
as a TWA (see below) — that's what shows up on the home screen and app switcher.

## Running it locally

Any static file server works, e.g.:

```
cd msm-pokedex
python3 -m http.server 8000
```

Then open `http://localhost:8000` in Chrome.

## Deploying to GitHub Pages

1. Push this folder's contents to a GitHub repository.
2. Repository → Settings → Pages → set source to your branch/`root`.
3. Open the generated `https://username.github.io/repo-name/` URL.
4. On Android Chrome: menu → "Add to Home screen" / "Install app".

## Path to a zero-eviction guarantee (TWA)

Once the PWA is stable and you're happy with the look, it can be wrapped as a
Trusted Web Activity — a thin native shell around this exact same code, giving
you a real installable APK with no storage-eviction risk, without rewriting
anything here. At that point you'll need:

- Real 192×192 and 512×512 PNG app icons (replacing the placeholders above)
- [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) or PWABuilder
  to generate the Android project from `manifest.json`
- A Digital Asset Links file proving you own both the site and the app, so
  Chrome hides its address bar inside the wrapped app

This is a packaging step only — flag it back to me when you're ready and
we'll walk through it together.

## Adding a monster

1. Add an entry to `data/monsters.json` with a stable `id`, `classId`,
   `variantSystem`, and a `variants` object keyed by variant id.
2. Only include the variants that are actually released — missing ones
   render as locked tiles automatically.
3. Drop the matching image(s) into `assets/monsters/`.

No JavaScript changes are required for any of the above.
