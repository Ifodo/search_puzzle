IGetHouse Word Puzzle – Product Requirements Document (PRD)

Version: 1.0
Date: 2025-09-03
Owner: IGetHouse Product Team
Status: Draft → Review → Build

1) Summary

Build a fast, mobile-first word search puzzle game that teaches users real-estate concepts while driving traffic and leads to IGetHouse. The game runs entirely on the front end (HTML5 + TailwindCSS + Vanilla JavaScript) with no backend and no CDN. Users choose a category (e.g., Property Types, Mortgage & Finance, Home Interior & Decor, Legal & Documentation, Locations in Nigeria, etc.); the app generates a grid with hidden words from that category; users select letters to find words. CTAs, tips, and share actions tie discovery back to IGetHouse listings and content.

2) Objectives & Rationale

Educate: Familiarize users with real-estate terms, processes, and Nigeria-specific context.

Engage: Provide a sticky, gamified experience to increase time-on-site and return visits.

Convert: Drive users to IGetHouse funnels (NHF information, mortgage partners, listings pages, contact forms, WhatsApp/chat).

Delight: Smooth, responsive UX that feels premium and brand-consistent.

Non-goals (v1): account login, server-side leaderboards, multi-player, real-time sync, CMS-backed word lists.

3) Success Metrics (KPIs)

Average Session Length: ≥ 3:30 mins

Puzzle Completion Rate: ≥ 45% (per session)

CTA Click-Through (post-win modal): ≥ 8%

Return Rate (7-day): ≥ 20%

Daily Challenge Plays: ≥ 500/day (site-wide)

Share Rate (WA/X): ≥ 5%

4) Target Users & Personas

Curious Buyer (Gen Z/Young Professional): learning basics; loves quick games + shareability.

Active House Hunter: browsing listings; appreciates tips that reduce research time.

Investor/Landlord: interested in ROI/finance/legal categories; enjoys higher difficulty.

Home Decor Enthusiast: attracted by Home Interior & Decor category.

Accessibility: WCAG 2.1 AA; supports keyboard-only and screen readers.

5) Scope

In-scope (v1):

Category picker → grid-based word search generator

Difficulty modes (Easy/Medium/Hard)

Timer (optional), pause, and restart

Hints system (limited, optional)

Scoring & streaks (local only via localStorage)

Post-completion modal with IGetHouse CTA + tips

Daily Challenge (deterministic seed per date)

Offline-capable PWA (optional but recommended)

Analytics hooks (optional, privacy-first; can be toggled off)

Out-of-scope (v1):

User accounts, cloud sync

Server-side data, CMS, or admin portal

Dynamic personalization from server

6) User Stories & Acceptance Criteria

US-01: Pick category
As a player, I can choose a category to load a themed puzzle.

Given the landing screen, when I click a category tile, then the game loads a new grid with 10–15 words from that category and shows the side word list.

US-02: Play & select words
As a player, I can select contiguous letters to mark a word.

Drag or click-start → click-end highlights a path in the 8 directions (N, NE, E, SE, S, SW, W, NW).

If the selection matches a hidden word, it locks and the word is ticked off.

US-03: Difficulty
As a player, I can choose Easy/Medium/Hard.

Easy: 8×8 grid, 8–10 words, no backwards, horizontal/vertical only.

Medium: 12×12 grid, 12–14 words, includes diagonals and backward words.

Hard: 15×15 grid, 14–16 words, all directions + higher letter noise.

US-04: Hints
As a player, I can consume limited hints to progress.

Hint reveals the first letter cell of a random unfound word or pulses the line-of-sight for that word for 1.5s.

Default 2 hints per puzzle; using hints reduces max score.

US-05: Timer & Score
As a player, I see a timer and score update.

Score increases per word; time bonus; hint penalty.

On completion: show final score with share options.

US-06: Completion & CTA
As a player, I see a celebration and a contextual CTA.

Modal: 🎉 confetti, completion time/score, CTA buttons (e.g., “Browse Lagos Apartments”), and Play Again.

US-07: Daily Challenge
As a player, I can play a once-per-day puzzle that is the same for all users.

Seed = SHA256('IGETHOUSE-'+YYYYMMDD+'CATEGORY') to generate the same grid for the day.

US-08: Persistence
As a player, my last difficulty, sound, and streaks are remembered locally.

Stored with localStorage keys; no PII is stored.

US-09: Accessibility

Full keyboard navigation; visible focus; ARIA roles; color not sole cue.

7) Information Architecture

Home

Hero + "+ Play" button

Daily Challenge badge

Categories grid (cards with icon, brief description, difficulty tags)

Game Screen

Top bar: Logo (IGetHouse), breadcrumb, Settings (difficulty, sound, timer toggle)

Left panel: Word List + progress (e.g., 7/12) + hint button + tips panel

Center: Responsive puzzle grid

Right (optional on desktop): Real estate tips and contextual CTA

Results Modal

Score, time, streak

CTA buttons (Listings, NHF, Mortgage partners, Contact/WhatsApp)

8) Categories & Sample Word Banks

Final word banks live as static JSON; curated for clarity and Nigeria context. Examples below (not exhaustive):

A. Property Types
Apartment, Bungalow, Duplex, Penthouse, Maisonette, Studio, Terrace, Semi-Detached, Detached, Tenement, Self-Contain, Mini-Flat, Chalet, Condo

B. Home Interior & Decor
Kitchen, Sofa, Ceiling, Lighting, Paint, Rug, Wardrobe, Curtain, Tiles, Wallpaper, Island, Backsplash, Faucet, Chandelier, Cushion

C. Mortgage & Finance
Mortgage, Equity, Interest, NHF, Collateral, Appraisal, Downpayment, Amortization, Lender, Refinancing, PMI, Tenor, Offer, Valuation, Underwriting

D. Legal & Documentation
Deed, Title, Survey, C of O, Consent, Agreement, Covenant, Easement, Lease, Tenancy, Stamp, Search, Probate, Indenture, Encumbrance

E. Construction & Materials
Concrete, Rebar, Foundation, Beam, Plaster, Roofing, Asphalt, Aggregate, Grout, Block, Formwork, Column, Screed, Primer

F. Maintenance & Utilities
Generator, Inverter, Solar, Meter, Borehole, Sewage, Water, Waste, HVAC, Filter, Breaker, Fuse, Pump, Gutter, Pressure

G. Stakeholders & Roles
Realtor, Broker, Surveyor, Valuer, Architect, Engineer, Builder, Developer, Landlord, Tenant, Caretaker, Inspector, Notary

H. Locations (Nigeria)
Lagos, Abuja, Port Harcourt, Ibadan, Kano, Enugu, Benin, Kaduna, Abeokuta, Lekki, Yaba, Ikeja, Ajah, Ikoyi, Surulere, Gbagada, Owerri, Uyo, Warri

I. Investment & Metrics
ROI, Yield, Cashflow, Vacancy, Appreciation, Rental, Capital, Leverage, Portfolio, Risk, Equity, Diversify, Depreciation, Net, Gross

J. Smart Home & Tech
Sensor, Camera, Doorbell, Thermostat, Hub, Automation, WiFi, Router, Alarm, Access, Intercom, Lock, Lighting, Smart, Panel

Curation rules: Avoid ambiguous variants (e.g., “color/colour”), prefer single words, and include short + long terms. Multi-word entries may appear without spaces (e.g., CofO).

9) Game Mechanics & Rules

Grid placement: Words can share letters (overlap) but cannot cross non-matching letters.

Directions by difficulty:

Easy: Horizontal (→), Vertical (↓)

Medium: + Diagonals (↘, ↗) + Backwards for ≤30% of words

Hard: All 8 directions + Backwards up to 50% of words

Fill characters: Random A–Z with weighted frequency to reduce accidental word formation; optional theming letters for category flavor.

Selection: Mouse drag or touch drag; keyboard mode (hold Shift + arrows to extend selection). Confirmation on mouse/touch up.

Validation: Case-insensitive; accents normalized; multi-word terms matched ignoring spaces and punctuation.

Hints: 2 per game; configurable; costs points (-15% per use) and ends current combo.

Timer: On by default (can toggle off in Settings for casual play; disabling timer reduces max score by 10%).

10) Scoring, Streaks & Achievements

Base scoring:

Word found = 100 × difficultyMultiplier

Time bonus = max(0, 50 – secondsSinceLastWord)

Combo bonus = +10 linear per consecutive word < 15s

Hint penalty = –15% max score each hint

Timer off penalty = –10% final score

Multipliers: Easy 1.0, Medium 1.3, Hard 1.6

Streaks: Consecutive daily plays increase a streak meter (local only). Breaking streak resets to 0.

Achievements (local):

First Home: complete first puzzle

No Hints: complete any Medium+ without hints

Speed Buyer: finish in under 3:00 (Medium)

Legal Eagle: finish Legal & Documentation (Hard)

11) Engagement & Retention Features

Daily Challenge: single rotating category with deterministic seed.

Micro-tips: every 3 words, show a short tip (e.g., “You may qualify for NHF up to ₦50m depending on income and terms.”).

Context CTAs: tie found words to relevant pages (e.g., after finding Mortgage, show “Explore mortgage-ready listings”).

Share: Pre-filled WhatsApp and X captions with trophy emoji + site link.

12) IGetHouse Integration (Lead-Gen)

Win Modal CTAs (2–3 buttons):

Browse Lagos Apartments → listings URL

Check Your NHF Options → NHF info page

Chat on WhatsApp → wa.me link with prefilled message (no PII captured on-site)

Inline CTAs: Right panel cards themed by category (e.g., Home Interior → “See move-in-ready homes with modern kitchens”).

UTM tagging on outbound links for attribution. (Optional if analytics is enabled.)

13) Visual & Brand Requirements

Primary brand color: #025940 (IGetHouse green)

Palette (suggested):

Dark Green #014233

Mint #B6E3C3

Sand #F3EFE6

Charcoal #1F2937

Typography: System fonts for performance (e.g., Inter optional if bundled locally).

Style: Clean cards, rounded xl–2xl, soft shadows, high contrast, subtle motion.

Animations: 150–250ms ease transitions; confetti on win; gentle pulse for hints.

Sound (optional): Click, success, win jingle; toggle in settings.

14) Accessibility

Keyboard selection mode; Tab cycles actionable items, arrow keys navigate grid; Enter/Space to start/end selection.

ARIA: role="grid", aria-selected on cells, live region for “Word found” updates.

Color contra