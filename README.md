# MSM Pokédex — Phase 1 (+ Phase 4 data pass)

## Pre-Batch-4 fix pass (items a–e from the Phase 4 plan)

Five fixes requested before starting Batch 4 (remaining Fire class):

**a. Multi-island breeding combo audit (Anglow, Buzzinga, Blabbit, Ffidyll)**
- **Anglow / Buzzinga (Common/Rare):** converted the single flat breeding
  description into the `breeding.combos` format. Both are bred only on
  their natural island (Water Island for Anglow, Fire Haven for Buzzinga)
  — their Mythical Island listing was never a second breeding location,
  it's teleport-only (to breed with Cataliszt for the Dreamythical
  counterpart), which is what `alternativeAcquisition` already said. The
  flat single-sentence format just didn't make that distinction visually;
  the combos format now does. Epic (already Best/Alt prose) converted to
  the same structured combos array for consistency.
- **Blabbit:** the Seasonal Shanty "combo" (Spunge + Scups, Common/Rare)
  was actually wrong, not just unclear — Spunge and Scups don't exist on
  Seasonal Shanty. Per the wiki, Core Seasonals like Blabbit have **no**
  fresh two-parent combo there at all; they're obtained by teleport, or
  (once you already own one) by breeding it with an Aux. Seasonal for a
  chance at a duplicate. Removed the fake combo and moved the real
  mechanism into Alternative Acquisition. Also fixed Epic Blabbit's
  Seasonal Shanty entry, which had duplicated Water Island's combo
  (Shellbeat + Oaktopus) — the actual Shanty combo is Punkleton + Yool.
- **Ffidyll:** same class of bug — Pladdie + Floot Fly is real, but it's
  the Faerie Island combo only. Seasonal Shanty's real combo is
  Schmoochle + Blabbit. Split into per-island combos for Common and Rare;
  also confirmed and filled in Epic's previously-unverified combo
  (Faerie Island: Pladdie + HippityHop; Seasonal Shanty: Viveine + Spurrit).
- **Not done in this pass:** a full re-verification of all 244 monsters'
  breeding combos for this same island-mixup pattern. That's a batch-scale
  task in its own right (same scope as the Phase 3 batches already
  underway) — flagging it as a candidate for its own dedicated pass rather
  than guessing at it inline here.

**b. A–Z jump sidebar — bigger targets + drag-to-scrub**
Letters are now bigger (larger font, more padding, bigger tap area) and
the whole list got a subtle background pill for grip. Added one-finger
drag scrubbing in the style of Niagara Launcher's alphabet index: dragging
up/down anywhere on the list tracks whichever letter is under the finger
(not just the button you started on), magnifies it, and jumps live as you
move — a single swipe browses the whole alphabet without lifting and
re-tapping. Tap-to-jump and keyboard (Tab + Enter) still work as before.

**c. Header was scrolling away — root cause fixed**
The header was already `position: sticky`, so it *should* have stayed
pinned — the actual bug was `overflow-x: hidden` on `html, body` (added in
an earlier pass to fix a horizontal-overflow glitch). `overflow: hidden`
on any axis, on any ancestor of a sticky element, silently turns that
ancestor into a scroll container, which breaks sticky positioning for
everything inside it. Switched to `overflow-x: clip`, which blocks the
same horizontal overflow without creating a scroll container. Header
(title, view toggle, search, filters) now stays fixed on both Monster and
Island views, exactly as intended when it was first added.

**d. Island tile monster counts — uniform black**
`.island-row__count-block` now uses a fixed `#1a1a1a` instead of the
per-tile computed contrast color, so every island tile's count reads the
same regardless of that tile's fill color.

**e. Main Timeline subgrouped, matching Mirror Timeline's pattern**
Added `mainGroup` + `groupOrder` fields to `data/islands.json` and
refactored both timelines to render through the same grouped-section
function, in your specified fixed order (not alphabetical) within each
group: **Natural → Fire → Magical → Ethereal → Higher Plane → Utility**
for Main; **Natural → Magical → Ethereal → Utility** for Mirror (subgroup
labels renamed from "Ethereal Islets" to "Ethereal" and a new "Utility"
subgroup added for Minor Paironormal Carnival, to match your spec).
**One discrepancy worth flagging:** your Main → Natural list didn't
include Earth Island. Since Earth Island (and Mirror Earth Island) still
exist in the data and Mirror → Natural still lists Mirror Earth Island,
I added Earth Island to Main → Natural rather than silently dropping it
from the timeline — let me know if that omission was actually intentional.

**No art changes in this pass — `CACHE_VERSION` not bumped.**

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

## Profile UX + Island View corrections pass

- **Paironormal Carnival, properly split:** kept "Paironormal Carnival" as
  the display name in both timelines (matches in-game naming exactly), but
  they're now two separate island entries under the hood — Main Timeline
  shows the Major roster/assets, Mirror Timeline shows a standalone tile
  (not nested under any subgroup) with the Minor roster/assets. Internally
  this uses a `matchKey` field to disambiguate the two without changing
  what's displayed; the roster header shows a small "Major Mode"/"Minor
  Mode" badge so it's unambiguous once you're inside one.
- **Clickable Element/Island chips on profiles:** clicking an Element chip
  jumps to Monsters view filtered to just that element (replacing any
  existing filters, like a tag link). Clicking an Island chip jumps
  straight into that island's roster in Island View.
- **Droah reclassified** from Mirror Water Island to Crystal Islet.
  Verified all four released Primordials against the wiki and corrected
  the same bug for all of them — they were all on the wrong (Mirror
  Natural) island:
  - Lowb (Plant) → Plasma Islet
  - Fandhul (Cold) → Shadow Islet
  - Bogle (Air) → Mech Islet
  - Droah (Water) → Crystal Islet
  Also confirmed and tightened the Unity-Tree note: a Primordial's
  happiness-projection only covers **Common**-rarity monsters on its Islet;
  Rare/Epic Ethereals there still need Likes placed nearby.
- **Search field:** no longer live-filters on every keystroke. Tapping the
  field clears it for a fresh search, but the grid keeps showing the
  previous results until the new search is actually submitted (Enter / the
  keyboard's search key). Tapping away without submitting restores the
  field to whatever search is still actually driving the grid.
- **Sooza, Ziggurab, Thrumble, Rootitoot:** removed Fire Haven / Fire Oasis
  from their island lists — confirmed via wiki these Fire Triples live on
  their Magical Island + its Mirror + Amber only, not the Fire islands
  themselves (they're used *as breeding parents* by Fire Haven/Oasis
  players for Rare Kayna, which is a different thing from *residing*
  there). **Flagging for Phase 3:** a broader scan turned up ~13 other
  Fire-element hybrids (Glowl, Flowah, Stogg, Barrb, Floogull, Repatillo,
  Tring, Phangler, Boskus, Whaddle, Woolabee, Wynq, Sneyser) that *do*
  currently list Fire Haven/Fire Oasis — these look correct (Fire hybrids
  generally do live on the Fire islands) but weren't individually
  re-verified here, so they should get the same wiki-check treatment
  during Phase 3 rather than being assumed correct by pattern-matching.
- **Hairionette corrected:** its Minor form was missing Mirror Psychic
  Island entirely (only listed Minor Paironormal Carnival), while its
  Major form wrongly included Mirror Psychic Island (that's Minor's
  territory, not Major's). Also corrected a real error in the old data:
  Paironormal Carnival does **not** let Single-Element Paironormals be
  freshly bred there via breeding-failure or otherwise — per the wiki's
  own Breeding page, single-element Paironormals can only be Transposed in
  (from the matching Magical/Mirror-Magical Island) or bought from its
  Market. The old "breeding there ignores time of day" line was
  inaccurate and has been removed.
- **Kayna reviewed, no changes needed:** already correctly modeled —
  Common is Market-purchase-only (accurate per wiki, not a bug), Rare
  and Epic already carry properly sourced, grouped multi-island combos
  matching the Blabbit template.

### On the full multi-island breeding-combo audit

The Blabbit/Monculus/Kayna `breeding.combos` format (multiple islands,
grouped when the combo is identical, kept separate for main/mirror pairs,
per-island timers) is the correct target shape and the rendering already
fully supports it — this is a data-population task, not a code change.
Systematically reviewing all 244 monsters for missed multi-island combos
(the Monculus/Hairionette/Kayna pattern) is exactly Phase 3's scope, not a
side fix — flagging here rather than attempting it inline so it gets the
same batched, sourced treatment as everything else in that phase.

## Island tile redesign + header-width fix

- **Retired the white wordmark plate.** Instead, each tile now uses a
  two-zone layout matching the reference design you shared: a neutral
  near-white ground on the left (where the island photo and its wordmark
  sit close together, sized near the tile's full height) blending into the
  class-majority accent color on the right, which carries a large bold
  monster count + "Monster(s)" label in place of the old small count text.
  The neutral zone is near-white rather than the app's own dark surface
  color because the wordmark art is drawn to sit on a light background —
  matching that is what actually fixes legibility, not a color-contrast
  trick layered on top of a mismatched background.
- **Fixed the actual overflow bug behind the "header narrower than tiles"
  glitch:** `.island-row` had `width: 100%` *and* horizontal margins at the
  same time — a margin box always extends beyond 100% of its container in
  that combination, which is exactly what was pushing the document wider
  than the viewport and left the sticky header (which sizes itself to the
  viewport) looking clipped next to it. Moved the horizontal gutter onto
  `.island-list`'s padding instead of the row's margin, and added
  `overflow-x: hidden` on `html, body` plus an explicit `width: 100%` on
  `.app-header` as a backstop against the same class of bug elsewhere.
- **Paironormal Carnival wordmarks are in** (Major: gold, Minor: teal/blue)
  and saved to `assets/islands/wordmarks/`. The Major-Mode/Minor-Mode badge
  in the roster header has also been removed, per your note that the
  timeline location already makes that clear.
- **Body art now in too:** the Major (clock+cannon) and Minor
  (roller-coaster+tentacles) island photos are saved to
  `assets/islands/paironormal-carnival.png` and
  `assets/islands/paironormal-carnival-minor.png` respectively — Paironormal
  Carnival's tiles are fully art-complete on both timelines now.

## Ethereal art batch (Phase 4 art gap closed, mostly)

Real art is now in for all 5 Single-Element Ethereals (Ghazt, Reebro,
Grumpyre, Jeeode, Humbug — common/rare/epic) and 8 of the 10
Double-Element Ethereals (Arackulele, Nebulob, Jellbilly, Dragong,
Bellowfish, Boodoo — common/rare/epic — plus Sox's missing epic). All
processed per the "Adding your own images" convention below: resized to
400px max edge, quantized to 256 colors, `optimize=True`. Combined ~7.4MB
of raw uploads compressed down to ~1MB.

Bumped `CACHE_VERSION` to `v4` in `service-worker.js` — needed both because
existing art got touched (the first Ghazt/Reebro/etc. batch was saved
uncompressed in the previous pass and has now been reprocessed in place)
and because the cache-first strategy for images also caches 404 responses:
anyone who'd already loaded a monster page before this art existed would
otherwise keep getting served the cached 404 instead of the new image.

Still missing art: **Kazilleon** and **Fung Pray** (common/rare/epic each).

## Fung Pray + Kazilleon art added — Phase 4 Ethereal art now 100% complete

All 13 monsters from the original Phase 4 list (5 Single-Element +
10 Double-Element Ethereals) now have real, compressed art for every
variant. Same treatment as before (400px max edge, 256-color quantize,
optimize) — 4.1MB of uploads compressed to ~170KB. Bumped `CACHE_VERSION`
to `v5` for the same 404-caching reason as last time.

Note: the wider Triple/Quad/Penta-Element Ethereal set (Yooreek, Meebkin,
Blarret, Gaddzooks, Auglur, Flasque, Nitebear, Piplash, Teeter-Tauter,
Pentumbra, Rhysmuth, Oogiddy, BeMeebEth) still has no art — that was never
part of the original Phase 4 ask, so it's just noted here rather than
treated as a gap in this phase.

## Triple-Element Ethereal art batch (8 of 9 remaining monsters)

Added real art for all 8 Triple-Element Ethereals (Yooreek, Meebkin,
Blarret, Gaddzooks, Auglur, Flasque, Nitebear, Piplash — common + rare
each, no epic tier for these) plus BeMeebEth (the Penta-Element Ethereal,
common only). Same compression treatment (400px max edge, 256-color
quantize, optimize) — 10.7MB of uploads compressed to ~340KB.
`CACHE_VERSION` bumped to `v6`.

Still missing art: the 4 Quad-Element Ethereals — **Teeter-Tauter**,
**Pentumbra**, **Rhysmuth**, **Oogiddy** (common only, no rare/epic tiers
for these). Once those land, every Ethereal monster in the dataset will
have art.

## Quad-Element Ethereal art added — Ethereal class 100% art-complete

Added Teeter-Tauter, Pentumbra, Rhysmuth, and Oogiddy (common only, matching
their single-variant setup). **All 31 Ethereal monsters now have art for
every variant they have.**

**Bug found and fixed while processing this batch:** Sox's three variants
were mislabeled two batches back — the file saved as `sox-common.png` was
actually the Rare art (teal), `sox-rare.png` was actually the Epic art
(green, with the crystal-tail and ridged horns), and `sox-epic.png` was
actually the Common art (plain tan goat). Caught it because this batch
re-sent Sox's rare/epic art again and the "Rare_Sox.png" this time was
pixel-identical to what was already saved as `sox-epic.png` — a real
content conflict, not just a coincidence. Rotated the three files into
their correct slots (common = tan goat = simplest design, rare = teal
recolor, epic = green with added crystal growths and ridged horns — the
complexity progression that holds for every other Ethereal checked so
far). This turn's `Epic_Sox.png` re-upload was **not** used — it showed a
spotted, slime-dripping bat-winged creature that doesn't match Sox's
goat/gazelle body plan at all, so it looks like an unrelated file that got
swept up under that name. Sox's epic slot now correctly holds the
already-verified green gazelle art instead.

`CACHE_VERSION` bumped to `v7` (covers both the new art and the Sox fix).

**Correction:** the fix above was based on my own guess at complexity
progression (plainest = common, most decorated = epic), without an actual
filename to confirm it — and it guessed wrong. With the real filenames
confirmed directly, the correct mapping is:
- `sox-common.png` = teal creature (`Sox.png`)
- `sox-rare.png` = green gazelle with purple crystal growths (`Rare_Sox.png`)
- `sox-epic.png` = tan/white goat (`Epic_Sox.png`)

So common/epic ended up swapped from what the "plainest vs. most decorated"
assumption predicted — a reminder that filename confirmation beats visual
inference when they're available. All three are now saved correctly.
`CACHE_VERSION` bumped again to `v8`.

## Phase 3 — Batch 1: Epic Single-Element Ethereal breeding fix

Fixed the known bug flagged at the end of Phase 4: all 5 Single-Element
Ethereals' **Epic** variant was reusing the **Common** variant's breeding
description verbatim ("a Quad-Element and a Triple-Element Natural
monster..."), which describes how to get the Common form, not the Epic.

Every Epic Single-Element Ethereal actually has two valid, distinct
breeding combos — one on its natural island, one on Ethereal Island — and
per the wiki's own breeding-patterns page, the Ethereal Island combo
always pairs two Double-Element Ethereals that (a) don't share an element
with each other and (b) neither carries the Epic's own element. Converted
all 5 to the `breeding.combos` array format (the Monculus/Kayna template)
to actually represent this, instead of a single flat description:

| Monster | Natural Island combo | Ethereal Island combo |
|---|---|---|
| Epic Ghazt (Plasma) | T-Rox + Furcorn, Plant Island | Boodoo + Dragong |
| Epic Reebro (Mech) | T-Rox + Pango, Air Island | Sox + Kazilleon |
| Epic Grumpyre (Shadow) | Dandidoo + Bowgart, Cold Island | Nebulob + Fung Pray |
| Epic Jeeode (Crystal) | Quibble + Pummel, Water Island | Jellbilly + Arackulele |
| Epic Humbug (Poison) | Cybop + Clamble, Earth Island | Whisp + Bellowfish |

Each Natural Island combo entry groups the island with its Mirror
counterpart (e.g. Plant Island + Mirror Plant Island) per the
"don't split main/mirror pairs" rule, since there's no indication the
combo differs there. `timeEnhanced` for each is the standard 25% breeding-
time reduction, not a separately sourced figure. Common/Rare variants for
these 5 were left as-is — they're already accurate, just less detailed
(generic "Quad + Triple" phrasing instead of naming the specific parents);
that's a polish item, not a bug, so it's not in scope for this batch.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Profile layout change (applies going forward to every monster)

Reordered the Monster Profile sections: **Breeding** now comes right after
Elements, followed by **Used To Breed**, followed by **Islands** (previously
Islands came before Breeding). This is a template-level change in
`index.html` — since sections are just shown/hidden and filled in by JS,
not rebuilt in DOM order, this reorders every monster's profile
automatically with no per-monster data change needed.

## Phase 3 — Batch 2: remaining 16 Ethereals (Ethereal Workshop + Islets)

Closes out the Ethereal class entirely — this was the last set of Ethereal
monsters with unpopulated breeding data (all 16 had `breeding: null` and
nothing else).

**Important finding that changed the approach for this whole batch:**
these monsters aren't bred at all, in the two-parent sense the rest of the
dex uses. Ethereal Workshop and the Ethereal Islets use entirely different
mechanics:

- **Ethereal Workshop (Triples/Quads/Quint):** obtained by *Synthesizing*
  — combining 3, 4, or 5 "Meebs" (element-attuned critters) in the
  Synthesizer. Quads can also be synthesized by using their same-wave
  Triple as a base monster instead of starting from scratch (e.g. Whaill
  can be synthesized from Nitebear). There's no such shortcut for Oogiddy.
- **Ethereal Islets:** obtained by *Dish-Harmonizing* — an existing
  Monster is broken back into its attuned Meebs, which randomly recombine
  into two new Monsters. This is genuinely random, not a fixed pair of
  parents, so it doesn't fit the `breeding.combos` format at all.
- **Rare tiers** (confirmed to now exist for all 15 of these monsters
  except BeMeebEth) work differently again: on Ethereal Workshop, a Common
  is *evolved* into Rare via the Rarefied Attunement Structure; on the
  Islets, Rares come from the same random Dish-Harmonizing process via a
  Rarefied Dish-Harmonizer, just with a chance of Rare instead of Common.

Because none of this is actually breeding, forcing it into
`breeding.combos` would misrepresent it — so `breeding` stays `null` (this
is correct, not a gap) and the real acquisition mechanism is documented in
`alternativeAcquisition` instead, which is exactly how Monculus itself
handles its own non-breeding Wublin Island path.

**Data changes:**
- All 16 monsters' Common variant now has accurate, specific
  `alternativeAcquisition` text (exact Meeb elements required, synthesis
  success/fail timing, Islet Dish-Harmonizing where applicable).
- Added a Rare variant (previously entirely missing) for Teeter-Tauter,
  Pentumbra, Rhysmuth, and Oogiddy — confirmed via the wiki that all four
  now have real Rare tiers, following the same Workshop-evolve /
  Islet-Dish-Harmonize pattern as the other 11.
- BeMeebEth gets a note that no Rare or Epic exists for it yet — what
  circulates online under that name is fan concept art, not real game
  content.
- **Bug fix, found by accident while reviewing this batch's own notes:**
  6 pre-existing `notes` entries (not written by me) incorrectly identified
  "Poison Islet" as "Mirror Earth Island" — those are unrelated islands.
  Removed the wrong parenthetical; the substance of the note (Poison Islet
  hasn't been released yet) was already correct.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Profile template + Monster View navigation pass

- **A–Z jump sidebar (Monster View):** a fixed letter list on the right
  edge lets you jump straight to the first visible monster starting with
  that letter. Letters with nothing currently visible (given active
  filters/search) show disabled rather than disappearing, so the alphabet
  doesn't reflow as you filter. Hidden automatically in Island View.
- **Egg Requirements moved** to right after "Vessels, Zapping, Boxing &
  Revitalizing" (previously came before Alternative Acquisition), and its
  list now sorts longest hatch-time first, shortest last.
- **Time format standardized everywhere:** every duration in the dataset —
  breeding timers, egg hatch times, special-mechanics text, everything —
  now uses the `1d 6h 20m` style instead of a mix of that and "1 day, 6
  hours, 20 minutes" prose. 189 conversions across the whole file.
- **Breeding template refined to match Monculus exactly:** added
  `Best:` / `Also:` support for the case where one island has more than
  one valid parent pairing (previously this got crammed into a single
  prose sentence — fixed for Hairionette, which also had a stale note
  left over from before the Paironormal Carnival split; cleaned that up
  too). The flat single-description breeding path (the ~350 monsters not
  yet migrated to the full multi-combo format) now gets the same
  island-header visual treatment for consistency, even though its
  underlying data isn't restructured yet — that's still Phase 3's job,
  batch by batch.
- **Alternative Acquisition now supports the same island-grouped template
  as Breeding**, for monsters whose acquisition genuinely differs by
  island. Converted all 16 Ethereal Workshop/Islet monsters from Phase 3
  Batch 2 to this format (separate blocks for "Ethereal Workshop" vs. the
  Islet(s)), while monsters with a single ungrouped acquisition path (like
  Monculus's Wublin Island purchase) stay as plain bullet lines — grouping
  is only applied where it actually clarifies something.
- **Font consistency confirmed:** `.breed-combo` blocks and
  `.profile-section li/p` already shared the same size/line-height before
  this pass; the new Alternative Acquisition blocks reuse `.breed-combo`
  directly, so everything stays visually consistent without new CSS rules
  to maintain.

**No art changes in this pass — `CACHE_VERSION` not bumped.**

## Phase 3 — Batch 3: Fire hybrid re-verify (Glowl, Flowah, Stogg, Barrb, Floogull, Repatillo, Tring, Phangler, Boskus, Whaddle, Woolabee, Wynq, Sneyser)

**Island assignments confirmed correct** for all 13 — unlike Sooza/Ziggurab/Thrumble/
Rootitoot (pure Magical monsters wrongly cross-listed to Fire Haven/Oasis), these
are genuine Fire-element hybrids that legitimately live there. Pattern holds
across the whole set: Doubles (Glowl, Flowah, Stogg, Phangler, Boskus) live on
their Fire island + the two Magical Islands (+ Mirrors) sharing their non-Fire
element; Triples/the Quad (Barrb, Floogull, Repatillo, Tring, Whaddle, Woolabee,
Wynq, Sneyser) live on their Fire island + Amber only, no Magical cross-listing.
Spot-checked Glowl, Barrb, and Phangler directly against the wiki to confirm.

**Bigger finding: Rare/Epic for Fire hybrids don't work like Ethereal
Epics did in Batch 1.** There's no two-parent "Epic combo that lacks the
monster's element" pattern here — Fire Monster Rares and Epics use a
completely different mechanism:
- **Rare** isn't bred via a distinct combination at all — any breeding
  attempt that would normally produce the Common has a chance to fail
  upward into a Rare instead. (Confirmed for all 13; documented as a note
  rather than a fake `breeding.combos` entry, since there's no fixed
  parent pair to show.)
- **Epic** breeding combination is genuinely different per island and
  doesn't follow a memorable formula — the wiki maintains a dedicated
  "Epic Breeding Combinations" reference page specifically because there
  isn't a shortcut. Epic Monsters also cannot breed once obtained.
- **On Amber Island specifically**, neither Rare nor Epic breeds at all —
  both are Crucible/Enhanced Crucible **evolutions** of an existing
  Common/Rare, a completely different mechanic, already well-documented
  in these monsters' pre-existing `specialMechanics` data.

**Data changes:**
- Added the missing **Epic variant entirely** for Flowah, Barrb, Floogull,
  Repatillo, Phangler, Woolabee, and Wynq — confirmed via the wiki that
  real Epic forms exist for all 7; they simply weren't in the dataset at
  all before this batch.
- Populated 3 confirmed specific Epic combos: Epic Glowl (Fire Haven:
  Floogull + Dandidoo; Fire Oasis: Wynq + Quibble), Epic Barrb (Fire
  Haven: Floogull + Shrubb), Epic Floogull (Fire Haven: Reedling + Glowl).
- For every other island/monster combination where I could confirm the
  *mechanism* but not the *specific parent pair*, the note says so
  explicitly ("not yet independently confirmed for X in this build")
  rather than guessing — this covers most of the Magical-island Epic
  combos for the 5 Doubles, and most Epic combos overall for the newly
  added 7. A dedicated deep-dive batch would be needed to chase down all
  of these individually; flagging rather than attempting it inline.
- Added `specialMechanics` (Enhanced Crucible evolution, Vessel cost in
  Relics) for the 7 newly-added Epic variants, matching the exact template
  already used by the 6 that had it — Relic cost scales by element count
  (10 for Doubles, 20 for Triples/Quad, matching the existing pattern).
- Avoided duplicating the Amber Crucible mechanic across two sections:
  removed my own first-draft `alternativeAcquisition` entries once I
  found this was already thoroughly covered in `specialMechanics` for
  every Rare and 6 of the 13 Epics.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

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
