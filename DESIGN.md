---
name: Hulog
description: Photocopied barangay-notice pitch site for a one-shot gate vault — copier sheet, photocopy ink, rubber-stamp red.
colors:
  copier-sheet: "#f6f5f1"
  notice-paper: "#eeede9"
  photocopy-ink: "#1a1a1a"
  faded-ink: "#4e4e4a"
  ghost-ink: "#6d6d68"
  fold-line: "#d1d0cd"
  stamp-red: "#c45c4a"
  stamp-paper: "#f6f5f1"
  latch-green: "#2f6b4f"
  denied-red: "#b42318"
  oled-pit: "#111111"
  oled-phosphor: "#f3f3f0"
  hall: "#16181c"
  hall-paper: "#1c1f24"
  hall-ink: "#ecece8"
  hall-stamp: "#d46a58"
typography:
  display:
    fontFamily: "Archivo Black, Arial Narrow, sans-serif"
    fontSize: "clamp(2.1rem, 4.6vw, 3.35rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Archivo Black, Arial Narrow, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.2rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.028em"
  title:
    fontFamily: "Atkinson Hyperlegible, Helvetica Neue, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "Atkinson Hyperlegible, Helvetica Neue, sans-serif"
    fontSize: "1.08rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Atkinson Hyperlegible, Helvetica Neue, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "0.04em"
rounded:
  none: "0px"
  keypad: "1px"
  control: "3px"
spacing:
  xs: "0.45rem"
  sm: "0.65rem"
  md: "1.25rem"
  lg: "1.5rem"
  xl: "2.5rem"
  nav-h: "64px"
  page-max: "1180px"
  measure: "72ch"
components:
  button-stamp-cta:
    backgroundColor: "{colors.stamp-red}"
    textColor: "{colors.stamp-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "68px"
    padding: "0"
  button-stamp-cta-compact:
    backgroundColor: "{colors.stamp-red}"
    textColor: "{colors.stamp-paper}"
    rounded: "{rounded.none}"
    height: "48px"
    padding: "0"
  button-outline:
    backgroundColor: "{colors.copier-sheet}"
    textColor: "{colors.photocopy-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.62rem 1.05rem"
  button-outline-hover:
    backgroundColor: "{colors.notice-paper}"
    textColor: "{colors.photocopy-ink}"
    rounded: "{rounded.control}"
  button-stamp-fill:
    backgroundColor: "{colors.stamp-red}"
    textColor: "{colors.stamp-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.62rem 1.05rem"
  button-stamp-fill-hover:
    backgroundColor: "{colors.photocopy-ink}"
    textColor: "{colors.copier-sheet}"
    rounded: "{rounded.control}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.photocopy-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.62rem 1.05rem"
  button-icon:
    backgroundColor: "{colors.copier-sheet}"
    textColor: "{colors.photocopy-ink}"
    rounded: "{rounded.control}"
    size: "40px"
    padding: "0"
  input:
    backgroundColor: "{colors.copier-sheet}"
    textColor: "{colors.photocopy-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0.6rem 0.75rem"
  notice-block:
    backgroundColor: "{colors.notice-paper}"
    textColor: "{colors.photocopy-ink}"
    rounded: "{rounded.none}"
    padding: "1.25rem 1.3rem 1.4rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.faded-ink}"
    typography: "{typography.label}"
    padding: "0.4rem 0.7rem 0.55rem"
  nav-link-active:
    backgroundColor: "transparent"
    textColor: "{colors.photocopy-ink}"
    typography: "{typography.label}"
  wordmark:
    backgroundColor: "transparent"
    textColor: "{colors.photocopy-ink}"
    typography: "{typography.display}"
    padding: "0"
---

# Design System: Hulog

## Overview

**Creative North Star: "Barangay photocopied notice"**

Hulog reads as a sheet someone ran through a barangay copier and taped to a gate: warm copier paper, grain in the fiber, photocopy-black type, and one rubber-stamp red for the press. The pitch is a notice, not a product dashboard. Light is the default hall; dark is a dimmer corridor of the same sheet, not a neon inversion.

Density stays spare. Headlines shout in Archivo Black; sentences stay in Atkinson Hyperlegible so a tired host can read them. The vault is an exhibit stamped onto the page, not a SaaS device mock in a chrome bezel. Confirmed refusals: the three-card purple product landing, Host Grotesk on cool paper, and drop-shadow lift.

**Key Characteristics:**
- Copier-sheet field with tiled grain (multiply on light, overlay on dark)
- Archivo Black for shouts; Atkinson Hyperlegible for sentences; JetBrains Mono only inside data
- Stamp red as the single chromatic press
- Hairline-ruled lists and paper notice blocks; no card grid
- Rubber-stamp raster CTAs that press down, they do not lift
- Live vault shown as a photocopied plate with exhibit and date stamps

## Colors

Warm photocopy neutrals carry the sheet. One stamp red does the press. Latch green and denied red speak only as vault outcomes.

### Primary
- **Stamp Red**: The rubber-stamp ink. Primary CTAs, stamped PIN, step indexes, text selection, and focus rings. On the dark hall it warms slightly (`hall-stamp`) so the press still reads on the dimmer sheet.

### Secondary
- **Latch Green**: Granted / bolt-open / success log. Never a brand fill.
- **Denied Red**: Wrong PIN, field error, warn log. Never a decorative accent.

### Neutral
- **Copier Sheet**: Page field. The whole site sits on this, not on white.
- **Notice Paper**: Inset sheets (Try-it forms, code chips). One step duskier than the field.
- **Photocopy Ink**: Wordmark, headlines, rules, outlines.
- **Faded Ink**: Ledes, secondary sentences, idle nav.
- **Ghost Ink**: Placeholders.
- **Fold Line**: Hairline rules between list rows and around notice sheets.
- **Stamp Paper**: Knockout type sitting in stamp red (same sheet as the field in light; remaps with the hall in dark).
- **OLED Pit / OLED Phosphor**: Vault glass only. Pit is the 0.96" screen; phosphor is the digits. They do not paint the page.
- **Hall / Hall Paper / Hall Ink**: Dark-theme remaps of sheet, notice paper, and ink. Same world, lights off.

### Named Rules
**The Stamp Red Rule.** Stamp red is the only chromatic accent on the sheet. It marks a press: CTA, PIN, selection, focus. It does not fill page backgrounds or paint chrome.

**The Copier Sheet Rule.** The field is copier sheet, not white, not OLED black. OLED pit exists only inside the vault glass.

## Typography

**Display Font:** Archivo Black (Arial Narrow fallback)
**Body Font:** Atkinson Hyperlegible (Helvetica Neue fallback)
**Label/Mono Font:** JetBrains Mono (OLED, keypad, log, wiring codes)

**Character:** The pairing is a posted notice: black condensed shout for the offer, hyperlegible sentences for the tired host, and a machine mono trapped inside the hardware.

### Hierarchy
- **Display** (400, clamp 2.1–3.35rem, 1.08, −0.03em): Hero offer. Cap width at 14ch. The wordmark is the same cut at 1.15rem with +0.02em. Price on Cost uses this cut at clamp 2.4–3.4rem. Stamped PIN uses this cut at clamp 1.9–2.55rem with +0.08em, in stamp red, through the ink-bleed filter.
- **Headline** (400, clamp 1.6–2.2rem, 1.12, −0.028em): Page titles (How a drop works, Try a drop, Cost, Wiring, Team).
- **Title** (700, 1.15rem): Step headings and notice-block titles (notice titles sit a hair smaller at 1.05rem). Atkinson, never Archivo.
- **Body** (400, 1.08rem lede / 1rem elsewhere, 1.55): Sentences. Ledes max at 38ch on the hero, `measure` (72ch) on interior pages, 58ch on step copy.
- **Label** (700, 0.82rem): Form labels. Nav links are the same family at 0.92rem / 700. Footer sits at 0.9rem faded ink.
- **Mono** (500–600, 0.58–0.9rem): OLED chrome and hints (0.58rem), keypad keys (0.9rem / 600), event log (0.72rem), wiring `<code>` (0.82rem on notice paper).

### Named Rules
**The Two Voices Rule.** Archivo Black for the shout (wordmark, headlines, price, stamped PIN, lock slab). Atkinson Hyperlegible for the sentence. Never reverse them.

**The Mono Enclosure Rule.** JetBrains Mono lives inside the vault, the keypad, the log, and wiring codes. It does not label the page.

## Layout

A single 1180px measure with 1.25rem side gutters. Sticky topbar is 64px. Interior pages pad 2rem / 1.25rem / 5rem. The first viewport is a split exhibit: offer column, 18px scribbled gutter, stamped vault (vault column max 400px). That split is the home composition, not a sitewide grid — How / Try / Cost / Wiring / Team are single-column notices inside `.page`.

Below 960px the split gutter hides, columns stack, desktop nav collapses to a 40px menu button, and stamp CTAs shrink (68px → 58px tall). Footer, Try-it grid, people rows, and wiring rows also collapse to one column.

Rhythm is hairline-ruled rows (1.35rem vertical padding on steps; 0.85–0.9rem on parts and people) and two-column Try-it / parts grids at 1.5rem / 0.9rem gaps. No card mosaic, no metric strip, no three-up feature row.

## Elevation & Depth

Flat photocopy. Depth is grain, multiply-blend stamps, and an SVG ink-bleed displacement — not drop shadows. Light grain tiles at 380px, opacity 0.34, multiply. Dark grain uses overlay at 0.26. Stamps, vault plate, and wordmark bracket multiply onto the sheet; in the hall most of those rasters invert and screen.

The only box-shadows are inset 2px rings on the OLED (`latch-green` granted, `denied-red` denied). Buttons do not lift. Press is a 1–2px downward translate, sometimes with `scale(0.98)`.

Motion uses `--ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`): page change 0.28s / 8px, in-view reveal 0.48s / 12px, exhibit enter 0.55s / 10px. The stamped PIN slams in (rotate ≈ −2°, y 3→0) then lifts off the sheet when the door shuts. `prefers-reduced-motion: reduce` kills animation and transition.

### Shadow Vocabulary
- **OLED granted** (`box-shadow: inset 0 0 0 2px` latch-green): Access open.
- **OLED denied** (`box-shadow: inset 0 0 0 2px` denied-red): Access refused.

### Named Rules
**The Ink Not Shadow Rule.** Depth is grain, multiply-blend stamps, and the ink-bleed filter. Box-shadow is reserved for OLED status rings. Surfaces do not lift.

## Shapes

Notice sheets are square (0). Controls take a barely-there 3px. Keypad keys take 1px so they read as stamped metal, not UI chips. Rubber-stamp CTAs, exhibit marks, date marks, the theme pill, the vault plate, and the wordmark bracket are raster silhouettes from `hulog-web/public/notice/` — they are not CSS pills or circles.

Hairlines are 1px `fold-line` around notice sheets and between list rows. Outline buttons and keypad keys stroke `photocopy-ink`. Focus is a 2px stamp-red outline with 3px offset.

### Named Rules
**The Near-Square Rule.** Notice sheets are square. Controls take 3px. Keypad keys take 1px. Rubber stamps are raster silhouettes, not CSS pills.

## Components

### Buttons
Primary action is a rubber-stamp raster (`.stamp-cta`), not a CSS fill. Height 68px on the hero, 48px compact on Try-it, 58px below 960px. Mix-blend multiply on light. Hover nudges 1px down; active presses 2px down. No border, no radius.

- **Shape:** Raster stamp (0 radius) for primary press; 3px on sheet buttons
- **Primary:** Notice rasters `cta-try.png`, `cta-stamp-pin.png`, `cta-unlock.png` in stamp red
- **Hover / Focus:** Downward press. Focus-visible is the global 2px stamp-red ring
- **Stamp fill** (`.btn-stamp`): CSS stand-in for sheet confirmations (deposit, master unlock, proposal). Stamp-red fill, stamp-paper type, 0.62rem / 1.05rem, 700 / 0.92rem. Hover inverts to photocopy ink on copier sheet
- **Outline** (`.btn`): Copier sheet, 1px photocopy-ink stroke. Hover fills notice paper
- **Ghost** (`.btn-ghost`): Transparent, same stroke. Master-unlock and New PIN
- **Icon** (`.icon-btn`): 40×40, same outline language. Menu only
- **Parts link:** Bare Atkinson 700 with a scribbled underline, not a button

### Cards / Containers
There are no cards. Recurring containers:

- **Notice block:** Notice-paper fill, 1px fold-line, 0 radius, 1.25rem / 1.3rem / 1.4rem padding. Try-it “You” / “Rider” sheets.
- **Step / part / person / wire:** Hairline-top rows. Wires are 9.5rem mono pin + sentence. People are name / role split.
- **Exhibit:** Relative well. `stamp-exhibit.png` (158px, −11° companion `stamp-date.png`) over a photocopied `vault-plate.png`. Not a bezel, not a device mock frame.
- **Alert:** 1px latch-green stroke, latch-green type, 0.75rem / 0.9rem. Drop confirmation only.

### Inputs / Fields
- **Style:** Full-width, 1px fold-line, copier-sheet fill, 3px radius, 0.6rem / 0.75rem, Atkinson 1rem
- **Focus:** Fold-line becomes stamp red; no glow
- **Error:** Denied-red sentence at 0.85rem under the field
- **Placeholder:** Ghost ink

### Navigation
Sticky copier-sheet bar, 64px, 1.25rem gutters, a scribbled header rule along the bottom. Wordmark is the notice bracket raster plus ink-bled “HULOG” in Archivo Black 1.15rem. Links are Atkinson 700 / 0.92rem in faded ink; hover and active go photocopy ink. The active link gets an 8px scribbled underline, not a pill. Theme control is `toggle-pill.png` (88×44), a stamp, not a CSS switch. Below 960px links move into a stacked mobile list (1rem, full width).

### Vault exhibit
Photocopied plate (aspect 864 / 1152) with a live OLED + 4×4 keypad + lock slab composited in the well. OLED is pit on phosphor, JetBrains 0.58rem chrome, seven-segment PIN. Keypad keys are 1px-radius, 5px gap, multiply on light, invert-fill on hover. Lock slab is Archivo Black, +0.14em, ink-bleed; latch-green when open. Sheet QR is stamp red on transparent; glass QR is phosphor on pit.

### Stamped PIN
On Try-it, the minted PIN is Archivo Black in stamp red through ink-bleed. A ghost of the same PIN sits at 0.22 opacity after the door shuts and the live stamp lifts off the sheet.

## Do's and Don'ts

### Do:
- **Do** sit every page on copier sheet with the grain overlay on.
- **Do** shout in Archivo Black and speak in Atkinson Hyperlegible.
- **Do** spend stamp red on a press (raster CTA, PIN, focus, selection) and nowhere else as a fill.
- **Do** stack interior content as hairline-ruled lists and square notice sheets.
- **Do** press controls downward (1–2px). Primary CTAs are the notice rasters.
- **Do** keep JetBrains Mono inside the vault, keypad, log, and wiring codes.
- **Do** treat dark as the hall remap (`hall`, `hall-paper`, `hall-ink`, `hall-stamp`), not a new identity.

### Don't:
- **Don't** ship a three-card feature row, metric strip, or purple-gradient SaaS hero.
- **Don't** revive Host Grotesk, cool paper `#f5f5f3`, or OLED-as-page-brand.
- **Don't** put drop shadows or lift (`translateY(-n)`) on surfaces or buttons.
- **Don't** use white as the page field, or OLED pit as a page background.
- **Don't** label the page in JetBrains Mono or set body copy in Archivo Black.
- **Don't** turn CSS pills into primary CTAs; the press is a rubber stamp.
- **Don't** add a kicker or eyebrow above the offer. The shipped fold starts at the headline.
