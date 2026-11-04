---
target: AI-first design (Figma)
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "url:https://www.figma.com/design/2NXIyQA6Cl9FeZXKDOeJse/Zenyra"
timestamp: 2026-11-03T16-30-31Z
slug: www-figma-com-design-2nxiyqa6cl9fezxkdoejse-zenyra
closed: true
---
Method: design review only (detector not applicable — Figma design, no web markup to scan)

Target: Figma "AI-first concept" page — Desktop/Mobile 01 Welcome, 02 Conversation, 03 Recommended plan.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 2 | Progress bar and "What we've heard" are good; no typing, loading, or advisor-offline state |
| 2 | Match system / real world | 3 | Warm plain language, real tier names and prices |
| 3 | User control and freedom | 2 | Only "Start over"; answers can't be edited; multi-select chips have no Continue |
| 4 | Consistency and standards | 3 | Tokens and components consistent; call card repeated on the plan screen |
| 5 | Error prevention | 2 | Multi-select has no explicit submit; free text has no guidance |
| 6 | Recognition rather than recall | 3 | Plan restates answers; summary panel on desktop (missing on mobile) |
| 7 | Flexibility and efficiency | 2 | Decided or returning visitors have no direct Book path in the hero |
| 8 | Aesthetic and minimalist | 3 | Calm, but the plan screen has 8+ actions competing |
| 9 | Error recovery | 1 | No error, offline, or "I didn't understand" states designed |
| 10 | Help and documentation | 3 | Call option is always present; disclaimer is clear |
| Total | | 24/40 | Solid foundation, unfinished states |

Design specificity: the hero is the generic "AI tool" archetype (centred headline, big input, chips). Only the logo and copy say "head spa in the Sunset". The studio's photos, its strongest asset, appear only below the fold. The advisor also has no presence: it's an input box, not a host.

Priority issues
- [P1] Hero reads as an AI product, not a spa. No place, no host, no warmth in the first viewport. Fix: show the advisor's greeting as a first message (avatar + "Hi, I'm Zenyra's advisor…") sitting on the composer, and bring a studio photo or the founder into the fold (e.g. a photo band straddling the hero into the cream band, as on the current site).
- [P1] No designed states for the AI itself: typing, slow, error, offline/"coming soon" (the hook currently returns "coming soon, please call"). Fix: add a state strip (typing, retry error, offline → call/book card) to 02.
- [P1] The primary CTA is missing from the hero. "Book your first visit" is the site-wide primary, but the hero only offers chat or call. Fix: make the alternate row "Call to book · or book directly", with a text link to booking.
- [P2] Plan screen overload: Book, Call ×2, Send link, Compare link, save form (3 channels + input + button), tier link, and the follow-up composer. Fix: drop the duplicate call card on desktop, drop the "Send me this plan" link on desktop (the panel is beside it), and give mobile a sticky Book/Call bar.
- [P2] Conversation control: multi-select chips need a "Continue" action, and past answers need an "Edit" affordance. Mobile chips are 36px tall, below a 44px touch target.

Minor: the teal wash is hard-clipped at the hero's top edge under the header; the "$29" figure appears twice in the quote (row + total); Step 1 box nests a third container level; the header nav still lists "First visit", which the advisor now owns; the mobile plan is about 2000px with no persistent CTA; the mobile conversation has no "what we've heard" recap.
