# Design System Specification: The Engineering Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Editor"**
This system moves beyond the "toy-like" feel of standard gamification. It treats code education as a high-end craft. We are blending the rigorous, mono-spaced precision of a developer IDE with the airy, sophisticated layout of a premium editorial magazine. 

The design breaks the "template" look through **intentional asymmetry**—offsetting headers, using generous white space to create focus, and employing "Tonal Layering" instead of rigid boxes. We don't just teach developers; we provide them with a high-performance environment where achievement feels inevitable and visually prestigious.

---

## 2. Colors & Surface Philosophy
Our palette balances the "Trustworthy Professional" (`primary`) with "High-Octane Achievement" (gamification accents).

### The "No-Line" Rule
**Borders are a failure of hierarchy.** To maintain a premium feel, avoid 1px solid strokes for sectioning. Boundaries must be defined through background shifts. For example, a `surface-container-low` section sitting on a `surface` background creates a clean, architectural break without the visual "noise" of a line.

### Surface Hierarchy & Nesting
Treat the UI as physical layers. Use the following tiers to define depth:
- **Base:** `surface` (#fcf8f8) – The foundation.
- **Sectioning:** `surface-container-low` (#f6f3f2) – Used for large sidebar or background areas.
- **Interactive Elements:** `surface-container-lowest` (#ffffff) – Reserved for the most important cards and input areas to make them "pop" against the slightly off-white background.

### The "Glass & Gradient" Rule
To prevent a flat, "Bootstrap" appearance:
- **CTAs & Heroes:** Use a subtle linear gradient from `primary` (#004ac6) to `primary-container` (#2563eb) at a 135-degree angle.
- **Floating Overlays:** Use `surface-container-lowest` with an 80% opacity and a `20px` backdrop-blur. This "frosted glass" effect ensures the UI feels integrated into the environment rather than pinned on top.

---

## 3. Typography
We utilize a triple-font strategy to balance technical utility with editorial elegance.

| Level | Token | Font Family | Size | Intent |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Plus Jakarta Sans | 3.5rem | Bold, asymmetrical hero statements. |
| **Headline** | `headline-md` | Plus Jakarta Sans | 1.75rem | Course titles and major milestones. |
| **Title** | `title-md` | Inter | 1.125rem | Card headers and navigation. |
| **Body** | `body-md` | Inter | 0.875rem | General content and descriptions. |
| **Label** | `label-md` | Space Grotesk | 0.75rem | Technical metadata, XP, and code snippets. |

*Director’s Note: Use Space Grotesk for all "achievement" metrics (XP, Streaks). Its monospaced feel communicates developer-centric precision.*

---

## 4. Elevation & Depth
### The Layering Principle
Do not rely on drop shadows for hierarchy. Use **Tonal Layering**:
- Place a `surface-container-lowest` card on a `surface-container-high` background. The natural contrast creates a "soft lift."

### Ambient Shadows
Where floating is mandatory (e.g., Modals):
- **Shadow:** `0px 20px 40px rgba(28, 27, 27, 0.06)`
- **Tint:** Shadows must be tinted with the `on-surface` color to mimic natural light, never pure black.

### The "Ghost Border" Fallback
If accessibility requires a container edge, use a **Ghost Border**:
- `outline-variant` (#c3c6d7) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### TopNavBar
- **Style:** `surface-container-lowest` with a `surface-dim` bottom "Ghost Border" (10% opacity).
- **Layout:** Asymmetrical. Left-aligned logo, center-right navigation, and right-aligned "Streak & XP" cluster using `Space Grotesk`.

### CourseCard
- **Base:** `surface-container-lowest`. No border. Roundedness: `lg` (1rem).
- **Hover State:** Instead of a heavy shadow, shift the background to `primary-fixed-dim` and apply a `2px` offset transform (upward).
- **Gamification:** The rank icon (Purple) should sit partially "broken" out of the top-left corner of the card to disrupt the grid.

### ProgressBar
- **Track:** `surface-container-highest`. Height: `8px`. Roundedness: `full`.
- **Indicator:** Gradient from `secondary` (#8127cf) to `primary` (#004ac6).
- **Animation:** Use a "spring" easing (0.4, 0, 0.2, 1) for XP gains.

### LessonRow
- **Locked:** `surface-dim` background, `on-surface-variant` text. 40% opacity.
- **Available:** `surface-container-lowest`. Soft `on-surface` text.
- **In-Progress:** `primary-fixed` background. Add a pulsing dot icon.
- **Completed:** `tertiary-container` (Gold) background. Text is `on-tertiary-fixed-variant`.

### CompletionOverlay (Modal)
- **Background:** 90% opacity `inverse-surface` with high-intensity backdrop blur.
- **Content:** Central `display-md` typography. Use `tertiary` (#784b00) for the primary "XP Gained" count.

---

## 6. Do's and Don'ts

### Do
- **Use Vertical Rhythm:** Use the 4px base scale to create extreme "breathing room" (e.g., 64px or 80px between major sections).
- **Tone-on-Tone:** Use `primary-container` text on `primary-fixed` backgrounds for a sophisticated, low-contrast "Modern" look.
- **Code as Art:** High-contrast dark code panels should have `xl` (1.5rem) rounded corners to contrast the "sharp" nature of code.

### Don't
- **Don't use 100% Black:** Even in dark mode, use `background` (#0a0a0a). Pure #000000 kills the "editorial" depth.
- **Don't use Divider Lines:** If two items need separation, use 16px of whitespace or a background tint shift.
- **Don't Center Everything:** Lean into left-aligned typography with wide right margins to mimic a technical manual or luxury magazine.

---

## 7. Dark Mode Strategy
- **Base:** `background` (#0a0a0a).
- **Code Editor:** Use a custom "High-Contrast" theme. Background: `inverse-surface` (#313030).
- **Glow:** For achievement elements (Gold/Purple), add a `0px 0px 12px` outer glow using the color’s own hex at 30% opacity to simulate an "active terminal" feel.