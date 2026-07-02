# Mehtab Electronics — Future Electronics

A cinematic, scroll-driven 3D landing page for an electronics company. Built with Next.js (App Router), React Three Fiber, GSAP, Lenis and Framer Motion.

## Concept

There is no traditional scrolling. A single camera glides upward through a stack of ten 3D scenes (hero → cameras → security → solar → smart home → networking → power → services → projects → contact), each with its own procedurally-built models, particle fields and holographic shader effects. Lenis smooths the raw scroll input; GSAP's ScrollTrigger keeps everything in sync; the camera rig damps toward its target position every frame so motion never snaps.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- React Three Fiber + drei + postprocessing (Bloom/Vignette)
- Custom GLSL shaders (`components/three/shaders.ts`) for the holographic ring/panel glow and the grid floor
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- Framer Motion for all HTML text/card reveals
- Zustand for the single scroll-progress store shared between the DOM and the R3F render loop

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Production build: `npm run build && npm run start`.

## Structure

```
app/                     Next.js App Router entry (layout, page, global CSS)
components/three/        Canvas, camera rig, shaders, procedural model library, the 10 scenes
components/sections/      HTML overlay content for each scene (headlines, cards, badges)
components/layout/        Navigation, footer "command center", Lenis provider, cursor glow
components/ui/            Reusable glass card / gradient text / magnetic button / floating badge
hooks/                     useReducedMotion, useMousePointer
store/                     useJourneyStore (zustand) — the single source of scroll progress
lib/constants.ts          Scene copy, colors, spacing — the one place that defines the journey
```

## Notes

- All 3D objects are built from primitive geometry + custom materials — no external model files to license or download.
- `prefers-reduced-motion` is respected: Lenis smoothing and camera damping both fall back to near-instant behavior.
- The 3D canvas is loaded client-only via `next/dynamic` so it never blocks first paint or SSR.
