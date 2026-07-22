---
version: alpha
name: Cooper
description: Dense, flat, and teal-anchored dashboard UI inspired by the team-channel design system.
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.141 0.005 285.823)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.141 0.005 285.823)"
  popover: "oklch(1 0 0)"
  popover-foreground: "oklch(0.141 0.005 285.823)"
  primary: "oklch(0.508 0.118 165.612)"
  primary-foreground: "oklch(0.979 0.021 166.113)"
  secondary: "oklch(0.967 0.001 286.375)"
  secondary-foreground: "oklch(0.21 0.006 285.885)"
  muted: "oklch(0.967 0.001 286.375)"
  muted-foreground: "oklch(0.552 0.016 285.938)"
  accent: "oklch(0.967 0.001 286.375)"
  accent-foreground: "oklch(0.21 0.006 285.885)"
  destructive: "oklch(0.577 0.245 27.325)"
  border: "oklch(0.92 0.004 286.32)"
  input: "oklch(0.92 0.004 286.32)"
  ring: "oklch(0.705 0.015 286.067)"
  status-success-bg: "rgba(16, 185, 129, 0.15)"
  status-success-text: "oklch(0.569 0.198 164.404)"
  status-warning-bg: "rgba(245, 158, 11, 0.15)"
  status-warning-text: "oklch(0.642 0.186 66.894)"
  status-error-bg: "rgba(239, 68, 68, 0.15)"
  status-error-text: "oklch(0.586 0.238 27.319)"
  status-info-bg: "rgba(59, 130, 246, 0.15)"
  status-info-text: "oklch(0.546 0.232 264.391)"
  dark-background: "oklch(0.141 0.005 285.823)"
  dark-foreground: "oklch(0.985 0 0)"
  dark-card: "oklch(0.21 0.006 285.885)"
  dark-primary: "oklch(0.432 0.095 166.913)"
  dark-secondary: "oklch(0.274 0.006 286.033)"
  dark-muted: "oklch(0.274 0.006 286.033)"
  dark-muted-foreground: "oklch(0.705 0.015 286.067)"
  dark-border: "oklch(1 0 0 / 10%)"
  dark-input: "oklch(1 0 0 / 15%)"
  dark-destructive: "oklch(0.704 0.191 22.216)"
typography:
  body:
    fontFamily: Mona Sans Variable
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  body-medium:
    fontFamily: Mona Sans Variable
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
  heading:
    fontFamily: Mona Sans Variable
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  label-xs:
    fontFamily: Mona Sans Variable
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.2
  mono:
    fontFamily: JetBrains Mono Variable
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 0.525rem
  md: 0.7rem
  lg: 0.875rem
  xl: 1.225rem
  full: 9999px
spacing:
  xs: 2px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 24px
  header-height: 56px
  card-spacing: 16px
  sidebar-width: 256px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.body-medium}"
    rounded: "{rounded.md}"
    height: 28px
    padding: 0 8px
  button-primary-hover:
    backgroundColor: "oklch(0.508 0.118 165.612 / 0.8)"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.body-medium}"
    rounded: "{rounded.md}"
    height: 28px
    padding: 0 8px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    typography: "{typography.body-medium}"
    rounded: "{rounded.md}"
    height: 28px
    padding: 0 8px
  button-destructive:
    backgroundColor: "oklch(0.577 0.245 27.325 / 0.1)"
    textColor: "{colors.destructive}"
    typography: "{typography.body-medium}"
    rounded: "{rounded.md}"
    height: 28px
    padding: 0 8px
  button-destructive-hover:
    backgroundColor: "oklch(0.577 0.245 27.325 / 0.2)"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  input:
    backgroundColor: "oklch(0.92 0.004 286.32 / 0.2)"
    textColor: "{colors.foreground}"
    typography: "{typography.body-medium}"
    rounded: "{rounded.md}"
    height: 28px
    padding: 2px 8px
  badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label-xs}"
    rounded: "{rounded.full}"
    height: 20px
    padding: 2px 8px
  dialog:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
  tooltip:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 6px 12px
---

## Overview

Cooper is a dense, flat dashboard UI. Built to feel like a precision instrument — compact, calm, and quietly competent. No gradients. No heavy shadows. Depth comes from transparency layering and subtle 1px ring outlines on cards instead of box-shadows. The teal-green primary provides the sole moment of color against a monochromatic zinc-neutral backdrop.

Mona Sans Variable carries the UI voice; JetBrains Mono handles code, hashes, and technical data. Everything runs at 12px as the default body size — information-dense but legible with relaxed leading.

## Colors

All tokens use the OKLCH color space for perceptually uniform rendering and clean dark-mode transitions. The palette is intentionally restrained — one accent (teal-green), one destructive (red), and a zinc-grey neutral scale.

- **Primary (teal-green):** The sole interaction color. Buttons, badges, links, focus rings. Nothing else competes with it.
- **Neutrals (zinc):** The backbone. Background, foreground, muted, card, border — all derived from a single neutral axis. Light theme runs near-white to near-black; dark theme inverts.
- **Destructive (red):** Minimal use — delete buttons, error states, offline indicators.
- **Status colors:** Semantic states (success/warning/error/info) always use 15% opacity backgrounds with 600-level text. Never solid fills.

Dark mode inverts surface tokens while keeping the primary and status palette recognizable — darker teal for primary, translucent white borders (10–15% opacity) instead of solid grey.

## Typography

One family, one voice. Mona Sans Variable carries everything from 10px labels to 14px headings. JetBrains Mono is reserved for code spans, hashes, sequence numbers, and timestamps.

- **body (12px/400/1.5):** The workhorse. Cards, dialogs, sheets, tooltips, breadcrumbs.
- **body-medium (12px/500/1.5):** Interactive text — buttons, inputs, labels.
- **heading (14px/500/1.4):** Card titles, dialog titles, sheet titles.
- **label-xs (10px/500/1.2):** Badges, status chips, metadata.
- **mono (12px/400/1.5):** Technical data. Tabular numbers by default.

Font smoothing is set to antialiased on WebKit, grayscale on macOS. Body text uses `text-wrap: pretty`; headings use `text-wrap: balance`.

## Layout

A compact, fixed-header layout. The top bar is 56px tall (`--header-height`). The sidebar is 256px on desktop, 288px on mobile, collapsing to 48px icon-only.

All spacing follows an 8px base grid. Cards use a CSS-variable-driven spacing model (`--card-spacing`) that defaults to 16px (12px for compact cards). Common gaps: 4px for inline runs (button icon+text), 8px for content grouping, 24px for section padding.

Breakpoints follow Tailwind defaults: sm (640px), md (768px), lg (1024px), xl (1280px).

## Elevation & Depth

Depth is tonal, not shadow-based. Cards use `ring-1 ring-foreground/10` — a hairline outline at 10% foreground opacity. Only overlays (dialogs, sheets, dropdown menus) use box-shadows (`shadow-lg`).

Dropdown menus add glassmorphism via `backdrop-blur-2xl backdrop-saturate-150` over their content area. Dialog and sheet backdrops are solid black at 80% opacity with optional `backdrop-blur-xs` when supported.

Avatar borders use blend-mode pseudo-elements (`mix-blend-darken` in light, `mix-blend-lighten` in dark) to create a hairline edge that adapts to the background.

## Shapes

The base corner radius is 0.875rem (14px) — soft enough to feel modern, sharp enough to feel engineered. The scale extends from `sm` (8.4px) through `4xl` (36.4px).

Fully rounded (`9999px`) is reserved for badges, avatars, status chips, and presence dots — small elements that benefit from pill shapes.

Interactive buttons press down on click with `active:scale-[0.96]` and a 1px translate-y, creating a subtle mechanical response.

## Components

### Buttons

28px tall by default. Four variants: primary (teal fill), secondary (neutral fill), ghost (transparent), destructive (red tint). All share 8px horizontal padding, 4px gap between icon and text, and a 150ms ease-out transition on color/background/border/transform. Hover on primary darkens to 80% opacity. Disabled state is 50% opacity with `pointer-events: none`.

### Cards

Rounded-lg containers with a 10% foreground ring. Internal padding driven by `--card-spacing` (16px default, 12px compact). Header uses heading typography with 4px gap to description text. Footer sits at the bottom with items centered.

### Inputs

28px tall, 8px horizontal padding, 2px vertical. Background at 20% input opacity (30% in dark mode). Focus ring is 2px at 30% ring opacity. Invalid state adds a destructive border at 40% opacity. Placeholder uses muted foreground color.

### Badges

20px tall, fully rounded, 10px label text, 8px horizontal padding, 2px vertical. Tabular numbers for consistent width. Focus ring at 3px.

### Dialogs & Sheets

Fixed overlays at z-50 with black 80% backdrops. Content slides in from center (dialog) or edge (sheet). Headers have 24px padding, 6px gap between title and description. Close button is a ghost icon in the top-right corner.

### Tooltips

Inverted colors — foreground background with background text. 12px horizontal, 6px vertical padding. 6px gap for icon+text. Appear at z-50 with slide-in animation.

### Status Badges

Always use 15% opacity colored backgrounds: emerald for success/active/synced, amber for warning/idle/pending, red for error/offline, blue for info. Text color matches at 600-level saturation.

## Do's and Don'ts

- Do use the teal primary only for interactive elements — never for decorative purposes
- Do use `ring-1 ring-foreground/10` on cards instead of box-shadows
- Do keep status badges at exactly 15% background opacity with 600-level text
- Do use 12px as the default body size — go larger only when information density demands it
- Don't introduce new accent colors — the teal/grey palette is intentionally limited
- Don't use box-shadows on static elements — reserve them for overlays only
- Don't mix font families outside the two designated families (Mona Sans + JetBrains Mono)
- Don't exceed 28px height for standard buttons or inputs
- Don't use gradients anywhere — flat color with transparency overlays only
