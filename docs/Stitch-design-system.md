# Project QuizQuest: Engineering Editorial Handoff

## 1. Vision & Identity
QuizQuest is a gamified LMS for elite developers. The design identity, **"Engineering Editorial"** (also known as the **Architectural Ledger**), is characterized by:
- **Atmospheric Depth**: Components floating in a deep indigo/slate void with heavy shadows and backdrop blurs.
- **Architectural Precision**: High-contrast typography (Plus Jakarta Sans) and mono-spaced accents.
- **Telemetry UI**: Information presented as operational telemetry with glowing state indicators.

## 2. Global Style Tokens (Tailwind CSS v4)
Implementation should use Tailwind v4. Core tokens extracted from the "God Tier" suite:

### Colors
- **Background**: `#020617` (Slate 950) with a radial gradient top-left: `radial-gradient(circle at 0% 0%, #1e1b4b 0%, #020617 100%)`.
- **Primary/Accent**: `#4f46e5` (Indigo 600) / `#6366f1` (Indigo 500).
- **Surface Panels**: `bg-slate-900/60` with `backdrop-blur-xl`.
- **Borders**: `border-white/5` or `border-indigo-500/10`.
- **Text-Primary**: `text-slate-50` (high contrast).
- **Text-Secondary**: `text-slate-400`.
- **Text-Accent**: `text-indigo-400`.

### Typography
- **Primary Font**: `Plus Jakarta Sans`.
- **Mono Font**: `JetBrains Mono` or `ui-monospace`.
- **Weights**: Use `font-black` (900) for headlines and `font-bold` (700) for UI elements to maintain legibility.

### Effects
- **Shadows**: `shadow-2xl shadow-indigo-950/50`.
- **Gradients**: Use linear gradients for primary buttons: `from-indigo-600 to-indigo-500`.

## 3. Core Screens (Final Reference)
The following screens represent the finalized v2 "God Tier" suite:
- **Landing Page**: {{DATA:SCREEN:SCREEN_26}}
- **Dashboard (Command Center)**: {{DATA:SCREEN:SCREEN_19}}
- **Course Catalog**: {{DATA:SCREEN:SCREEN_24}}
- **Course Outline**: {{DATA:SCREEN:SCREEN_7}}
- **Lesson Player (Reading)**: {{DATA:SCREEN:SCREEN_31}}
- **Lesson Player (Quiz)**: {{DATA:SCREEN:SCREEN_14}}
- **Lesson Player (Code)**: {{DATA:SCREEN:SCREEN_13}}

## 4. Component Implementation Notes
- **Glass Panels**: Use `bg-slate-900/40 border border-white/5 backdrop-blur-md rounded-xl`.
- **Glow Effects**: Add subtle `drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]` to active indicators and badges.
- **Grids**: Use a repeating SVG background grid (10px or 20px) at 2-5% opacity across the background.
- **Progress Bars**: `h-1 bg-slate-800 rounded-full overflow-hidden` with a `bg-indigo-500 shadow-[0_0_10px_#6366f1]` fill.

## 5. Technical Requirements
- **Next.js 16 / React 19 / TypeScript**.
- **Tailwind CSS v4** (Theme configuration in `app/globals.css`).
- **No external libs**: Pure Tailwind/CSS for the UI shell.
- **Responsive**: Maintain the floating panel layout across breakpoints.
