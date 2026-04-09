# Project QuizQuest: Engineering Editorial Handoff (Finalized)

## 1. Vision & Identity: "The Engineering Editorial"
QuizQuest is a gamified LMS for elite developers. The identity, **"Engineering Editorial"** (The Architectural Ledger), is defined by atmospheric depth, razor-sharp typography, and structural precision.

### The Brand Mark
The new logo is a circuit-inspired isometric mark that represents the "Architecture of Knowledge." 
- **Favicon**: Use the central mark on a Slate 950 background.
- **Header Logo**: Use the mark alongside "QUIZQUEST" in bold Plus Jakarta Sans.

## 2. Global Style Tokens (Tailwind CSS v4)
Implementation MUST use Tailwind v4 for consistency.

### Colors & Atmospheric Background
- **Primary Background**: `#020617` (Slate 950).
- **Atmospheric Gradient**: `radial-gradient(circle at 0% 0%, #1e1b4b 0%, #020617 100%)`.
- **Primary Accent**: `#4f46e5` (Indigo 600) / `#6366f1` (Indigo 500).
- **Surface Panels**: `bg-slate-900/60` with `backdrop-blur-xl`.
- **Borders**: `border-white/5` (subtle) or `border-indigo-500/10` (accented).
- **Grid Texture**: A subtle 20px repeating grid SVG at 3% opacity overlaid on the background.

### Typography (Plus Jakarta Sans)
- **Authoritative Contrast**: Use `font-black` (900) for hero headlines and `font-bold` (700) for component headers.
- **Mono Accents**: Use `JetBrains Mono` for telemetry, metadata, and code blocks.

## 3. Component Architecture
- **Floating Panels**: Components must have physical "mass" using `shadow-2xl shadow-indigo-950/50` and high `backdrop-blur-md`.
- **Glow States**: Active indicators and progress bars should have a subtle indigo outer glow.

## 4. Final "God Tier" Screen Suite
Use these specific versions for implementation:
- **Landing Page**: {{DATA:SCREEN:SCREEN_42}}
- **Dashboard (Command Center)**: {{DATA:SCREEN:SCREEN_24}}
- **Course Catalog**: {{DATA:SCREEN:SCREEN_27}}
- **Course Outline**: {{DATA:SCREEN:SCREEN_17}}
- **Lesson Player (Reading)**: {{DATA:SCREEN:SCREEN_30}}
- **Lesson Player (Quiz)**: {{DATA:SCREEN:SCREEN_37}}
- **Lesson Player (Code)**: {{DATA:SCREEN:SCREEN_3}}

## 5. Technical Requirements
- **Next.js 16 / React 19 / TypeScript**.
- **Tailwind CSS v4** (All theme variables in `app/globals.css`).
- **Layout**: Sticky nav and floating panel structure consistent across all breakpoints.