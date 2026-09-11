# MSM Pokédex — Phase 1

An offline-first PWA reference app for My Singing Monsters. Data lives in JSON;
the engine (HTML/CSS/JS) never hardcodes monster, class, or variant names.

## What's in this pass

- Data loading pipeline (`loadData → validateData → normalizeData → render`)
- Monster grid (Home view) with class-driven card theming
- Monster Profile bottom sheet with working variant switching
- Locked/unreleased variant tiles (see `noggin` in `data/monsters.json` — its
  Rare variant is intentionally missing to demonstrate the locked state)
- Service worker: app shell cached on install, JSON cached network-first
- Sample data covering all three variant systems: standard rarity
  (Noggin/Mammott/Furcorn), Celestial lifecycle (Solvane — placeholder),
  Paironormal form (Duantha — placeholder)

**Not yet built:** search, filter drawer, Island View, class/element/island
filters. That's Phases 3 and 5.

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
