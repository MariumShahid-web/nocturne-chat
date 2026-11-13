---
name: Nocturne Chat
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#bec8cb'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#889395'
  outline-variant: '#3e484b'
  surface-tint: '#7dd3e5'
  primary: '#7dd3e5'
  on-primary: '#00363e'
  primary-container: '#167d8d'
  on-primary-container: '#ebfbff'
  inverse-primary: '#006876'
  secondary: '#a4ced2'
  on-secondary: '#06363a'
  secondary-container: '#234d50'
  on-secondary-container: '#92bdc0'
  tertiary: '#b6c8de'
  on-tertiary: '#203243'
  tertiary-container: '#627487'
  on-tertiary-container: '#f6f9ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a1efff'
  primary-fixed-dim: '#7dd3e5'
  on-primary-fixed: '#001f25'
  on-primary-fixed-variant: '#004e5a'
  secondary-fixed: '#bfeaee'
  secondary-fixed-dim: '#a4ced2'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#234d50'
  tertiary-fixed: '#d1e4fb'
  tertiary-fixed-dim: '#b6c8de'
  on-tertiary-fixed: '#091d2d'
  on-tertiary-fixed-variant: '#36485a'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 23px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.005em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12.5px
    fontWeight: '400'
    lineHeight: 17px
    letterSpacing: 0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10.5px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-tablet: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style
The design system delivers an intimate, nocturnal atmosphere tailored for focused group messaging. It balances the depth of deep oceanic navy with the crisp illumination of luminous seafoam and ice-blue accents. The aesthetic marries high-precision utilitarian clarity with atmospheric tactile comfort—evoking the serenity of late-night conversations without eye fatigue.

Targeting modern digital communities, distributed teams, and close-knit social circles, the UI projects quiet confidence, swift responsiveness, and zero visual friction. The design movement blends **Modern Nocturnal Minimalism** with **Atmospheric Layering**: deep monochromatic canvases layered with tonal containers, translucent frosted glass overlays on floating chrome, and deliberate, high-legibility messaging capsules.

## Colors
The palette is built around deep spatial immersion punctuated by crisp oceanic bioluminescence. 

- **Primary Canvas & Structural Depth (`#071B2B`)**: Deep Navy / Night. Serves as the primary app background and base elevation level. It creates visual rest and extends battery efficiency across OLED mobile screens.
- **Primary Accent (`#167D8D`)**: Vibrant Teal. Dedicated to active states, send triggers, read receipts, and primary interactive affordances.
- **Soft Highlight & Interactive Soft Surface (`#B9E4E8`)**: Ice Blue / Pale Aqua. Applied to outgoing chat bubble backgrounds, pill highlights, unread badge counters, and active segment indicators. Text placed on this surface must strictly leverage `#071B2B` to guarantee AAA contrast.
- **Neutral Light & Text Ground (`#EEEEEE`)**: Clean Light Gray / Off-White. Powers incoming chat message surfaces, high-contrast primary text labels, and structural delimiters.

### Functional Tint & Overlay Rules
- **Incoming Bubbles**: Surface color `#0E2A40` (a stepped tonal elevation over `#071B2B`) with text in `#EEEEEE`.
- **Outgoing Bubbles**: Fill `#B9E4E8` with high-contrast text `#071B2B`.
- **System & Timestamp Text**: Low-opacity neutral `#EEEEEE` at 64% opacity for secondary info, and 42% for disabled/ambient metadata.
- **Live Status Accents**: Online presence utilizes an electric emerald `#00D68F`; busy/do-not-disturb utilizes amber-crimson `#FF5C5C`.

## Typography
Typography balances human-centric readability with technical precision. 

- **Primary Sans (Plus Jakarta Sans)**: Handles all primary headlines, group titles, member handles, and conversational body copy. Its open apertures, geometric clarity, and subtle friendly curves make fast message scanning effortless on mobile touchscreens.
- **Monospaced Utility (JetBrains Mono)**: Handles timestamps, unread pill counts, technical telemetry, file attachment sizes, and code snippets within messages. This creates a clean functional juxtaposition against conversational text.

### Hierarchy Guidelines
- Message bubble body text strictly leverages `body-md` (14px) and `body-lg` (16px) with an intentional line-height multiplier (1.4–1.45x) to prevent claustrophobic text blocks inside compact bubbles.
- Dynamic mobile scaling switches `headline-lg` to `headline-lg-mobile` across viewport widths under 390px.
- Timestamps nested within message bubbles must use `label-sm` with tabular numerals to ensure baseline visual stability across multi-message streams.

## Layout & Spacing
The layout model employs a strict fluid layout engineered for one-handed mobile ergonomic zones.

### Vertical Chat Rhythm
- **Message Stacking (Same sender)**: Grouped sequential messages sit close together with a `space-xs` (4px) vertical gap.
- **Message Stacking (Alternating senders)**: Shift between different senders triggers a `space-md` (12px) separation to define visual conversational turns clearly.
- **Group Metadata Delimiters**: Day breaks and system status lines introduce `space-xl` (24px) breathing room.

### Layout Mechanics
- **Mobile (< 640px)**: Single-column full-width viewport. Outer screen padding fixed at `margin` (16px). Maximum message bubble width is constrained to `78%` of the viewport width to prevent edge-to-edge stretching and sustain comfortable reading eye-travel.
- **Tablet / Split View (640px - 1024px)**: Dual-pane master-detail arrangement. Channel navigation drawer occupies a fixed 320px column; conversation view absorbs remaining fluid space with `margin-tablet` (24px).
- **Desktop (> 1024px)**: Three-column setup (Navigation/Channels 280px, Active Chat fluid max-width 840px centered, Info/Media Drawer 320px).

## Elevation & Depth
The design system bypasses traditional muddy drop shadows in favor of **Tonal Layering** accompanied by **Subtle Back-tinted Ambient Halos** and **Glassmorphic Surface Chrome**.

### Elevation Tiers
1. **Level 0 (Canvas Base - `#071B2B`)**: The deep foundation. Chat stream canvas and background gutter.
2. **Level 1 (Submerged Containers - `#0B2438`)**: Pinned channel list items, conversation message search bars, and incoming message bubbles. Borders are rendered using a 1px ghost stroke of `#EEEEEE` at 8% opacity.
3. **Level 2 (Floating Floating Chrome & Modals - `#10314A`)**: Floating bottom input dock, pinned header bars, and context menus. Enhanced with `backdrop-filter: blur(16px)` and an ambient teal halo: `0 8px 32px -4px rgba(22, 125, 141, 0.18)`.
4. **Level 3 (Active Message Layer - `#B9E4E8`)**: Outgoing message bubbles. Flat fill with no drop shadow, distinguished purely by sharp tonal luminance contrast against the dark background.

### Border Discipline
Avoid heavy structural lines. Dividers between chat sessions and top navigation bars must use ultra-thin 1px borders using `#B9E4E8` at 12% opacity or `#EEEEEE` at 6% opacity to preserve optical softness.

## Shapes
The shape language uses an organic, tactile geometry calibrated at roundedness scale `2` (base 8px / 0.5rem radius) with conversational asymmetry.

### Specialized Component Geometries
- **Chat Bubbles**: Standard corners use `rounded-lg` (16px). To indicate conversational flow and continuous speech, sequential bubbles from the same author adopt asymmetric pinning:
  - *Outgoing consecutive*: Top-right corner collapses to 4px.
  - *Incoming consecutive*: Top-left corner collapses to 4px.
  - *Terminal bubble in a cluster*: Retains full 16px radius on outer edges, preserving an organic silhouette.
- **Action Buttons & Inputs**: Bottom composer input bar uses full continuous pill radii (9999px) for friendly tactile ergonomics.
- **Avatars**: Continuous squircle (nested squircle formula or 28% border-radius equivalent) rather than harsh circles, delivering a distinctive bespoke signature.

## Components

### Message Bubbles
- **Outgoing**: Filled with `#B9E4E8`. Typography is `#071B2B` (`body-md`, weight 500). Timestamp and read indicators sit bottom-right, styled in `#167D8D` (`label-sm`).
- **Incoming**: Filled with `#0E2A40`. Typography is `#EEEEEE` (`body-md`, weight 400). Author alias placed above message body in `#B9E4E8` (`headline-sm`, weight 600). Timestamps sit in `#EEEEEE` at 50% opacity (`label-sm`).
- **Reactions Pill Cluster**: Floating capsules overlapping the bottom boundary of bubbles. Background `#071B2B`, 1px border in `#167D8D` at 40%, text and counter in `#EEEEEE` (`label-sm`).

### Avatars & Group Indicators
- **Squircle Silhouette**: 40x40px for thread lists, 32x32px inside active chat feeds.
- **Status Indicator**: 10x10px dot placed at bottom-right corner with a 2px knockout ring matching the background canvas color (`#071B2B`). `#00D68F` for active, `#167D8D` for idle/in-app, `#FF5C5C` for do-not-disturb.
- **Group Stacked Avatars**: Clustered overlapping avatars (negative margin 10px) with 2px canvas-colored outer separation stroke.

### Input Bar / Message Composer
- **Container**: Floating pill or bottom-anchored frosted glass dock (`#071B2B` at 85% opacity, `backdrop-filter: blur(16px)`).
- **Text Field**: Recessed fill in `#0B2438`, border 1px solid `#167D8D` at 25%, inner text `#EEEEEE`, placeholder text `#EEEEEE` at 40%.
- **Action Buttons (Attachment, Mic, Emoji)**: Icon buttons in `#B9E4E8` with no background fill; hover/press triggers a subtle glow (`rgba(22, 125, 141, 0.2)`).
- **Send Trigger**: 36x36px circle filled with `#167D8D`. Icon is white (`#EEEEEE`). Active/pressed state scales to 0.94x with an outer glow of `#167D8D`.

### Chips & Channel Filters
- **Resting**: Background `#0B2438`, border 1px solid `#EEEEEE` at 10%, text `#EEEEEE` at 70% (`label-md`).
- **Active / Selected**: Background `#167D8D`, border 1px solid transparent, text `#EEEEEE` (`label-md`, weight 600).
- **Unread Count Pill**: Fully rounded badge with `#B9E4E8` background and `#071B2B` bold numeric text (`label-sm`).

### Lists (Chat Threads)
- **Item Container**: Height 72px, fluid width. Background transparent; active/pressed state shows smooth transition to `#0B2438`.
- **Primary Line**: Group/contact name in `#EEEEEE` (`headline-sm`), timestamp float-right in `#EEEEEE` at 50% (`label-sm`).
- **Secondary Line**: Truncated snippet of latest message in `#EEEEEE` at 65% (`body-sm`). Unread conversations bold the snippet to `#EEEEEE` at 95% and place an unread counter pill on the right margin.

### Checkboxes & Radio Elements
- **Box/Ring**: 20x20px, 4px border radius for checkboxes, full circle for radios. Border 2px solid `#167D8D` at 50%, background transparent.
- **Checked State**: Fill `#167D8D` with a crisp `#EEEEEE` checkmark glyph; outer rim displays a 3px ambient ring of `#167D8D` at 20%.