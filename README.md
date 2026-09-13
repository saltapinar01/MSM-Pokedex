# MSM Pokédex — Phase 1

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
