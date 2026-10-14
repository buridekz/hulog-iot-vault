# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Both equally: homeowners and boarding-house hosts first in the story, defense panel one click away in the proof. Secondary operators: couriers (Shopee, J&T, Lazada, Flash, Grab/Lalamove) at a PH gate.

## Product Purpose

Hulog is an ESP32 drop vault at the residential gate. The owner issues a time-bound single-use PIN or dynamic QR; the courier uses it once; the door re-latches; the owner gets a drop confirmation. This website is the pitch visual hub and interactive demo of that loop.

Success: a first-time visitor knows what Hulog is, why a gate padlock fails, and can try a drop in one sitting. A panelist can still reach cost, wiring, and the team without a thesis dump.

## Positioning

Not a padlock and not a static QR sticker. Access is a rolling, single-use token that dies when the door cycle completes. Mechanism the site must prove: one pass, one open, then dead.

## Operating Context

Pitch defense with a laptop and phones. Distilled site: Home, How it works, Try it (shared vault demo), Cost (₱820), Wiring (friendlier pinout), Team. Rituals: copy rider note (Taglish), view proposal PDF, mint a pass. Hardware story stays true: 12V solenoid, MC-38/limit switch, IR presence, 0.96" OLED, 4×4 keypad, ESP32. Dual-core/FreeRTOS is optional proof, not homepage copy.

## Capabilities and Constraints

- Reccontent is allowed: friendly Filipino-English, not thesis-speak. Do not invent customers, press, or new prices. Keep ₱820, ₱3,499–₱4,999, team names, adviser credit, and the Taglish rider note as a real ritual.
- Existing BOM table numbers stay as authored in that table; hero/brief ₱820 copy stays as authored.
- Demo must become a single shared vault state: generated pass is the PIN/QR the courier and keypad accept; wrong PIN fails visibly; master unlock needs confirmation; lock/IR/item counts are not static fake telemetry.
- Stack is the existing React + Vite app in `hulog-web`. Do not change framework.
- No Raspberry Pi. Product is ESP32-class hardware; site is the explainer.

## Brand Commitments

Name: **HULOG**. Voice: warm, plain, Filipino-gate practical. Technical nouns only where a host or panelist needs them (PIN, QR, latch, wiring). Visual: new world, light default plus dark mode, not SaaS (no purple, no dashboard chrome, no three-card feature row). Demo must stay a single shared vault state.

## Evidence on Hand

- `Hulog_One_Page_Proposal.md` / `.html`
- Live app: `hulog-web/src` (Hero, DashboardSystem, Architecture, ShoppingList, Simulator, PinoutGuide, PitchEconomics, Footer, Sidebar)
- No product photography of a finished enclosure. Do not fabricate customer logos as endorsements. Demo data is synthetic and may be labeled as such.

## Product Principles

1. Prove the drop, don’t describe it.
2. One vault, one token, one truth across portal and simulator.
3. Keep the facts; rewrite the sentences so a tired host can follow them.
4. The site must work on a phone in the defense room.
5. Do not claim a live ESP32 node this page does not have.

## Accessibility & Inclusion

Keyboard-usable demo (keypad, forms, nav). Visible focus. Body text contrast ≥ 4.5:1. No product-specific WCAG certification was set.
