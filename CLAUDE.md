# Zenyra — website redesign

Redesign of the website for **Zenyra (悠然美)**, a head spa and wellness studio at 2560 Noriega St in San Francisco's Sunset District, founded by Ellaine Luo. Live WIP site being replaced: https://zenyra-sf.com (we have no source or hosting access — the redesign is built locally from scratch; photos and videos in `assets/` were downloaded from the live site).

## Goal

Every page pushes one path: **book a first visit ($29 Rhythm Explorer) → return → membership** (Rhythm Growth Path, six tiers). "Book your first visit" is the primary CTA everywhere.

## Audience

Most current customers are Chinese speakers; the studio wants to grow an English-speaking audience. Both languages are first-class — never ship a string in one language only.

## Stack

Plain static HTML/CSS/JS, no build step. Git repo: `ktsao1/zenyra-sf` on GitHub (branch `main`). Preview from this folder with caching off, so a refresh always shows the current pages (plain `python3 -m http.server` lets Chrome reuse stale copies, which once made the nav look broken):

```bash
python3 -c 'import http.server as h
class H(h.SimpleHTTPRequestHandler):
    def end_headers(self): self.send_header("Cache-Control", "no-store"); super().end_headers()
h.ThreadingHTTPServer(("", 4173), H).serve_forever()'
```

- `index.html`, `gallery.html` — pages. Header/footer markup is duplicated across both; change them together. There is no membership page (removed 2026-11-04): every plan is a card in the home's `#membership` section, and nav links point there. `index.html` is the home (styles in `home-host.css`, behaviour in `home-host.js`): a welcome hero, then "Three ways to begin" (the AI advisor's instant plan and quote, book online, call), then Services, Membership (all six plans as cards), About, Visit. It opened on the advisor until Kevin reordered it on 2026-11-04. `index-old.html` is the previous home, kept as a backup: not linked, `noindex`.
- Preview with no-cache headers so the browser never shows a stale page (see Stack).
- `styles.css` — all styles; tokens at the top. Design rules: `DESIGN.md`.
- `i18n.js` — EN/中文. English text lives in the HTML; Chinese lives in the `zh` dictionary keyed by `data-i18n` (text) and `data-i18n-aria|alt|placeholder|title|content` (attributes). Every key used in HTML must exist in `zh`. Language order: `?lang=` → saved choice (localStorage) → browser language → English.
- `main.js` — mobile menu, lightbox, gallery filters, wellness-advisor chat.

## Brand rules (hard)

- **Logo**: `assets/images/zenyra-icon.png` (leaf monogram). Don't redraw or recolor it.
- **Primary teal `#019494`** (sampled from the logo). It fails contrast for small text, so text and buttons use `--teal-deep` (#00706f); `#019494` carries the logo, large price numerals, rules, and accents.
- Everything else is our choice and can change. The current system (white + cream surfaces, ink type, Inter / Source Serif 4, pill buttons, no shadows, teal as the only colour) is documented in `DESIGN.md` — follow it for new UI.

## Placeholders

Unconfirmed content is marked visibly so it can't ship unnoticed: `.placeholder-inline` (amber "◌ TBD") and `.placeholder-block` (dashed amber box). Currently placeholder: service prices/durations, Google reviews, WeChat ID, Ambassador/Leader tier benefits, team profiles (not yet on the page). Never invent reviews, prices, or credentials to fill them.

## Integrations pending

- **AI wellness advisor**: UI is built; a backend engineer will connect it. The only hook is `window.ZenyraAdvisor.ask(question, lang)` in `main.js` → must resolve to reply text. Until then it returns a "coming soon, please call" message.
- **Memberships are set up by phone or in person, never online** (client's request, 2026-11-04). The home's membership section shows the plans and offers Call / Visit; don't add a sign-up or booking link to a plan. The $29 Rhythm Explorer first visit is still booked online.
- **Booking**: only three links go to the online booking site `https://zenyra-book.mase.cloud/`: the header's top-right "Book Now"/"Book" button, the "Book online" card in "Three ways to begin", and the advisor's plan result. Each carries `data-book` so the URL can be swapped in one search. Every other "Book your first visit"/"Book your visit" button (hero, mobile menu, services, membership, visit, gallery) goes to the three ways section (`#begin`, or `index.html#begin` from the gallery), so visitors choose between the advisor, booking online and calling (Kevin, 2026-11-04).

## Work log

No issue tracker — log significant work in `../Knowledge Bank/Zenyra.md`.
