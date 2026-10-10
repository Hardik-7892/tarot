# TAROT MILESTONES (TEMPORARY)
> Rule: complete MAX 1 milestone per session, then report and STOP. Update status below each time.
> Purpose: keep context small across sessions. Read only the milestone you are working on.

## How to use
- Status values: `pending | in_progress | done`
- Work milestones in order (M8a-c can run after M1 since they are content-only, but still one at a time).
- Verify each milestone with `npm run lint` + `npm run build` (static export must pass).
- Do NOT start the next milestone in the same session.

## M1 - Intent-first ritual + generic DeckFan labels [done]
Scope:
- New `components/IntentStep.jsx`: pause copy ("Pause. Hold one question lightly…"), optional `name` + `question` inputs, Continue/Shuffle CTA. Empty allowed.
- Refactor `components/DeckFan.jsx` props: `{ pickCount, labels[], spreadId, verdict, initialCards? }`. Remove hardcoded Past/Present/Future `pickLabel()`.
- Wire through `/daily`, `/spread`, `/yes-no`. Fan hidden until intent confirmed.
- Pass `name/question/spreadId` down for journal + share reuse.
Accept: fan gated, empty inputs work, reduced-motion safe, lint+build pass.
Files: components/IntentStep.jsx, components/DeckFan.jsx, app/daily/page.js, app/spread/page.js, app/yes-no/page.js

## M2 - Reading Journal + settings (cap, autosave, privacy) [done]
Scope:
- `lib/journal.js`: CRUD on `tarot.journal.v1`. Entry `{id, at, spreadId, name?, question?, note?, picks:[{cardId, orientation}]}`.
- `lib/settings.js` (or fold into journal): `tarot.settings.v1 { autosave: true, cap: 200 }`.
- `components/JournalPanel.jsx`: post-reveal save UI. Autosave ON -> auto-save once, show "Saved - in this browser only" + link. OFF -> "Save reading" button, idempotent (disable after save, toast "Already saved" on repeat).
- `app/journal/page.js`: list newest-first, filter by name/spread, per-entry delete, Clear history (2-step confirm, wipes journal key only), Export JSON + TXT + Copy, cap editor (min 200, warn >1000).
- Cap-lowering guard: if `newCap < currentCount`, modal "You have N readings. Lowering to M deletes K oldest. [Keep / Delete oldest & continue / Cancel]". Raising never deletes. At-cap save drops oldest + toast.
- Privacy copy: JournalPanel + /journal top + footer: "Saved only in this browser - nothing leaves your device."
- Navbar: add Journal link.
Accept: reload persists, shared-device works via name filter, export downloads, clear wipes only journal, save-once guard works, lint+build pass.
Files: lib/journal.js, lib/settings.js, components/JournalPanel.jsx, app/journal/page.js, components/Navbar.jsx, app/layout.js (footer line)

## M3 - Share a reading [done]
Depends: M1 (needs labels/picks passthrough).
Scope:
- `lib/share.js`: `encodeReading(picks) -> base64url`, `decodeReading()`, `formatReadingText({name, question, spread, picks})`.
- `components/ShareButtons.jsx`: Copy link (`?r=`), Copy text, `navigator.share` fallback.
- `DeckFan.jsx`: if `?r=` present, reconstruct reveal mode (no shuffle), CTA "This is a shared reading -> Draw your own". Invalid `?r=` -> friendly error.
Accept: link reproduces exact cards/orientations + question, invalid code handled, lint+build pass.
Files: lib/share.js, components/ShareButtons.jsx, components/DeckFan.jsx

## M4 - New spreads + spread index [done]
Depends: M1.
Scope:
- `lib/spreads.js`: `{id, title, description, labels[], verdict?}` for daily(1), past-present-future(3), love You/Them/Us(3), career Strength/Challenge/Advice(3), decision Option A/Option B/Counsel(3), celtic-cross(10 classic positions).
- `app/spread/page.js` -> index; `app/spread/[id]/page.js` + `generateStaticParams`. Keep `/daily`, `/yes-no` as thin wrappers for SEO.
- Celtic Cross mobile-readable layout; 10-pick needs draw-without-replacement from full 78 (fan paginates or re-deals mid-pick).
Accept: correct labels per spread, mobile OK, lint+build pass (check `out/spread/*`).
Files: lib/spreads.js, app/spread/page.js, app/spread/[id]/page.js, components/DeckFan.jsx

## M5 - Birth / Soul card calculator [done]
Scope: `app/learn/birth-card/page.js` — date input -> digit-sum reduce to 1-22 -> map to Major, result card + share link. Client-only.
Accept: correct reduction, links to card page, lint+build pass.
Files: app/learn/birth-card/page.js, app/learn/page.js (link), app/page.js (optional link)

## M6 - Quiz / flashcards [done]
Scope: `app/learn/quiz/page.js` — show back, 4-option guess or type, flip via TarotCard, in-session score only.
Accept: no persistence needed, keyboard accessible, lint+build pass.
Files: app/learn/quiz/page.js, app/learn/page.js (link)

## M7 - Cheat-sheet [done]
Scope: `app/learn/cheatsheet/page.js` — compact table all 78 (upright 1-line, rev, yes/no), print CSS.
Accept: prints cleanly, lint+build pass.
Files: app/learn/cheatsheet/page.js, app/learn/page.js (link)

## M8a - Hand-written Love/Career: MAJORS (quality batch 1) [done]
Scope: `lib/domains-handwritten.js` keyed by id: `loveUpright, loveReversed, careerUpright, careerReversed` (1-2 sentences, ~140 chars each) for 22 majors = 88 snippets.
Style: match essence/upright voice, second-person actionable; reversed = blocked/delayed/shadowed; no health/legal guarantees, no certainties.
UI: `app/cards/[id]/page.js` Love + Career sections (hide section if entry missing — no filler).
Accept: 88/88 present, no TODOs, spot-check 10 cards, lint+build pass.
Files: lib/domains-handwritten.js, app/cards/[id]/page.js

## M8b - Hand-written Love/Career: CUPS + PENTACLES [done]
Scope: same schema for 28 cards = 112 snippets. Depends: M8a pattern approved.
Accept: same as M8a.
Files: lib/domains-handwritten.js

## M8c - Hand-written Love/Career: WANDS + SWORDS [done]
Scope: same schema for 28 cards = 112 snippets.
Accept: full 312/312 complete, lint+build pass.
Files: lib/domains-handwritten.js

## M9 - Explorer polish [done]
Scope: `app/cards/explorer.jsx` — add element filter (Fire/Water/Air/Earth), Yes/No/Unclear filter, Court/Pip filter, Random card button.
Accept: filters compose with search, random navigates, lint+build pass.
Files: app/cards/explorer.jsx

## M10 - PWA + sound + SEO polish [pending]
Scope:
- `public/manifest.webmanifest` + ☾ SVG icons, theme-color, offline note. No heavy SW lib (keep export simple).
- `lib/sound.js`: WebAudio tick on shuffle/flip + mute toggle, off under reduced-motion.
- Per-spread metadata/OpenGraph titles.
Accept: manifest valid, sound toggle persists, lint+build pass.
Files: public/manifest.webmanifest, public/icons/*, lib/sound.js, components/DeckFan.jsx, app/*/page.js (metadata)

## Log
- 2026-10-10: tracker created. Nothing started.
- 2026-10-10: M1 done. IntentStep.jsx added; DeckFan gated + labels/spreadId/onComplete context; daily/spread/yes-no wired. lint + build pass (87 pages).
- 2026-10-10: M2 done. lib/journal.js + lib/settings.js (localStorage, cap floor 200); JournalPanel (autosave toggle, save-once, note) in DeckFan reveal; /journal page (search, spread filter, export JSON/TXT/Copy, cap guard modal, 2-step clear); navbar + footer privacy. lint + build pass (88 pages).
- 2026-10-10: M3 done. lib/share.js (base64url ?r= codec + text formatter); ShareButtons (Copy link/text, native share); DeckFan shared mode (reveal without shuffle, broken-link error, Draw your own, save shared to journal). lint + build pass (88 pages).
- 2026-10-10: M4 done. lib/spreads.js (7 defs); /spread now index; /spread/[id] pages (ppf, love, career, decision, celtic-cross); /daily + /yes-no read from defs; navbar Spreads. Celtic Cross fits existing 12-back fan (10 picks, no re-deal needed). lint + build pass (93 pages).
- 2026-10-10: M5 done. /learn/birth-card (digit-sum reduce to 1-22, 22=Fool, math shown, card link, shareable ?d= link, nothing stored); Tools section on /learn. lint + build pass (94 pages).
- 2026-10-10: M6 done. /learn/quiz (choice + type modes, same-arcana/suit distractors, crypto-random, streak scoring in-session only, essence reveal, keyboard-native buttons); Tools grid link. lint + build pass (95 pages).
- 2026-10-10: M7 done. /learn/cheatsheet (5 grouped tables, 78 rows verified in HTML, card links, Y/N coding, print CSS black-on-white + Print button); Tools grid link. lint + build pass (96 pages).
- 2026-10-10: M8a done, revised for decorum. lib/domains-handwritten.js (22 majors x 4 = 88 snippets, 63-107 chars, zero hyphens or dashes in values per script check); In Love / In Career sections on card pages, hidden when entry missing. lint + build pass (96 pages).
- 2026-10-10: M8b done. Cups + Pentacles added (28 x 4 = 112 snippets, same register, zero hyphens per script check; 50 entries / 200 snippets total). Verified in built HTML: two of cups and king of pentacles show sections, queen of swords still hides. lint + build pass (96 pages).
- 2026-10-10: M8c done. Wands + Swords added (28 x 4 = 112 snippets, same register, zero hyphens per script check; 78 entries / 312 snippets total, 57-107 chars). Verified: three of swords and ten of wands show sections. lint + build pass (96 pages). All card pages now carry In Love / In Career.
- 2026-10-10: M9 done. Explorer gains element (Fire/Water/Air/Earth), omen (Yes/No/Unclear), and kind (Court/Pip) filter groups composing with search + suit filter, a reset control, and a crypto random card jump. lint + build pass (96 pages).
