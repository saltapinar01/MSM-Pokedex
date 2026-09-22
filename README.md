# MSM Pokédex — Phase 1 (+ Phase 4 data pass)

## Correction: Rare/Epic Wubbox requirements mirror Common's exactly

The person corrected the previous pass directly: Rare and Epic Wubbox's
per-island requirements aren't a different structure from Common's —
they're just Common's exact same per-island pattern, scaled to that
tier. That replaces two things that were wrong in the last update:
- Rare Wublin Island was listed as needing "any 10 of the 19 Rare
  Wublins" — actually all 19, same as Common.
- Rare and Epic's other-island entries were vague placeholders ("exact
  count not confirmed" / "boxing in phases, not itemized") — actually
  the same concrete 15-per-island / 30-on-Gold-Island rule as Common,
  just requiring that tier's Monsters instead of Common ones.

Rewrote both tiers' `islandDetails` to mirror Common's 9-entry structure
exactly (Wublin Island + the 7 other islands at 15 + Gold Island at 30),
substituting "Rare Monsters" / "Epic Monsters" for "Common Monsters."
Epic keeps its per-island artwork from the last pass; it has no Wublin
Island entry since no Epic Wubbox exists there.

## Epic Wubbox images added + gallery replaced with an accordion

**Images:** processed all 9 uploaded per-island Epic Wubbox artworks to
match every other asset in the project — resized to a 400px-long-side
cap, converted to palette mode with transparency preserved, optimized
(24–35KB each, in line with the existing 18–30KB range; the fancier
designs like Ethereal run slightly larger, which tracks with their extra
color complexity). Saved as `wubbox-epic-<island>.png` for Plant, Cold,
Air, Water, Earth, Fire Haven, Fire Oasis, Ethereal, and Gold. Spot-checked
the most complex one (Ethereal) for palette-conversion banding — none
visible.

**UI: replaced the appearance gallery from last pass with an accordion**,
per direct request. Built on native `<details>`/`<summary>` rather than
hand-rolled JS toggle logic — free keyboard support and accessibility,
and the browser already tracks open/closed state without extra code. A
custom chevron (CSS-only, rotates on open) replaces the default disclosure
triangle. Each panel shows the per-island artwork (where one exists)
alongside that island's specific requirement text.

This also replaced the data shape from last pass: `imagesByIsland`
(images only) is gone, folded into a richer `islandDetails` field
(`{island, image?, requirement}`) that carries both the art and the
requirement text together — since the actual need turned out to be
"show requirements per island," not just "show art per island."
Populated for all 3 Wubbox tiers:
- **Common:** 9 islands, each with its own requirement text (Wublin
  Island's "all 19 Wublins" rule, the standard "15 Common Monsters" rule
  for the 7 other islands, Gold Island's "30 instead of 15" exception).
  No per-island art — Common Wubbox looks the same everywhere.
- **Rare:** 2 entries (Wublin Island's specific rule, a general one for
  everywhere else — the per-island Rare counts elsewhere aren't
  confirmed, same gap flagged last pass).
- **Epic:** all 9 islands, each with its new artwork plus a requirement
  line. The exact Epic Monster counts per elemental "phase" aren't
  itemized in available sources — flagged rather than invented.

To avoid saying the same thing twice, simplified `alternativeAcquisition`
back down to just the purchase-price line for each tier, pointing to the
new accordion for the per-island breakdown that used to live there as
flat grouped text.

**No other Supernatural research done in this pass** — this was purely
the asset-and-UI work the person asked for. The 16 remaining Wublin egg
lists and 13 remaining polarity pairs from the last check are still
open.

## Two Wubbox design questions, answered with working code

Before continuing the Supernatural data work, addressed two structural
questions about how Wubbox should be represented:

**"Epic Wubbox looks different per island — show each as a separate
profile?"** Recommending against literal separate profiles: the game
itself treats Epic Wubbox as one monster with 9 cosmetic reskins, not 9
different creatures (no separate Book of Monsters entry per island).
Making separate profiles would misrepresent that and break things
elsewhere that assume one profile per real species (search, breeding
references). Instead, added a new optional `imagesByIsland` field per
variant and a small "Appearance By Island" gallery section in the profile
page (index.html, styles.css, app.js all updated) that shows a thumbnail
per island when that field is populated. **Not populated with real data
yet** — the project's asset folder only has one generic
`wubbox-epic.png`, not the 9 distinct per-island designs, so the gallery
has nothing to show until those image files exist. Infrastructure is
ready; needs the actual assets.

**"Wubbox needs different monster sets per island — how to capture
that?"** No new code needed — the Acquisition section already supports
grouped-by-island blocks (`{island, lines}`), used elsewhere for
monsters with genuinely different acquisition paths per location.
Restructured Wubbox's three tiers to use it: Wublin Island's "box all 19
Wublins" rule now sits in its own block, the "15 Common Monsters" rule
covering the 5 Natural Islands + mirrors + Fire Haven + Ethereal Island
in another, and Gold Island's "30 instead of 15" exception in a third.

## Phase 3 — Batch 7 continued: Supernatural price/polarity/egg check (20 monsters)

**Prices: all 19 Wublins now confirmed**, closing out the placeholder bug
from the last pass. Real prices, low to high: Brump 2,000 → Zynth/Gheegur/
Scargo 3,000 → Blipsqueak/Screemu/Poewk/Fleechwurm 5,000 → Creepuscule/
Maulch/Thwok/Dermit 17,000 → Astropod/Zuuker/Bona-Petite/Whajje 20,000 →
Dwumrohl/Pixolotl/Tympa 34,000. Worth noting: a couple of these (Blipsqueak,
Screemu, Poewk, Fleechwurm) genuinely are 5,000 — the placeholder wasn't
wrong for every monster, just wrong as a blanket value applied to all 19
regardless of their real, very different prices. Also caught a source
conflict worth flagging: a 2023 Steam guide gives Dwumrohl and Whajje as
5,000 Coins each, but the primary wiki's current pages say 34,000 and
20,000 — the wiki's own trivia about a past "price change of all Wublins"
explains the gap, so the current wiki page was trusted over the older
guide.

**Egg requirements: 3 of 19 now fully confirmed** with exact counts
(matching the app's existing `eggRequirements` schema, already used for
Wubbox's Wublin Island list): Zynth (1 each of T-Rox, Congle, Pango,
Oaktopus, Drumpler, Maw), Screemu (2 Shellbeat, 6 each Spunge/Shrubb/
Quibble), Whajje (6 Tweedle, 7 Deedge, 10 each Dandidoo/Cybop/Reedling).
**Not completed:** the other 16. Partial, non-itemized facts surfaced for
a few (Dwumrohl needs all 5 Natural Quads + all 5 Naturals Singles +
Potbelly specifically + zero Doubles, 71 eggs total; Tympa's single
largest requirement is 24 Drumplers; Dermit needs Fwog and nothing from
the Fire islands or Light/Psychic/Faerie Island) but not broken into the
precise per-monster counts the schema needs — these come from a page's
own inventory table, not search snippets, and getting all 16 properly
would mean fetching each one individually. Flagging as real, sizeable
remaining work rather than quietly leaving it incomplete.

**Polarity: unchanged from the prior partial pass** (Brump, Dwumrohl,
Fleechwurm, Pixolotl, Poewk, Whajje have confirmed pairs or half-pairs;
the other ~13 don't). One relevant bonus fact did surface this pass:
confirmation that Fleechwurm (last Wublin released, July 2017) and
Dwumrohl (among the first, March 2016) are correctly the *only* mutually
negative pair on the island — matches what was already in the data, no
change needed, but good independent corroboration.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Phase 3 — Batch 7 (partial): Supernatural class check — Wublins (20 monsters)

Started Batch 7 (Supernatural class, 20 monsters — all Wublins plus
Wubbox). **This turned out to be a scoping pass more than a completion**,
similar to how Batch 5 started with a "check" before diving in — except
here the surprise showed up mid-batch rather than up front. Flagging that
clearly rather than presenting a rushed full pass as finished.

**Structural note:** Wublins genuinely can't be bred — they're bought as
dormant statues, then woken by zapping in eggs within a time limit
(Common), or evolved via Keys + Rare/Epic egg-zapping (Rare/Epic, no time
limit). So `breeding: null` across the board is correct, not a gap — the
real equivalent of "breeding data" for this class is the statue price,
the egg requirements, the time limit, and Polarity.

**Real bug found: every one of the 17 not-yet-individually-checked
Wublins had an identical "5,000 Coins" Market price** — obviously a
placeholder, not researched per-monster data. Confirmed this directly by
checking two of them: Brump is actually 2,000 Coins, Astropod is 20,000.
Real prices are confirmed to range 2,000–34,000 Coins and are
monster-specific, not uniform. Fixed Brump and Astropod with their real
prices; for the other 17, **removed the wrong placeholder** and replaced
it with an explicit "not independently confirmed, real prices are
monster-specific" note rather than leaving a number that's already known
to be false in most cases. This needs the same one-by-one treatment the
Magical and Natural Singles got — 17 more individual page checks, not a
2-minute cleanup. Recommending it as its own sub-batch (7a — Wublin
statue prices).

**Polarity — directly relevant to the person's own Wublin Island grid
project.** Only Whajje's pairing (positive: Dwumrohl, negative: Zynth)
was on record before this pass. Confirmed 5 more, partially or fully,
from primary-wiki and community-tool sources describing the positive-pole
chain (Brump → Fleechwurm → Pixolotl → Scargo → ... → Poewk → Brump,
looping through all 19) and a couple of negative-pole facts:
- **Brump:** positive Fleechwurm, negative Blipsqueak (both confirmed)
- **Dwumrohl:** positive Astropod, negative Fleechwurm (both confirmed —
  Dwumrohl/Fleechwurm is also confirmed as the only *mutual* negative
  pair on the island, each reducing the other)
- **Fleechwurm:** positive Pixolotl (confirmed), negative Dwumrohl
  (confirmed via the mutual-pair fact above)
- **Pixolotl:** positive Scargo (confirmed); negative pole not found
- **Poewk:** positive Brump (confirmed, this is what closes the 19-Wublin
  loop); negative pole not found

Also confirmed and added the general mechanic rules governing all of
this: Rare and Epic Wublins **inherit the exact same pole pairing as
their Common form** (only taking effect once both tiers of the pair are
actually released — an Epic-tier bonus needs the other monster's Epic
form to exist too), and the loose grid-size tendency (positive poles
tend to be a different grid size, 2x2 vs 3x3; negative poles tend to
share size, likely to discourage same-size farms) with Blipsqueak/Screemu
as the one known exception.

**Not resolved this pass, and likely won't be quick:** the remaining
~13 Wublins' full pole pairs. The complete chain almost certainly exists
in full somewhere (a Tumblr infographic and an itch.io tool both
reference having the complete picture, but neither rendered as
extractable text this pass — one's an image, the other's inside an
interactive Unity app). Worth a dedicated look if this matters enough to
chase down properly, given it maps directly onto the grid-planning work
already underway.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Phase 3 — Batch 6d: Natural Quads (5 monsters) — closes Batch 6

Covers Entbrat, Riff, Deedge, Shellbeat, Quarrister — **the last of the
Natural class, and the last sub-batch of Batch 6.**

**Filled in 3 blank Epic times** (Deedge, Shellbeat, Quarrister — same
disclaimer-text-in-time-field bug as before): Epic Deedge 1d 17h/1d 6h 45m,
Epic Shellbeat 1d 19h/1d 8h 15m, Epic Quarrister 1d 11h/1d 2h 15m. The 2
already-filled ones (Entbrat, Riff) matched the same Steam guide exactly —
9 for 9 now across Batches 6b–6d, no misses.

**A proper cleanup pass on the redundant-clause bug**, since by this point
it was clearly a widespread pattern rather than a couple of one-offs.
Went through the whole Natural class and separated the false positives
from the real bugs:
- **Real duplicates, fixed (13 total):** Tweedle, Maw, Pango, Potbelly,
  Noggin, Toe Jammer, and Mammott's Epic descriptions, plus Maw, Dandidoo,
  Cybop, Quibble, Pango, Shrubb, Congle, and Reedling's Rare descriptions
  — each had a combo already named in the main sentence, then repeated
  verbatim after a stray "|" under a redundant label ("Also obtainable
  on...", "Epic X here:"). **Two of these (Tweedle's Epic, Maw's Rare)
  were missed on the first pass** and caught on a follow-up sweep before
  calling this done — worth double-checking after any similar bulk
  cleanup rather than trusting the first pass was complete.
- **Legitimate, left alone (5):** the Rare descriptions for Tweedle,
  Potbelly, Noggin, Toe Jammer, and Mammott also use a "|" character, but
  what follows it isn't a duplicate — it's genuinely different information
  (which specific Fire-Triple or Magical-Triple pairs work on a different
  island). These just happen to share a separator character with the real
  bug; the content itself checks out.

**This closes Batch 6 (Natural class, 31 monsters) entirely** — Singles +
Mimic (6), Doubles (10), Triples (10), and Quads (5) are all done.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Phase 3 — Batch 6c: Natural Triples (10 monsters)

Covers T-Rox, Pummel, Clamble, Bowgart, Congle, PomPom, Scups, Spunge,
Thumpies, Reedling. Same pattern as Batch 6b: mostly a verification pass
against the same Steam breeding-times guide, which by this point has been
right 7-for-7 on every Epic time it's been checked against — high enough
confidence to use it directly for the gaps.

**Filled in 3 blank Epic times** (Spunge, Thumpies, Reedling — all three
had the "not yet confirmed" disclaimer text literally sitting in the time
fields, same bug pattern as Batch 6b's Dandidoo): Epic Spunge 1d 1h/18h 45m,
Epic Thumpies 1d 9h/24h 45m, Epic Reedling 17h/12h 45m.

**Confirmed correct, no changes needed:** all 10 Common times (8h/6h for
T-Rox, 12h/9h for the other 9), all 10 Rare times (10h 30m/7h 52m 30s for
T-Rox, 15h 30m/11h 37m 30s for the other 9), and the 7 Epic times that
were already filled in (T-Rox, Pummel, Clamble, Bowgart, Congle, PomPom,
Scups) — every single one matched the guide exactly.

**Cleaned up two more of the same redundant-clause artifacts** as
Batch 6b's Oaktopus fix — Congle's and Reedling's Epic descriptions each
named their Fire-island combo once in the main sentence, then repeated it
a second time after a stray "|" character. Removed the duplicate half in
both. No duplicate-island bug this time — that one was fully swept in
Batch 6b.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Phase 3 — Batch 6b: Natural Doubles (10 monsters)

Covers Drumpler, Fwog, Maw, Dandidoo, Cybop, Quibble, Pango, Furcorn,
Oaktopus, Shrubb. This batch turned into more of a data-integrity sweep
than fresh research — the combos and times were already largely correct,
but three real bugs and one systemic issue turned up while verifying.

**Systemic bug, fixed dataset-wide:** duplicate island entries in Epic-tier
`islands` arrays — e.g. Drumpler's Epic listed "Faerie Island" twice. This
wasn't isolated to Doubles: it also affected all 5 Natural Singles from
Batch 6a (Tweedle, Potbelly, Noggin, Toe Jammer, Mammott) plus Congle and
Reedling (Triples, not yet reached in the batch plan) — 13 tier-entries
total across the whole dataset. Deduped everywhere in one pass.

**Real Epic-timing bugs, caught by cross-referencing a full table of all
10 Doubles' Epic times against a Steam community guide sourced from the
wiki:**
- **Fwog's Epic time was Maw's time, not its own** (13h/9h 45m — actually
  Maw's value). Real Epic Fwog is 7h/5h 15m. Fixed.
- **Drumpler's Epic enhanced time had a rounding error**: 15h × 0.75 =
  11h 15m exactly, but the data had 11h 45m. Fixed.
- **Dandidoo's Epic time**, left blank in Batch 6a's cleanup, is now
  confirmed: 1d 5h / 21h 45m.

Also cleaned up a leftover editing artifact in Oaktopus's Epic
description — a redundant clause ("Epic Oaktopus here: Rootitoot +
Bonkers") duplicating the already-stated "Psychic: Rootitoot + Bonkers"
a second time after a stray "|" character.

**Everything else checked out.** Cross-referenced Common and Rare times
for all 10 against the same source: all Common times (30m for
Fwog/Drumpler/Maw, 8h for the other 7) and all Rare times (1h 7m 30s for
Drumpler/Maw, 1h 15m for Fwog specifically — genuinely different despite
sharing a Common time, confirmed directly rather than "corrected" to
match the other two — and 10h 30m for the remaining 7) matched exactly.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Phase 3 — Batch 6a: Natural Singles + Mimic (6 monsters)

Starts Batch 6 (Natural class, 31 monsters). This data was noticeably more
mature going in than Fire or Magical were — spot-checking a cross-section
of Doubles/Triples/Quads showed combos and times already filled in and
accurate. So Batch 6 will likely need fewer, larger sub-batches than
Batch 5 did. Starting with the two structurally distinct pieces: the 5
Singles (Tweedle, Potbelly, Noggin, Toe Jammer, Mammott) and Mimic (the
one Quint, Fire Oasis's odd one out).

**Singles confirmed and filled in** (all were missing Market price and
incubation time entirely): Tweedle 300 Coins/4h, Potbelly 250 Coins/2h,
Noggin 300 Coins/5s, Toe Jammer 250 Coins/1min, Mammott 300 Coins/2min.
Also confirmed the breeding-failure mechanic already implied in the data:
a failed breeding attempt using a Quad-Element Monster has a **100%**
chance of returning the matching Single, not just "a chance."

**Mimic — three real fixes, plus one of my own that had to be reverted:**
- **Islands list was incomplete** — that's what I thought at the time. A
  secondary source claimed Mimic also lived on Gold Island, so I added it.
  The person then flagged this directly with a link to the primary wiki
  page, which is unambiguous: "Mimic is a Quint-Element Natural Monster
  that is **found exclusively on Fire Oasis**" — and the page's own trivia
  section calls this out explicitly as one of the things that makes Mimic
  unique among Natural Monsters ("not on any Islands where all other
  Naturals are found... on only one Island in the main game"). Reverted —
  Mimic's `islands` is back to just `["Fire Oasis"]` on all 3 tiers. The
  secondary source that caused this was wrong; lesson taken for future
  Mimic-adjacent claims.
- **Rare Mimic's acquisition was a placeholder** ("same as the Common
  form") with no actual price or time. It's genuinely different: purchased
  from the **StarShop for 15,000 Starpower**, not the Market, and cannot
  be bred at all. Filled in with the real path and its 3d 23h 30m
  incubation.
- **Epic Mimic's enhanced time was blank** — filled in (1d 15h → 1d 5h 15m).
  Its combo (Wynq + Glowl) was already present in the data and left as-is.
  **Flagging for a closer look later, not resolved now:** the primary
  wiki's main Mimic page states plainly that Mimic "cannot breed or be
  bred" in the current game, and even lists "no Rare or Epic variant" in
  its own trivia — though that trivia line looks stale, since a dedicated
  Rare Mimic page (version 4.8.2, StarShop-only, matching what's in the
  data) clearly does exist. Whether "Epic Mimic" is real, and whether its
  Wynq + Glowl combo is accurate, wasn't independently re-confirmed this
  pass — worth a dedicated check before trusting that entry further.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Phase 3 — Batch 5f: Magical Sanctum/Nexus cross-monsters (11 monsters)

Final sub-batch of Batch 5 — **closes out the entire Magical class.** Covers
Cahoot, Déjà-Jin, Knucklehead, Roarick, Xyster, Osstax (Doubles), Frondley,
Larvaluss, Mushaboom, G'day (Triples), and Enchantling (Quad). Note: the
real name is **Frondley**, not "MsFrondley" — that was this project's own
internal id/shorthand, not a name to actually use.

**This is the single biggest structural finding across all of Batch 5.**
Every one of these 11 had `islands` arrays listing their 2–4 component
Magical Islands (Psychic/Light/Faerie/Bone) plus all the matching Mirror
islands — e.g. Cahoot listed as living on Psychic Island, Light Island,
*and* Magical Sanctum. **This is wrong for all 11.** Multiple primary wiki
pages state it explicitly and identically: "Cahoot is a Double-Element
Magical Monster **exclusive to Magical Sanctum**" — same wording, word for
word, on Knucklehead's, Xyster's, Frondley's, Roarick's, Osstax's,
Déjà-Jin's, Larvaluss's, Mushaboom's, G'day's, and Enchantling's own pages.
None of these 11 monsters live on their component Magical Islands at all —
their only real residences are **Magical Sanctum and Magical Nexus**.
Fixed every `islands` array (22 tier-entries) to just `["Magical Sanctum",
"Magical Nexus"]`.

One consequence: since there's no multi-island mixup to worry about after
all (there's only one place they're bred), the flat single-description
breeding format these already had turns out to be the *right* shape for
these 11 — the risk flagged back in the original Batch 5 planning was
real, just not the risk expected. The bug was residency, not breeding-combo
attribution.

**Confirmed a clean, near-universal timing pattern within this group:**
- **All 6 Doubles breed in 20h/15h enhanced** — confirmed individually for
  all 6 (Cahoot, Déjà-Jin, Knucklehead, Roarick, Xyster, Osstax all
  independently landed on the exact same number).
- **All 4 Triples breed in 1d 6h/22h 30m** — confirmed for 3 of 4
  (Frondley, Larvaluss, Mushaboom); G'day pattern-matched with high
  confidence given the other three were unanimous.
- **Rare timing is also uniform within each tier**, but *not* the same
  simple ×1.25 multiplier the wiki's general Rare-monster page describes —
  Rare Doubles here are 1d 2h 30m (confirmed for Knucklehead and Déjà-Jin
  directly; the other 4 pattern-matched), and Rare Triples are 1d 13h 30m
  (confirmed for Larvaluss, which *does* match ×1.25 of its Common time
  exactly — 30h × 1.25 = 37.5h — while the Doubles' Rare time doesn't fit
  that same formula, so it wasn't used to extrapolate them).
- **Enchantling (the Quad) is fully confirmed both tiers**: 2d 2h/1d 13h 30m
  Common, 2d 14h 30m/1d 22h 52m 30s Rare — both exactly ×1.25, both
  independently confirmed on two separate sources.

**Epic Knucklehead** is confirmed to exist with a confirmed time (2d 3h
49m/1d 14h 51m 45s), but the source for its exact combo was truncated —
only "involves Fluoress as one parent" came through cleanly. Filled in the
time, left the combo flagged as unconfirmed rather than guessed. No other
Epic entries exist for this group of 11 — didn't find evidence any of the
other 10 have an Epic yet.

**Another fabricated note found and removed — same one as Batch 5a.** All
22 tier-entries carried the identical "appears at Level 1 size... shared
Nexus Nucleus structure" note already debunked and stripped from the 4
Magical Singles. Removed here too. Worth being alert for this exact phrase
anywhere else in the Magical data that hasn't been touched yet.

**Not confirmed, flagged rather than guessed:** exact Magical Nexus
Transpose costs/times for all 11. The per-island Magical hybrids'
Coin/Diamond cost pattern (2M/10 Diamonds Doubles, 4M/20 Triples,
8M/40 Quad) is noted as a plausible extrapolation, but since these 11 skip
the "bred on a component island, then Transposed" step entirely, there's
a real chance Sanctum-exclusive monsters price differently — didn't find
a page that actually says so either way.

**This closes Batch 5 (Magical class, 43 monsters) entirely** — Singles
(4), Psychic/Faerie/Light/Bone hybrids (28), and Sanctum/Nexus
cross-monsters (11) are all done.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Phase 3 — Batch 5e: Bone Island hybrids (7 monsters)

Fifth sub-batch of Batch 5 — **closes out all four per-island Magical
sub-batches** (Psychic/Faerie/Light/Bone done; only the Sanctum/Nexus
cross-monsters remain for Batch 5f). Covers Peckidna, Denchuhs, Hawlo
(Doubles), Withur, Uuduk, Banjaw (Triples), Plinkajou (Quad).

**Common tier already accurate** (confirmed: Peckidna/Denchuhs/Hawlo =
Noggin/Toe Jammer/Kayna + Clackula, 9h; Withur/Uuduk/Banjaw = combos of
the 3 Doubles, 16h; Plinkajou = Banjaw + Noggin, 1d 8h). Same Magical
Nexus `islands` fix applied as the previous three sub-batches.

**Rare Plinkajou: a 4th confirmed cross-island match.** 1d 18h 30m /
2d 12h 30m Nexus Transpose — identical to Rare Gloptic (Psychic), Rare
Pladdie (Faerie), and Rare Blow't (Light). The "one Rare time per
structural tier, shared by every Magical Island" pattern is about as
proven as it can get at this point; filled in the remaining blanks
(Peckidna, Denchuhs, Uuduk) from it with a corrected, tier-accurate note
(caught and fixed a copy-paste bug where the confirmation note for these
Doubles/Triple briefly said "Rare Quads" — wrong tier, fixed before
shipping).

**Epic Peckidna — new addition, found during Faerie batch research and
held for this batch:** Uuduk + Fwog, 1d 22h 15m (1d 10h 41m 15s
enhanced), plus its Magical Nexus Transpose (20 Diamonds, 2d 16h 15m).
This breaks the loose "only one Epic per island, and it's a Triple"
pattern seen on Psychic/Faerie/Light (Rooba/Cantorell/TooToo) — Bone's
confirmed Epic is a Double instead.

**Epic Withur/Uuduk/Banjaw/Plinkajou/Denchuhs/Hawlo: confirmed NOT to
exist**, with the clearest signal yet across all 4 Magical Islands. Every
mention found was explicitly labeled fan content — a wiki community-forum
post literally titled "I present to you the FIRST epic quad… Epic
Plinkajou!" (a user's own concept pitch, not a real feature) and a
"Fanmade Bone Island Epic Wubbox" post listing the same set. Left unadded.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Phase 3 — Batch 5d: Light Island hybrids (7 monsters)

Fourth sub-batch of Batch 5. Covers Gob, Bulbo, Pluckbill (Doubles),
Spytrap, TooToo, Fiddlement (Triples), and Blow't (Quad).

**Common tier already accurate** (confirmed: Gob/Bulbo/Pluckbill =
Potbelly/Mammott/Kayna + Fluoress, 9h; Spytrap/TooToo/Fiddlement = combos
of the 3 Doubles, 16h; Blow't = TooToo + Mammott, 1d 8h — exact match).
Same `islands` fix applied as Batches 5b/5c (Magical Nexus was missing
from all 7 despite being a real residence).

**Rare Blow't is now a 3rd confirmed cross-island match for the Quad
tier** — 1d 18h 30m, identical to Rare Gloptic (Psychic) and Rare Pladdie
(Faerie). At this point the "one Rare time per structural tier, shared
across every Magical Island" pattern from Batches 5b/5c is about as solid
as it gets without checking literally every remaining monster. Filled in
the remaining blanks (Bulbo, Pluckbill, Spytrap, Fiddlement) from that
pattern, each flagged individually in its breeding description.

**Epic TooToo:** combo was already correct (Spytrap + Flowah); filled in
the confirmed time (2d 5h 5m / 1d 15h 48m 45s enhanced).

**Epic Gob/Bulbo/Pluckbill/Spytrap/Fiddlement/Blow't: confirmed NOT to
exist yet**, more clearly than the "mixed signal" calls in Batches 5b/5c.
A fan-continuation wiki page listing a speculative future "Epic Wubbox"
lineup for Light Island includes all 6 of these — which is exactly the
kind of unreleased/fan-predicted content this project treats as
unreliable, not evidence they're real. Left unadded, same as before, but
with more confidence this time that "not yet released" (rather than "data
gap") is the right read.

**Magical Nexus:** Blow't's Transpose figures came back an exact 3rd
match too (8,000,000 Coins/2d 2h Common, 40 Diamonds/2d 12h 30m Rare —
identical to Gloptic and Pladdie). Also got a first confirmed Triple-tier
Common Transpose time via TooToo (4,000,000 Coins/1d 10h) — Rooba,
Periscorp, Tapricorn, Cantorell, Bridg-it, and Clavi-gnat's equivalent
times are still unconfirmed and could likely be backfilled from this now
that it's known, if useful for a later cleanup pass.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Phase 3 — Batch 5c: Faerie Island hybrids (7 monsters) + Psychic retroactive fix

Third sub-batch of Batch 5. Covers Hippityhop, Squot, Wimmzies (Doubles),
Cantorell, Bridg-it, Clavi-gnat (Triples), and Pladdie (Quad).

**Retroactive fix from Batch 5b:** the 7 Psychic Island hybrids got their
Magical Nexus *acquisition text* added last batch, but their `islands`
arrays were never updated to actually list Magical Nexus as a residence —
an inconsistency (the text said they're there, the data said they
weren't). Fixed for all 7. Applied the same fix proactively to this
batch's 7 Faerie monsters so it doesn't recur.

**Common tier was already accurate** (confirmed against the wiki:
Hippityhop/Squot/Wimmzies = Noggin/Mammott/Kayna + Floot Fly, 9h;
Cantorell/Bridg-it/Clavi-gnat = combos of the 3 Doubles, 16h; Pladdie =
Clavi Gnat + Noggin, 1d 8h — exact match).

**Rare timing gap, same shape as Batch 5b, now on firmer footing.**
Directly confirmed Rare Pladdie at 1d 18h 30m — identical to Rare
Gloptic's (Psychic's Quad) confirmed time. Combined with Batch 5b's
finding that Rare Doubles and Rare Triples each share one universal time
regardless of island, this is now a **2-for-2 cross-island confirmation**
(Psychic and Faerie both land on the same Double/Triple/Quad-tier times).
Filled in the remaining blanks (Squot, Cantorell, Clavi-gnat) from that
now well-supported pattern, flagged individually in each one's breeding
description as pattern-matched rather than page-by-page confirmed.

**Epic Cantorell:** combo was already correct (Clavi Gnat + HippityHop);
filled in the confirmed time (2d 12h 32m / 1d 21h 24m enhanced).

**Epic Hippityhop/Squot/Wimmzies/Bridg-it/Clavi-gnat/Pladdie:** same call
as Batch 5b — pages for some of these (e.g. Epic Wimmzies) appear to
exist on secondary sites, but no combo could be confirmed on the primary
wiki this pass. Left unadded rather than guessed.

**Magical Nexus acquisition** added for all 7, same Coin/Diamond pattern
as Batch 5b (Doubles 2,000,000 Coins / 10 Diamonds; Triples 4,000,000 /
20 Diamonds; Quad 8,000,000 / 40 Diamonds). Pladdie's exact Transpose
times were directly confirmed (2d 2h Common, 2d 12h 30m Rare — matching
Gloptic's exactly); the others' costs are confirmed but exact times
weren't found this pass.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Phase 3 — Batch 5b: Psychic Island hybrids (7 monsters)

Second sub-batch of Batch 5. Covers Bonkers, Poppette, Yuggler (Doubles),
Tapricorn, Rooba, Periscorp (Triples), and Gloptic (Quad).

**Good news first:** unlike the Fire class batches, this data was already
mostly correct going in — Common-tier combos and times all checked out
against the wiki (Bonkers/Poppette/Yuggler: Potbelly, Toe Jammer, or Kayna
+ Theremind, 9h; Tapricorn/Rooba/Periscorp: combos of the 3 Doubles, 16h;
Gloptic: Rooba + Toe Jammer, 1d 8h — confirmed exact match).

**What was actually missing — Rare timing and Magical Nexus, across the
board.** Every one of the 7 had `alternativeAcquisition: []` (completely
empty) despite all of them living on Magical Nexus per their `islands`
list — the Transpose path was never recorded for any of them. Added
confirmed costs/times: Nexus Transpose is Coins for Common (2,000,000 for
Doubles, 4,000,000 for Triples, 8,000,000 for the Quad — confirmed
pattern) and Diamonds for Rare (10 for Doubles, 20 for Triples, 40 for
the Quad). Exact Common-tier Transpose *times* were only individually
confirmed for Bonkers/Poppette (1d 3h) and Gloptic (2d 2h) — left
unconfirmed rather than guessed for Yuggler/Tapricorn/Rooba/Periscorp.

Rare breeding times were also blank for 5 of the 7 (only Yuggler and
Rooba had them filled in). Directly confirmed Rare Bonkers and Rare
Poppette at 12h 30m/9h 22m 30s — identical to Rare Yuggler's existing
value, confirming these 3 Doubles share one Rare timing. Rare Gloptic
confirmed at 1d 18h 30m/1d 7h 52m 30s. For Rare Tapricorn and Rare
Periscorp, no individual wiki page confirmation was found — filled in via
the same strong same-tier pattern as Rare Rooba (1d 1h 30m/19h 7m 30s)
and flagged as pattern-matched, not individually confirmed, right in the
breeding description.

**Epic tier — flagging real uncertainty rather than guessing.** Only
Rooba currently has an Epic entry (Periscorp + Flowah, already in the
data, left as-is). For Bonkers, Poppette, Yuggler, Tapricorn, and
Periscorp: the wiki's own "Epic Monsters" category page lists Epic
Poppette, Epic Tapricorn, and Epic Yuggler as existing entries, but
repeated searches couldn't turn up a confirmed breeding combo, time, or
even a solid release-date confirmation for any of the three (one
secondary source's monster-tier navigation didn't show an Epic tier for
Poppette at all, which cuts the other way). Epic Bonkers, Epic Periscorp,
and Epic Gloptic didn't turn up in the category listing at all, which
reads as "not released yet" rather than "data gap." Given the mixed
signal, **no Epic entries were added for these 5** rather than risking a
wrong combo — worth a dedicated follow-up search pass, or picking up
naturally once a proper "Epic X" wiki page exists for one of them and
turns up cleanly in search.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Phase 3 — Batch 5a: Magical Singles (4 monsters)

First sub-batch of Batch 5 (Magical class, 43 monsters — split into 6
sub-batches per the processing plan). Covers the 4 Single-Element Magical
Monsters: Theremind (Psychic), Floot Fly (Faerie), Fluoress (Light),
Clackula (Bone).

**Confirmed structural facts (mysingingmonsters.fandom.com):**
- **Common cannot be bred at all** — this matches what the data already
  had (`breeding: null`), but the acquisition details were vague or
  wrong. Added confirmed Market price + incubation time per monster
  (Theremind 25,000 Coins/3h; Floot Fly 30,000 Coins/4h; Fluoress 30,000
  Coins/2h; Clackula 25,000 Coins/5h), the Magical Sanctum path (teleport
  a Level-15 copy — not sold separately there), and the Magical Nexus
  path (Transpose after feeding to Level 18, or a direct 1,800-Diamond
  purchase — previously missing entirely).
- **Rare** is bred from **any 2 Triple-Element Monsters sharing that
  element** — a real, different combo on the home island vs. on Magical
  Sanctum (Sanctum's Triples are the cross-island 2/3-element Magicals,
  not the home island's own Triples). **Found and fixed a real bug**:
  Rare Clackula's data only listed the Sanctum-side Triples
  (Larvaluss/Mushaboom/G'day) and was completely missing its own Bone
  Island combo (Withur/Uuduk/Banjaw) — the other 3 Singles had both
  listed correctly, only Clackula was missing half. Also fixed Rare
  Clackula's blank breeding times (now 8h/6h, matching the other 3 and
  confirmed directly on its wiki page). Converted all 4 from a flat
  description to the proper multi-island `combos` format, and added the
  Magical Nexus Transpose path (5 Diamonds, 1d 2h) that was missing.
- **Epic is bred, with a real combo — this was the biggest gap.** All 12
  Epic entries (4 monsters × islands) were sitting at `breeding: null`
  with a fabricated-sounding "Obtained via Epic Chest or Epic Item"
  line that no source supports. Replaced with confirmed combos:

  | Monster | Home-island combo | Time | Sanctum combo |
  |---|---|---|---|
  | Epic Theremind (Psychic) | Gloptic + Yuggler | 1d 12m | Enchantling + Déjà-Jin |
  | Epic Floot Fly (Faerie) | Pladdie + Squot | 19h 56m | Enchantling + Knucklehead |
  | Epic Fluoress (Light) | Blow't + Gob | 19h 16m | Enchantling + Cahoot |
  | Epic Clackula (Bone) | Plinkajou + Denchuhs | 20h 6m | Enchantling + Osstax |

  Sanctum combo breeding times weren't found and are left blank/flagged
  rather than guessed. Added the confirmed Magical Nexus Transpose path
  for Epic (10 Diamonds; times 1d 18h 12m / 1d 13h 56m / 1d 13h 16m /
  1d 14h 6m respectively).
- **Removed a fabricated detail.** All 12 tier-entries previously carried
  an identical note claiming Nexus copies "appear at Level 1 size" and
  feed into a "shared Nexus Nucleus structure." No primary or fan wiki
  source supports this — it doesn't match how Magical Nexus actually
  works (Transposing, described above) and looks like a stray
  fabrication from an earlier pass. Removed everywhere it appeared.

**Not independently confirmed, flagged rather than guessed:** Sanctum-side
Epic breeding times (all 4); Common-tier Magical Nexus Transpose time for
Floot Fly and Clackula specifically (Theremind ~21h and Fluoress ~20h are
sourced, but only from a secondary fan wiki, not the primary one).

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Phase 3 — Batch 4: remaining Fire class (13 monsters)

Closes out the Fire class, minus Kayna (already reviewed, no changes
needed) and the batch-3/triple monsters. Covers: PongPing, Krillby,
Tuskski (Faerie Island trio); Edamimi, Bisonorus, Bowhead (Psychic Island
trio); Tiawa, Yelmut, Drummidary (Light Island trio); Flum Ox, Incisaur,
Gnarls (Bone Island trio); and Candelavra (Fire Haven, not a Magical
Island monster at all — see below).

**Major finding, different from every earlier Fire batch:** these 13
belong to a distinct real mechanic called **Fire Expansion** (added in
v4.1.1) — they're not bred like the Doubles/Triples/other hybrids handled
in Batches 3. Per the wiki's own Fire Monsters and Epic Monsters pages:

- **Common and Rare cannot be bred at all.** Common is purchased in the
  Market for Relics (300 for the 8 Quads, 250–500 for the 4 Quints,
  depending on the monster); Rare is purchased from the StarShop instead
  (confirmed 15,000 for the Quints checked). The existing data already had
  this right for Common in most cases — this batch's main job was Epic.
- **Epic is bred, but with a real per-island combo** confirmed against the
  wiki (previous data had all 12 magical-island Epics as `breeding: null`
  with a note saying Crucible-evolution "isn't confirmed yet" — that's now
  resolved):

  | Monster | Epic combo | Time |
  |---|---|---|
  | Epic PongPing (Faerie) | Pladdie + Floot Fly | 1d 23h |
  | Epic Krillby (Faerie) | Pladdie + Kayna | 1d 19h |
  | Epic Tuskski (Faerie) | Pladdie + Wimmzies | 2d 7h |
  | Epic Edamimi (Psychic) | Gloptic + Potbelly | 1d 21h |
  | Epic Bisonorus (Psychic) | Gloptic + Kayna | 2d 3h |
  | Epic Bowhead (Psychic) | Gloptic + Poppette | 2d 3h |
  | Epic Tiawa (Light) | Blow't + Potbelly | 2d 1h |
  | Epic Yelmut (Light) | Blow't + Kayna | 1d 15h |
  | Epic Drummidary (Light) | Blow't + Pluckbill | 2d 1h |
  | Epic Flum Ox (Bone) | Plinkajou + Kayna | 1d 13h |
  | Epic Incisaur (Bone) | Plinkajou + Clackula | 1d 17h |
  | Epic Gnarl (Bone, *singular name*) | Plinkajou + Peckidna | 1d 23h |
  | Epic Candelavra (Fire Haven) | Repatillo + Dandidoo | 2d 5h |

  Each is only breedable during its own limited "Fire with Fire"
  promotional window, and can *also* be reached year-round via enhanced
  Crucible evolution on Amber Island (confirmed same duration as the
  breeding combo, for every one of the 13). `timeEnhanced` is the standard
  25% reduction. Rare's on-island StarShop path was also missing from the
  data entirely (only the Amber evolution path was listed) — added.
- **Candelavra is not one of the 12 Magical-Island Fire Expansion
  monsters** — it's native to **Fire Haven**, not a Magical Island, and
  wasn't part of the 2023 rollout. Its `islands` list was previously just
  `["Amber Island"]`, missing Fire Haven entirely — fixed. It was also
  completely missing Rare and Epic variants (only Common existed) — added
  both, following the same Market → StarShop → Crucible pattern.
- **Gnarls was completely missing its Epic tier** (Common/Rare only) —
  added. Note the real in-game name for this tier is singular, **"Epic
  Gnarl"**, not "Epic Gnarls."
- **Resolved a previously-hedged note**: earlier passes flagged Tuskski's,
  Bowhead's, Gnarls's, and Drummidary's exact 5-element makeup as
  "genuinely unclear from available sources." The wiki's own Quint
  comparison actually states this plainly: Tuskski's elements match Air
  Island's (despite living on Faerie Island), Bowhead's match Cold
  Island's (despite living on Psychic Island), and Gnarls/Drummidary are
  the only two Quints whose elements match their own home island. Updated
  the notes to state this as confirmed rather than hedged.

**Not independently confirmed this batch, flagged rather than guessed:**
Tiawa's and Flum Ox's exact Common Market price/incubation time (assumed
300 Relics / 1d 16h by strong pattern-match with the other 6 confirmed
Quads, but not individually re-verified on their own wiki pages);
Candelavra's Fire Haven Common Market price (no confirmed figure found —
only its Amber Vessel price of 40 Relics was).

**Follow-up (post-Batch 4):** the person submitted outside research
claiming to verify these two flagged items. Checked it directly rather
than taking it at face value — it had real problems (an internal math
error stating "1 day, 16 hours" equals "38 hours" when it's 40; citation
links that were just Google Image-search redirects, not evidence the
page content was actually read; and a "Faerie Island Epics" list that
mixed in Natural-class Noggin/Mammott/Drumpler and already-handled
Fire-class Stogg/Boskus as if they were new Magical-class corrections
for this project's Faerie batch, alongside several combos that just
restated this project's own already-correct data back to it). So: only
independently re-verified the two genuinely checkable claims rather than
importing the document wholesale.
- **Candelavra: confirmed** directly on the primary wiki — 500 Relics,
  matching the submitted claim. Filled in (was previously left blank).
- **Tiawa/Flum Ox:** 300 Relics / 1d 16h corroborated by a second,
  independent source (not the one cited in the submission). Upgraded
  from "pattern-matched" to "confirmed" with reasonable confidence, though
  still not the primary wiki's own page directly.
- **Not acted on:** the claimed release dates for Rare Poppette/Tapricorn/
  Periscorp (Jan 8 2025 / May 2025 / Aug 2025) — suspiciously precise
  given everything else in the document, and not independently checked.
  The underlying conclusion (their Epics are unreleased) already matched
  this project's own Batch 5b finding, so no data changed either way.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

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

## Fire Oasis was missing from all 3 Wubbox tiers

Checking the person's Wublin-Island exception (Epic Wubbox correctly
excludes it, confirmed) surfaced a broader bug: **Fire Oasis was missing
from Common, Rare, and Epic Wubbox's `islands` lists**, even though the
person had directly supplied the Fire Oasis Epic Wubbox artwork. Confirmed
on the primary wiki that Common and Rare both belong on "both Fire
Islands" (Haven and Oasis) same as Epic. Fixed all three `islands` arrays
and added the matching Fire Oasis entry to Common/Rare's `islandDetails`
(Epic's already had it, from the artwork). Cross-checked afterward that
every tier's `islands` list and `islandDetails` list now contain exactly
the same islands, with Wublin Island correctly present only for
Common/Rare and absent for Epic.

## Two more Wubbox corrections: Rare Wublin Island, Epic Gold Island

**Rare Wubbox on Wublin Island reverted to 10 of 19** (not all 19). The
"mirror Common exactly" correction from two turns ago was right for every
other island, but the primary wiki's own "Activating" mechanics page
states this one exception explicitly — confirmed by two independent
sources (the primary wiki and, separately, a link the person sent from
the fan "ideas" wiki, which happened to agree). Only Wublin Island's Rare
entry changed; the rest of Rare's mirrored structure stands.

**Epic Wubbox on Gold Island is structurally different, confirmed via
its own dedicated wiki page** — not just a bigger version of the normal
rule, as the person suspected. It boxes in 5 strict-order phases (Plant →
Cold → Air → Water → Earth), 6 Epic Monsters per phase (1 Single + 1 Quad
+ 2 Doubles + 2 Triples of that element, 30 total), and visually/musically
resembles that element's own island's Epic Wubbox during each phase —
matching the person's own recollection that "it cycles through other
Epic Wubbox designs in itself." Rewrote Gold Island's Epic entry to
describe this instead of the flat "30 instead of 15" rule that's correct
for Common/Rare but wrong for Epic.

**Still open, not resolved this pass:** the wiki describes every other
island's Epic requirement as "all 15 Natural Epics" (or "15 Ethereal
Epics" / "15 Natural and Fire Epics" on the Fire islands) — a definite,
complete set, not "any 15" as currently modeled. The actual named list of
which 15 Epic Monsters this refers to per island hasn't been tracked down
yet.

## Complete Epic Wubbox requirement list found for Gold Island

Chased down the "for accuracy" follow-up. Found the actual complete
named list via a Steam guide's Gold Island checklist — cross-checked
against this project's own 30 non-Mimic Natural species and it's an
exact match, no typos, nothing missing:
- **Plant Phase:** Potbelly, Oaktopus, Furcorn, Reedling, Spunge, Entbrat
- **Cold Phase:** Mammott, Pango, Maw, Thumpies, Clamble, Deedge
- **Air Phase:** Tweedle, Dandidoo, Cybop, PomPom, Scups, Riff
- **Water Phase:** Toe Jammer, Quibble, Fwog, Congle, Bowgart, Shellbeat
- **Earth Phase:** Noggin, Shrubb, Drumpler, Pummel, T-Rox, Quarrister

Replaced Gold Island's generic phase description with this full list.

**Also corrected a framing error while researching this.** The wiki
states individual Natural Islands need "all 15 Natural Epics," and
Fire/Ethereal islands need their own fixed 15 — a definite, complete
set, not "any 15 Epic Monsters" as every non-Gold island was phrased
before. Fifteen is also notably *half* of the 30-monster set Gold Island
needs across all 5 phases, suggesting each individual Natural Island's
own Epic Wubbox needs a specific subset, not a free choice. Updated the
wording on Plant/Cold/Air/Water/Earth/Fire Haven/Fire Oasis/Ethereal to
say "a fixed fifteen-Monster set... not any 15 of the player's choosing,"
**but the exact 15 assigned to each individual island isn't confirmed**
from available sources — flagged rather than guessed, since nothing
found this pass named which half of the 30 applies to, say, Plant
Island's own Epic Wubbox specifically (as opposed to Gold Island's
combined version).

## Batch 8: Legendary class (19 monsters)

Covers the Shugafam (8), bb$quad (4), Werdos (5: Tawkerr, Parlsona,
Maggpi, Stoowarb, Charrkoll), plus Alcordion and T-Pirainha. Legendary
Monsters only have a Common tier — no Rare/Epic exists for this class
(the wiki notes Shugafam specifically won't get one "due to copyright
issues," since these are real-musician collabs).

**Shugafam — filled in real combos + times, confirmed by 5 independent
sources.** Shugabush itself: Bowgart + Clamble on Plant Island, 1d 11h
(was missing entirely). The other 7 are each Shugabush + one specific
Natural Monster, bred **on Shugabush Island itself** (not their own home
island, which the previous vague "bred using Shugabush plus a specific
Natural Monster" phrasing left ambiguous) — Shugarock/Mammott,
Shugabass/Potbelly, Shugajo/Oaktopus, Shugabeats/Furcorn,
Shugabuzz/Quibble, Shugitar/PomPom, Shugavox/Deedge. All 8 share the
exact same time, 1d 11h/26h 15m — confirmed directly, not assumed.

**bb$quad — found a real naming bug, not a fabrication.** The three
newest members were stored as "Bbenior," "Bbinistr," and "Bbkinbash" —
missing the "$" that bbli$zard and the rest of the "bb$quad" family
actually use in their names. Initially suspected these might be
hallucinated from an earlier pass, since bbli$zard Island is brand new
(released September 2, 2026 — this pass is happening barely two weeks
later) and the general wiki page still describes future members as
"unknown." But all three have their own dedicated, dated wiki pages
confirming them as real, released Sept 2, 2026: **bb$enior** (bbli$zard +
Mammott), **bb$inistr** (bbli$zard + Spunge), **bb$kinbash** (bbli$zard +
Fwog), all 1d 11h/26h 15m. Fixed the name field on all three (both the
monster-level and variant-level `name`). bbli$zard itself: Thumpies +
Congle on Cold Island, 1d 11h (was also missing a time) — note it's
explicitly the one bb$quad member that can't result from a breeding
failure on its own island, unlike Shugabush.

**Werdos (Tawkerr, Parlsona, Maggpi, Stoowarb, Charrkoll): confirmed
un-breedable**, Market purchase for 100 Relics, 8h incubation — this
matches what Tawkerr's entry already had; added the same to the other 4,
which were missing acquisition info entirely.

**Alcordion:** combo (Scups + PomPom on Air Island) was already correct;
filled in the blank enhanced time (2d 2h → 1d 13h 30m).

**T-Pirainha:** already accurate (Clubbox Waveform Act reward) — no
changes needed.

**Worth a future look, not chased down this pass:** a YouTube short
mentions a monster called "bbdek$tr" appearing alongside bb$inistr on
bbli$zard Island — may be a newer bb$quad member not yet in this data,
but only a single casual source mentioned it, so it wasn't added without
better confirmation.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Four newly-released monsters added (Sept 16, 2026 / v5.7.0)

The person supplied direct wiki content for a batch of brand-new
releases. Unlike the last couple of submitted documents, this one held
up — real wiki URLs, internally consistent, no arithmetic errors found.
Added:

- **bbdek$tr** — the 5th bb$quad member (Legendary), resolving the
  "worth a future look" item flagged at the end of Batch 8. Bred on
  bbli$zard Island from bbli$zard + Drumpler, 1d 11h/26h 15m — same
  timing as every other bb$quad/Shugafam member.
- **Epic Cataliszt** (Mythical) — new tier on an existing monster.
  Notably unusual: it's the only Epic Monster that breeds using its own
  Common form as a parent (Cataliszt is required in every Mythical
  Island combination to begin with), the only one with more than one
  combination on a single island, and the only one whose combos are
  identical across Common/Rare/Epic. Modeled the two explicitly-called-
  out best combinations (Cataliszt + G'joob, Cataliszt + Cherubble) in
  the description rather than all 7 cascading combos with their
  fallback chances, which would be excessive detail for this schema.
- **Vawk** (Paironormal, new species) — a Ruin/Depths Double bred from
  Arcorina + Shhimmer, 1d 21h, Carnival-exclusive (no home Magical/
  Natural island, matching every other Paironormal Double/Triple already
  in this data). Modeled with the standard `major`/`minor` tiers this
  class uses.
- **Rare Pentumbra** — already had solid data from an earlier pass;
  added the specific element list (Plasma, Shadow, Crystal, Poison) the
  new source confirmed for its Attunement requirement, since the
  existing text only said "all of its Elements."

No Rare/Epic added for bbdek$tr (Legendary never gets them) or for Vawk
(not mentioned as existing yet in the source) — left absent rather than
assumed.

**No art changes — `CACHE_VERSION` not bumped** (no new image assets
were provided for these 3 new monster entries; placeholder image paths
were set following this project's naming convention but the actual PNG
files don't exist yet).

## Images added for the 4 new monsters + Vawk verification + a bonus fix

**Images:** processed all 5 uploaded images (Vawk Major/Minor, Rare
Pentumbra, Epic Cataliszt, bbdek$tr) to match the project's standard —
400px-long-side cap, palette mode with transparency, optimized. Epic
Cataliszt came out larger than most (60KB) due to its detailed
white-fur shading and fine linework; checked it visually for banding —
clean. All 5 copied into `assets/monsters/`, filling the placeholder
paths set when these monsters were first added.

**Vawk verified directly on the wiki** — everything from the submitted
document held up (Arcorina + Shhimmer, 1d 21h, Sept 16 2026/v5.7.0).
Added a few more confirmed details: its mezzo-soprano "oooooooohhh"
vocal contribution, the 15-Diamond first-placement reward, and that it's
the *penultimate* Paironormal Monster overall — only the still-unnamed
Paironormal Quad remains unreleased.

**Bonus find while verifying Vawk:** the wiki mentioned Unklaw releasing
in the same wave ("Anniversary Month"), which was already correctly
dated in this data (Sept 2, 2026) but had a blank breeding time. Filled
it in: 2d 8h/1d 18h, confirmed directly. Not something the person asked
about — just sitting right next to what they did ask about.

**Noted but not chased down:** one source mentioned two more names —
"Waxen La" and "Queen Re" — released alongside Unklaw and the bb$quad
on Sept 2, 2026. Unclear what class these belong to or whether they're
already in this dataset under different names. Flagging for a possible
future check rather than guessing.

## Batch 9a: Seasonal class — the 5 Core Seasonals (of 15 total)

Started Batch 9 (Seasonal class, 15 monsters). This class turned out to
have exactly the structure the pre-Batch-4 Blabbit/Ffidyll fix already
uncovered, now confirmed as the general rule for the whole class:
**5 "Core" Seasonals** (Punkleton, Yool, Schmoochle, Blabbit, Hoola) each
have one unique home-island combo and cannot be freshly bred on Seasonal
Shanty at all; **9 "Aux" Seasonals plus Jam Boree** each have their own
home-island combo *and* a Shanty-specific combo built from two Core
Seasonals. Splitting the batch along this line — Core Seasonals first,
since the Aux group's Shanty combos are built out of them.

**All 5 Core Seasonals are now complete and cross-validated:**
- **Punkleton** (Spooktacle): Bowgart + T-Rox on Plant Island, 18h.
  Islands list was missing Plant Island and Gold Island entirely — fixed.
- **Yool** (Festival of Yay): Thumpies + Congle on Cold Island, 1d 12h.
  Rare confirmed 1d 7h 45m.
- **Schmoochle** (Season of Love): Riff + Tweedle on Air Island,
  1d 7h 6m (exact figure directly confirmed, not a round number).
- **Hoola** (SummerSong): PomPom + Pango, notably on *both* Air and
  Earth Island with the identical combo, 1d 1h. Rare confirmed 1d 7h 45m.
  Epic has 3 real combos (Air: Riff+Fwog, Earth: Quarrister+Dandidoo,
  Shanty: Schmoochle+Yool), all sharing one confirmed time, 21h 20m.
- **Blabbit**: already solid from the pre-Batch-4 fix; just filled in
  the one missing enhanced time (19h → 14h 15m).

**Found and verified the exact rule behind every Epic Core Seasonal's
Shanty combo**, confirmed on the wiki's own Epic Monsters page: it's
always the two Core Seasonals whose real-world seasonal events fall
**farthest apart** on the yearly cycle from the Epic's own event
(Eggs-Travaganza → SummerSong → Spooktacle → Festival of Yay → Season of
Love → back to Eggs-Travaganza). Checked this against all 5 independently
and every single one matched exactly: Epic Punkleton = Blabbit+Schmoochle,
Epic Yool = Blabbit+Hoola, Epic Schmoochle = Punkleton+Hoola, Epic Hoola =
Schmoochle+Yool, Epic Blabbit = Punkleton+Yool (already had this one).

**Not resolved this pass:** Epic Punkleton's and Epic Schmoochle's
home-island timings, and Epic Schmoochle's exact per-island combo — the
wiki confirms these exist and differ by island but didn't surface the
specifics in this pass's searches. Flagged in the data rather than
guessed.

**Next up: the 9 Aux Seasonals + Jam Boree.** Unlike the Core group,
the wiki explicitly states their Shanty combos follow "no discernible
pattern" — each one needs individual research rather than a shared rule.

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Batch 9b: the 9 Aux Seasonals + Jam Boree — closes Batch 9

Completes the Seasonal class (15 monsters total). Despite the wiki's own
warning that these "follow no discernible pattern," a Steam breeding
guide had nearly the complete cross-reference table in one place, cross-
checked against individual wiki pages for times and confirmation.

**All 9 Aux Seasonals + Jam Boree now have real home-island and Shanty
combos:**
- **Gobbleygourd** (Feast-Ember): Kayna + Glowl on Fire Haven *and* Fire
  Oasis (identical combo, 21h); Shanty: Jam Boree + Clavavera.
- **Clavavera** (Beat Hereafter): Withur + Clackula on Bone Island;
  Shanty: Punkleton + Schmoochle. Islands list was missing Bone Island
  entirely — fixed.
- **Viveine** (Echoes of Eco): Shugabush + Oaktopus, 1d 2h 5m 20s; Shanty:
  Punkleton + Blabbit. Added the missing Rare and Epic tiers from
  scratch — Rare notably sells for the same 12 Relics as Common on Amber
  Island (a stated exception to the usual Rare-costs-more pattern), and
  Epic is one of only two Epic Seasonals *not* time-limited on its Amber
  Island form, alongside Epic Monculus on Wublin Island.
- **Carillong** (Crescendo Moon): Roarick + Mushaboom on **Magical
  Sanctum**, 1d 3h 9m 32s — islands list only had Seasonal Shanty before,
  completely missing its actual home island. Shanty: Yool + Schmoochle.
- **Whiz-bang** (SkyPainting): Blow't + Spytrap on Light Island, 1d 4h 6m;
  Shanty: Spurrit + Boo'qwurm.
- **Boo'qwurm** (MindBoggle): fixed the missing apostrophe in its name
  (was "Booqwurm"). Periscorp + Bonkers on Psychic Island, 1d 6m 24s;
  Shanty: Gobbleygourd + Clavavera.
- **Spurrit** (Perplexplore): Wynq + Maw on Fire Oasis, 20h 18m; Shanty:
  Blabbit + Hoola.
- **Jam Boree**: the one exception with no home island at all — bred only
  on Seasonal Shanty, Punkleton + Hoola, 1d 16h 24m. Its Rare tier also
  breaks the class-wide pattern: **2d 2h**, not the uniform 1d 7h 45m
  every other Rare Seasonal shares (confirmed on two independent pages).

**Confirmed a uniform rule for Rare Seasonals**: every Rare Seasonal
except Rare Jam Boree breeds in exactly 1d 7h 45m, regardless of which
monster or island. Applied this across the board — and caught one
oversight from earlier in the pass where Rare Schmoochle's time got left
blank despite the rule already being established; fixed on a follow-up
sweep.

**Monculus enriched with its Wublin Island mechanic**, which had real
gaps: Rare Monculus was missing its Wublin evolution path entirely (12
Keys, capped at 3 at a time — unlike Common's market-purchase and Epic's
already-documented evolution). Epic's Ethereal Island enhanced time was
also filled in.

**Not resolved this pass** (flagged in the data rather than guessed):
Epic combos for Clavavera (both islands) and Carillong (both islands);
Ffidyll's and Monculus's exact Seasonal Shanty breeding *time* specifically
(the combo itself is confirmed for both, just not a distinct timing figure
separate from their home-island combo).

**This closes Batch 9 (Seasonal class, 15 monsters) entirely.**

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Major cross-dataset cleanup pass

A large batch of fixes spanning formatting, a systematic data-integrity
sweep, images, and UI — requested as a full review of everything done so
far before continuing to new batches.

### Breeding-text formatting (dataset-wide)
- **"Best: X. Also: Y, Z" cramped text → structured `also` field.** The
  UI already supported rendering "Best" and "Also" as separate lines; the
  data just wasn't using that field. Converted 38 combos across Natural
  Doubles/Triples/Quads (both Common and their Rare counterparts, which
  in 5 cases just said "see Common's list" — copied that list over
  instead of leaving a cross-reference the UI can't resolve).
- **Redundant "Bred on [Island] from X + Y" stripped** wherever the
  combo's own island label already shows that same island (in the
  `combos` array format, each combo already renders its own island
  heading above the description — restating it in the text was pure
  duplication). Left alone where the phrasing was actually load-bearing
  (a few flat-description entries listing multiple real islands, where
  it disambiguates which one the text refers to).
- **Trailing "(Element+Element)" suffixes removed** from 6 Magical
  Sanctum cross-monster combos (Cahoot, Déjà-Jin, Knucklehead, Roarick,
  Xyster, Osstax) — redundant with the element chips already shown
  elsewhere on the profile.

### The big one: teleport/transpose/vessel/purchase islands wrongly mixed into breeding scope
This was the core, dataset-wide version of the Arackulele/Banjaw bug
pattern flagged directly. The underlying issue: a monster's `islands`
list (a complete, correct residency list) was being reused as the
*breeding combo's* island label too — so "Ethereal Island, The
Colossingum" looked like the same combo works on both, when only one is
real and the other is teleport/transpose/vessel/purchase-only. Verified
Arcorina's specific case directly on the wiki (confirmed: Transposed to
Paironormal Carnival for 100,000 Coins, not bred there) before applying
the same pattern everywhere else.

Systematically found and fixed **139 affected variant entries** across
every non-Wubbox batch done so far:
- **13 Fire hybrids** (Glowl, Flowah, Stogg, Barrb, Floogull, Repatillo,
  Tring, Phangler, Boskus, Whaddle, Woolabee, Wynq, Sneyser) — Amber
  Island removed from breeding scope; its Vessel explanation was also
  sitting in Notes instead of Alternative Acquisition, so moved that too.
- **60 per-island Magical/Fire-Triple hybrids** — Magical Nexus or Amber
  Island removed from breeding scope (Bonkers, Poppette, Yuggler,
  Rootitoot, Tapricorn, Rooba, Periscorp, Gloptic, Hippityhop, Squot,
  Wimmzies, Ziggurab, Cantorell, Bridg-it, Clavi-gnat, Pladdie, Gob,
  Bulbo, Pluckbill, Sooza, Spytrap, TooToo, Fiddlement, Blow't, Peckidna,
  Denchuhs, Hawlo, Thrumble, Withur, Uuduk, Banjaw, Plinkajou, and more).
- **All 30 Natural Doubles/Triples/Quads' Rare tiers**, plus several
  Common tiers — Gold Island, The Colossingum, Shugabush Island, and
  bbli$zard Island removed from breeding scope.
- **5 Ethereal Singles** (Jeeode, Reebro, Ghazt, Humbug, Grumpyre) and
  **10 Ethereal Doubles** — The Colossingum removed.
- **Seasonal class** — Seasonal Shanty removed from the Core Seasonals'
  and several Aux Seasonals' breeding scope (Gobbleygourd, Boo'qwurm,
  Whiz-bang, Clavavera, Spurrit, Punkleton, Yool, Schmoochle, Hoola).
- **3 Paironormal Singles' Major tier** (Owlesque, Arcorina, Shhimmer) —
  Paironormal Carnival removed, confirmed via Arcorina's own wiki page.

Final sweep confirms **zero remaining mixed-island cases** anywhere in
the dataset.

### Bisonorus — stale hedge notes from before it was actually confirmed
Bisonorus still carried two "not independently confirmed, lower
confidence" notes left over from *before* the Fire Expansion batch
actually researched and confirmed it (300 Relics, Gloptic + Kayna — both
directly sourced at the time). These should have been cleaned up then
and weren't. Removed. Checked the rest of the dataset for the same
stale-note pattern — Bisonorus was the only one affected.

### Images: fixed a black-fringing bug affecting 14 files
Discovered that all 5 newly-uploaded monster images (bbdek$tr, Vawk
Major/Minor, Epic Cataliszt, Rare Pentumbra) had a dark/black border
where the color fill should meet transparency. Root cause: the palette-
conversion step composited semi-transparent edge pixels against black by
default before quantizing. **The same bug affected all 9 Epic Wubbox
images from the earlier batch**, which nobody had flagged yet — caught
it proactively while fixing the reported ones. Reprocessed all 14 using
direct RGBA quantization (preserving true alpha instead of flattening to
RGB first), confirmed visually clean on the two most detail-heavy images
(Epic Cataliszt, Ethereal Wubbox), and file sizes landed back in the
project's normal 22–38KB range.

### UI: A–Z jump sidebar no longer hides under the header
It was vertically centered at `50%`, which could place its top edge
(the "A") underneath the sticky header on shorter viewports, since the
full 26-letter list runs tall. Changed to `top: max(150px, 50%)` — a
fixed clearance floor below the header, while still centering normally
on taller screens.

### Dipster Fa's erroneous Celestial Island tier
Fa had a 4th "astral" tier ("Superno-Fa") tagged to Celestial Island —
an island that isn't even built yet (Phase 5, not in `islands.json`).
None of Fa's 6 siblings have an astral tier at all. Removed it rather
than guess at a replacement island, since the ambiguity was real: unclear
whether this was misplaced content that belongs elsewhere, or content
that shouldn't exist yet at all.

### Clarified, not changed: "How to Obtain" vs "Alternative Acquisition"
These are the same section with a dynamic label, by design — the code
already shows "Alternative Acquisition" when a monster is bred (since
that path is the primary one and this section covers *other* ways to
get it) and "How To Obtain" when it can't be bred at all (since this
section is then the *only* way). No bug here.

### Checked, not fixed: Rare Clavavera's "tiny image" report
All three Clavavera images (Common, Rare, and Epic) turned out to be
completely missing from the asset folder — not a sizing mismatch between
them, since there's nothing there to compare. Flagging in case the art
exists and just needs uploading.

### Not attempted this pass: the missing Interesting Fact / Notes audit
Quantified rather than guessed at: **294 of 591 variant entries are
missing both fields entirely**, plus 133 missing just Interesting Fact
and 99 missing just Notes. Filling these properly means real per-monster
research, not filler text — at this scale, that's a bigger undertaking
than any single batch completed so far in this project. Flagging for a
deliberate decision on how to approach it (e.g., its own dedicated
batch(es)) rather than rushing shallow content into it now.

**No `CACHE_VERSION` bump beyond what the 14 reprocessed images require**
— since actual pixel content changed for those 14 files, a cache-version
bump IS warranted for this pass, unlike the pure-data batches before it.

## Clavavera images, remaining Best/Also cleanup, and label consistency

**Clavavera's 3 images added** (Common, Rare, Epic) — the images were
never actually missing due to a sizing bug as first suspected; they were
just entirely absent. Processed with the corrected (non-fringing) method
from the start.

**4 more Best/Also inconsistencies found and fixed**, beyond the 38
already converted: Cantorell, Spytrap, and Fiddlement's Rare combos had
an inline "(also: X, Y)" parenthetical instead of the structured field,
and Enchantling's Common combo used "Other working combinations:" prose
instead. All four now use the same `also` array the UI already renders
consistently. Left Epic Cataliszt's combo as prose rather than forcing
it into Best/Also — it genuinely isn't a "best vs. also-works" situation
(each of its 7 pairings has its own distinct fallback mechanic), so
restructuring it would lose real information rather than just reformat it.

**"Alternative Acquisition" is now the permanent section title** on
every profile, replacing the old conditional "How To Obtain" label for
un-bred monsters. This was intentional behavior, not a bug, but
consistency across every profile was specifically requested over the
dynamic labeling — done.

**Parked for later** (added to the running flagged-items list): the
Interesting Fact / Notes audit (294 of 591 variant entries missing both
fields — see the cleanup-pass entry above for the full breakdown).

## Batch 10 (in progress): Mythical class — formatting sweep surfaces more bugs

Started Batch 10 (Mythical class, 15 monsters: 7 Core Mythicals, Cataliszt,
7 Dreamythicals). This class was already well-researched, but applying
the same island-scoping and Best/Also normalization surfaced real bugs.

**5 Core Mythicals converted to properly-scoped combos** (Cherubble,
Hyehehe, G'joob, Strombonin, Yawstrich): Common/Rare had "Bred on X
Island" / "(same as Common...)" text redundant with their combo's own
label; Epic had the same "Best (X): A+B. Alternative (Mythical Island):
C+D" cramming already fixed for Buzzinga/Anglow in Batch 4. **Caught and
fixed my own regex bug mid-fix**: a non-greedy match collapsed 5 of the
new Mythical Island combo descriptions down to a single stray letter
("C") with the rest of the real text dumped into the note field. Caught
on verification before shipping, not after.

**Normalized Best/Also formatting further, dataset-wide**, following up
on the cleanup pass from before this batch:
- **12 instances** of inline "(use at least one Rare parent)" moved to
  the `note` field (Buzzinga, Ffidyll ×2, Anglow, Cataliszt, and all 7
  Dreamythicals' Rare tiers). **Caught a real data-loss bug of my own**:
  the first pass overwrote Ffidyll's existing notes ("Cloverspell
  seasonal event only", etc.) instead of merging with them — restored
  before moving on.
- **35 instances** of "Same as Common, use at least one Rare parent" (no
  combo restated) normalized by looking up the actual Common combo and
  copying it in, rather than leaving a cross-reference the UI can't
  resolve — covers most of the Natural Doubles' Rare tier and most of
  the per-island Magical/Seasonal Rare tiers.
- **10 instances** of inline "(also: X, Y)" converted to the structured
  `also` field (Cantorell, Sooza, Spytrap, TooToo ×2, Fiddlement, Blow't
  ×2, Withur ×2).

**Found a real, older timing bug in the process**: Punkleton's Rare
breeding time was set to 18h — identical to its Common time — instead of
the confirmed uniform 1d 7h 45m every other Rare Seasonal uses (including
its own siblings Yool, Schmoochle, and Hoola, which were already
correct). Traces back to a copy-paste slip in the original Batch 9a work.
Fixed.

**Batch 10 not yet complete** — the 7 Dreamythicals and Cataliszt itself
still need a proper accuracy review; this pass only touched their
formatting, not whether the underlying combos/times are correct.

## Batch 10 complete: Cataliszt and the 7 Dreamythicals verified

Finished Batch 10 (Mythical class, 15 monsters). Unlike most classes so
far, this one turned into pure verification rather than data repair —
everything checked out.

**All 7 Epic Dreamythical combos cross-validated** against the detailed
Epic Cataliszt cascade info received earlier in this conversation (each
of Cataliszt's 7 possible pairings has a primary result plus fallback
results including specific Epic Dreamythicals) — every single one of the
7 Epic combos already in the data matched exactly as a confirmed fallback
result of its stated pairing.

**Found and independently verified a genuine "pyramid" pattern** on the
primary wiki: the 7 Core Mythicals' own breeding times rise 5h per
island from Plant Island (18h) up to a peak at Water Island's Anglow
(1d 9h), then fall by 5h again through Earth Island and both Fire Islands
back down to 18h at Cherubble. Checked this programmatically against
every value already in the data — holds exactly, no exceptions, for both
Common (5h steps) and Rare (6.25h steps) tiers. Added as a note on
Cataliszt, since it's the throughline connecting all 7.

**Programmatically confirmed the +9h Common / +11.25h Rare offset rule**
(each Dreamythical's breeding time is its Core Mythical's time plus a
fixed offset, because Cataliszt's own incubation is 9h Common / 11.25h
Rare) across all 7 Dreamythicals with zero exceptions.

**One real fix**: Cataliszt's own purchase price was missing — confirmed
directly on the primary wiki (100,000 Coins) and added.

**This closes Batch 10 (Mythical class, 15 monsters) entirely.**

**No art changes in this batch — `CACHE_VERSION` not bumped.**

## Batch 11 complete: Paironormal class (14 monsters)

This class was already in excellent shape — only one real gap and a
handful of formatting inconsistencies matching the same pattern fixed
across the rest of the dataset.

**Scallyrags' breeding time was the one real gap** (both Major and
Minor) — confirmed directly on the primary wiki: Hairionette + Owlesque,
1d 21h/1d 9h 45m.

**Formatting normalized to match the rest of the dataset**: the Minor
tiers of the 3 Paironormal Singles (Owlesque, Arcorina, Shhimmer) had
"Bred on Mirror [Island] the same way as the Major form, but at night..."
— redundant with the single-island scope already shown. Stripped it,
then caught and fixed an awkward "But at night..." sentence fragment
left over from the first pass before finalizing.

Confirmed no island-mixing issues in this class: the Carnival-exclusive
Doubles/Triples (Scallyrags, Dakktyl, Jerm, Erma-Gurdy, Illoost, Galymph,
Raqsoun, The Inflatterer, Unklaw, Vawk) are genuinely single-island —
unlike the 4 Singles, they have no separate home Natural/Fire island to
conflict with.

**This closes Batch 11 (Paironormal class, 14 monsters) entirely** —
only the still-unreleased Paironormal Quad remains outside this dataset,
consistent with what the wiki itself confirms.

**No art changes in this batch — `CACHE_VERSION` not bumped.**
