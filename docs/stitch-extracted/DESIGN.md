# Design System Specification: Engineering Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Ledger"**

This design system moves away from the "disposable" feel of traditional gamified apps, instead adopting the aesthetic of a high-end engineering journal or a premium architectural monograph. We are building a space that feels authoritative and high-performance.

The core philosophy is **Intentional Asymmetry**. We break the rigid, centered "app template" look by utilizing bold whitespace, off-center groupings, and varying typographical scales. This creates an editorial rhythm—directing the eye through a hierarchy that feels curated rather than automated.

---

## 2. Color & Surface Philosophy

### The "Electric Indigo" Core
Our palette is anchored by a high-contrast `primary_container` (#4f46e5) and `on_primary_container` (#dad7ff). This "Electric Indigo" provides the high-performance energy required for an engineering-focused brand.

### The No-Line Rule & Tonal Layering
**Explicit Instruction:** Do not use 1px solid, opaque borders for sectioning. Boundaries must be defined through:
1.  **Background Shifts:** Transitioning from `surface` (#0b1326) to `surface_container_low` (#131b2e).
2.  **Nesting Depth:** Treat the UI as stacked sheets. An inner module should live on `surface_container_high` (#222a3d) to naturally "lift" off a `surface_container` background without a single line of ink.

### Glass & Texture
For floating elements (modals, dropdowns, navigation bars), use **Glassmorphism**:
*   **Surface:** Use `surface_bright` (#31394d) at 60-80% opacity.
*   **Backdrop Blur:** 12px to 20px.
*   **Signature Gradient:** Main CTAs should utilize a subtle linear gradient from `primary` (#c3c0ff) to `primary_container` (#4f46e5) at a 135° angle to add "visual soul."

---

## 3. Typography: Geometric Authority

We use **Plus Jakarta Sans** exclusively. Its geometric clarity reinforces the "engineering" aspect of the brand.

*   **Display & Headlines:** Use `ExtraBold` or `Bold` weights. Set `display-lg` and `display-md` with slight negative letter-spacing (-0.02em) to create a tight, authoritative "block" of text.
*   **Labels:** All `label-md` and `label-sm` elements must use **Wide Tracking** (+0.08em to +0.1em) and `Uppercase` styling. This mimics technical blueprints and architectural labeling.
*   **The Editorial Mix:** Pair a massive `display-sm` headline with a tiny, wide-tracked `label-md` immediately above it to create that high-end magazine feel.
*   **Technical Data:** For XP values, timers, or scores, use a monospace font-variant (if available) or forced tabular figures to ensure numbers align vertically during high-speed updates.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through the hierarchy of `surface_container` tokens. 
*   **Base:** `surface_dim` (#0b1326)
*   **Sectioning:** `surface_container_lowest` (#060e20)
*   **Interactive Cards:** `surface_container_high` (#222a3d)

### Ambient Shadows
When an element must float (e.g., a "Streak" pop-over), use a **Multi-layered Ambient Shadow**:
*   **Shadow 1 (Crisp):** 2px Y, 4px Blur, `on_surface` at 4% opacity.
*   **Shadow 2 (Ambient):** 12px Y, 24px Blur, `on_surface` at 8% opacity.
*   *Note: Never use pure black shadows. Always tint the shadow with the `on_surface` indigo-neutral (#dae2fd).*

### Ghost Borders
If a container requires a border for accessibility, use a **Ghost Border**: `outline_variant` (#464555) at 20% opacity. It should be felt, not seen.

---

## 5. Components & Elements

### Buttons: High-Performance Triggers
*   **Primary:** Gradient of `primary` to `primary_container`. `DEFAULT` (0.25rem) radius for a sharp, architectural look.
*   **Secondary:** Ghost style. `surface_container_highest` background with a `ghost border`.
*   **States:** On hover, increase the `backdrop-blur` or slightly shift the gradient angle. Avoid simple opacity changes.

### Gamification: Premium Achievements
*   **XP/Streaks:** Treat these as "Brushed Brass" and "Deep Velvet."
    *   **Brass (Gold):** Use `tertiary` (#dbc75f) with a subtle metallic noise texture overlay.
    *   **Velvet (Purple):** Use `secondary_container` (#53398b) with a deep `secondary` (#d1bcff) inner-glow.
*   **The Progress Bar:** Use a fine hairline container (`outline_variant` at 10% opacity) with a `primary` fill. No rounded caps; keep them architectural and square.

### Cards & Lists
*   **The "No Divider" Rule:** Forbid the use of horizontal rules (`<hr>`). Separate list items using `spacing-md` (vertical whitespace) or by alternating the `surface_container` tint slightly.
*   **Asymmetry:** In a card, left-align the primary data but right-align the secondary meta-data at the very bottom edge, creating a diagonal visual flow.

### Specialized "Engineering" Monospace
Use a monospace treatment for technical data (e.g., "Accuracy: 98.4%"). Set these in `label-sm` with the `on_tertiary_fixed` color (#211b00) to highlight precision.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical grids. Place a headline on the left and the body text in a narrower column on the right.
*   **Do** prioritize "Breathing Room." If a layout feels cramped, double the whitespace.
*   **Do** use `outline_variant` for extremely fine hairlines (0.5px) to separate high-level editorial sections.

### Don’t:
*   **Don’t** use standard "drop shadows" (e.g., 0px 4px 10px black).
*   **Don’t** use fully rounded (pill) buttons unless it’s a specific "Chip" component. Stick to the `DEFAULT` (4px) or `lg` (8px) radius.
*   **Don’t** use "Alert Red" for errors if you can avoid it. Use `error_container` (#93000a) with `on_error_container` text for a more sophisticated, "dimmed" warning.