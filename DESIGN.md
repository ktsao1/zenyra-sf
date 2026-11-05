# Zenyra — Design system

A quiet, near-achromatic page — white canvas, warm cream bands, ink type — where **teal is the only colour**. Adapted from the "Alden" editorial-healthcare style reference (serene clinic on warm parchment), with Zenyra's two fixed brand elements swapped in: the leaf-monogram logo and teal `#019494`. Tokens live at the top of `styles.css`; this file explains the rules behind them.

## What's fixed vs. chosen

- **Fixed (brand):** the logo `assets/images/zenyra-icon.png` (never redrawn or recoloured) and teal `#019494`.
- **Chosen (from the Alden reference):** everything else below.

## Colour

| Token | Value | Use |
|---|---|---|
| `--teal` | `#019494` | Brand teal. Highlighted heading phrases, large price numerals, thin rules, the start-tier outline. **Large text only** (3.7:1 on white, 3.3:1 on cream). |
| `--teal-deep` | `#00706f` | The one filled colour: primary buttons (white text, 5.9:1), text links, small teal text. |
| `--teal-night` | `#0b4241` | Button hover only. |
| `--teal-wash` | teal at 16% | Soft radial wash in a section corner (advisor, gallery CTA). Atmosphere, never a fill. |
| `--ink` | `#28262a` | Headings and body. |
| `--ink-soft` | `#4a4a4c` | Secondary text, captions. |
| `--paper` / `--surface` | `#ffffff` | Page canvas and cards. |
| `--cream` | `#f3f1eb` | The second surface: full-width bands and whole containers, never partial tints. |
| `--fog` / `--line` | `#dddcdd` | Hairlines, badge fill. |
| `--line-strong` | `#cbcbcb` | Hairlines on cream, ghost-button border. |
| `--placeholder` | `#8a5700` | Amber "◌ TBD" markers — functional, not brand. |

Teal is punctuation: at most one highlighted phrase per heading, one filled button style. Don't add a second accent colour.

## Type

- **Inter** (400/500/600) — UI, body, buttons, badges, card headings, prices, and the `h1` hero statement. Negative tracking is the signature: −0.015em body, −0.02em to −0.03em for small headings, −0.045em to −0.05em for display and price numerals.
- **Source Serif 4** (400) — editorial `h2` section openers, the founder quote, the footer line, tier-group labels. Never in nav, buttons, badges, or form fields.
- **Chinese:** PingFang SC / Noto Sans SC for sans, Noto Serif SC for serif, zero letter-spacing, heavier weights (h1 600, h2/h3 500).
- **Highlighted phrase:** wrap it in `<span class="hl">` and add `data-i18n-rich` to the heading; in the `zh` dictionary mark the matching phrase with `*…*`.

## Shape & elevation

- Buttons, badges, kickers, filters, chips, inputs: fully pill (`--radius-pill`).
- Cards 16px (`--radius`), images/video/map 24px (`--radius-image`), small UI 4px.
- **Cards are white on cream, with no outline.** Surface contrast separates a card from its band, so a card never needs a border. The one outlined card is the $29 Rhythm Explorer (1px teal): "start here".

## Elevation

Shadows carry hierarchy: **the higher a surface sits, the more it matters right now.** Three tokens at the top of `styles.css`, warm (tinted from `--ink`, never black), always offset down with a soft blur. Never on buttons, badges, chips, or photographs in the page flow.

| Level | Token | Meaning | Used on |
|---|---|---|---|
| 0 | — | Content | Bands, text, lists (Services, recognitions), photos, the advisor conversation and its side panel (kept flat so the chat stays quiet: advisor messages are plain text beside the leaf, the side panel is facts on hairlines) |
| 1 | `--shadow-1` | A card you can act on | Book online / Call cards, plan cards, the higher-tiers disclosure, the composer field (including the advisor module's composer, docked across the full width of its bottom edge), the scrolled header |
| 2 | `--shadow-2` | What we want you to pick | The advisor card; any tilt card while the pointer holds it |
| 3 | `--shadow-3` | Floats above the page | Lightbox, certificate preview, mobile menu |

The hero window casts a shadow while it peeks in tipped back, fading to none as it opens flat (`--p`). The header floats at level 1, not 3, so a full-width bar doesn't darken the page.

## Components

- **Kicker** → retired everywhere (home 2026-11-04, gallery the same day): the headings name their sections. The `.kicker` style remains only for `index-old.html`; don't add new ones.
- **Primary button** → teal-deep pill. **Ghost button** → transparent pill, silver border, ink text; on hover it fills with the *other* surface (`--ghost-hover`): white on cream bands, cream on white cards.
- **Card** → white, 16px radius, `--card-pad` padding, level-1 shadow, no border; headings Inter 500 at `clamp(1.3rem, 1.8vw, 1.5rem)` (the advisor card's is the one larger exception).
- **Header** → white and flat at the top; once the page scrolls it floats on `--shadow-1` (`.is-scrolled`, set in `main.js`). Wordmark in Inter 500, ink, wide tracking. Sticky is kept (deviation from Alden) so "Book" is always reachable, phones included: under 36rem the button shortens to "Book"/"预约", Menu becomes a two-line icon that crosses into a close mark (its label stays for screen readers), and under 24rem the wordmark drops beside the logo. Touch targets in the header are 44px.
- **Section heads** → serif headline, short lede (centred or left with the column); no kicker on the new home.
- **No featured tier** (the "Most popular" flag was removed 2026-11-04; no plan is singled out). **Start tier** → 1px teal outline.

## Layout rhythm

Max width 75rem. Sections strictly alternate white canvas and cream bands, so the colour change marks each section and there are no section hairlines; no dark bands. Home (`index.html`, 2026-11-04): welcome hero (white, centred text and two CTAs over a slow idle drift of soft teal and sand blotches, `.hero-drift`, still with reduced motion; a wide room photo peeks in at the foot of the first screen and straddles the cream band below) → Three ways to begin (cream: the advisor's instant plan and quote as the large white card, Book online and Call beside it) → Services (white: rows show only their names; the open row (chosen, or pointed at / focused) unfolds its description and price, the text wiping in left to right and the price following behind a drawn teal rule; choosing a row shows that service's room or machine with a caption; services without a photo show a "Photo TBD" placeholder) → Membership (cream, framed as "after your first visit": four plans as `.tier` cards, four across, information only (no buttons: joining is by phone or in person), no plan singled out; the $3,980 and $9,800 consultation tiers folded into one `<details>` card below; then the call-or-visit line) → Founder + recognitions (white) → Visit (cream) → footer (white). The advisor is one way in, not the front door; everything after the ways to begin is secondary.

## Motion (home)

One authored moment: **the window into the studio.** The hero's room photo peeks in at the foot of the first screen as a small pane tipped back in perspective; scrolling straightens it and widens it to the full width while the photo inside settles from a slow zoom and the welcome text steps back (`--p` on `.host-hero`, written by `home-host.js`). Supporting motion stays small: the welcome comes into focus from a blur on arrival, the colour drift and the two hero buttons lean toward the pointer, the ways-to-begin and membership cards turn a few degrees toward the pointer with a soft teal light under it (the advisor card takes only the light), and the membership tiers are dealt up into place once. Easing is `--ease-out` (`cubic-bezier(.16, 1, .3, 1)`). Pointer effects run on fine pointers only; with reduced motion none of it runs and the page is flat and still.

**Advisor module (home):** opens on the hero's light, not a cream band: white with the same teal and sand drift held fixed behind the conversation (`.am-drift`). The "Powered by wellness AI" label sits with the disclaimer under the composer.

**Steeping (home):** each heading's teal phrase arrives in ink and steeps into teal over ~2s the first time it comes into view (the hero's after the welcome focuses in); the founder's quote draws its teal rule down the same way. The composer's send button rests a shade lighter while the field is empty.

## Motion (every page): state changes never snap

- **Language switch:** an ink pill slides to the chosen language, and the page re-reads itself as one View Transition (old words fade, new ones come into focus from a 3px blur).
- **Lightbox:** set down from 94% scale while the page dims and softens behind it (4px backdrop blur); closes faster than it opens.
- **Mobile menu:** unrolls from under the header (clip-path), links settling in a beat apart.
- **Gallery filters:** a View Transition; photos that stay glide to their new places, the rest step back and fade.

Rules carried through all of it: exits faster than entrances; nothing loops except the hero drift; script-only effects start from the finished state, so a failed script shows the page as designed; reduced motion turns movement off and keeps colour and state changes.

