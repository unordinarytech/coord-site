# UI Design Specs

> Extracted from the team-channel dashboard design system.
> CSS-variable-first, Tailwind CSS v4, shadcn/ui Base Mira style, Base UI React primitives.

---

## 1. Color System

All colors use **OKLCH** color space, defined as CSS custom properties.

### Light Theme (`:root`)

| Token | OKLCH | Visual |
|---|---|---|
| `--background` | `oklch(1 0 0)` | Pure white |
| `--foreground` | `oklch(0.141 0.005 285.823)` | Near-black |
| `--card` | `oklch(1 0 0)` | White |
| `--card-foreground` | `oklch(0.141 0.005 285.823)` | — |
| `--popover` | `oklch(1 0 0)` | White |
| `--popover-foreground` | `oklch(0.141 0.005 285.823)` | — |
| `--primary` | `oklch(0.508 0.118 165.612)` | Teal-green |
| `--primary-foreground` | `oklch(0.979 0.021 166.113)` | Very light teal |
| `--secondary` | `oklch(0.967 0.001 286.375)` | Near-white neutral |
| `--secondary-foreground` | `oklch(0.21 0.006 285.885)` | Dark neutral |
| `--muted` | `oklch(0.967 0.001 286.375)` | Near-white neutral |
| `--muted-foreground` | `oklch(0.552 0.016 285.938)` | Mid neutral |
| `--accent` | `oklch(0.967 0.001 286.375)` | Near-white neutral |
| `--accent-foreground` | `oklch(0.21 0.006 285.885)` | Dark neutral |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Red |
| `--border` | `oklch(0.92 0.004 286.32)` | Light border |
| `--input` | `oklch(0.92 0.004 286.32)` | Light |
| `--ring` | `oklch(0.705 0.015 286.067)` | Focus ring |

### Dark Theme (`.dark`)

| Token | OKLCH | Visual |
|---|---|---|
| `--background` | `oklch(0.141 0.005 285.823)` | Near-black |
| `--foreground` | `oklch(0.985 0 0)` | Near-white |
| `--card` | `oklch(0.21 0.006 285.885)` | Dark card |
| `--primary` | `oklch(0.432 0.095 166.913)` | Darker teal |
| `--primary-foreground` | `oklch(0.979 0.021 166.113)` | Very light |
| `--secondary` | `oklch(0.274 0.006 286.033)` | Dark neutral |
| `--secondary-foreground` | `oklch(0.985 0 0)` | Near-white |
| `--muted` | `oklch(0.274 0.006 286.033)` | Dark neutral |
| `--muted-foreground` | `oklch(0.705 0.015 286.067)` | Mid-light neutral |
| `--destructive` | `oklch(0.704 0.191 22.216)` | Brighter red |
| `--border` | `oklch(1 0 0 / 10%)` | 10% white |
| `--input` | `oklch(1 0 0 / 15%)` | 15% white |
| `--ring` | `oklch(0.552 0.016 285.938)` | Mid neutral |

### Semantic Status Colors

Used consistently at 15% bg opacity with 600-level text:

| Status | Background | Text |
|---|---|---|
| Success / Active / Synced | `bg-emerald-500/15` | `text-emerald-600` |
| Warning / Idle / Pending | `bg-amber-500/15` | `text-amber-600` |
| Error / Offline | `bg-red-500/15` | `text-red-600` |
| Info | `bg-blue-500/15` | `text-blue-600` |
| Neutral | `bg-muted` | `text-muted-foreground` |

---

## 2. Typography

### Font Families

| Token | Value | Usage |
|---|---|---|
| `--font-sans` | `'Mona Sans Variable', sans-serif` | Body, UI |
| `--font-mono` | `'JetBrains Mono Variable', monospace` | Code, technical data |
| `--font-heading` | `var(--font-sans)` | Headings (same as body) |

### Font Sizes

| Size | Class | Usage |
|---|---|---|
| 10px | `text-[0.625rem]` | Badge text, xs button text |
| 11px | `text-[11px]` | Inline status badges, meta labels |
| 12px | `text-xs/relaxed` | **Primary body/small text** — buttons, cards, dialogs, sheets, labels, inputs, breadcrumbs, tooltips |
| 14px | `text-sm` | CardTitle, DialogTitle, SheetTitle, AvatarFallback |
| 16px | `text-base` | Rarely used |

### Font Weight

| Weight | Class | Usage |
|---|---|---|
| 500 | `font-medium` | Buttons, Badges, CardTitle, DialogTitle, SheetTitle, Labels |

### Text Rendering

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  text-wrap: pretty;
}
h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}
```

### Other Utilities

- `tabular-nums` — Badges, sequence numbers, timestamps
- `tracking-tight` — Page headings
- `whitespace-nowrap` — Buttons, Badges

---

## 3. Border Radii

Base: `--radius: 0.875rem` (14px)

| Token | Value | Approx Pixels |
|---|---|---|
| `--radius-sm` | `calc(var(--radius) * 0.6)` | ~8.4px |
| `--radius-md` | `calc(var(--radius) * 0.8)` | ~11.2px |
| `--radius-lg` | `var(--radius)` | 14px |
| `--radius-xl` | `calc(var(--radius) * 1.4)` | ~19.6px |
| `--radius-2xl` | `calc(var(--radius) * 1.8)` | ~25.2px |
| `--radius-3xl` | `calc(var(--radius) * 2.2)` | ~30.8px |
| `--radius-4xl` | `calc(var(--radius) * 2.6)` | ~36.4px |

### Radius Usage by Component

| Class | Components |
|---|---|
| `rounded-sm` | Button (xs, icon-xs) |
| `rounded-md` | Buttons (default), Inputs, Tooltips, Skeleton |
| `rounded-lg` | Cards, DropdownMenu content |
| `rounded-xl` | Dialog content, Sheet content |
| `rounded-full` | Badges, Avatars, Avatar badges, Status chips |

---

## 4. Borders

### Border Widths

| Value | Usage |
|---|---|
| `border` (1px) | Buttons, Inputs, Dialog/Sheet content, Avatar ring |
| `ring-1` | Cards (`ring-1 ring-foreground/10`), DropdownMenu content |
| `ring-2` | AvatarBadge, AvatarGroup stacking, Input focus-visible, `aria-invalid` |
| `ring-[3px]` | Badge focus-visible |
| `border-b` | Site header (sticky top bar) |

### Border Colors

| Token | Light | Dark |
|---|---|---|
| `--border` | `oklch(0.92 0.004 286.32)` | `oklch(1 0 0 / 10%)` |
| `--input` | `oklch(0.92 0.004 286.32)` | `oklch(1 0 0 / 15%)` |
| `--ring` | `oklch(0.705 0.015 286.067)` | `oklch(0.552 0.016 285.938)` |

### Component Border Usage

| Pattern | Where |
|---|---|
| `border border-transparent` | Button base, Badge base |
| `border border-input` | Inputs |
| `border border-border` | Outline buttons, Outline badges |
| `border border-border/50` | Subtle card borders |
| `border-destructive/40` | Error state inputs |

---

## 5. Shadows

**No custom shadow tokens.** Uses Tailwind v4 default shadow scale.

| Class | Usage |
|---|---|
| `shadow-md` | DropdownMenu content |
| `shadow-lg` | Dialog content, Sheet content |

**Key design decision:** Cards do NOT use box-shadow. They use `ring-1 ring-foreground/10` for a subtle outline effect instead — flat depth model.

---

## 6. Spacing & Layout

### Spacing Scale

Uses Tailwind v4 default (0.25rem = 4px base). Common values:

| Value | Tailwind | Usage |
|---|---|---|
| 2px | `py-0.5` | Badge, Input padding |
| 4px | `gap-1`, `mt-1` | Button icon+text, card header grid, breadcrumb items |
| 6px | `gap-1.5`, `py-1.5`, `mt-1.5` | Dialog/Sheet header, Tooltip content |
| 8px | `gap-2`, `px-2`, `py-2`, `mt-2` | Labels, sidebar items, form groups, button groups |
| 12px | `gap-3`, `px-3` | Member rows, Tooltip horizontal padding |
| 16px | `--card-spacing`, `p-4` | Card padding (default) |
| 24px | `p-6` | Dialog/Sheet header and footer |

### Layout Variables

| Variable | Value | Usage |
|---|---|---|
| `--header-height` | `3.5rem` (56px) | Top site header |
| `--card-spacing` | `--spacing(4)` (16px) / `--spacing(3)` (12px for sm) | Card internal padding |
| `SIDEBAR_WIDTH` | `16rem` (256px) | Desktop sidebar |
| `SIDEBAR_WIDTH_MOBILE` | `18rem` (288px) | Mobile sidebar |
| `SIDEBAR_WIDTH_ICON` | `3rem` (48px) | Collapsed sidebar |

### Breakpoints

| Breakpoint | Width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

---

## 7. Component Sizing

| Component | Height | Horizontal |
|---|---|---|
| Button (default) | `h-7` (28px) | `px-2` |
| Button (xs) | `h-5` (20px) | `px-2` |
| Button (sm) | `h-6` (24px) | `px-2` |
| Button (lg) | `h-8` (32px) | `px-2.5` |
| Button (icon) | `w-7 h-7` (28px) | — |
| Input | `h-7` (28px) | `px-2 py-0.5` |
| Badge | `h-5` (20px) | `px-2 py-0.5` |
| Avatar (default) | `size-8` (32px) | — |
| Avatar (sm) | `size-6` (24px) | — |
| Avatar (lg) | `size-10` (40px) | — |

---

## 8. Interactive States

### Focus Rings

| Component | Focus Style |
|---|---|
| Input | `focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30` |
| Badge | `focus-visible:ring-[3px] focus-visible:ring-ring/50` |
| Button | `focus-visible:bg-accent` |

### Active Press

```css
active:scale-[0.96]
active:not-aria-[haspopup]:translate-y-px
```

### Disabled

```css
disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed
```

### Invalid

```css
aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20
```

---

## 9. Animation & Motion

### Transition Defaults

| Component | Duration | Easing |
|---|---|---|
| Buttons, Badges | `150ms` | `ease-out` |
| Inputs, Breadcrumbs | `transition-colors` | (default) |
| Dialogs | `200ms` | `ease-out` |
| Sheets | `200ms` | `ease-in-out` |
| DropdownMenu | `100ms` | (default) |

### Page-Level Motion (`motion`)

```
Column enter:
  from:     { opacity: 0, y: 6 }
  to:       { opacity: 1, y: 0 }
  ease:     [0.23, 1, 0.32, 1]   (cubic bezier)
  duration: 0.22s

Stagger:
  columnDelay: 0.07s
  rowDelay:    0.025s

List items:
  from: { opacity: 0, y: 6 }
  stagger: 0.02–0.03s
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 10. Z-Index

| Value | Context |
|---|---|
| `z-10` | AvatarBadge |
| `z-50` | Dialog backdrop, Dialog content, Sheet overlay, Sheet content, DropdownMenu, Tooltip |

---

## 11. Design Principles

1. **Dense & compact** — Default text is 12px, buttons are 28px, headers are 56px. Information-dense layouts.
2. **Flat depth** — Cards use `ring-1 ring-foreground/10` instead of box-shadows. Only overlays (dialogs, sheets, dropdowns) use `shadow-lg`.
3. **Soft radius** — Base radius 0.875rem creates a modern, approachable feel without being playful.
4. **Semantic transparency** — Status colors consistently use `bg-{color}-500/15` with `text-{color}-600`.
5. **No gradients** — Flat color design. Depth comes from transparency overlays (`/10`, `/20`, `/30`, `/80`).
6. **Backdrop blur on overlays** — Dialogs and sheets blur content behind them (`backdrop-blur-xs`).
7. **Avatar border via blend-mode** — Uses `mix-blend-darken` / `mix-blend-lighten` pseudo-elements for hairline avatar borders.
8. **Motion-presence panels** — Every panel uses staggered entrance animations via `motion`.

---

## 12. Tech Stack

| Layer | Choice |
|---|---|
| CSS framework | Tailwind CSS v4 |
| Design system | shadcn/ui — Base Mira style |
| Component primitives | Base UI React |
| Styling variants | `class-variance-authority` |
| Class merging | `tailwind-merge` + `clsx` |
| Animation | `motion` v12 (React) + `tw-animate-css` |
| Icons | Tabler Icons (`@tabler/icons-react`) |
| Fonts | Mona Sans Variable, JetBrains Mono Variable |
| Color space | OKLCH |
